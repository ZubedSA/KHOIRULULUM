'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, LogOut, User, Settings, Shield, GraduationCap, Banknote, RefreshCcw, Loader2 } from 'lucide-react'
import type { Profile, UserRole } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

interface HeaderProps {
    user: Profile | null
    onSignOut: () => void
    isCollapsed: boolean
}

export function Header({ user, onSignOut, isCollapsed }: HeaderProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const { toast } = useToast()
    const { refreshAuth, loading: authLoading } = useAuth()

    const getPageTitle = (): string => {
        if (pathname.startsWith('/admin')) {
            if (pathname === '/admin') return 'Dashboard Admin'
            if (pathname.includes('/users')) return 'User Management'
            if (pathname.includes('/settings')) return 'Pengaturan'
            if (pathname.includes('/audit')) return 'Audit Log'
        }
        if (pathname.startsWith('/akademik')) {
            if (pathname === '/akademik') return 'Dashboard Akademik'
            if (pathname.includes('/kelas')) return 'Data Kelas'
            if (pathname.includes('/siswa')) return 'Data Siswa'
            if (pathname.includes('/jadwal')) return 'Jadwal Pelajaran'
            if (pathname.includes('/absensi')) return 'Absensi'
            if (pathname.includes('/nilai')) return 'Nilai'
        }
        if (pathname.startsWith('/keuangan')) {
            if (pathname === '/keuangan') return 'Dashboard Keuangan'
            if (pathname.includes('/tagihan')) return 'Tagihan Santri'
            if (pathname.includes('/pemasukan')) return 'Pemasukan'
            if (pathname.includes('/pengeluaran')) return 'Pengeluaran'
            if (pathname.includes('/kategori')) return 'Kategori'
            if (pathname.includes('/laporan')) return 'Laporan'
            if (pathname.includes('/tunggakan')) return 'Tunggakan'
        }
        return 'Dashboard'
    }

    const getRoleBadge = (): { label: string; className: string } => {
        switch (user?.role) {
            case 'admin':
                return { label: 'Admin', className: 'bg-violet-100 text-violet-700' }
            case 'guru':
                return { label: 'Guru', className: 'bg-blue-100 text-blue-700' }
            case 'bendahara':
                return { label: 'Bendahara', className: 'bg-emerald-100 text-emerald-700' }
            default:
                return { label: 'User', className: 'bg-gray-100 text-gray-700' }
        }
    }

    const handleRoleSwitch = async (newRole: UserRole) => {
        if (!user) return

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    role: newRole,
                    name: user.name,
                    roles: user.roles || [newRole]
                })

            if (error) throw error

            // Force refresh the auth state so Header/Sidebar update immediately
            await refreshAuth()

            toast({
                title: 'Berhasil',
                description: `Berpindah ke role ${newRole}`,
            })

            // Redirect based on role
            switch (newRole) {
                case 'admin':
                    router.push('/admin')
                    break
                case 'guru':
                    router.push('/akademik')
                    break
                case 'bendahara':
                    router.push('/keuangan')
                    break
            }

            // Refresh the server state
            router.refresh()
        } catch (error) {
            console.error('Error switching role:', error)
            toast({
                title: 'Gagal',
                description: 'Gagal berpindah role',
                variant: 'destructive',
            })
        }
    }

    const canSwitch = pathname.startsWith('/admin') || (user && (
        user.role === 'admin' ||
        user.roles?.includes('admin') ||
        (user.roles && user.roles.length > 1)
    ))

    const roleBadge = getRoleBadge()

    return (
        <header
            className={cn(
                "fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300 left-0 shadow-sm sm:shadow-none",
                isCollapsed ? "lg:left-20" : "lg:left-64"
            )}
        >
            <div className="h-full px-6 flex items-center justify-between">
                {/* Page Title */}
                <div>
                    <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </Button>

                    <DropdownMenuSeparator className="h-8 w-px bg-gray-100 hidden sm:block mx-1" />

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-3 px-2 hover:bg-gray-100">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.avatar_url || undefined} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || '?'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-900">{user?.name || 'Loading...'}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className={cn("text-xs px-1.5 py-0.5 rounded-full uppercase", roleBadge.className)}>
                                            {user ? roleBadge.label : 'Auth Error'}
                                        </span>
                                        {!user && (
                                            <span
                                                role="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    refreshAuth();
                                                }}
                                                className={cn(
                                                    "h-5 w-5 flex items-center justify-center rounded-md transition-colors",
                                                    "text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer",
                                                    authLoading ? "" : "animate-pulse"
                                                )}
                                                title="Sync Ulang Auth"
                                            >
                                                {authLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCcw className="h-3 w-3" />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-60">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-400 font-normal truncate uppercase tracking-tighter">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                <User className="h-4 w-4" />
                                <span>Profil Saya</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Settings className="h-4 w-4" />
                                <span>Pengaturan</span>
                            </DropdownMenuItem>

                            {/* Pindah Role Section in Profile Dropdown (Redundant for accessibility) */}
                            {canSwitch && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel className="text-[10px] font-bold text-gray-400 uppercase px-2 py-1.5 tracking-wider">Akses Dashboard</DropdownMenuLabel>

                                    {user?.role !== 'admin' && user?.roles?.includes('admin') && (
                                        <DropdownMenuItem onClick={() => handleRoleSwitch('admin')} className="gap-2 cursor-pointer py-2 px-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-4 h-4 text-violet-500" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-medium">Administrator</span>
                                                <span className="text-[10px] text-gray-400 truncate">Kelola sistem & user</span>
                                            </div>
                                        </DropdownMenuItem>
                                    )}
                                    {user?.role !== 'guru' && (user?.role === 'admin' || user?.roles?.includes('guru')) && (
                                        <DropdownMenuItem onClick={() => handleRoleSwitch('guru')} className="gap-2 cursor-pointer py-2 px-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <GraduationCap className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-medium">Akademik / Guru</span>
                                                <span className="text-[10px] text-gray-400 truncate">Kelola nilai & absen</span>
                                            </div>
                                        </DropdownMenuItem>
                                    )}
                                    {user?.role !== 'bendahara' && (user?.role === 'admin' || user?.roles?.includes('bendahara')) && (
                                        <DropdownMenuItem onClick={() => handleRoleSwitch('bendahara')} className="gap-2 cursor-pointer py-2 px-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                                <Banknote className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-medium">Bendahara / Keuangan</span>
                                                <span className="text-[10px] text-gray-400 truncate">Kelola biaya & spp</span>
                                            </div>
                                        </DropdownMenuItem>
                                    )}
                                </>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-600 gap-2 cursor-pointer">
                                <LogOut className="h-4 w-4" />
                                <span>Keluar</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
