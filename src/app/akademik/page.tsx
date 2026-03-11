'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, Calendar, ClipboardCheck, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function AkademikDashboard() {
    // Mock data - will be replaced with real data from Supabase
    const stats = {
        totalKelas: 12,
        totalSiswa: 456,
        absensiHariIni: 423,
        tidakHadir: 33
    }

    const todaySchedule = [
        { time: '07:30 - 08:30', subject: 'Al-Quran', class: 'Kelas 7A', status: 'ongoing' },
        { time: '08:30 - 09:30', subject: 'Bahasa Arab', class: 'Kelas 7B', status: 'upcoming' },
        { time: '10:00 - 11:00', subject: 'Fiqih', class: 'Kelas 8A', status: 'upcoming' },
        { time: '11:00 - 12:00', subject: 'Akidah Akhlak', class: 'Kelas 9A', status: 'upcoming' },
    ]

    const recentGrades = [
        { student: 'Ahmad Fauzi', class: '7A', subject: 'Al-Quran', score: 85, type: 'UTS' },
        { student: 'Fatimah Zahra', class: '7A', subject: 'Al-Quran', score: 92, type: 'UTS' },
        { student: 'Muhammad Ali', class: '7B', subject: 'Bahasa Arab', score: 78, type: 'Tugas' },
        { student: 'Aisyah Putri', class: '8A', subject: 'Fiqih', score: 88, type: 'UTS' },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
                    <h2 className="text-2xl font-bold mb-1">Dashboard Akademik 📚</h2>
                    <p className="text-blue-100">Kelola data akademik madrasah dengan mudah.</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                Total Kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalKelas}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                </div>
                                Total Siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">{stats.totalSiswa}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <ClipboardCheck className="w-4 h-4 text-green-600" />
                                </div>
                                Hadir Hari Ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">{stats.absensiHariIni}</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <ClipboardCheck className="w-4 h-4 text-red-600" />
                                </div>
                                Tidak Hadir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-red-600">{stats.tidakHadir}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Input Absensi', icon: ClipboardCheck, href: '/akademik/absensi', color: 'blue' },
                        { label: 'Input Nilai', icon: FileText, href: '/akademik/nilai', color: 'emerald' },
                        { label: 'Lihat Jadwal', icon: Calendar, href: '/akademik/jadwal', color: 'violet' },
                        { label: 'Data Siswa', icon: Users, href: '/akademik/siswa', color: 'orange' },
                    ].map((item, index) => (
                        <Link key={index} href={item.href}>
                            <Card className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer group ${item.color === 'blue' ? 'hover:border-blue-200' :
                                item.color === 'emerald' ? 'hover:border-emerald-200' :
                                    item.color === 'violet' ? 'hover:border-violet-200' :
                                        'hover:border-orange-200'
                                }`}>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color === 'blue' ? 'bg-blue-100' :
                                        item.color === 'emerald' ? 'bg-emerald-100' :
                                            item.color === 'violet' ? 'bg-violet-100' :
                                                'bg-orange-100'
                                        }`}>
                                        <item.icon className={`w-5 h-5 ${item.color === 'blue' ? 'text-blue-600' :
                                            item.color === 'emerald' ? 'text-emerald-600' :
                                                item.color === 'violet' ? 'text-violet-600' :
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
                    {/* Today's Schedule */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Jadwal Hari Ini</CardTitle>
                                <CardDescription>Jadwal mengajar Anda</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/akademik/jadwal">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {todaySchedule.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-xl border transition-all ${item.status === 'ongoing'
                                            ? 'border-blue-200 bg-blue-50'
                                            : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className={`font-medium ${item.status === 'ongoing' ? 'text-blue-700' : 'text-gray-900'}`}>
                                                    {item.subject}
                                                </p>
                                                <p className="text-sm text-gray-500">{item.class}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-medium ${item.status === 'ongoing' ? 'text-blue-600' : 'text-gray-600'}`}>
                                                    {item.time}
                                                </p>
                                                {item.status === 'ongoing' && (
                                                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                                        Berlangsung
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Grades */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Nilai Terbaru</CardTitle>
                                <CardDescription>Input nilai terakhir</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/akademik/nilai">Lihat Semua</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentGrades.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.student}</p>
                                            <p className="text-sm text-gray-500">{item.class} • {item.subject} • {item.type}</p>
                                        </div>
                                        <div className={`text-lg font-bold ${item.score >= 85 ? 'text-green-600' :
                                            item.score >= 70 ? 'text-blue-600' :
                                                'text-orange-600'
                                            }`}>
                                            {item.score}
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
