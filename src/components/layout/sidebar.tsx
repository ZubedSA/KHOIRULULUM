'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    ClipboardCheck,
    FileText,
    Wallet,
    Receipt,
    TrendingUp,
    TrendingDown,
    Tag,
    BarChart3,
    AlertCircle,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
    user: Profile | null
    isCollapsed: boolean
    onToggle: () => void
}

export interface MenuItem {
    label: string
    href: string
    icon: React.ReactNode
}

export const adminMenus: MenuItem[] = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'User Management', href: '/admin/users', icon: <Users className="w-5 h-5" /> },
    { label: 'Akademik', href: '/akademik', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Keuangan', href: '/keuangan', icon: <Wallet className="w-5 h-5" /> },
    { label: 'Pengaturan', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'Audit Log', href: '/admin/audit', icon: <Shield className="w-5 h-5" /> },
]

export const akademikMenus: MenuItem[] = [
    { label: 'Dashboard', href: '/akademik', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Kelas', href: '/akademik/kelas', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Siswa', href: '/akademik/siswa', icon: <Users className="w-5 h-5" /> },
    { label: 'Jadwal', href: '/akademik/jadwal', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Absensi', href: '/akademik/absensi', icon: <ClipboardCheck className="w-5 h-5" /> },
    { label: 'Nilai', href: '/akademik/nilai', icon: <FileText className="w-5 h-5" /> },
]

export const keuanganMenus: MenuItem[] = [
    { label: 'Dashboard', href: '/keuangan', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Tagihan Santri', href: '/keuangan/tagihan', icon: <Receipt className="w-5 h-5" /> },
    { label: 'Pemasukan', href: '/keuangan/pemasukan', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Pengeluaran', href: '/keuangan/pengeluaran', icon: <TrendingDown className="w-5 h-5" /> },
    { label: 'Kategori', href: '/keuangan/kategori', icon: <Tag className="w-5 h-5" /> },
    { label: 'Laporan', href: '/keuangan/laporan', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Tunggakan', href: '/keuangan/tunggakan', icon: <AlertCircle className="w-5 h-5" /> },
]

export function Sidebar({ user, isCollapsed, onToggle }: SidebarProps) {
    const pathname = usePathname()

    const getMenus = (): MenuItem[] => {
        // Determine which menu to show based on current path (works even without user)
        if (pathname.startsWith('/admin')) {
            return adminMenus
        }
        if (pathname.startsWith('/akademik')) {
            return akademikMenus
        }
        if (pathname.startsWith('/keuangan')) {
            return keuanganMenus
        }

        // Default based on role if user is available
        if (user) {
            switch (user.role) {
                case 'admin':
                    return adminMenus
                case 'guru':
                    return akademikMenus
                case 'bendahara':
                    return keuanganMenus
            }
        }

        // Fallback to admin menus if no user and no path match
        return adminMenus
    }

    const getAccentColor = (): string => {
        if (pathname.startsWith('/admin')) {
            return 'violet'
        }
        if (pathname.startsWith('/akademik')) {
            return 'blue'
        }
        if (pathname.startsWith('/keuangan')) {
            return 'emerald'
        }
        return 'blue'
    }

    const menus = getMenus()
    const accent = getAccentColor()

    const accentClasses = {
        violet: {
            active: 'bg-violet-50 text-violet-700 border-violet-200',
            hover: 'hover:bg-violet-50/50 hover:text-violet-600',
            icon: 'text-violet-500'
        },
        blue: {
            active: 'bg-blue-50 text-blue-700 border-blue-200',
            hover: 'hover:bg-blue-50/50 hover:text-blue-600',
            icon: 'text-blue-500'
        },
        emerald: {
            active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            hover: 'hover:bg-emerald-50/50 hover:text-emerald-600',
            icon: 'text-emerald-500'
        }
    }

    const colors = accentClasses[accent as keyof typeof accentClasses]

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-100 transition-all duration-300 hidden lg:block",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                {!isCollapsed && (
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center",
                            accent === 'violet' && "bg-gradient-to-br from-violet-500 to-violet-600",
                            accent === 'blue' && "bg-gradient-to-br from-blue-500 to-blue-600",
                            accent === 'emerald' && "bg-gradient-to-br from-emerald-500 to-emerald-600"
                        )}>
                            <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">Madrasah</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center mx-auto",
                        accent === 'violet' && "bg-gradient-to-br from-violet-500 to-violet-600",
                        accent === 'blue' && "bg-gradient-to-br from-blue-500 to-blue-600",
                        accent === 'emerald' && "bg-gradient-to-br from-emerald-500 to-emerald-600"
                    )}>
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className={cn("h-8 w-8 text-gray-400 hover:text-gray-600", isCollapsed && "absolute -right-3 bg-white border shadow-sm")}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
                {menus.map((menu) => {
                    const isActive = pathname === menu.href ||
                        (menu.href !== '/admin' && menu.href !== '/akademik' && menu.href !== '/keuangan' && pathname.startsWith(menu.href))

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent",
                                isActive
                                    ? colors.active
                                    : `text-gray-600 ${colors.hover}`,
                                isCollapsed && "justify-center px-2"
                            )}
                            title={isCollapsed ? menu.label : undefined}
                        >
                            <span className={cn(isActive && colors.icon)}>
                                {menu.icon}
                            </span>
                            {!isCollapsed && <span>{menu.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            {/* Role-based quick links for Admin */}
            {user?.role === 'admin' && !pathname.startsWith('/admin') && !isCollapsed && (
                <div className="absolute bottom-20 left-0 right-0 px-3">
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-2">Quick Access</p>
                        <div className="space-y-1">
                            {!pathname.startsWith('/akademik') && (
                                <Link
                                    href="/akademik"
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    <span>Akademik</span>
                                </Link>
                            )}
                            {!pathname.startsWith('/keuangan') && (
                                <Link
                                    href="/keuangan"
                                    className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                                >
                                    <Wallet className="w-4 h-4" />
                                    <span>Keuangan</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </aside>
    )
}
