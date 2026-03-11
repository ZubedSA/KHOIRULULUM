'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, GraduationCap, BookOpen, Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useDashboardStats } from '@/hooks/use-dashboard-stats'

export default function AdminDashboard() {
    const { stats, loading } = useDashboardStats()

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-violet-500/20">
                    <h2 className="text-2xl font-bold mb-1">Selamat Datang, Admin! 👋</h2>
                    <p className="text-violet-100">Berikut ringkasan data madrasah hari ini.</p>
                </div>

                {/* Academic Stats */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Data Akademik
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    Total Guru
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalGuru}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">tenaga pengajar aktif</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <GraduationCap className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    Total Siswa
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalSiswa}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">santri terdaftar</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                        <BookOpen className="w-4 h-4 text-violet-600" />
                                    </div>
                                    Total Kelas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-9 w-16 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalKelas}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">kelas aktif</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Financial Stats */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Ringkasan Keuangan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                    </div>
                                    Pemasukan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-2xl font-bold text-green-600">{formatRupiah(stats.totalPemasukan)}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">bulan ini</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                        <TrendingDown className="w-4 h-4 text-red-600" />
                                    </div>
                                    Pengeluaran
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-2xl font-bold text-red-600">{formatRupiah(stats.totalPengeluaran)}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">bulan ini</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                    </div>
                                    Total Tagihan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-2xl font-bold text-blue-600">{formatRupiah(stats.totalTagihan)}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">bulan ini</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardDescription className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                        <Wallet className="w-4 h-4 text-orange-600" />
                                    </div>
                                    Tunggakan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className="text-2xl font-bold text-orange-600">{formatRupiah(stats.totalTunggakan)}</p>
                                )}
                                <p className="text-sm text-gray-500 mt-1">belum terbayar</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
                            <CardDescription>Log aktivitas sistem</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { action: 'User baru ditambahkan', user: 'Ustadz Ahmad', time: '2 menit lalu', type: 'create' },
                                    { action: 'Pembayaran SPP diterima', user: 'Ahmad Fauzi', time: '15 menit lalu', type: 'payment' },
                                    { action: 'Data siswa diperbarui', user: 'Admin', time: '1 jam lalu', type: 'update' },
                                    { action: 'Absensi kelas 7A dicatat', user: 'Ustadzah Fatimah', time: '2 jam lalu', type: 'attendance' },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                        <div className={`w-2 h-2 rounded-full ${item.type === 'create' ? 'bg-green-500' :
                                            item.type === 'payment' ? 'bg-blue-500' :
                                                item.type === 'update' ? 'bg-yellow-500' :
                                                    'bg-violet-500'
                                            }`} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{item.action}</p>
                                            <p className="text-xs text-gray-500">{item.user} • {item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                            <CardDescription>Akses cepat ke fitur utama</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Tambah User', icon: Users, color: 'violet', href: '/admin/users' },
                                    { label: 'Input Pembayaran', icon: Wallet, color: 'emerald', href: '/keuangan/tagihan' },
                                    { label: 'Lihat Absensi', icon: Calendar, color: 'blue', href: '/akademik/absensi' },
                                    { label: 'Laporan Keuangan', icon: TrendingUp, color: 'green', href: '/keuangan/laporan' },
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href={item.href}
                                        className={`p-4 rounded-xl border-2 border-dashed transition-all hover:border-solid ${item.color === 'violet' ? 'border-violet-200 hover:border-violet-400 hover:bg-violet-50' :
                                            item.color === 'emerald' ? 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50' :
                                                item.color === 'blue' ? 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' :
                                                    'border-green-200 hover:border-green-400 hover:bg-green-50'
                                            }`}
                                    >
                                        <item.icon className={`w-6 h-6 mb-2 ${item.color === 'violet' ? 'text-violet-500' :
                                            item.color === 'emerald' ? 'text-emerald-500' :
                                                item.color === 'blue' ? 'text-blue-500' :
                                                    'text-green-500'
                                            }`} />
                                        <p className="text-sm font-medium text-gray-700">{item.label}</p>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
