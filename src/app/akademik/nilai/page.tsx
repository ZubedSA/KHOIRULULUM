'use client'

import { useState } from 'react'
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
import { FileText, Plus, Search, TrendingUp, Users, Award, Printer, Trash2 } from 'lucide-react'
import { RaportTemplate } from '@/components/features/academic/raport-template'
import { useUI } from '@/hooks/use-ui'
import { useToast } from '@/hooks/use-toast'

// Mock data
const gradesData = [
    { id: '1', student: 'Ahmad Fauzi', nis: '20251001', class: '7A', subject: 'Al-Quran', tugas: 85, uts: 88, uas: 90, avg: 87.7 },
    { id: '2', student: 'Fatimah Zahra', nis: '20251002', class: '7A', subject: 'Al-Quran', tugas: 92, uts: 95, uas: 94, avg: 93.7 },
    { id: '3', student: 'Muhammad Ali', nis: '20251003', class: '7A', subject: 'Al-Quran', tugas: 78, uts: 80, uas: 82, avg: 80.0 },
    { id: '4', student: 'Aisyah Putri', nis: '20251004', class: '7A', subject: 'Al-Quran', tugas: 88, uts: 85, uas: 87, avg: 86.7 },
    { id: '5', student: 'Umar Hadi', nis: '20251005', class: '7A', subject: 'Al-Quran', tugas: 70, uts: 72, uas: 75, avg: 72.3 },
    { id: '6', student: 'Khadijah Sari', nis: '20251006', class: '7A', subject: 'Al-Quran', tugas: 95, uts: 92, uas: 96, avg: 94.3 },
    { id: '7', student: 'Ibrahim Hakim', nis: '20251007', class: '7A', subject: 'Al-Quran', tugas: 82, uts: 78, uas: 80, avg: 80.0 },
    { id: '8', student: 'Maryam Dewi', nis: '20251008', class: '7A', subject: 'Al-Quran', tugas: 90, uts: 88, uas: 92, avg: 90.0 },
]

const classes = ['Kelas 7A', 'Kelas 7B', 'Kelas 8A', 'Kelas 8B', 'Kelas 9A', 'Kelas 9B']
const subjects = ['Al-Quran', 'Matematika', 'B. Indonesia', 'B. Arab', 'Fiqih', 'Akidah', 'SKI', 'IPA', 'IPS']
const gradeTypes = ['Tugas', 'UTS', 'UAS', 'Praktik']
const semesters = ['Semester 1', 'Semester 2']

export default function NilaiPage() {
    const { confirm } = useUI()
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState('Kelas 7A')
    const [subjectFilter, setSubjectFilter] = useState('Al-Quran')
    const [semesterFilter, setSemesterFilter] = useState('Semester 1')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isRaportOpen, setIsRaportOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [formData, setFormData] = useState({
        student: '',
        gradeType: '',
        score: ''
    })

    const filteredGrades = gradesData.filter(grade => {
        const matchesSearch = grade.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
            grade.nis.includes(searchQuery)
        return matchesSearch
    })

    const avgScore = gradesData.reduce((sum, g) => sum + g.avg, 0) / gradesData.length
    const highestScore = Math.max(...gradesData.map(g => g.avg))
    const lowestScore = Math.min(...gradesData.map(g => g.avg))

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600'
        if (score >= 70) return 'text-blue-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getGradeBadge = (score: number) => {
        if (score >= 90) return { label: 'A', color: 'bg-green-100 text-green-700' }
        if (score >= 80) return { label: 'B', color: 'bg-blue-100 text-blue-700' }
        if (score >= 70) return { label: 'C', color: 'bg-yellow-100 text-yellow-700' }
        if (score >= 60) return { label: 'D', color: 'bg-orange-100 text-orange-700' }
        return { label: 'E', color: 'bg-red-100 text-red-700' }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        setIsDialogOpen(false)
        setFormData({ student: '', gradeType: '', score: '' })
    }

    const handlePrint = () => {
        window.print()
    }

    const handleDelete = async (studentName: string) => {
        const confirmed = await confirm({
            title: 'Hapus Data Nilai?',
            description: `Apakah Anda yakin ingin menghapus data nilai untuk ${studentName}? Tindakan ini tidak dapat dibatalkan.`,
            confirmLabel: 'Ya, Hapus',
            variant: 'destructive'
        })

        if (confirmed) {
            toast({
                title: 'Data Dihapus',
                description: `Data nilai ${studentName} berhasil dihapus dari sistem.`,
                variant: 'destructive',
            })
        }
    }

    const handleShowRaport = (student: any) => {
        // Mock full grades for raport
        const fullGrades = subjects.map(s => ({
            subject: s,
            score: Math.floor(Math.random() * (100 - 75 + 1)) + 75 // Random between 75-100
        }))

        setSelectedStudent({
            ...student,
            fullGrades,
            attendance: {
                hadir: 24,
                sakit: 1,
                izin: 0,
                alpha: 0
            }
        })
        setIsRaportOpen(true)
    }

    return (
        <DashboardLayout>
            <style jsx global>{`
                @media print {
                    body {
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .print\\:block {
                        display: block !important;
                    }
                }
            `}</style>
            <div className="space-y-6 print:hidden">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Nilai</h1>
                        <p className="text-gray-500">Input dan kelola nilai siswa</p>
                    </div>
                    <div className="flex gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-blue-500 hover:bg-blue-600">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Input Nilai
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Input Nilai Baru</DialogTitle>
                                    <DialogDescription>
                                        Masukkan nilai untuk {subjectFilter} - {classFilter}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Siswa</Label>
                                            <Select
                                                value={formData.student}
                                                onValueChange={(value) => setFormData({ ...formData, student: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih siswa" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gradesData.map((g) => (
                                                        <SelectItem key={g.id} value={g.student}>{g.student}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Jenis Nilai</Label>
                                            <Select
                                                value={formData.gradeType}
                                                onValueChange={(value) => setFormData({ ...formData, gradeType: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih jenis nilai" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {gradeTypes.map((type) => (
                                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nilai (0-100)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="Masukkan nilai"
                                                value={formData.score}
                                                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                                            />
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                Jumlah Siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">{gradesData.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                </div>
                                Rata-rata Kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-emerald-600">{avgScore.toFixed(1)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Award className="w-4 h-4 text-green-600" />
                                </div>
                                Nilai Tertinggi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">{highestScore.toFixed(1)}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-orange-600" />
                                </div>
                                Nilai Terendah
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-orange-600">{lowestScore.toFixed(1)}</p>
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
                                <SelectTrigger className="w-full md:w-36">
                                    <SelectValue placeholder="Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                <SelectTrigger className="w-full md:w-36">
                                    <SelectValue placeholder="Mapel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subj) => (
                                        <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                                <SelectTrigger className="w-full md:w-36">
                                    <SelectValue placeholder="Semester" />
                                </SelectTrigger>
                                <SelectContent>
                                    {semesters.map((sem) => (
                                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Daftar Nilai - {subjectFilter}</CardTitle>
                        <CardDescription>
                            {classFilter} • {semesterFilter} • Tahun Ajaran 2025/2026
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIS</TableHead>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead className="text-center">Tugas</TableHead>
                                    <TableHead className="text-center">UTS</TableHead>
                                    <TableHead className="text-center">UAS</TableHead>
                                    <TableHead className="text-center">Rata-rata</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredGrades.map((grade) => {
                                    const badge = getGradeBadge(grade.avg)
                                    return (
                                        <TableRow key={grade.id}>
                                            <TableCell className="font-mono text-sm">{grade.nis}</TableCell>
                                            <TableCell className="font-medium">{grade.student}</TableCell>
                                            <TableCell className={`text-center font-medium ${getScoreColor(grade.tugas)}`}>
                                                {grade.tugas}
                                            </TableCell>
                                            <TableCell className={`text-center font-medium ${getScoreColor(grade.uts)}`}>
                                                {grade.uts}
                                            </TableCell>
                                            <TableCell className={`text-center font-medium ${getScoreColor(grade.uas)}`}>
                                                {grade.uas}
                                            </TableCell>
                                            <TableCell className={`text-center font-bold ${getScoreColor(grade.avg)}`}>
                                                {grade.avg.toFixed(1)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${badge.color}`}>
                                                    {badge.label}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-2 border-primary/20 hover:bg-primary/5 text-primary"
                                                    onClick={() => handleShowRaport(grade)}
                                                >
                                                    <Printer className="w-3.5 h-3.5" />
                                                    <span className="text-xs">Raport</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 border-red-200 hover:bg-red-50 text-red-500"
                                                    onClick={() => handleDelete(grade.student)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Raport Preview Dialog */}
            <Dialog open={isRaportOpen} onOpenChange={setIsRaportOpen}>
                <DialogContent className="max-w-5xl h-[90vh] overflow-y-auto p-0 gap-0">
                    <DialogHeader className="p-6 border-b shrink-0 flex flex-row items-center justify-between space-y-0 sticky top-0 bg-white z-10">
                        <div>
                            <DialogTitle>Preview Raport Digital</DialogTitle>
                            <DialogDescription>
                                {selectedStudent?.student} • {selectedStudent?.nis}
                            </DialogDescription>
                        </div>
                        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
                            <Printer className="w-4 h-4 mr-2" />
                            Cetak / Simpan PDF
                        </Button>
                    </DialogHeader>
                    <div className="bg-gray-100 p-8 flex justify-center">
                        <div className="shadow-2xl bg-white border border-gray-200">
                            {selectedStudent && (
                                <RaportTemplate
                                    student={{ name: selectedStudent.student, nis: selectedStudent.nis }}
                                    classData={{ name: classFilter, homeroom_teacher_name: 'Ahmad Syaifuddin, S.Pd.' }}
                                    semester={semesterFilter}
                                    academicYear="2025/2026"
                                    grades={selectedStudent.fullGrades}
                                    attendance={selectedStudent.attendance}
                                    date="11 Maret 2026"
                                />
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Printing Area (Only visible during print) */}
            <div className="hidden print:block fixed inset-0 z-[9999] bg-white">
                {selectedStudent && (
                    <RaportTemplate
                        student={{ name: selectedStudent.student, nis: selectedStudent.nis }}
                        classData={{ name: classFilter, homeroom_teacher_name: 'Ahmad Syaifuddin, S.Pd.' }}
                        semester={semesterFilter}
                        academicYear="2025/2026"
                        grades={selectedStudent.fullGrades}
                        attendance={selectedStudent.attendance}
                        date="11 Maret 2026"
                    />
                )}
            </div>
        </DashboardLayout>
    )
}
