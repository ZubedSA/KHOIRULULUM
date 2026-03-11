'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function LoadingBar() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [progress, setProgress] = useState(0)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Trigger loading bar on change
        setVisible(true)
        setProgress(30)

        const timer = setTimeout(() => {
            setProgress(100)
            const hideTimer = setTimeout(() => {
                setVisible(false)
                setProgress(0)
            }, 300)
            return () => clearTimeout(hideTimer)
        }, 400)

        return () => clearTimeout(timer)
    }, [pathname, searchParams])

    if (!visible) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none">
            <div
                className="h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-primary transition-all duration-500 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)] relative overflow-hidden"
                style={{ width: `${progress}%` }}
            >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full animate-[shimmer_2s_infinite]" />
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    )
}
