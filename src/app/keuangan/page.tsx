'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, TrendingUp, TrendingDown, AlertCircle, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'

export default function KeuanganDashboard() {
    const { stats, loading } = useDashboardStats()

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const calculatePercentageChange = (current: number, previous: number): string => {
        if (previous === 0) return '0'
        return ((current - previous) / previous * 100).toFixed(1)
    }

    const pemasukanChange = parseFloat(calculatePercentageChange(stats.totalPemasukan, stats.pemasukanBulanLalu))
    const pengeluaranChange = parseFloat(calculatePercentageChange(stats.totalPengeluaran, stats.pengeluaranBulanLalu))
    const saldo = stats.totalPemasukan - stats.totalPengeluaran
    const tagihanLunas = stats.totalTagihan - stats.totalTunggakan

    const recentTransactions = [
        { type: 'income', description: 'Pembayaran SPP - Ahmad Fauzi', amount: 500000, date: 'Hari ini', category: 'SPP' },
        { type: 'expense', description: 'Pembayaran Listrik', amount: 1500000, date: 'Hari ini', category: 'Listrik & Air' },
        { type: 'income', description: 'Pembayaran SPP - Fatimah Zahra', amount: 500000, date: 'Kemarin', category: 'SPP' },
        { type: 'income', description: 'Donasi - Bapak H. Ahmad', amount: 5000000, date: 'Kemarin', category: 'Donasi' },
        { type: 'expense', description: 'Pembelian ATK', amount: 750000, date: '2 hari lalu', category: 'ATK' },
    ]

    const tunggakanSiswa = [
        { name: 'Muhammad Ali', class: '7A', amount: 1500000, months: 3 },
        { name: 'Dewi Safitri', class: '8B', amount: 1000000, months: 2 },
        { name: 'Rizky Pratama', class: '9A', amount: 500000, months: 1 },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
                    <h2 className="text-2xl font-bold mb-1">Dashboard Keuangan 💰</h2>
                    <p className="text-emerald-100">Kelola keuangan madrasah dengan transparan dan akurat.</p>
                </div>

                {/* Main Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                </div>
                                Total Pemasukan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-green-600">{formatRupiah(stats.totalPemasukan)}</p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                                {pemasukanChange >= 0 ? (
                                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm ${pemasukanChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(pemasukanChange)}%
                                </span>
                                <span className="text-sm text-gray-500">dari bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                </div>
                                Total Pengeluaran
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-red-600">{formatRupiah(stats.totalPengeluaran)}</p>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                                {pengeluaranChange <= 0 ? (
                                    <ArrowDownRight className="w-4 h-4 text-green-500" />
                                ) : (
                                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                                )}
                                <span className={`text-sm ${pengeluaranChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Math.abs(pengeluaranChange)}%
                                </span>
                                <span className="text-sm text-gray-500">dari bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-white">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Receipt className="w-4 h-4 text-emerald-600" />
                                </div>
                                Saldo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-emerald-600">{formatRupiah(saldo)}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">saldo saat ini</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Billing Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription>Total Tagihan Bulan Ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{formatRupiah(stats.totalTagihan)}</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription>Tagihan Lunas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <>
                                    <p className="text-2xl font-bold text-green-600">{formatRupiah(tagihanLunas)}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: stats.totalTagihan > 0 ? `${(tagihanLunas / stats.totalTagihan) * 100}%` : '0%' }}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                Tunggakan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                            ) : (
                                <p className="text-2xl font-bold text-orange-600">{formatRupiah(stats.totalTunggakan)}</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Input Pembayaran', icon: Receipt, href: '/keuangan/tagihan', color: 'emerald' },
                        { label: 'Catat Pemasukan', icon: TrendingUp, href: '/keuangan/pemasukan', color: 'green' },
                        { label: 'Catat Pengeluaran', icon: TrendingDown, href: '/keuangan/pengeluaran', color: 'red' },
                        { label: 'Lihat Tunggakan', icon: AlertCircle, href: '/keuangan/tunggakan', color: 'orange' },
                    ].map((item, index) => (
                        <Link key={index} href={item.href}>
                            <Card className="border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color === 'emerald' ? 'bg-emerald-100' :
                                        item.color === 'green' ? 'bg-green-100' :
                                            item.color === 'red' ? 'bg-red-100' :
                                                'bg-orange-100'
                                        }`}>
                                        <item.icon className={`w-5 h-5 ${item.color === 'emerald' ? 'text-emerald-600' :
                                            item.color === 'green' ? 'text-green-600' :
                                                item.color === 'red' ? 'text-red-600' :
                                                    'text-orange-600'
                                            }`} />
                                    </div>
                                    <span className="font-medium text-gray-700 group-hover:text-gray-900">{item.label}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Transactions */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
                                <CardDescription>5 transaksi terakhir</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/keuangan/laporan">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentTransactions.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                {item.type === 'income' ? (
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{item.description}</p>
                                                <p className="text-xs text-gray-500">{item.category} • {item.date}</p>
                                            </div>
                                        </div>
                                        <p className={`font-semibold ${item.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {item.type === 'income' ? '+' : '-'}{formatRupiah(item.amount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tunggakan Alert */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-orange-500" />
                                    Siswa dengan Tunggakan
                                </CardTitle>
                                <CardDescription>Segera tindak lanjuti</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/keuangan/tunggakan">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {tunggakanSiswa.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-orange-100 bg-orange-50 hover:bg-orange-100 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">Kelas {item.class} • {item.months} bulan tunggakan</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-orange-600">{formatRupiah(item.amount)}</p>
                                            <Button variant="ghost" size="sm" className="text-xs text-orange-600 hover:text-orange-700 p-0 h-auto">
                                                Tagih
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
