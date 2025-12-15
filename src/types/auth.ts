import { User } from '@supabase/supabase-js'

// Usar tipos de Supabase directamente
export type AuthUser = User


export type UserRole =
    | 'admin'
    | 'director'
    | 'gerente'
    | 'coordinador'
    | 'supervisor'
    | 'recursos_humanos'
    | 'administrativo'
    | 'contador'
    | 'comercial'
    | 'atencion_cliente'
    | 'conductor'

export interface UserProfile {
    id: string
    nombre?: string
    apellido?: string
    avatar_url?: string
    role?: UserRole
    phone?: string
    department?: string
    position?: string
    created_at?: string
    updated_at?: string
}

// Helper para obtener nombre completo
export function getFullName(profile: UserProfile | null): string {
    if (!profile) return ''
    return `${profile.nombre || ''} ${profile.apellido || ''}`.trim()
}

// Para las credenciales
export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterCredentials extends LoginCredentials {
    nombre: string
    apellido: string
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

