import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthStore, UserProfile } from '../types/auth.types'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

// Helper para normalizar el perfil
function normalizeProfile(profile: any): UserProfile | null {
    if (!profile) return null
    
    return {
        id: profile.id || '',
        nombre: profile.nombre,
        apellido: profile.apellido,
        avatar_url: profile.avatar_url,
        role: profile.role,
        phone: profile.phone,
        department: profile.department,
        position: profile.position,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
    }
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // Estado inicial
            user: null,
            profile: null,
            isLoading: true,
            error: null,

            // Acciones
            initialize: async () => {
                // Esta función ya no se usa directamente
                console.warn('⚠️ initialize() está deprecado, usa AuthInitializer')
                set({ isLoading: false })
            },

            setUser: (user: User | null) => set({ user, isLoading: false }),
            setProfile: (profile) => set({ profile: normalizeProfile(profile) }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),

            signIn: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null })
                    const supabase = createClient()
                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })

                    if (error) throw error
                    if (!data?.user) throw new Error('No se pudo iniciar sesión')

                    set({ user: data.user })

                    // Obtener perfil
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single()
                    
                    set({ profile: normalizeProfile(profile) })
                } catch (error: any) {
                    set({ error: error.message })
                    throw error
                } finally {
                    set({ isLoading: false })
                }
            },

            signOut: async () => {
                try {
                    set({ isLoading: true })
                    const supabase = createClient()
                    const { error } = await supabase.auth.signOut()
                    
                    if (error) throw error
                    
                    // IMPORTANTE: Limpiar estado inmediatamente
                    set({ 
                        user: null, 
                        profile: null,
                        error: null 
                    })
                    
                    // También limpiar el localStorage (persistencia)
                    localStorage.removeItem('auth-storage')
                    
                } catch (error: any) {
                    set({ error: error.message })
                    console.error('Error en signOut:', error)
                } finally {
                    // Asegurar que loading sea false
                    setTimeout(() => {
                        set({ isLoading: false })
                    }, 500)
                }
            },

            refreshProfile: async () => {
                const { user } = get()
                if (!user) return

                try {
                    const supabase = createClient()
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()
                    
                    set({ profile: normalizeProfile(profile) })
                } catch (error: any) {
                    console.error('Error actualizando perfil:', error)
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                profile: state.profile
            }),
        }
    )
)
