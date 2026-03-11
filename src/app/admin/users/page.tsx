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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, MoreHorizontal, Pencil, Trash2, UserPlus, Loader2 } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUI } from '@/hooks/use-ui'
import { useToast } from '@/hooks/use-toast'
import { useProfiles } from '@/hooks/use-profiles'

export default function UsersPage() {
    const { profiles, loading, deleteProfile, createUser } = useProfiles()
    const { confirm } = useUI()
    const { toast } = useToast()
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'guru', password: '' })

    const filteredUsers = profiles.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQuery.toLowerCase())
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        return matchesSearch && matchesRole
    })

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">Admin</Badge>
            case 'guru':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Guru</Badge>
            case 'bendahara':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Bendahara</Badge>
            default:
                return <Badge variant="secondary">{role}</Badge>
        }
    }

    const getStatusBadge = (status: string) => {
        return status === 'active' || status === undefined
            ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Aktif</Badge>
            : <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Nonaktif</Badge>
    }

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.email || !newUser.password) {
            toast({
                variant: 'destructive',
                title: 'Data tidak lengkap',
                description: 'Mohon isi semua field yang diperlukan'
            })
            return
        }

        setIsSubmitting(true)
        const success = await createUser(newUser)
        setIsSubmitting(false)

        if (success) {
            toast({
                title: 'Berhasil',
                description: `User ${newUser.name} telah berhasil dibuat`
            })
            setIsAddDialogOpen(false)
            setNewUser({ name: '', email: '', role: 'guru', password: '' })
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500">Kelola akun guru dan bendahara madrasah</p>
                    </div>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-violet-500 hover:bg-violet-600">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Tambah User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Tambah User Baru</DialogTitle>
                                <DialogDescription>
                                    Buat akun baru untuk guru atau bendahara
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan nama lengkap"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@madrasah.id"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="guru">Guru</SelectItem>
                                            <SelectItem value="bendahara">Bendahara</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Masukkan password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
                                <Button onClick={handleAddUser} className="bg-violet-500 hover:bg-violet-600" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : 'Simpan'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama atau email..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Filter Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Role</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="guru">Guru</SelectItem>
                                    <SelectItem value="bendahara">Bendahara</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-50">
                                    <TableHead className="font-semibold">User</TableHead>
                                    <TableHead className="font-semibold">Email</TableHead>
                                    <TableHead className="font-semibold">Role</TableHead>
                                    <TableHead className="font-semibold">Status</TableHead>
                                    <TableHead className="font-semibold">Tanggal Dibuat</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                                                <p className="text-sm text-gray-500">Memuat data user...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Tidak ada user ditemukan
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={undefined} />
                                                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-violet-600 text-white text-sm">
                                                            {user.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{user.email}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>{getStatusBadge(user.status || 'active')}</TableCell>
                                            <TableCell className="text-gray-600">
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                }) : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Pencil className="w-4 h-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={async () => {
                                                                const confirmed = await confirm({
                                                                    title: 'Hapus User?',
                                                                    description: `Apakah Anda yakin ingin menghapus akun ${user.name}? Akses user ini akan segera dicabut.`,
                                                                    confirmLabel: 'Ya, Hapus',
                                                                    variant: 'destructive'
                                                                })
                                                                if (confirmed) {
                                                                    const success = await deleteProfile(user.id)
                                                                    if (success) {
                                                                        toast({ title: "Berhasil", description: "User telah dihapus" })
                                                                    }
                                                                }
                                                            }}
                                                        >
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
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
