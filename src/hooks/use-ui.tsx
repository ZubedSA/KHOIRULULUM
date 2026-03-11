'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { HelpCircle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ConfirmOptions {
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'destructive'
}

interface UIContextType {
    confirm: (options: ConfirmOptions) => Promise<boolean>
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)
    const [confirmState, setConfirmState] = useState<{
        options: ConfirmOptions
        resolve: (value: boolean) => void
    } | null>(null)

    const confirm = useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            setConfirmState({ options, resolve })
        })
    }, [])

    const handleConfirm = useCallback(() => {
        if (confirmState) {
            confirmState.resolve(true)
            setConfirmState(null)
        }
    }, [confirmState])

    const handleCancel = useCallback(() => {
        if (confirmState) {
            confirmState.resolve(false)
            setConfirmState(null)
        }
    }, [confirmState])

    return (
        <UIContext.Provider value={{ confirm, isLoading, setIsLoading }}>
            {children}

            {/* Premium Global Confirmation Modal V3 (Robust shadcn/ui) */}
            <Dialog
                open={!!confirmState}
                onOpenChange={(open) => {
                    if (!open) handleCancel()
                }}
            >
                <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none bg-white rounded-[1.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
                    {/* Brand Top Bar */}
                    <div className={cn(
                        "h-1.5 w-full",
                        confirmState?.options.variant === 'destructive' ? "bg-red-500" : "bg-primary"
                    )} />

                    <div className="p-8 flex flex-col items-center text-center">
                        {/* Icon Container */}
                        <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm",
                            confirmState?.options.variant === 'destructive'
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-primary"
                        )}>
                            {confirmState?.options.variant === 'destructive'
                                ? <AlertTriangle className="w-10 h-10" />
                                : <HelpCircle className="w-10 h-10" />
                            }
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
                            {confirmState?.options.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed px-4">
                            {confirmState?.options.description}
                        </p>
                    </div>

                    <div className="px-8 pb-8 flex flex-col gap-3">
                        <Button
                            onClick={handleConfirm}
                            variant={confirmState?.options.variant === 'destructive' ? "destructive" : "default"}
                            className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all"
                        >
                            {confirmState?.options.confirmLabel || 'Ya, Lanjutkan'}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="ghost"
                            className="w-full h-11 text-slate-500 hover:text-slate-900 font-semibold rounded-xl hover:bg-slate-100/50"
                        >
                            {confirmState?.options.cancelLabel || 'Batal'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </UIContext.Provider>
    )
}

export function useUI() {
    const context = useContext(UIContext)
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider')
    }
    return context
}
