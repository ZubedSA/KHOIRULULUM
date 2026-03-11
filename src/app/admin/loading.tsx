'use client'

import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sidebar placeholder */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-100">
                <div className="h-16 flex items-center px-4 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-violet-500 animate-pulse" />
                    <div className="ml-3 h-5 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="p-3 space-y-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </aside>

            {/* Header placeholder */}
            <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-100 z-30">
                <div className="h-full flex items-center justify-between px-6">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    </div>
                </div>
            </header>

            {/* Main content skeleton */}
            <main className="pt-16 pl-64 min-h-screen">
                <div className="p-6 space-y-6">
                    {/* Welcome banner skeleton */}
                    <div className="h-24 bg-gradient-to-r from-violet-400 to-violet-500 rounded-2xl animate-pulse" />

                    {/* Stats skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-28 bg-white rounded-xl shadow-sm animate-pulse" />
                        ))}
                    </div>

                    {/* More content skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-24 bg-white rounded-xl shadow-sm animate-pulse" />
                        ))}
                    </div>

                    {/* Cards skeleton */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-64 bg-white rounded-xl shadow-sm animate-pulse" />
                        <div className="h-64 bg-white rounded-xl shadow-sm animate-pulse" />
                    </div>
                </div>
            </main>

            {/* Loading indicator */}
            <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                <span className="text-sm text-gray-600">Memuat...</span>
            </div>
        </div>
    )
}
