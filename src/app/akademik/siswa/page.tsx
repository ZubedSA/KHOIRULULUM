'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Label } from '@/components/ui/label'
import { Search, MoreHorizontal, Pencil, Trash2, UserPlus, Users, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStudents, type CreateStudentInput, type StudentWithClass } from '@/hooks/use-students'
import { useClasses } from '@/hooks/use-classes'
import { useToast } from '@/hooks/use-toast'
import { useUI } from '@/hooks/use-ui'

export default function SiswaPage() {
    const { classes } = useClasses()
    // Pass 'all' or specific class id. But the hook expects class_id to filter.
    // Let's control filter state. 
    // Optimization: fetch all for now to allow client side search across classes easily?
    // Or fetch by class. Let's start with fetching all (pass undefined/null to hook) and filter client side for search.
    // Actually, hook filters by DB query if id provided.
    // Let's implement client-side filtering for search, and server-side for dropdown to be efficient?
    // For small schools, fetching all is better for UX (instant search).
    const { students, loading, addStudent, updateStudent, deleteStudent } = useStudents() // Fetch all initially
    const { toast } = useToast()
    const { confirm } = useUI()

    const [searchQuery, setSearchQuery] = useState('')
    const [classFilter, setClassFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    const [formData, setFormData] = useState<CreateStudentInput>({
        nis: '',
        name: '',
        gender: 'L',
        class_id: '',
        parent_name: '',
        parent_phone: '',
        phone: '',
        address: ''
    })

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.nis.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = classFilter === 'all' || student.class_id === classFilter
        return matchesSearch && matchesClass
    })

    // Stats
    const totalStudents = students.length
    const maleCount = students.filter(s => s.gender === 'L').length
    const femaleCount = students.filter(s => s.gender === 'P').length

    const handleCreate = async () => {
        if (!formData.nis || !formData.name || !formData.class_id) {
            toast({ variant: "destructive", title: "Gagal", description: "NIS, Nama, dan Kelas wajib diisi" })
            return
        }

        setIsSubmitting(true)
        const success = await addStudent(formData)
        setIsSubmitting(false)

        if (success) {
            toast({ title: "Berhasil", description: "Siswa berhasil ditambahkan" })
            setIsAddDialogOpen(false)
            setFormData({
                nis: '', name: '', gender: 'L', class_id: '', parent_name: '', parent_phone: '', phone: '', address: ''
            })
        } else {
            toast({ variant: "destructive", title: "Gagal", description: "Gagal menambah siswa (Mungkin NIS sudah ada)" })
        }
    }

    const handleEditClick = (student: StudentWithClass) => {
        setEditingId(student.id)
        setFormData({
            nis: student.nis,
            name: student.name,
            gender: student.gender as 'L' | 'P',
            class_id: student.class_id || '',
            parent_name: student.parent_name || '',
            parent_phone: student.parent_phone || '',
            phone: student.phone || '',
            address: student.address || ''
        })
        setIsEditDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingId) return
        setIsSubmitting(true)
        const success = await updateStudent(editingId, formData)
        setIsSubmitting(false)

        if (success) {
            toast({ title: "Berhasil", description: "Data siswa berhasil diperbarui" })
            setIsEditDialogOpen(false)
            setEditingId(null)
        } else {
            toast({ variant: "destructive", title: "Gagal", description: "Gagal memperbarui data" })
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Hapus Siswa?',
            description: 'Apakah Anda yakin ingin menghapus data siswa ini? Semua data terkait (nilai, dll) akan ikut terhapus.',
            confirmLabel: 'Ya, Hapus',
            variant: 'destructive'
        })

        if (confirmed) {
            const success = await deleteStudent(id)
            if (success) {
                toast({ title: "Berhasil", description: "Siswa berhasil dihapus" })
            } else {
                toast({ variant: "destructive", title: "Gagal", description: "Gagal menghapus siswa" })
            }
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
                        <p className="text-gray-500">Kelola data santri madrasah</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-500 hover:bg-blue-600">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Tambah Siswa
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Tambah Siswa Baru</DialogTitle>
                                <DialogDescription>
                                    Masukkan data siswa baru
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nis">NIS <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="nis"
                                        placeholder="Contoh: 2024001"
                                        value={formData.nis}
                                        onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="class">Kelas <span className="text-red-500">*</span></Label>
                                    <Select value={formData.class_id} onValueChange={(value) => setFormData({ ...formData, class_id: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="name">Nama Lengkap <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="name"
                                        placeholder="Nama lengkap siswa"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Jenis Kelamin</Label>
                                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value as 'L' | 'P' })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. HP Ortu</Label>
                                    <Input
                                        id="phone"
                                        placeholder="0812..."
                                        value={formData.parent_phone}
                                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="parentName">Nama Orang Tua</Label>
                                    <Input
                                        id="parentName"
                                        placeholder="Nama orang tua/wali"
                                        value={formData.parent_name}
                                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="address">Alamat</Label>
                                    <Input
                                        id="address"
                                        placeholder="Alamat lengkap"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
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
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Edit Siswa</DialogTitle>
                                <DialogDescription>Ubah data siswa</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                                <div className="space-y-2">
                                    <Label>NIS</Label>
                                    <Input
                                        value={formData.nis}
                                        onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kelas</Label>
                                    <Select value={formData.class_id} onValueChange={(value) => setFormData({ ...formData, class_id: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map((cls) => (
                                                <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Nama Lengkap</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Jenis Kelamin</Label>
                                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value as 'L' | 'P' })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="L">Laki-laki</SelectItem>
                                            <SelectItem value="P">Perempuan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>No. HP Ortu</Label>
                                    <Input
                                        value={formData.parent_phone}
                                        onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Nama Orang Tua</Label>
                                    <Input
                                        value={formData.parent_name}
                                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label>Alamat</Label>
                                    <Input
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                                    <p className="text-sm text-gray-500">Total Siswa</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">L</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{maleCount}</p>
                                    <p className="text-sm text-gray-500">Laki-laki</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                    <span className="text-pink-600 font-bold">P</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{femaleCount}</p>
                                    <p className="text-sm text-gray-500">Perempuan</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <span className="text-emerald-600 font-bold">{classes.length}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                                    <p className="text-sm text-gray-500">Total Kelas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama atau NIS..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={classFilter} onValueChange={setClassFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Filter Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kelas</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Students Table */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                                        <TableHead className="font-semibold">NIS</TableHead>
                                        <TableHead className="font-semibold">Nama Siswa</TableHead>
                                        <TableHead className="font-semibold">L/P</TableHead>
                                        <TableHead className="font-semibold">Kelas</TableHead>
                                        <TableHead className="font-semibold">Orang Tua</TableHead>
                                        <TableHead className="font-semibold">No. HP HP</TableHead>
                                        <TableHead className="w-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                Tidak ada siswa ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredStudents.map((student) => (
                                            <TableRow key={student.id} className="hover:bg-gray-50">
                                                <TableCell className="font-mono text-gray-600">{student.nis}</TableCell>
                                                <TableCell className="font-medium text-gray-900">{student.name}</TableCell>
                                                <TableCell>
                                                    <Badge className={student.gender === 'L' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-pink-100 text-pink-700 hover:bg-pink-100'}>
                                                        {student.gender}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{student.class?.name || '-'}</Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-600">{student.parent_name || '-'}</TableCell>
                                                <TableCell className="text-gray-600">{student.parent_phone || '-'}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditClick(student)}>
                                                                <Pencil className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student.id)}>
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
