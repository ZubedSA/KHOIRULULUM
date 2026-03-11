'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Plus, TrendingUp, TrendingDown, MoreHorizontal, Pencil, Trash2, Tag, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCategories, type CreateCategoryInput, type UpdateCategoryInput } from '@/hooks/use-categories'
import type { Category } from '@/types/database'
import { useToast } from '@/hooks/use-toast'
import { useUI } from '@/hooks/use-ui'

export default function KategoriPage() {
    const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
    const { toast } = useToast()
    const { confirm } = useUI()

    // Create State
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newCategory, setNewCategory] = useState<CreateCategoryInput>({
        name: '',
        type: 'income',
        description: '',
        is_active: true
    })

    // Edit State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [editForm, setEditForm] = useState<UpdateCategoryInput>({})

    // Delete State (unused explicitly)

    const incomeCategories = categories.filter(c => c.type === 'income')
    const expenseCategories = categories.filter(c => c.type === 'expense')

    const handleCreate = async () => {
        if (!newCategory.name) {
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Nama kategori harus diisi"
            })
            return
        }

        setIsSubmitting(true)
        const success = await addCategory(newCategory)
        setIsSubmitting(false)

        if (success) {
            toast({
                title: "Berhasil",
                description: "Kategori berhasil ditambahkan"
            })
            setIsAddDialogOpen(false)
            setNewCategory({ name: '', type: 'income', description: '', is_active: true })
        } else {
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Gagal menambah kategori"
            })
        }
    }

    const handleUpdate = async () => {
        if (!editingCategory) return

        setIsSubmitting(true)
        const success = await updateCategory(editingCategory.id, editForm)
        setIsSubmitting(false)

        if (success) {
            toast({
                title: "Berhasil",
                description: "Kategori berhasil diperbarui",
            })
            setEditingCategory(null)
        } else {
            toast({
                variant: "destructive",
                title: "Gagal",
                description: "Gagal memperbarui kategori"
            })
        }
    }

    const handleDelete = async (id: string) => {
        const confirmed = await confirm({
            title: 'Hapus Kategori?',
            description: 'Apakah Anda yakin ingin menghapus kategori ini? Kategori yang sudah memiliki transaksi tidak dapat dihapus.',
            confirmLabel: 'Ya, Hapus',
            variant: 'destructive'
        })

        if (!confirmed) return

        try {
            const success = await deleteCategory(id)
            if (success) {
                toast({
                    title: "Berhasil",
                    description: "Kategori berhasil dihapus"
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Gagal",
                    description: "Gagal menghapus kategori"
                })
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Gagal",
                description: err instanceof Error ? err.message : 'Gagal menghapus kategori'
            })
        }
    }

    const openEditDialog = (category: Category) => {
        setEditingCategory(category)
        setEditForm({
            name: category.name,
            description: category.description || '',
            is_active: category.is_active
        })
    }

    const CategoryCard = ({ category }: { category: Category }) => (
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow group">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                            {category.type === 'income' ? (
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                                <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-500">{category.description || '-'}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(category.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <Badge className={category.is_active ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-100'}>
                        {category.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                    <Badge variant="outline" className={category.type === 'income' ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'}>
                        {category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kategori Keuangan</h1>
                        <p className="text-gray-500">Kelola kategori pemasukan dan pengeluaran</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-500 hover:bg-emerald-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Kategori
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah Kategori Baru</DialogTitle>
                                <DialogDescription>
                                    Buat kategori baru untuk pemasukan atau pengeluaran
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Kategori</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: SPP, Gaji Guru"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipe</Label>
                                    <Select
                                        value={newCategory.type}
                                        onValueChange={(value: 'income' | 'expense') => setNewCategory({ ...newCategory, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tipe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">
                                                <div className="flex items-center gap-2">
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                    Pemasukan
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="expense">
                                                <div className="flex items-center gap-2">
                                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                                    Pengeluaran
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Deskripsi</Label>
                                    <Input
                                        id="description"
                                        placeholder="Deskripsi singkat kategori"
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="status" className="font-normal text-sm text-gray-600">Status</Label>
                                    <Select
                                        value={newCategory.is_active ? 'active' : 'inactive'}
                                        onValueChange={(v) => setNewCategory({ ...newCategory, is_active: v === 'active' })}
                                    >
                                        <SelectTrigger className="w-32 h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Nonaktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
                                <Button
                                    className="bg-emerald-500 hover:bg-emerald-600"
                                    onClick={handleCreate}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Edit Dialog */}
                <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Edit Kategori</DialogTitle>
                            <DialogDescription>
                                Perbarui informasi kategori
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nama Kategori</Label>
                                <Input
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Deskripsi</Label>
                                <Input
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={editForm.is_active ? 'active' : 'inactive'}
                                    onValueChange={(v) => setEditForm({ ...editForm, is_active: v === 'active' })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Nonaktif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingCategory(null)} disabled={isSubmitting}>Batal</Button>
                            <Button
                                className="bg-emerald-500 hover:bg-emerald-600"
                                onClick={handleUpdate}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <Tag className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                                    <p className="text-sm text-gray-500">Total Kategori</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{incomeCategories.length}</p>
                                    <p className="text-sm text-gray-500">Kategori Pemasukan</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-red-600">{expenseCategories.length}</p>
                                    <p className="text-sm text-gray-500">Kategori Pengeluaran</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    <Tabs defaultValue="income" className="space-y-4">
                        <TabsList className="bg-gray-100 p-1">
                            <TabsTrigger value="income" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                                Pemasukan ({incomeCategories.length})
                            </TabsTrigger>
                            <TabsTrigger value="expense" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                                <TrendingDown className="w-4 h-4 mr-2 text-red-600" />
                                Pengeluaran ({expenseCategories.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="income">
                            {incomeCategories.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Belum ada kategori pemasukan</p>
                                    <Button variant="link" onClick={() => setIsAddDialogOpen(true)}>Tambah sekarang</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {incomeCategories.map((category) => (
                                        <CategoryCard key={category.id} category={category} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="expense">
                            {expenseCategories.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                                    <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Belum ada kategori pengeluaran</p>
                                    <Button variant="link" onClick={() => setIsAddDialogOpen(true)}>Tambah sekarang</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {expenseCategories.map((category) => (
                                        <CategoryCard key={category.id} category={category} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </DashboardLayout>
    )
}
