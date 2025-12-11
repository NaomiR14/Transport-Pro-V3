import { User } from '@supabase/supabase-js'

// Usar tipos de Supabase directamente
export type AuthUser = User


export interface UserProfile {
    id: string
    full_name: string
    avatar_url?: string
    role: 'admin' | 'user' | 'driver'
    phone?: string
    created_at: string
    updated_at: string
}
// Para las credenciales
export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials extends LoginCredentials {
    full_name: string
    phone?: string
}

export interface AuthStore {
    user: AuthUser | null
    profile: UserProfile | null
    isLoading: boolean
    error: string | null

    initialize: () => Promise<void>
    setUser: (user: AuthUser | null) => void
    setProfile: (profile: UserProfile | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    refreshProfile: () => Promise<void>
}

