'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/auth-store'
import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient, User } from '@supabase/supabase-js'

async function loadProfile(supabase: SupabaseClient, user: User) {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error obteniendo perfil:', error)
    } else {
        useAuthStore.getState().setProfile(profile)
    }
}

export default function AuthInitializer() {
    useEffect(() => {
        const supabase = createClient()
        let mounted = true

        const checkSession = async () => {
            if (!mounted) return

            try {
                useAuthStore.getState().setLoading(true)

                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Error obteniendo sesión:', error)
                    return
                }

                if (session?.user) {
                    useAuthStore.getState().setUser(session.user)
                    await loadProfile(supabase, session.user)
                } else {
                    useAuthStore.getState().setUser(null)
                    useAuthStore.getState().setProfile(null)
                }
            } catch (error) {
                console.error('Error en verificación de sesión:', error)
            } finally {
                if (mounted) useAuthStore.getState().setLoading(false)
            }
        }

        checkSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                if (event === 'SIGNED_IN') {
                    useAuthStore.getState().setLoading(true)
                }

                if (session?.user) {
                    useAuthStore.getState().setUser(session.user)
                    await loadProfile(supabase, session.user)
                } else {
                    useAuthStore.getState().setUser(null)
                    useAuthStore.getState().setProfile(null)
                }

                if (mounted) useAuthStore.getState().setLoading(false)
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return null
}
