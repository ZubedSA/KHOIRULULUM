'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'
import { useToast } from './use-toast'

export function useProfiles() {
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const { toast } = useToast()

    const fetchProfiles = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('name', { ascending: true })

            if (error) throw error
            setProfiles(data || [])
        } catch (error) {
            console.error('Error fetching profiles:', error)
            toast({
                variant: 'destructive',
                title: 'Gagal memuat user',
                description: error instanceof Error ? error.message : 'Terjadi kesalahan'
            })
        } finally {
            setLoading(false)
        }
    }, [supabase, toast])

    const deleteProfile = async (id: string) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', id)

            if (error) throw error

            setProfiles(prev => prev.filter(p => p.id !== id))
            return true
        } catch (error) {
            console.error('Error deleting profile:', error)
            toast({
                variant: 'destructive',
                title: 'Gagal menghapus user',
                description: error instanceof Error ? error.message : 'Terjadi kesalahan'
            })
            return false
        }
    }

    const createUser = async (userData: Record<string, unknown>) => {
        try {
            const response = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || 'Terjadi kesalahan saat membuat user')
            }

            // Refresh the profiles list after successful creation
            await fetchProfiles()
            return true
        } catch (error) {
            console.error('Error creating user:', error)
            toast({
                variant: 'destructive',
                title: 'Gagal membuat user',
                description: error instanceof Error ? error.message : 'Terjadi kesalahan'
            })
            return false
        }
    }

    useEffect(() => {
        fetchProfiles()
    }, [fetchProfiles])

    return {
        profiles,
        loading,
        refreshProfiles: fetchProfiles,
        deleteProfile,
        createUser
    }
}
