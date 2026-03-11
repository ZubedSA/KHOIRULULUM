import { AuthProvider } from '@/hooks/use-auth'
import { UIProvider } from '@/hooks/use-ui'
import { Toaster } from '@/components/ui/toaster'
import { LoadingBar } from '@/components/ui/loading-bar'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <UIProvider>
            <AuthProvider>
                <LoadingBar />
                {children}
                <Toaster />
            </AuthProvider>
        </UIProvider>
    )
}
