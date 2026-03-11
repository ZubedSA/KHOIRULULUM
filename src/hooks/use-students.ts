'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Student } from '@/types/database'

export interface CreateStudentInput {
    nis: string
    name: string
    gender: 'L' | 'P'
    class_id: string
    parent_name?: string
    parent_phone?: string
    phone?: string
    address?: string
    birth_date?: string
}

export interface UpdateStudentInput {
    nis?: string
    name?: string
    gender?: 'L' | 'P'
    class_id?: string
    parent_name?: string
    parent_phone?: string
    phone?: string
    address?: string
    birth_date?: string
    is_active?: boolean
}

export interface StudentWithClass extends Omit<Student, 'class'> {
    class?: {
        name: string
        grade_level: number
    } | null
}

interface UseStudentsReturn {
    students: StudentWithClass[]
    loading: boolean
    error: Error | null
    refetch: () => void
    addStudent: (data: CreateStudentInput) => Promise<boolean>
    updateStudent: (id: string, data: UpdateStudentInput) => Promise<boolean>
    deleteStudent: (id: string) => Promise<boolean>
}

export function useStudents(initialClassId?: string): UseStudentsReturn {
    const [students, setStudents] = useState<StudentWithClass[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchStudents = useCallback(async () => {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        try {
            let query = supabase
                .from('students')
                .select(`
                    *,
                    class:classes(name, grade_level)
                `)
                .order('name')

            if (initialClassId && initialClassId !== 'all') {
                query = query.eq('class_id', initialClassId)
            }

            const { data, error: fetchError } = await query

            if (fetchError) throw fetchError

            setStudents(data as StudentWithClass[] || [])
        } catch (err) {
            console.error('Error fetching students:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch students'))
        } finally {
            setLoading(false)
        }
    }, [initialClassId])

    const addStudent = async (data: CreateStudentInput): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: insertError } = await supabase
                .from('students')
                .insert([data])

            if (insertError) throw insertError

            await fetchStudents()
            return true
        } catch (err) {
            console.error('Error adding student:', err)
            return false
        }
    }

    const updateStudent = async (id: string, data: UpdateStudentInput): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: updateError } = await supabase
                .from('students')
                .update(data)
                .eq('id', id)

            if (updateError) throw updateError

            await fetchStudents()
            return true
        } catch (err) {
            console.error('Error updating student:', err)
            return false
        }
    }

    const deleteStudent = async (id: string): Promise<boolean> => {
        const supabase = createClient()
        try {
            const { error: deleteError } = await supabase
                .from('students')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            await fetchStudents()
            return true
        } catch (err) {
            console.error('Error deleting student:', err)
            return false
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    return {
        students,
        loading,
        error,
        refetch: fetchStudents,
        addStudent,
        updateStudent,
        deleteStudent
    }
}
