'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, AcademicYear } from '@/types/database'

interface ReferenceDataReturn {
    teachers: Profile[]
    academicYears: AcademicYear[]
    loading: boolean
    error: Error | null
    fetchReferences: () => void
}

export function useReferenceData(): ReferenceDataReturn {
    const [teachers, setTeachers] = useState<Profile[]>([])
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchReferences = useCallback(async () => {
        setLoading(true)
        setError(null)
        const supabase = createClient()

        try {
            // Fetch Teachers
            const { data: teachersData, error: teachersError } = await supabase
                .from('profiles')
                .select('*')
                .in('role', ['guru', 'admin']) // Admin bisa jadi wali kelas juga theoretically
                .order('name')

            if (teachersError) throw teachersError

            // Fetch Academic Years
            const { data: yearsData, error: yearsError } = await supabase
                .from('academic_years')
                .select('*')
                .order('created_at', { ascending: false })

            if (yearsError) throw yearsError

            setTeachers(teachersData || [])
            setAcademicYears(yearsData || [])
        } catch (err) {
            console.error('Error fetching reference data:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch reference data'))
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReferences()
    }, [fetchReferences])

    return {
        teachers,
        academicYears,
        loading,
        error,
        fetchReferences
    }
}
