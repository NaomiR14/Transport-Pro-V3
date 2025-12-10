"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'

interface AuthContextType {
    user: any
    isLoading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const pathname = usePathname()
    const supabase = createClient()

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true)
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
            setIsLoading(false)
        }

        checkAuth()

        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
        })

        return () => subscription.unsubscribe()
    }, [pathname, supabase])

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, signOut }}>
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