'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { MobileNav } from './mobile-nav'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, loading, signOut } = useAuth()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [showContent, setShowContent] = useState(false)

    useEffect(() => {
        // Redirection check: if auth completely fails on client, push to login
        if (!loading && !user) {
            window.location.href = '/login'
        }
    }, [user, loading])

    // Show content immediately if we have cached user, or after brief delay
    useEffect(() => {
        if (user || !loading) {
            setShowContent(true)
        } else {
            // If still loading with no cached user, show content after short delay
            const timer = setTimeout(() => setShowContent(true), 100)
            return () => clearTimeout(timer)
        }
    }, [user, loading])

    // Always render layout immediately - no full-page loading spinner
    return (
        <div className="min-h-screen bg-gray-50/50">
            <Sidebar
                user={user}
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />
            <Header
                user={user}
                onSignOut={signOut}
                isCollapsed={isCollapsed}
            />
            <main
                className={cn(
                    "pt-16 min-h-screen transition-all duration-300 pb-24 lg:pb-6",
                    isCollapsed ? "lg:pl-20" : "lg:pl-64",
                    "pl-0"
                )}
            >
                <div className="p-6">
                    {showContent ? children : (
                        <div className="space-y-6 animate-pulse">
                            <div className="h-24 bg-gray-200 rounded-2xl" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-28 bg-white rounded-xl shadow-sm" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <MobileNav user={user} />
        </div>
    )
}
