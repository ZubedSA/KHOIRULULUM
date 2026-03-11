'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ClipboardCheck, Check, X, AlertCircle, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'

// Mock data
const mockStudents = [
    { id: '1', nis: '2024001', name: 'Ahmad Fauzi', status: null },
    { id: '2', nis: '2024002', name: 'Fatimah Zahra', status: null },
    { id: '3', nis: '2024003', name: 'Muhammad Ali', status: null },
    { id: '4', nis: '2024004', name: 'Aisyah Putri', status: null },
    { id: '5', nis: '2024005', name: 'Rizky Pratama', status: null },
    { id: '6', nis: '2024006', name: 'Dewi Safitri', status: null },
    { id: '7', nis: '2024007', name: 'Hasan Abdullah', status: null },
    { id: '8', nis: '2024008', name: 'Khadijah Sari', status: null },
]

const mockClasses = ['7A', '7B', '8A', '8B', '9A', '9B']
const attendanceStatuses = [
    { value: 'hadir', label: 'Hadir', icon: Check, color: 'green' },
    { value: 'sakit', label: 'Sakit', icon: AlertCircle, color: 'yellow' },
    { value: 'izin', label: 'Izin', icon: AlertCircle, color: 'blue' },
    { value: 'alpha', label: 'Alpha', icon: X, color: 'red' },
]

export default function AbsensiPage() {
    const [selectedClass, setSelectedClass] = useState('7A')
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [attendance, setAttendance] = useState<Record<string, string>>({})

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }))
    }

    const setAllStatus = (status: string) => {
        const newAttendance: Record<string, string> = {}
        mockStudents.forEach(student => {
            newAttendance[student.id] = status
        })
        setAttendance(newAttendance)
    }

    const getStatusBadge = (status: string | null) => {
        if (!status) return null
        const statusInfo = attendanceStatuses.find(s => s.value === status)
        if (!statusInfo) return null

        const colorClasses = {
            green: 'bg-green-100 text-green-700 hover:bg-green-100',
            yellow: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
            blue: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
            red: 'bg-red-100 text-red-700 hover:bg-red-100',
        }

        return (
            <Badge className={colorClasses[statusInfo.color as keyof typeof colorClasses]}>
                {statusInfo.label}
            </Badge>
        )
    }

    const stats = {
        total: mockStudents.length,
        hadir: Object.values(attendance).filter(s => s === 'hadir').length,
        sakit: Object.values(attendance).filter(s => s === 'sakit').length,
        izin: Object.values(attendance).filter(s => s === 'izin').length,
        alpha: Object.values(attendance).filter(s => s === 'alpha').length,
        belum: mockStudents.length - Object.keys(attendance).length,
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Input Absensi</h1>
                        <p className="text-gray-500">Catat kehadiran siswa harian</p>
                    </div>
                    <Button className="bg-blue-500 hover:bg-blue-600" disabled={Object.keys(attendance).length === 0}>
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        Simpan Absensi
                    </Button>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500">Tanggal</label>
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-44"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm text-gray-500">Kelas</label>
                                <Select value={selectedClass} onValueChange={setSelectedClass}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Pilih Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockClasses.map((cls) => (
                                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => setAllStatus('hadir')}>
                                    <Check className="w-4 h-4 mr-1 text-green-600" />
                                    Semua Hadir
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-xs text-gray-500">Total Siswa</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-2">
                                <Check className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stats.hadir}</p>
                            <p className="text-xs text-gray-500">Hadir</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center mx-auto mb-2">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <p className="text-2xl font-bold text-yellow-600">{stats.sakit}</p>
                            <p className="text-xs text-gray-500">Sakit</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-600">{stats.izin}</p>
                            <p className="text-xs text-gray-500">Izin</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2">
                                <X className="w-5 h-5 text-red-600" />
                            </div>
                            <p className="text-2xl font-bold text-red-600">{stats.alpha}</p>
                            <p className="text-xs text-gray-500">Alpha</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4 text-center">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-2">
                                <ClipboardCheck className="w-5 h-5 text-gray-600" />
                            </div>
                            <p className="text-2xl font-bold text-gray-600">{stats.belum}</p>
                            <p className="text-xs text-gray-500">Belum</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Student List */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ClipboardCheck className="w-5 h-5 text-blue-600" />
                            Daftar Siswa Kelas {selectedClass}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {mockStudents.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-500">NIS: {student.nis}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {attendance[student.id] && getStatusBadge(attendance[student.id])}
                                        <div className="flex gap-1">
                                            {attendanceStatuses.map((status) => (
                                                <Button
                                                    key={status.value}
                                                    variant={attendance[student.id] === status.value ? 'default' : 'outline'}
                                                    size="sm"
                                                    className={`w-9 h-9 p-0 ${attendance[student.id] === status.value
                                                        ? status.color === 'green' ? 'bg-green-500 hover:bg-green-600'
                                                            : status.color === 'yellow' ? 'bg-yellow-500 hover:bg-yellow-600'
                                                                : status.color === 'blue' ? 'bg-blue-500 hover:bg-blue-600'
                                                                    : 'bg-red-500 hover:bg-red-600'
                                                        : ''
                                                        }`}
                                                    onClick={() => handleStatusChange(student.id, status.value)}
                                                >
                                                    <status.icon className={`w-4 h-4 ${attendance[student.id] === status.value ? 'text-white' :
                                                        status.color === 'green' ? 'text-green-600' :
                                                            status.color === 'yellow' ? 'text-yellow-600' :
                                                                status.color === 'blue' ? 'text-blue-600' :
                                                                    'text-red-600'
                                                        }`} />
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
