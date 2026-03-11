'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { BarChart3, TrendingUp, TrendingDown, Download, FileSpreadsheet, FileText, Wallet, Loader2 } from 'lucide-react'
import { useReports } from '@/hooks/use-reports'

export default function LaporanPage() {
    const currentYearStr = new Date().getFullYear().toString()
    const [period, setPeriod] = useState(currentYearStr)
    const {
        monthlyData,
        categoryBreakdown,
        totalIncome,
        totalExpense,
        netIncome,
        loading
    } = useReports(period)

    const maxValue = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense))) || 1

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatShortRupiah = (amount: number) => {
        if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)}M`
        if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(0)}jt`
        return formatRupiah(amount)
    }

    const handleExportExcel = () => {
        // Create CSV content
        const headers = ['Bulan', 'Pemasukan', 'Pengeluaran', 'Selisih']
        const rows = monthlyData.map(d => [
            d.month,
            d.income.toString(),
            d.expense.toString(),
            (d.income - d.expense).toString()
        ])

        // Add Totals row
        rows.push(['TOTAL', totalIncome.toString(), totalExpense.toString(), netIncome.toString()])

        // Join to CSV string
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `laporan_keuangan_${period}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handlePrint = () => {
        window.print()
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h1>
                        <p className="text-gray-500">Analisis dan ekspor laporan keuangan</p>
                    </div>
                    <div className="flex gap-3">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2026">2026</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2024">2024</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
                            <FileSpreadsheet className="w-4 h-4" />
                            Export CSV
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={handlePrint}>
                            <FileText className="w-4 h-4" />
                            Print / PDF
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2" />
                        <p className="text-gray-500">Menghitung laporan...</p>
                    </div>
                ) : (
                    <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        Total Pemasukan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-emerald-600">{formatShortRupiah(totalIncome)}</p>
                                    <p className="text-xs text-gray-500 mt-1">Tahun {period}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                        </div>
                                        Total Pengeluaran
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-red-600">{formatShortRupiah(totalExpense)}</p>
                                    <p className="text-xs text-gray-500 mt-1">Tahun {period}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Wallet className="w-4 h-4 text-blue-600" />
                                        </div>
                                        Saldo Bersih
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-blue-600">{formatShortRupiah(netIncome)}</p>
                                    <p className="text-xs text-gray-500 mt-1">Tahun {period}</p>
                                </CardContent>
                            </Card>
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                            <BarChart3 className="w-4 h-4 text-violet-600" />
                                        </div>
                                        Margin
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold text-violet-600">
                                        {totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0}%
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Rasio saldo/pemasukan</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Monthly Chart */}
                            <Card className="border-0 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg">Grafik Bulanan</CardTitle>
                                    <CardDescription>Perbandingan pemasukan dan pengeluaran</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {monthlyData.map((data) => (
                                            <div key={data.month} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">{data.month}</span>
                                                    <span className="text-gray-500">
                                                        {formatShortRupiah(data.income - data.expense)}
                                                    </span>
                                                </div>
                                                <div className="space-y-1">
                                                    {/* Income Bar */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 text-xs text-gray-500">Masuk</div>
                                                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                                style={{ width: `${maxValue > 0 ? (data.income / maxValue) * 100 : 0}%` }}
                                                            />
                                                        </div>
                                                        <div className="w-20 text-xs text-right text-emerald-600 font-medium">
                                                            {formatShortRupiah(data.income)}
                                                        </div>
                                                    </div>
                                                    {/* Expense Bar */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 text-xs text-gray-500">Keluar</div>
                                                        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-red-500 rounded-full transition-all duration-500"
                                                                style={{ width: `${maxValue > 0 ? (data.expense / maxValue) * 100 : 0}%` }}
                                                            />
                                                        </div>
                                                        <div className="w-20 text-xs text-right text-red-600 font-medium">
                                                            {formatShortRupiah(data.expense)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Category Breakdown */}
                            <div className="space-y-6">
                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Pemasukan per Kategori</CardTitle>
                                        <CardDescription>Breakdown sumber pemasukan</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {categoryBreakdown.income.length > 0 ? (
                                            <div className="space-y-3">
                                                {categoryBreakdown.income.map((cat) => (
                                                    <div key={cat.category} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium">{cat.category}</span>
                                                            <span className="text-gray-600">{formatShortRupiah(cat.amount)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${cat.color} rounded-full`}
                                                                    style={{ width: `${cat.percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-500 w-10 text-right">{cat.percentage}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">Belum ada data pemasukan</p>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-0 shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Pengeluaran per Kategori</CardTitle>
                                        <CardDescription>Breakdown penggunaan dana</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {categoryBreakdown.expense.length > 0 ? (
                                            <div className="space-y-3">
                                                {categoryBreakdown.expense.map((cat) => (
                                                    <div key={cat.category} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="font-medium">{cat.category}</span>
                                                            <span className="text-gray-600">{formatShortRupiah(cat.amount)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${cat.color} rounded-full`}
                                                                    style={{ width: `${cat.percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs text-gray-500 w-10 text-right">{cat.percentage}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 text-center py-4">Belum ada data pengeluaran</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
