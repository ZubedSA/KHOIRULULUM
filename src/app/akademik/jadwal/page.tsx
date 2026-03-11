'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Calendar, Plus, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock data
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const timeSlots = [
    '07:00 - 07:45',
    '07:45 - 08:30',
    '08:30 - 09:15',
    '09:15 - 10:00',
    '10:15 - 11:00',
    '11:00 - 11:45',
    '12:30 - 13:15',
    '13:15 - 14:00',
]

const scheduleData: Record<string, Record<string, { subject: string; teacher: string; color: string }>> = {
    'Senin': {
        '07:00 - 07:45': { subject: 'Al-Quran', teacher: 'Ust. Ahmad', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        '07:45 - 08:30': { subject: 'Al-Quran', teacher: 'Ust. Ahmad', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        '08:30 - 09:15': { subject: 'Matematika', teacher: 'Ust. Hasan', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        '09:15 - 10:00': { subject: 'Matematika', teacher: 'Ust. Hasan', color: 'bg-blue-100 text-blue-700 border-blue-200' },
        '10:15 - 11:00': { subject: 'B. Indonesia', teacher: 'Siti Aminah', color: 'bg-violet-100 text-violet-700 border-violet-200' },
        '11:00 - 11:45': { subject: 'B. Indonesia', teacher: 'Siti Aminah', color: 'bg-violet-100 text-violet-700 border-violet-200' },
    },
    'Selasa': {
        '07:00 - 07:45': { subject: 'Fiqih', teacher: 'Ust. Ibrahim', color: 'bg-amber-100 text-amber-700 border-amber-200' },
        '07:45 - 08:30': { subject: 'Fiqih', teacher: 'Ust. Ibrahim', color: 'bg-amber-100 text-amber-700 border-amber-200' },
        '08:30 - 09:15': { subject: 'IPA', teacher: 'Fatimah', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
        '09:15 - 10:00': { subject: 'IPA', teacher: 'Fatimah', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
        '10:15 - 11:00': { subject: 'B. Arab', teacher: 'Ust. Yusuf', color: 'bg-rose-100 text-rose-700 border-rose-200' },
        '11:00 - 11:45': { subject: 'B. Arab', teacher: 'Ust. Yusuf', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    },
    'Rabu': {
        '07:00 - 07:45': { subject: 'Akidah', teacher: 'Ust. Ali', color: 'bg-green-100 text-green-700 border-green-200' },
        '07:45 - 08:30': { subject: 'Akidah', teacher: 'Ust. Ali', color: 'bg-green-100 text-green-700 border-green-200' },
        '08:30 - 09:15': { subject: 'IPS', teacher: 'Khadijah', color: 'bg-orange-100 text-orange-700 border-orange-200' },
        '09:15 - 10:00': { subject: 'IPS', teacher: 'Khadijah', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    },
    'Kamis': {
        '07:00 - 07:45': { subject: 'SKI', teacher: 'Ust. Umar', color: 'bg-teal-100 text-teal-700 border-teal-200' },
        '07:45 - 08:30': { subject: 'SKI', teacher: 'Ust. Umar', color: 'bg-teal-100 text-teal-700 border-teal-200' },
        '08:30 - 09:15': { subject: 'B. Inggris', teacher: 'Aisyah', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
        '09:15 - 10:00': { subject: 'B. Inggris', teacher: 'Aisyah', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
        '10:15 - 11:00': { subject: 'Seni Budaya', teacher: 'Maryam', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    },
    'Jumat': {
        '07:00 - 07:45': { subject: 'Al-Quran', teacher: 'Ust. Ahmad', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        '07:45 - 08:30': { subject: 'Al-Quran', teacher: 'Ust. Ahmad', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        '08:30 - 09:15': { subject: 'Penjaskes', teacher: 'Zainab', color: 'bg-lime-100 text-lime-700 border-lime-200' },
        '09:15 - 10:00': { subject: 'Penjaskes', teacher: 'Zainab', color: 'bg-lime-100 text-lime-700 border-lime-200' },
    },
    'Sabtu': {
        '07:00 - 07:45': { subject: 'Tahfidz', teacher: 'Ust. Ahmad', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        '07:45 - 08:30': { subject: 'Tahfidz', teacher: 'Ust. Ahmad', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
        '08:30 - 09:15': { subject: 'Ekskul', teacher: '-', color: 'bg-gray-100 text-gray-700 border-gray-200' },
        '09:15 - 10:00': { subject: 'Ekskul', teacher: '-', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    },
}

const classes = ['Kelas 7A', 'Kelas 7B', 'Kelas 8A', 'Kelas 8B', 'Kelas 9A', 'Kelas 9B']
const subjects = ['Al-Quran', 'Matematika', 'B. Indonesia', 'B. Arab', 'Fiqih', 'Akidah', 'SKI', 'IPA', 'IPS', 'B. Inggris']
const teachers = ['Ust. Ahmad', 'Ust. Hasan', 'Ust. Ibrahim', 'Ust. Ali', 'Ust. Umar', 'Ustdzh. Fatimah', 'Ustdzh. Aisyah']

export default function JadwalPage() {
    const [selectedClass, setSelectedClass] = useState('Kelas 7A')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        day: '',
        time: '',
        subject: '',
        teacher: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        setIsDialogOpen(false)
        setFormData({ day: '', time: '', subject: '', teacher: '' })
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Jadwal Pelajaran</h1>
                        <p className="text-gray-500">Kelola jadwal pelajaran per kelas</p>
                    </div>
                    <div className="flex gap-3">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Pilih Kelas" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls) => (
                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-500 hover:bg-blue-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tambah Jadwal
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Jadwal Baru</DialogTitle>
                                    <DialogDescription>
                                        Tambahkan jadwal pelajaran untuk {selectedClass}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Hari</Label>
                                                <Select
                                                    value={formData.day}
                                                    onValueChange={(value) => setFormData({ ...formData, day: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih hari" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {days.map((day) => (
                                                            <SelectItem key={day} value={day}>{day}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Jam</Label>
                                                <Select
                                                    value={formData.time}
                                                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih jam" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {timeSlots.map((time) => (
                                                            <SelectItem key={time} value={time}>{time}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Mata Pelajaran</Label>
                                            <Select
                                                value={formData.subject}
                                                onValueChange={(value) => setFormData({ ...formData, subject: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih mata pelajaran" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {subjects.map((subject) => (
                                                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Guru</Label>
                                            <Select
                                                value={formData.teacher}
                                                onValueChange={(value) => setFormData({ ...formData, teacher: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih guru" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {teachers.map((teacher) => (
                                                        <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                                            Simpan
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                Kelas Aktif
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">{selectedClass}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                </div>
                                Total Jam/Minggu
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">32</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-violet-600" />
                                </div>
                                Mata Pelajaran
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">12</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Schedule Grid */}
                <Card className="border-0 shadow-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-lg">Jadwal Mingguan - {selectedClass}</CardTitle>
                        <CardDescription>Tahun Ajaran 2025/2026 Semester Ganjil</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left p-3 font-medium text-gray-600 w-28">Jam</th>
                                        {days.map((day) => (
                                            <th key={day} className="text-center p-3 font-medium text-gray-600">
                                                {day}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map((time, index) => (
                                        <tr key={time} className={cn("border-b", index === 4 && "border-t-4 border-t-gray-200")}>
                                            <td className="p-3 text-sm text-gray-500 font-medium bg-gray-50">
                                                {time}
                                            </td>
                                            {days.map((day) => {
                                                const schedule = scheduleData[day]?.[time]
                                                return (
                                                    <td key={day} className="p-2">
                                                        {schedule ? (
                                                            <div className={cn(
                                                                "p-2 rounded-lg border text-center cursor-pointer hover:opacity-80 transition-opacity",
                                                                schedule.color
                                                            )}>
                                                                <p className="font-medium text-sm">{schedule.subject}</p>
                                                                <p className="text-xs opacity-75">{schedule.teacher}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="p-2 rounded-lg border-2 border-dashed border-gray-200 text-center text-gray-400 text-sm cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all">
                                                                +
                                                            </div>
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
