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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BookOpen, Plus, Search, Pencil, Trash2, Users, MoreHorizontal, Loader2 } from 'lucide-react'
import { useClasses, type CreateClassInput, type ClassWithDetails } from '@/hooks/use-classes'
import { useReferenceData } from '@/hooks/use-reference-data'
import { useToast } from '@/hooks/use-toast'
import { useUI } from '@/hooks/use-ui'

export default function KelasPage() {
    const { classes, loading, addClass, updateClass, deleteClass } = useClasses()
    const { teachers, academicYears, loading: loadingRef } = useReferenceData()
    const { toast } = useToast()
    const { confirm } = useUI()

    // State
    const [searchQuery, setSearchQuery] = useState('')
    const [gradeFilter, setGradeFilter] = useState('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Form State
    const [formData, setFormData] = useState<CreateClassInput>({
        name: '',
        grade_level: '',
        academic_year_id: '',
        homeroom_teacher_id: 'none'
    })
    const [editingId, setEditingId] = useState<string | null>(null)

    // Filter Logic
    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (cls.homeroom_teacher?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        const matchesGrade = gradeFilter === 'all' || cls.grade_level.toString() === gradeFilter
        return matchesSearch && matchesGrade
    })

    const totalStudents = classes.reduce((sum, cls) => sum + (cls.student_count || 0), 0)

    // Handlers
    const handleCreate = async () => {
        if (!formData.name || !formData.grade_level) {
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Nama kelas dan tingkat harus diisi"
            })
            return
        }

        setIsSubmitting(true)
        const payload = {
            ...formData,
            homeroom_teacher_id: formData.homeroom_teacher_id === 'none' ? undefined : formData.homeroom_teacher_id
        }

        const success = await addClass(payload)
        setIsSubmitting(false)

        if (success) {
            toast({ title: "Berhasil", description: "Kelas berhasil ditambahkan" })
            setIsAddDialogOpen(false)
            setFormData({ name: '', grade_level: '', academic_year_id: '', homeroom_teacher_id: 'none' })
        } else {
            toast({ variant: "destructive", title: "Gagal", description: "Gagal menambah kelas" })
        }
    }

    const handleEditClick = (cls: ClassWithDetails) => {
        setEditingId(cls.id)
        setFormData({
            name: cls.name,
            grade_level: cls.grade_level.toString(),
            academic_year_id: cls.academic_year_id || '',
            homeroom_teacher_id: cls.homeroom_teacher_id || 'none'
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingId) return

        setIsSubmitting(true)
        const payload = {
            ...formData,
            homeroom_teacher_id: formData.homeroom_teacher_id === 'none' ? undefined : formData.homeroom_teacher_id
        }

        // Remove undefined fields if string is empty (optional cleanup)
        if (!payload.academic_year_id) delete payload.academic_year_id

        const success = await updateClass(editingId, payload)
        setIsSubmitting(false)

        if (success) {
            toast({ title: "Berhasil", description: "Kelas berhasil diperbarui" })
            setIsEditDialogOpen(false)
            setEditingId(null)
        } else {
            toast({ variant: "destructive", title: "Gagal", description: "Gagal memperbarui kelas" })
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Hapus Kelas?',
            description: 'Apakah Anda yakin ingin menghapus kelas ini? Data siswa yang terhubung mungkin akan terdampak.',
            confirmLabel: 'Ya, Hapus',
            variant: 'destructive'
        })

        if (confirmed) {
            const success = await deleteClass(id)
            if (success) {
                toast({ title: "Berhasil", description: "Kelas berhasil dihapus" })
            } else {
                toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus kelas" })
            }
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Kelas</h1>
                        <p className="text-gray-500">Kelola data kelas dan wali kelas</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Kelas
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tambah Kelas Baru</DialogTitle>
                                <DialogDescription>
                                    Masukkan data kelas yang ingin ditambahkan
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nama Kelas</Label>
                                    <Input
                                        placeholder="Contoh: 7A"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tingkat</Label>
                                    <Select
                                        value={formData.grade_level}
                                        onValueChange={(value) => setFormData({ ...formData, grade_level: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tingkat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7">Kelas 7</SelectItem>
                                            <SelectItem value="8">Kelas 8</SelectItem>
                                            <SelectItem value="9">Kelas 9</SelectItem>
                                            <SelectItem value="10">Kelas 10</SelectItem>
                                            <SelectItem value="11">Kelas 11</SelectItem>
                                            <SelectItem value="12">Kelas 12</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tahun Ajaran</Label>
                                    <Select
                                        value={formData.academic_year_id}
                                        onValueChange={(value) => setFormData({ ...formData, academic_year_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tahun ajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYears.map((year) => (
                                                <SelectItem key={year.id} value={year.id}>
                                                    {year.name} {year.is_active ? '(Aktif)' : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Wali Kelas</Label>
                                    <Select
                                        value={formData.homeroom_teacher_id}
                                        onValueChange={(value) => setFormData({ ...formData, homeroom_teacher_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih wali kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">- Belum ditentukan -</SelectItem>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
                                <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleCreate} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Edit Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Kelas</DialogTitle>
                                <DialogDescription>Ubah data kelas</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Nama Kelas</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tingkat</Label>
                                    <Select
                                        value={formData.grade_level}
                                        onValueChange={(value) => setFormData({ ...formData, grade_level: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tingkat" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7">Kelas 7</SelectItem>
                                            <SelectItem value="8">Kelas 8</SelectItem>
                                            <SelectItem value="9">Kelas 9</SelectItem>
                                            <SelectItem value="10">Kelas 10</SelectItem>
                                            <SelectItem value="11">Kelas 11</SelectItem>
                                            <SelectItem value="12">Kelas 12</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Tahun Ajaran</Label>
                                    <Select
                                        value={formData.academic_year_id}
                                        onValueChange={(value) => setFormData({ ...formData, academic_year_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tahun ajaran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYears.map((year) => (
                                                <SelectItem key={year.id} value={year.id}>
                                                    {year.name} {year.is_active ? '(Aktif)' : ''}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Wali Kelas</Label>
                                    <Select
                                        value={formData.homeroom_teacher_id}
                                        onValueChange={(value) => setFormData({ ...formData, homeroom_teacher_id: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih wali kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">- Belum ditentukan -</SelectItem>
                                            {teachers.map((teacher) => (
                                                <SelectItem key={teacher.id} value={teacher.id}>
                                                    {teacher.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
                                <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleUpdate} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                Total Kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">{classes.length}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-emerald-600" />
                                </div>
                                Total Siswa
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-violet-600" />
                                </div>
                                Rata-rata per Kelas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-gray-900">
                                {classes.length > 0 ? Math.round(totalStudents / classes.length) : 0}
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
                                    placeholder="Cari kelas atau wali kelas..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={gradeFilter} onValueChange={setGradeFilter}>
                                <SelectTrigger className="w-full md:w-40">
                                    <SelectValue placeholder="Tingkat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Tingkat</SelectItem>
                                    <SelectItem value="7">Kelas 7</SelectItem>
                                    <SelectItem value="8">Kelas 8</SelectItem>
                                    <SelectItem value="9">Kelas 9</SelectItem>
                                    <SelectItem value="10">Kelas 10</SelectItem>
                                    <SelectItem value="11">Kelas 11</SelectItem>
                                    <SelectItem value="12">Kelas 12</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Daftar Kelas</CardTitle>
                        <CardDescription>
                            {filteredClasses.length} kelas ditemukan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading || loadingRef ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Kelas</TableHead>
                                        <TableHead>Tingkat</TableHead>
                                        <TableHead>Wali Kelas</TableHead>
                                        <TableHead className="text-center">Jumlah Siswa</TableHead>
                                        <TableHead>Tahun Ajaran</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClasses.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                Belum ada data kelas
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredClasses.map((cls) => (
                                            <TableRow key={cls.id}>
                                                <TableCell className="font-medium">{cls.name}</TableCell>
                                                <TableCell>
                                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                                                        Kelas {cls.grade_level}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{cls.homeroom_teacher?.name || '-'}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className="font-medium">{cls.student_count}</span> siswa
                                                </TableCell>
                                                <TableCell>{cls.academic_year?.name || '-'}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditClick(cls)}>
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(cls.id)}>
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
