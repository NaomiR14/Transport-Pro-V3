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
                console.log('[Auth] checkSession: start, setLoading(true)')
                useAuthStore.getState().setLoading(true)

                const { data: { session }, error } = await supabase.auth.getSession()
                console.log('[Auth] checkSession: getSession done, session=', session?.user?.id ?? null, 'error=', error?.message ?? null)

                if (error) {
                    console.error('Error obteniendo sesión:', error)
                    return
                }

                if (session?.user) {
                    useAuthStore.getState().setUser(session.user)
                    await loadProfile(supabase, session.user)
                    console.log('[Auth] checkSession: loadProfile done')
                } else {
                    useAuthStore.getState().setUser(null)
                    useAuthStore.getState().setProfile(null)
                }
            } catch (error) {
                console.error('[Auth] checkSession: caught error', error)
            } finally {
                if (mounted) {
                    console.log('[Auth] checkSession: finally setLoading(false)')
                    useAuthStore.getState().setLoading(false)
                }
            }
        }

        checkSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                console.log('[Auth] onAuthStateChange: event=', event, 'user=', session?.user?.id ?? null)

                if (event === 'SIGNED_IN') {
                    console.log('[Auth] onAuthStateChange: SIGNED_IN → setLoading(true)')
                    useAuthStore.getState().setLoading(true)
                }

                try {
                    if (session?.user) {
                        useAuthStore.getState().setUser(session.user)
                        await loadProfile(supabase, session.user)
                        console.log('[Auth] onAuthStateChange: loadProfile done for event=', event)
                    } else {
                        useAuthStore.getState().setUser(null)
                        useAuthStore.getState().setProfile(null)
                    }
                } catch (err) {
                    console.error('[Auth] onAuthStateChange: loadProfile threw for event=', event, err)
                } finally {
                    if (mounted) {
                        console.log('[Auth] onAuthStateChange: finally setLoading(false) for event=', event)
                        useAuthStore.getState().setLoading(false)
                    }
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return null
}
