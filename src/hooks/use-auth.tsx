'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/types/database'

interface AuthContextType {
    user: Profile | null
    loading: boolean
    signOut: () => Promise<void>
    refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Cache key for sessionStorage
const AUTH_CACHE_KEY = 'madrasah_auth_cache'
const CACHE_EXPIRY = 5 * 60 * 1000 // 5 minutes

interface CachedAuth {
    user: Profile | null
    timestamp: number
}

function getCachedAuth(): Profile | null {
    if (typeof window === 'undefined') return null

    try {
        const cached = sessionStorage.getItem(AUTH_CACHE_KEY)
        if (!cached) return null

        const parsed: CachedAuth = JSON.parse(cached)
        const now = Date.now()

        // Check if cache is still valid
        if (now - parsed.timestamp < CACHE_EXPIRY) {
            return parsed.user
        }

        // Clear expired cache
        sessionStorage.removeItem(AUTH_CACHE_KEY)
        return null
    } catch {
        return null
    }
}

function setCachedAuth(user: Profile | null): void {
    if (typeof window === 'undefined') return

    try {
        const cacheData: CachedAuth = {
            user,
            timestamp: Date.now()
        }
        sessionStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cacheData))
    } catch {
        // Ignore storage errors
    }
}

function clearCachedAuth(): void {
    if (typeof window === 'undefined') return

    try {
        sessionStorage.removeItem(AUTH_CACHE_KEY)
    } catch {
        // Ignore storage errors
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    // DO NOT initialize with cache here - causes hydration mismatch
    const [user, setUser] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const initialized = useRef(false)
    const isMounted = useRef(true)

    const supabase = createClient()

    // ... (rest of the component logic)

    const getUser = useCallback(async (passedUser?: any) => {
        try {
            console.log('--- STARTING GET_USER ---', { passedUser: !!passedUser })
            let authUser = passedUser

            if (!authUser) {
                const { data: { user: fetchedUser }, error: authError } = await supabase.auth.getUser()
                if (authError) console.warn('getUser() error:', authError)
                authUser = fetchedUser
            }

            // Final fallback - check session directly
            if (!authUser) {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) console.warn('getSession() error:', sessionError)
                authUser = session?.user
            }

            if (!isMounted.current) return

            if (!authUser) {
                console.log('No auth user found after all attempts')
                setUser(null)
                setCachedAuth(null)
                setLoading(false)
                return
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (profileError) console.warn('Profile fetch error:', profileError)

            if (!isMounted.current) return

            let userProfile: Profile
            const isAdminEmail = authUser.email?.toLowerCase().includes('admin')
            const isMetadataAdmin = authUser.user_metadata?.role === 'admin'

            if (profile) {
                // Profile exists, but we ensure admin status if email matches, metadata matches, or role matches
                const isActuallyAdmin =
                    profile.role === 'admin' ||
                    isAdminEmail ||
                    isMetadataAdmin ||
                    profile.roles?.includes('admin')

                // Respect the chosen role in the profile, but default to 'admin' if they are an admin with no role set
                const currentRole = profile.role as UserRole
                const finalRole = currentRole || (isActuallyAdmin ? 'admin' : 'guru')

                // If they are admin, they get all roles. Otherwise, use their assigned roles.
                const finalRoles = isActuallyAdmin
                    ? ['admin' as UserRole, 'guru' as UserRole, 'bendahara' as UserRole]
                    : (profile.roles && profile.roles.length > 0 ? profile.roles : [finalRole])

                userProfile = {
                    ...profile,
                    email: authUser.email || '',
                    role: finalRole,
                    roles: finalRoles
                }
            } else {
                // Fallback for missing profile record
                const isActuallyAdmin = isAdminEmail || isMetadataAdmin
                userProfile = {
                    id: authUser.id,
                    name: authUser.user_metadata?.name || authUser.email || 'Admin',
                    email: authUser.email || '',
                    role: isActuallyAdmin ? 'admin' : 'guru',
                    roles: isActuallyAdmin ? ['admin', 'guru', 'bendahara'] : ['guru'],
                    avatar_url: authUser.user_metadata?.avatar_url || null,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                } as Profile
            }

            // Debug log (can be seen in browser console)
            const debugData = {
                email: userProfile.email,
                role: userProfile.role,
                roles: userProfile.roles,
                is_admin_email: isAdminEmail,
                is_metadata_admin: isMetadataAdmin,
                profile_found: !!profile,
                authUser: {
                    id: authUser.id,
                    email: authUser.email,
                    metadata: authUser.user_metadata
                },
                timestamp: new Date().toISOString()
            }
            console.log('User Auth Loaded (Final):', debugData)

            if (typeof window !== 'undefined') {
                (window as any).MADRASAH_DEBUG = debugData;
                (window as any).MADRASAH_USER = userProfile;
            }

            // Clear old/incompatible cache (can happen if user format changed)
            if (userProfile) {
                const isOldFormat = !userProfile.roles || !userProfile.email
                if (isOldFormat) {
                    console.log('Clearing old auth cache format detector')
                    clearCachedAuth()
                }
            }

            setUser(userProfile)
            setCachedAuth(userProfile)
        } catch (error) {
            console.error('Auth error detailed:', error)
            if (typeof window !== 'undefined') {
                (window as any).MADRASAH_LAST_ERROR = error
            }
        } finally {
            if (isMounted.current) {
                setLoading(false)
            }
        }
    }, [supabase])
    useEffect(() => {
        isMounted.current = true
        if (initialized.current) return
        initialized.current = true

        // Load cache on client only to avoid hydration mismatch
        const cached = getCachedAuth()
        if (cached) {
            setUser(cached)
            setLoading(false)
            // Still verify in background
            getUser()
        } else {
            getUser()
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
                clearCachedAuth()
            } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                // Recover or update session if it changes
                getUser(session?.user)
            }
        })

        return () => {
            isMounted.current = false
            subscription.unsubscribe()
        }
    }, [getUser, supabase])

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        clearCachedAuth()
        window.location.href = '/login'
    }

    const refreshAuth = async () => {
        setLoading(true)
        await getUser()
    }

    const value = { user, loading, signOut, refreshAuth }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
