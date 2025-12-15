import { createClient } from '@/lib/supabase/client'
import type { UserProfile, RegisterCredentials } from '@/types/auth'
import type { User } from '@supabase/supabase-js'

export class AuthService {
    private supabase = createClient()

    async getSession() {
        return await this.supabase.auth.getSession()
    }

    async getUser(): Promise<{ data: { user: User | null }; error: any }> {
        return await this.supabase.auth.getUser()
    }

    async signIn(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({
            email,
            password,
        })
    }

    async signUp(credentials: RegisterCredentials) {
        return await this.supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
                data: {
                    nombre: credentials.nombre,
                    apellido: credentials.apellido,
                    phone: credentials.phone,
                },
            },
        })
    }

    async signOut() {
        return await this.supabase.auth.signOut()
    }

    async getProfile(userId: string): Promise<{ data: UserProfile | null; error: any }> {
        return await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
    }

    async updateProfile(userId: string, updates: Partial<UserProfile>) {
        return await this.supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()
    }

    // Helper para obtener nombre completo
    async getFullName(userId: string): Promise<string> {
        const { data: profile } = await this.getProfile(userId)
        if (!profile) return ''

        return `${profile.nombre || ''} ${profile.apellido || ''}`.trim()
    }

    onAuthStateChange(callback: (event: any, session: any) => void) {
        return this.supabase.auth.onAuthStateChange(callback)
    }
}

export const authService = new AuthService()