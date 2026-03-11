'use client'

import { useState } from 'react'
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
import { AlertCircle, Search, MessageSquare, Phone, Wallet, Users } from 'lucide-react'

// Mock data
const arrearsData = [
    { id: '1', student: 'Umar Hadi', nis: '20251005', class: '7A', parent: 'Bapak Hadi', phone: '08123456789', months: 3, amount: 1500000 },
    { id: '2', student: 'Zainab Nur', nis: '20251012', class: '7B', parent: 'Ibu Nur', phone: '08234567890', months: 2, amount: 1000000 },
    { id: '3', student: 'Hamid Fauzan', nis: '20251023', class: '8A', parent: 'Bapak Fauzan', phone: '08345678901', months: 4, amount: 2000000 },
    { id: '4', student: 'Safira Dewi', nis: '20251034', class: '8B', parent: 'Ibu Dewi', phone: '08456789012', months: 1, amount: 500000 },
    { id: '5', student: 'Ridwan Akbar', nis: '20251045', class: '9A', parent: 'Bapak Akbar', phone: '08567890123', months: 2, amount: 1000000 },
    { id: '6', student: 'Laila Sari', nis: '20251056', class: '9B', parent: 'Ibu Sari', phone: '08678901234', months: 5, amount: 2500000 },
    { id: '7', student: 'Farhan Rizki', nis: '20251067', class: '7A', parent: 'Bapak Rizki', phone: '08789012345', months: 1, amount: 500000 },
]

const classes = ['Semua Kelas', 'Kelas 7A', 'Kelas 7B', 'Kelas 8A', 'Kelas 8B', 'Kelas 9A', 'Kelas 9B']

export default function TunggakanPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState('Semua Kelas')
    const [monthFilter, setMonthFilter] = useState('all')

    const filteredArrears = arrearsData.filter(arrear => {
        const matchesSearch = arrear.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            arrear.nis.includes(searchQuery)
        const matchesClass = classFilter === 'Semua Kelas' || arrear.class === classFilter.replace('Kelas ', '')
        const matchesMonth = monthFilter === 'all' ||
            (monthFilter === '1' && arrear.months === 1) ||
            (monthFilter === '2' && arrear.months === 2) ||
            (monthFilter === '3+' && arrear.months >= 3)
        return matchesSearch && matchesClass && matchesMonth
    })

    const totalArrears = arrearsData.reduce((sum, a) => sum + a.amount, 0)
    const studentCount = arrearsData.length
    const criticalCount = arrearsData.filter(a => a.months >= 3).length

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getSeverityColor = (months: number) => {
        if (months >= 3) return 'bg-red-100 text-red-700'
        if (months >= 2) return 'bg-orange-100 text-orange-700'
        return 'bg-yellow-100 text-yellow-700'
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tunggakan SPP</h1>
                        <p className="text-gray-500">Pantau dan kelola tunggakan pembayaran</p>
                    </div>
                    <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Kirim Pengingat Massal
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2 text-orange-100">
                                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                    <Wallet className="w-4 h-4 text-white" />
                                </div>
                                Total Tunggakan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatRupiah(totalArrears)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                Siswa Menunggak
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-blue-600">{studentCount}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                </div>
                                Tunggakan Kritis (&gt;3 bln)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Wallet className="w-4 h-4 text-emerald-600" />
                                </div>
                                Rata-rata/Siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-emerald-600">
                                {formatRupiah(Math.round(totalArrears / studentCount))}
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
                                    placeholder="Cari siswa atau NIS..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Lama Tunggakan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="1">1 Bulan</SelectItem>
                                    <SelectItem value="2">2 Bulan</SelectItem>
                                    <SelectItem value="3+">3+ Bulan (Kritis)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Daftar Siswa dengan Tunggakan</CardTitle>
                        <CardDescription>
                            {filteredArrears.length} siswa dengan tunggakan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIS</TableHead>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Wali / Telp</TableHead>
                                    <TableHead className="text-center">Lama</TableHead>
                                    <TableHead className="text-right">Jumlah</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredArrears.map((arrear) => (
                                    <TableRow key={arrear.id}>
                                        <TableCell className="font-mono text-sm">{arrear.nis}</TableCell>
                                        <TableCell className="font-medium">{arrear.student}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                                {arrear.class}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">{arrear.parent}</p>
                                                <p className="text-xs text-gray-500">{arrear.phone}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(arrear.months)}`}>
                                                {arrear.months} bulan
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-red-600">
                                            {formatRupiah(arrear.amount)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Hubungi WhatsApp">
                                                    <Phone className="w-4 h-4 text-green-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" title="Kirim Pengingat">
                                                    <MessageSquare className="w-4 h-4 text-blue-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
