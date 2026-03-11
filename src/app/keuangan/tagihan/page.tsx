'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Receipt, Check, Search, Download, Loader2 } from 'lucide-react'
import { useBills } from '@/hooks/use-bills'
import { useToast } from '@/hooks/use-toast'

const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
]

export default function TagihanPage() {
    const [classFilter, setClassFilter] = useState<string>('all')
    const [monthFilter, setMonthFilter] = useState<string>('1')
    const [yearFilter, setYearFilter] = useState<string>('2026')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
    const [selectedBillId, setSelectedBillId] = useState<string | null>(null)
    const [paymentAmount, setPaymentAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'qris'>('cash')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { toast } = useToast()

    const filters = useMemo(() => ({
        classId: classFilter,
        month: parseInt(monthFilter),
        year: parseInt(yearFilter),
        status: statusFilter as 'unpaid' | 'paid' | 'partial' | 'all',
        search: searchQuery
    }), [classFilter, monthFilter, yearFilter, statusFilter, searchQuery])

    const { bills, classes, loading, createPayment } = useBills(filters)

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Lunas</Badge>
            case 'partial':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Sebagian</Badge>
            case 'unpaid':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Belum Bayar</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const selectedBill = bills.find(b => b.id === selectedBillId)

    const handlePayment = (billId: string) => {
        const bill = bills.find(b => b.id === billId)
        setSelectedBillId(billId)
        setPaymentAmount(bill?.amount.toString() || '')
        setIsPaymentDialogOpen(true)
    }

    const handleSubmitPayment = async () => {
        if (!selectedBillId || !paymentAmount) return

        setIsSubmitting(true)
        const success = await createPayment(selectedBillId, parseInt(paymentAmount), paymentMethod)
        setIsSubmitting(false)

        if (success) {
            toast({
                title: "Pembayaran Berhasil",
                description: `Pembayaran sebesar ${formatRupiah(parseInt(paymentAmount))} telah dicatat.`,
            })
            setIsPaymentDialogOpen(false)
            setSelectedBillId(null)
        } else {
            toast({
                title: "Pembayaran Gagal",
                description: "Terjadi kesalahan saat menyimpan pembayaran.",
                variant: "destructive"
            })
        }
    }

    const stats = {
        total: bills.length,
        paid: bills.filter(b => b.status === 'paid').length,
        unpaid: bills.filter(b => b.status === 'unpaid').length,
        partial: bills.filter(b => b.status === 'partial').length,
        totalAmount: bills.reduce((sum, b) => sum + b.amount, 0),
        paidAmount: bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0),
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tagihan Santri</h1>
                        <p className="text-gray-500">Kelola tagihan pembayaran santri per kelas</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                            <Receipt className="w-4 h-4 mr-2" />
                            Generate Tagihan
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Total Tagihan</p>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{formatRupiah(stats.totalAmount)}</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Sudah Terbayar</p>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-green-600">{formatRupiah(stats.paidAmount)}</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Lunas</p>
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-green-600">{stats.paid} siswa</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-500">Belum Bayar</p>
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-red-600">{stats.unpaid} siswa</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-4">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama atau NIS..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={monthFilter} onValueChange={setMonthFilter}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Bulan" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month) => (
                                        <SelectItem key={month.value} value={month.value.toString()}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={yearFilter} onValueChange={setYearFilter}>
                                <SelectTrigger className="w-28">
                                    <SelectValue placeholder="Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2026">2026</SelectItem>
                                    <SelectItem value="2025">2025</SelectItem>
                                    <SelectItem value="2024">2024</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-36">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="paid">Lunas</SelectItem>
                                    <SelectItem value="partial">Sebagian</SelectItem>
                                    <SelectItem value="unpaid">Belum Bayar</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Bills Table */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="p-8 flex items-center justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mr-2" />
                                <span className="text-gray-500">Memuat data...</span>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                                        <TableHead className="font-semibold">NIS</TableHead>
                                        <TableHead className="font-semibold">Nama Siswa</TableHead>
                                        <TableHead className="font-semibold">Kelas</TableHead>
                                        <TableHead className="font-semibold">Kategori</TableHead>
                                        <TableHead className="font-semibold">Jumlah</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bills.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                Tidak ada tagihan ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bills.map((bill) => (
                                            <TableRow key={bill.id} className="hover:bg-gray-50">
                                                <TableCell className="font-mono text-gray-600">{bill.student?.nis || '-'}</TableCell>
                                                <TableCell className="font-medium text-gray-900">{bill.student?.name || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{bill.class?.name || '-'}</Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{bill.category?.name || '-'}</TableCell>
                                                <TableCell className="font-semibold text-gray-900">{formatRupiah(bill.amount)}</TableCell>
                                                <TableCell>{getStatusBadge(bill.status)}</TableCell>
                                                <TableCell>
                                                    {bill.status !== 'paid' ? (
                                                        <Button
                                                            size="sm"
                                                            className="bg-emerald-500 hover:bg-emerald-600"
                                                            onClick={() => handlePayment(bill.id)}
                                                        >
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Bayar
                                                        </Button>
                                                    ) : (
                                                        <Button size="sm" variant="outline" disabled>
                                                            <Check className="w-4 h-4 mr-1" />
                                                            Lunas
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Dialog */}
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Input Pembayaran</DialogTitle>
                            <DialogDescription>
                                Catat pembayaran untuk {selectedBill?.student?.name}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="p-4 rounded-xl bg-gray-50 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Siswa:</span>
                                    <span className="font-medium">{selectedBill?.student?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Kelas:</span>
                                    <span className="font-medium">{selectedBill?.class?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Kategori:</span>
                                    <span className="font-medium">{selectedBill?.category?.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tagihan:</span>
                                    <span className="font-bold text-emerald-600">{formatRupiah(selectedBill?.amount || 0)}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="amount">Jumlah Bayar</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="Masukkan jumlah"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="method">Metode Pembayaran</Label>
                                <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih metode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">Tunai</SelectItem>
                                        <SelectItem value="transfer">Transfer Bank</SelectItem>
                                        <SelectItem value="qris">QRIS</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>Batal</Button>
                            <Button
                                className="bg-emerald-500 hover:bg-emerald-600"
                                onClick={handleSubmitPayment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Simpan Pembayaran
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DashboardLayout>
    )
}
