'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/types/database'
import {
    adminMenus,
    akademikMenus,
    keuanganMenus,
    MenuItem
} from './sidebar'

interface MobileNavProps {
    user: Profile | null
}

export function MobileNav({ user }: MobileNavProps) {
    const pathname = usePathname()

    const getMenus = (): MenuItem[] => {
        if (pathname.startsWith('/admin')) return adminMenus
        if (pathname.startsWith('/akademik')) return akademikMenus
        if (pathname.startsWith('/keuangan')) return keuanganMenus

        if (user) {
            switch (user.role) {
                case 'admin': return adminMenus
                case 'guru': return akademikMenus
                case 'bendahara': return keuanganMenus
            }
        }
        return adminMenus
    }

    const getAccentColor = (): string => {
        if (pathname.startsWith('/admin')) return 'violet'
        if (pathname.startsWith('/akademik')) return 'blue'
        if (pathname.startsWith('/keuangan')) return 'emerald'
        return 'blue'
    }

    const menus = getMenus()
    const accent = getAccentColor()

    const accentClasses = {
        violet: {
            active: 'bg-violet-100 text-violet-700',
            icon: 'text-violet-600'
        },
        blue: {
            active: 'bg-blue-100 text-blue-700',
            icon: 'text-blue-600'
        },
        emerald: {
            active: 'bg-emerald-100 text-emerald-700',
            icon: 'text-emerald-600'
        }
    }

    const colors = accentClasses[accent as keyof typeof accentClasses]

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
            <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth px-6 py-3 gap-6">
                {menus.map((menu) => {
                    const isActive = pathname === menu.href ||
                        (menu.href !== '/admin' && menu.href !== '/akademik' && menu.href !== '/keuangan' && pathname.startsWith(menu.href))

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center min-w-[56px] py-1 transition-all duration-300 gap-1.5 flex-shrink-0",
                                isActive
                                    ? colors.icon
                                    : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {/* Top Indicator Line */}
                            {isActive && (
                                <div className={cn(
                                    "absolute -top-3 left-0 right-0 h-0.5 rounded-full animate-in fade-in slide-in-from-top-1",
                                    accent === 'violet' && "bg-violet-500",
                                    accent === 'blue' && "bg-blue-500",
                                    accent === 'emerald' && "bg-emerald-500"
                                )} />
                            )}

                            <span className={cn(
                                "transition-all duration-300",
                                isActive && "scale-110"
                            )}>
                                {React.cloneElement(menu.icon as React.ReactElement, {
                                    className: "w-5 h-5"
                                })}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold tracking-tight whitespace-nowrap px-1",
                                isActive ? "opacity-100" : "opacity-60"
                            )}>
                                {menu.label}
                            </span>
                        </Link>
                    )
                })}
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </nav>
    )
}
