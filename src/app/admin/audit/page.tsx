'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Shield, Search, Eye, UserPlus, Edit, Trash2, LogIn, LogOut, Download, Upload, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useAuditLogs, type AuditLog } from '@/hooks/use-audit'

const actionTypes = ['Semua', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT']
const modules = ['Semua', 'students', 'payments', 'settings', 'auth', 'grades', 'expenses']

export default function AuditPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [actionFilter, setActionFilter] = useState('Semua')
    const [moduleFilter, setModuleFilter] = useState('Semua')
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

    const filters = useMemo(() => ({
        action: actionFilter,
        tableName: moduleFilter,
        search: searchQuery
    }), [actionFilter, moduleFilter, searchQuery])

    const { logs, loading } = useAuditLogs(filters)

    // Filter by search query client-side for now
    const filteredLogs = logs.filter(log => {
        if (!searchQuery) return true
        const searchLower = searchQuery.toLowerCase()
        return (
            log.action.toLowerCase().includes(searchLower) ||
            log.table_name.toLowerCase().includes(searchLower) ||
            log.user?.email.toLowerCase().includes(searchLower)
        )
    })

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATE': return <UserPlus className="w-4 h-4" />
            case 'UPDATE': return <Edit className="w-4 h-4" />
            case 'DELETE': return <Trash2 className="w-4 h-4" />
            case 'LOGIN': return <LogIn className="w-4 h-4" />
            case 'LOGOUT': return <LogOut className="w-4 h-4" />
            case 'EXPORT': return <Download className="w-4 h-4" />
            case 'IMPORT': return <Upload className="w-4 h-4" />
            default: return <Shield className="w-4 h-4" />
        }
    }

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-green-100 text-green-700'
            case 'UPDATE': return 'bg-blue-100 text-blue-700'
            case 'DELETE': return 'bg-red-100 text-red-700'
            case 'LOGIN': return 'bg-emerald-100 text-emerald-700'
            case 'LOGOUT': return 'bg-gray-100 text-gray-700'
            case 'EXPORT': return 'bg-violet-100 text-violet-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const formatDiff = (oldData: unknown, newData: unknown) => {
        if (!oldData && !newData) return 'Tidak ada detail perubahan'

        return (
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-gray-50 p-2 rounded max-h-40 overflow-y-auto">
                <div>
                    <strong className="text-red-500">Sebelum:</strong>
                    <pre>{JSON.stringify(oldData, null, 2)}</pre>
                </div>
                <div>
                    <strong className="text-green-500">Sesudah:</strong>
                    <pre>{JSON.stringify(newData, null, 2)}</pre>
                </div>
            </div>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                        <p className="text-gray-500">Riwayat aktivitas sistem</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Total Aktivitas</p>
                            <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Hari Ini</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {logs.filter(l => l.created_at.startsWith(new Date().toISOString().split('T')[0])).length}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Login Hari Ini</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {logs.filter(l => l.action === 'LOGIN' && l.created_at.startsWith(new Date().toISOString().split('T')[0])).length}
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Perubahan Data</p>
                            <p className="text-2xl font-bold text-violet-600">
                                {logs.filter(l => ['CREATE', 'UPDATE', 'DELETE'].includes(l.action)).length}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Cari aktivitas..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={actionFilter} onValueChange={setActionFilter}>
                                <SelectTrigger className="w-full md:w-36">
                                    <SelectValue placeholder="Aksi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {actionTypes.map((action) => (
                                        <SelectItem key={action} value={action}>{action}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={moduleFilter} onValueChange={setModuleFilter}>
                                <SelectTrigger className="w-full md:w-36">
                                    <SelectValue placeholder="Modul" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modules.map((mod) => (
                                        <SelectItem key={mod} value={mod}>{mod}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Riwayat Aktivitas</CardTitle>
                        <CardDescription>
                            {filteredLogs.length} aktivitas ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                                <span className="text-gray-500">Memuat log...</span>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                                <Shield className="w-10 h-10 text-gray-300 mb-2" />
                                <p>Belum ada aktivitas tercatat</p>
                                <p className="text-xs mt-1">Jalankan script `004_settings_audit_schema.sql` jika tabel belum dibuat.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Aksi</TableHead>
                                        <TableHead>Modul</TableHead>
                                        <TableHead className="text-right">Detail</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="text-sm text-gray-500 whitespace-nowrap">
                                                {format(new Date(log.created_at), 'dd MMM HH:mm', { locale: id })}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {log.user?.email || 'System'}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getActionColor(log.action)}`}>
                                                    {getActionIcon(log.action)}
                                                    {log.action}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                    {log.table_name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setSelectedLog(log)}
                                                >
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Detail Dialog */}
                <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Detail Aktivitas</DialogTitle>
                            <DialogDescription>
                                Informasi lengkap log aktivitas
                            </DialogDescription>
                        </DialogHeader>
                        {selectedLog && (
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Waktu</p>
                                        <p className="font-medium">
                                            {format(new Date(selectedLog.created_at), 'dd MMMM yyyy, HH:mm:ss', { locale: id })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">User</p>
                                        <p className="font-medium">{selectedLog.user?.email || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500">{selectedLog.user?.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Aksi</p>
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getActionColor(selectedLog.action)}`}>
                                            {getActionIcon(selectedLog.action)}
                                            {selectedLog.action}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Modul / Tabel</p>
                                        <p className="font-medium">{selectedLog.table_name}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Perubahan Data</p>
                                    {formatDiff(selectedLog.old_data, selectedLog.new_data)}
                                </div>

                                <div className="flex gap-4 pt-4 border-t">
                                    {selectedLog.ip_address && (
                                        <div>
                                            <p className="text-sm text-gray-500">IP Address</p>
                                            <p className="font-mono text-xs">{selectedLog.ip_address}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-500">Record ID</p>
                                        <p className="font-mono text-xs">{selectedLog.record_id}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
