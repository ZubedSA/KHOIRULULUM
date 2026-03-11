'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { School, Wallet, Calendar, Bell, Save, Loader2, Check } from 'lucide-react'
import { useSettings } from '@/hooks/use-settings'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
    const { settings, loading, saving, updateSettings } = useSettings()
    const { toast } = useToast()
    const [localSettings, setLocalSettings] = useState(settings)
    const [hasChanges, setHasChanges] = useState(false)

    // Sync local settings when loaded from database
    useEffect(() => {
        setLocalSettings(settings)
    }, [settings])

    // Track changes
    useEffect(() => {
        const isChanged = JSON.stringify(localSettings) !== JSON.stringify(settings)
        setHasChanges(isChanged)
    }, [localSettings, settings])

    const handleSave = async () => {
        const success = await updateSettings(localSettings)
        if (success) {
            toast({
                title: "Berhasil disimpan!",
                description: "Pengaturan telah berhasil disimpan ke database.",
            })
            setHasChanges(false)
        } else {
            toast({
                title: "Gagal menyimpan",
                description: "Terjadi kesalahan saat menyimpan pengaturan.",
                variant: "destructive"
            })
        }
    }

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                    <span className="ml-2 text-gray-500">Memuat pengaturan...</span>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
                        <p className="text-gray-500">Konfigurasi aplikasi dan preferensi</p>
                    </div>
                    <Button
                        onClick={handleSave}
                        className="bg-violet-500 hover:bg-violet-600"
                        disabled={saving || !hasChanges}
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : hasChanges ? (
                            <Save className="w-4 h-4 mr-2" />
                        ) : (
                            <Check className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Menyimpan...' : hasChanges ? 'Simpan Perubahan' : 'Tersimpan'}
                    </Button>
                </div>

                {hasChanges && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-700">
                            Ada perubahan yang belum disimpan. Klik "Simpan Perubahan" untuk menyimpan.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Madrasah Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <School className="w-5 h-5 text-violet-500" />
                                Informasi Madrasah
                            </CardTitle>
                            <CardDescription>Data identitas madrasah</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nama Madrasah</Label>
                                <Input
                                    value={localSettings.madrasah.name}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        madrasah: { ...localSettings.madrasah, name: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Alamat</Label>
                                <Textarea
                                    value={localSettings.madrasah.address}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        madrasah: { ...localSettings.madrasah, address: e.target.value }
                                    })}
                                    rows={2}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Telepon</Label>
                                    <Input
                                        value={localSettings.madrasah.phone}
                                        onChange={(e) => setLocalSettings({
                                            ...localSettings,
                                            madrasah: { ...localSettings.madrasah, phone: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={localSettings.madrasah.email}
                                        onChange={(e) => setLocalSettings({
                                            ...localSettings,
                                            madrasah: { ...localSettings.madrasah, email: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Billing Settings */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-emerald-500" />
                                Pengaturan Tagihan
                            </CardTitle>
                            <CardDescription>Konfigurasi default tagihan SPP</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nominal SPP Default (Rp)</Label>
                                <Input
                                    type="number"
                                    value={localSettings.billing.default_spp_amount}
                                    onChange={(e) => setLocalSettings({
                                        ...localSettings,
                                        billing: { ...localSettings.billing, default_spp_amount: parseInt(e.target.value) || 0 }
                                    })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Jatuh Tempo</Label>
                                    <Select
                                        value={localSettings.billing.default_due_day.toString()}
                                        onValueChange={(value) => setLocalSettings({
                                            ...localSettings,
                                            billing: { ...localSettings.billing, default_due_day: parseInt(value) }
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[5, 10, 15, 20, 25].map((day) => (
                                                <SelectItem key={day} value={day.toString()}>
                                                    Tanggal {day}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Denda Keterlambatan (Rp)</Label>
                                    <Input
                                        type="number"
                                        value={localSettings.billing.late_fee}
                                        onChange={(e) => setLocalSettings({
                                            ...localSettings,
                                            billing: { ...localSettings.billing, late_fee: parseInt(e.target.value) || 0 }
                                        })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Academic Year - Read Only Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-500" />
                                Tahun Ajaran
                            </CardTitle>
                            <CardDescription>Tahun ajaran aktif saat ini</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <p className="font-medium text-blue-900">2025/2026 - Semester 1</p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Tahun ajaran dikelola dari tabel academic_years di database.
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-sm text-gray-600">
                                    <strong>Catatan:</strong> Untuk mengganti tahun ajaran aktif, ubah kolom is_active
                                    pada tabel academic_years di database Supabase.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5 text-orange-500" />
                                Notifikasi
                            </CardTitle>
                            <CardDescription>Pengaturan pengingat dan notifikasi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Notifikasi Email</Label>
                                    <p className="text-sm text-gray-500">Kirim notifikasi via email</p>
                                </div>
                                <Switch
                                    checked={localSettings.notifications.email_notifications}
                                    onCheckedChange={(checked) => setLocalSettings({
                                        ...localSettings,
                                        notifications: { ...localSettings.notifications, email_notifications: checked }
                                    })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Pengingat SMS</Label>
                                    <p className="text-sm text-gray-500">Kirim pengingat via SMS</p>
                                </div>
                                <Switch
                                    checked={localSettings.notifications.sms_reminders}
                                    onCheckedChange={(checked) => setLocalSettings({
                                        ...localSettings,
                                        notifications: { ...localSettings.notifications, sms_reminders: checked }
                                    })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Pengingat Otomatis</Label>
                                    <p className="text-sm text-gray-500">Kirim pengingat sebelum jatuh tempo</p>
                                </div>
                                <Switch
                                    checked={localSettings.notifications.auto_reminder}
                                    onCheckedChange={(checked) => setLocalSettings({
                                        ...localSettings,
                                        notifications: { ...localSettings.notifications, auto_reminder: checked }
                                    })}
                                />
                            </div>
                            {localSettings.notifications.auto_reminder && (
                                <div className="space-y-2">
                                    <Label>Kirim pengingat X hari sebelum jatuh tempo</Label>
                                    <Select
                                        value={localSettings.notifications.reminder_days_before.toString()}
                                        onValueChange={(value) => setLocalSettings({
                                            ...localSettings,
                                            notifications: { ...localSettings.notifications, reminder_days_before: parseInt(value) }
                                        })}
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">1 hari</SelectItem>
                                            <SelectItem value="3">3 hari</SelectItem>
                                            <SelectItem value="5">5 hari</SelectItem>
                                            <SelectItem value="7">7 hari</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
