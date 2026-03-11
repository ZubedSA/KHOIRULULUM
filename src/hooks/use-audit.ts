'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface AuditLog {
    id: string
    created_at: string
    user_id: string
    action: string
    table_name: string
    record_id: string
    old_data: any
    new_data: any
    ip_address?: string
    user_agent?: string
    user?: {
        email: string
        role: string
    }
}

interface AuditLogFilters {
    action?: string
    tableName?: string
    startDate?: string
    endDate?: string
    search?: string
}

interface UseAuditLogsReturn {
    logs: AuditLog[]
    loading: boolean
    error: Error | null
    refetch: () => void
    logAction: (action: string, tableName: string, recordId: string, oldData?: any, newData?: any) => Promise<boolean>
}

export function useAuditLogs(filters?: AuditLogFilters): UseAuditLogsReturn {
    const [logs, setLogs] = useState<AuditLog[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    const fetchLogs = useCallback(async () => {
        setLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            // Note: Since we don't have a real audit table yet, we'll try to fetch from
            // a hypothetical 'audit_logs' table. If it fails, we'll handle the error.
            // In a real production app, you would enable Supabase Pgsodium or create a trigger-based audit log.

            // For now, let's create a client-side logger that stores to a simple table if it exists

            let query = supabase
                .from('audit_logs')
                .select(`
                    *,
                    user:profiles(email, role)
                `)
                .order('created_at', { ascending: false })

            if (filters?.action && filters.action !== 'Semua') {
                query = query.eq('action', filters.action)
            }
            if (filters?.tableName && filters.tableName !== 'Semua') {
                query = query.eq('table_name', filters.tableName)
            }
            if (filters?.startDate) {
                query = query.gte('created_at', filters.startDate)
            }
            if (filters?.endDate) {
                query = query.lte('created_at', filters.endDate)
            }

            const { data, error: fetchError } = await query

            if (fetchError) {
                // If table doesn't exist, ignore (dev mode)
                if (fetchError.code === '42P01') {
                    console.warn('Audit logs table not found')
                    setLogs([])
                    return
                }
                throw fetchError
            }

            if (data) {
                setLogs(data as any[])
            }
        } catch (err) {
            console.error('Error fetching audit logs:', err)
            // Don't set error state to avoid breaking UI if audit table missing
            // setError(err instanceof Error ? err : new Error('Failed to fetch audit logs'))
        } finally {
            setLoading(false)
        }
    }, [filters?.action, filters?.tableName, filters?.startDate, filters?.endDate])

    const logAction = async (action: string, tableName: string, recordId: string, oldData?: any, newData?: any): Promise<boolean> => {
        const supabase = createClient()

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return false

            const { error: insertError } = await supabase
                .from('audit_logs')
                .insert({
                    user_id: user.id,
                    action,
                    table_name: tableName,
                    record_id: recordId,
                    old_data: oldData,
                    new_data: newData
                })

            if (insertError) {
                if (insertError.code === '42P01') return false // Table missing
                throw insertError
            }

            return true
        } catch (err) {
            console.error('Error logging action:', err)
            return false
        }
    }

    useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    return { logs, loading, error, refetch: fetchLogs, logAction }
}
