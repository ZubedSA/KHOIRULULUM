'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { TrendingDown, Plus, Search, Calendar, Wallet, ShoppingCart, Loader2, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { useTransactions } from '@/hooks/use-transactions'
import { useToast } from '@/hooks/use-toast'
import { useUI } from '@/hooks/use-ui'

export default function PengeluaranPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        category_id: '',
        description: '',
        amount: '',
        recipient: ''
    })

    const { toast } = useToast()
    const { confirm } = useUI()

    const filters = useMemo(() => ({
        categoryId: categoryFilter,
        search: searchQuery
    }), [categoryFilter, searchQuery])

    const {
        transactions,
        categories,
        loading,
        createTransaction,
        deleteTransaction,
        totalAmount,
        todayAmount
    } = useTransactions('expense', filters)

    // Calculate Gaji total from transactions
    const gajiCategory = categories.find(c => c.name === 'Gaji Guru')
    const gajiAmount = transactions
        .filter(t => t.category_id === gajiCategory?.id)
        .reduce((sum, t) => sum + Number(t.amount), 0)

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.category_id || !formData.amount || !formData.description) {
            toast({
                title: "Data tidak lengkap",
                description: "Silakan isi kategori, deskripsi, dan jumlah",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)
        const success = await createTransaction({
            category_id: formData.category_id,
            amount: parseFloat(formData.amount),
            date: formData.date,
            description: formData.description,
            recipient: formData.recipient
        })
        setIsSubmitting(false)

        if (success) {
            toast({
                title: "Berhasil!",
                description: `Pengeluaran sebesar ${formatRupiah(parseFloat(formData.amount))} telah dicatat.`,
            })
            setIsDialogOpen(false)
            setFormData({
                date: format(new Date(), 'yyyy-MM-dd'),
                category_id: '',
                description: '',
                amount: '',
                recipient: ''
            })
        } else {
            toast({
                title: "Gagal menyimpan",
                description: "Terjadi kesalahan saat menyimpan data.",
                variant: "destructive"
            })
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Hapus Transaksi?',
            description: 'Apakah Anda yakin ingin menghapus catatan pengeluaran ini? Saldo akan disesuaikan secara otomatis.',
            confirmLabel: 'Ya, Hapus',
            variant: 'destructive'
        })

        if (confirmed) {
            const success = await deleteTransaction(id)
            if (success) {
                toast({
                    title: "Dihapus",
                    description: "Transaksi berhasil dihapus."
                })
            }
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pengeluaran</h1>
                        <p className="text-gray-500">Kelola semua transaksi pengeluaran</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-500 hover:bg-red-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Pengeluaran
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Pengeluaran Baru</DialogTitle>
                                <DialogDescription>
                                    Catat transaksi pengeluaran baru
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Tanggal</Label>
                                            <Input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Kategori</Label>
                                            <Select
                                                value={formData.category_id}
                                                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Deskripsi *</Label>
                                        <Input
                                            placeholder="Deskripsi transaksi (wajib)"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Jumlah (Rp)</Label>
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Penerima</Label>
                                            <Input
                                                placeholder="Contoh: Toko ATK"
                                                value={formData.recipient}
                                                onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button type="submit" className="bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        Simpan
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                </div>
                                Total Bulan Ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-red-600">{formatRupiah(totalAmount)}</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                Hari Ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-blue-600">{formatRupiah(todayAmount)}</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                    <Wallet className="w-4 h-4 text-violet-600" />
                                </div>
                                Total Gaji
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-violet-600">{formatRupiah(gajiAmount)}</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <ShoppingCart className="w-4 h-4 text-orange-600" />
                                </div>
                                Transaksi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-orange-600">{transactions.length}</p>
                            )}
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
                                    placeholder="Cari transaksi..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Daftar Pengeluaran</CardTitle>
                        <CardDescription>
                            {transactions.length} transaksi ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-red-500 mr-2" />
                                <span className="text-gray-500">Memuat data...</span>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Belum ada data pengeluaran. Klik &quot;Tambah Pengeluaran&quot; untuk menambah.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead>Penerima</TableHead>
                                        <TableHead className="text-right">Jumlah</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((expense) => (
                                        <TableRow key={expense.id}>
                                            <TableCell className="text-gray-500">
                                                {format(new Date(expense.date), 'dd MMM yyyy', { locale: idLocale })}
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                                                    {expense.category?.name || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium max-w-xs truncate">
                                                {expense.description || '-'}
                                            </TableCell>
                                            <TableCell className="text-gray-500">
                                                {expense.recipient || '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-red-600">
                                                {formatRupiah(Number(expense.amount))}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
