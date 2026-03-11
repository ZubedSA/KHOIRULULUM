'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Class } from '@/types/database'

export interface CreateClassInput {
    name: string
    grade_level: string
    academic_year_id?: string
    homeroom_teacher_id?: string
}

export interface UpdateClassInput {
    name?: string
    grade_level?: string
    academic_year_id?: string
    homeroom_teacher_id?: string
}

export interface ClassWithDetails extends Omit<Class, 'homeroom_teacher' | 'academic_year'> {
    homeroom_teacher?: {
        name: string
    }
    academic_year?: {
        name: string
    }
    student_count?: number
}

interface UseClassesReturn {
    classes: ClassWithDetails[]
    loading: boolean
    error: Error | null
    refetch: () => void
    addClass: (data: CreateClassInput) => Promise<boolean>
    updateClass: (id: string, data: UpdateClassInput) => Promise<boolean>
    deleteClass: (id: string) => Promise<boolean>
}

export function useClasses(): UseClassesReturn {
    const [classes, setClasses] = useState<ClassWithDetails[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchClasses = useCallback(async () => {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        try {
            // Fetch classes with relations
            const { data, error: fetchError } = await supabase
                .from('classes')
                .select(`
                    *,
                    homeroom_teacher:profiles!homeroom_teacher_id(name),
                    academic_year:academic_years(name)
                `)
                .order('grade_level')
                .order('name')

            if (fetchError) throw fetchError

            // Fetch student counts separately (or use a view/rpc if performance is an issue later)
            // For now, let's fetch counts
            const { data: studentsData, error: countError } = await supabase
                .from('students')
                .select('class_id')
                .eq('is_active', true)

            if (countError) console.error('Error fetching student counts:', countError)

            const classesWithCounts = data?.map((cls: { id: string;[key: string]: unknown }) => {
                const count = studentsData?.filter((s: { class_id: string;[key: string]: unknown }) => s.class_id === cls.id).length || 0
                return {
                    ...cls,
                    student_count: count
                }
            }) as ClassWithDetails[]

            setClasses(classesWithCounts || [])
        } catch (err) {
            console.error('Error fetching classes:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch classes'))
        } finally {
            setLoading(false)
        }
    }, [])

    const addClass = async (data: CreateClassInput): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: insertError } = await supabase
                .from('classes')
                .insert([{
                    name: data.name,
                    grade_level: parseInt(data.grade_level),
                    academic_year_id: data.academic_year_id || null,
                    homeroom_teacher_id: data.homeroom_teacher_id || null
                }])

            if (insertError) throw insertError

            await fetchClasses()
            return true
        } catch (err) {
            console.error('Error adding class:', err)
            return false
        }
    }

    const updateClass = async (id: string, data: UpdateClassInput): Promise<boolean> => {
        const supabase = createClient()
        try {
            const updatePayload: Record<string, string | number | null> = {}
            if (data.name) updatePayload.name = data.name
            if (data.grade_level) updatePayload.grade_level = parseInt(data.grade_level)
            if (data.academic_year_id !== undefined) updatePayload.academic_year_id = data.academic_year_id
            if (data.homeroom_teacher_id !== undefined) updatePayload.homeroom_teacher_id = data.homeroom_teacher_id

            const { error: updateError } = await supabase
                .from('classes')
                .update(updatePayload)
                .eq('id', id)

            if (updateError) throw updateError

            await fetchClasses()
            return true
        } catch (err) {
            console.error('Error updating class:', err)
            return false
        }
    }

    const deleteClass = async (id: string): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: deleteError } = await supabase
                .from('classes')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            await fetchClasses()
            return true
        } catch (err) {
            console.error('Error deleting class:', err)
            return false
        }
    }

    useEffect(() => {
        fetchClasses()
    }, [fetchClasses])

    return {
        classes,
        loading,
        error,
        refetch: fetchClasses,
        addClass,
        updateClass,
        deleteClass
    }
}
