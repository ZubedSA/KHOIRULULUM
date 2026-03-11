'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface MadrasahSettings {
    name: string
    address: string
    phone: string
    email: string
    logo_url?: string | null
}

interface BillingSettings {
    default_spp_amount: number
    default_due_day: number
    late_fee: number
}

interface NotificationSettings {
    email_notifications: boolean
    sms_reminders: boolean
    auto_reminder: boolean
    reminder_days_before: number
}

interface AllSettings {
    madrasah: MadrasahSettings
    billing: BillingSettings
    notifications: NotificationSettings
}

interface UseSettingsReturn {
    settings: AllSettings
    loading: boolean
    saving: boolean
    error: Error | null
    updateSettings: (newSettings: Partial<AllSettings>) => Promise<boolean>
}

const defaultSettings: AllSettings = {
    madrasah: {
        name: 'MTs Khairul Ulum',
        address: 'Jl. Contoh No. 123',
        phone: '021-12345678',
        email: 'info@khairululum.sch.id',
        logo_url: null
    },
    billing: {
        default_spp_amount: 500000,
        default_due_day: 10,
        late_fee: 25000
    },
    notifications: {
        email_notifications: true,
        sms_reminders: false,
        auto_reminder: true,
        reminder_days_before: 3
    }
}

export function useSettings(): UseSettingsReturn {
    const [settings, setSettings] = useState<AllSettings>(defaultSettings)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        setError(null)

        const supabase = createClient()

        try {
            const { data, error: fetchError } = await supabase
                .from('settings')
                .select('key, value')

            if (fetchError) throw fetchError

            if (data && data.length > 0) {
                const loadedSettings = { ...defaultSettings }

                data.forEach((row) => {
                    if (row.key === 'madrasah' && row.value) {
                        loadedSettings.madrasah = { ...loadedSettings.madrasah, ...row.value }
                    }
                    if (row.key === 'billing' && row.value) {
                        loadedSettings.billing = { ...loadedSettings.billing, ...row.value }
                    }
                    if (row.key === 'notifications' && row.value) {
                        loadedSettings.notifications = { ...loadedSettings.notifications, ...row.value }
                    }
                })

                setSettings(loadedSettings)
            }
        } catch (err) {
            console.error('Error fetching settings:', err)
            setError(err instanceof Error ? err : new Error('Failed to fetch settings'))
        } finally {
            setLoading(false)
        }
    }, [])

    const updateSettings = async (newSettings: Partial<AllSettings>): Promise<boolean> => {
        setSaving(true)

        const supabase = createClient()

        try {
            const updates = []

            if (newSettings.madrasah) {
                updates.push(
                    supabase
                        .from('settings')
                        .upsert({ key: 'madrasah', value: newSettings.madrasah, updated_at: new Date().toISOString() }, { onConflict: 'key' })
                )
            }

            if (newSettings.billing) {
                updates.push(
                    supabase
                        .from('settings')
                        .upsert({ key: 'billing', value: newSettings.billing, updated_at: new Date().toISOString() }, { onConflict: 'key' })
                )
            }

            if (newSettings.notifications) {
                updates.push(
                    supabase
                        .from('settings')
                        .upsert({ key: 'notifications', value: newSettings.notifications, updated_at: new Date().toISOString() }, { onConflict: 'key' })
                )
            }

            await Promise.all(updates)

            // Update local state
            setSettings(prev => ({
                ...prev,
                ...newSettings
            }))

            return true
        } catch (err) {
            console.error('Error saving settings:', err)
            setError(err instanceof Error ? err : new Error('Failed to save settings'))
            return false
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    return { settings, loading, saving, error, updateSettings }
}
