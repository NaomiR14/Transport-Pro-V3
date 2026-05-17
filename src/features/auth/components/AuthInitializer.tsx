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
        // Prevents INITIAL_SESSION from releasing isLoading while SIGNED_IN is
        // still processing its own loadProfile (avoids starting subscription query
        // while Supabase is mid-token-refresh).
        let signingIn = false

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                console.log('[Auth] event=', event, 'user=', session?.user?.id ?? null)

                // Only INITIAL_SESSION and SIGNED_IN perform a full auth cycle
                // (set user + load profile + gate isLoading). Other events (TOKEN_REFRESHED,
                // USER_UPDATED) just update the user object without touching the loading gate.
                const isAuthCycle = event === 'INITIAL_SESSION' || event === 'SIGNED_IN'

                if (event === 'SIGNED_IN') {
                    signingIn = true
                    console.log('[Auth] SIGNED_IN → setLoading(true)')
                    useAuthStore.getState().setLoading(true)
                }

                try {
                    if (session?.user) {
                        useAuthStore.getState().setUser(session.user)
                        if (isAuthCycle) {
                            await loadProfile(supabase, session.user)
                            console.log('[Auth] loadProfile done for event=', event)
                        }
                    } else {
                        useAuthStore.getState().setUser(null)
                        useAuthStore.getState().setProfile(null)
                    }
                } catch (err) {
                    console.error('[Auth] error for event=', event, err)
                } finally {
                    if (event === 'SIGNED_IN') signingIn = false
                    // Release isLoading only for auth-cycle events and only when
                    // no SIGNED_IN is still in progress (signingIn flag).
                    if (mounted && isAuthCycle && !signingIn) {
                        console.log('[Auth] setLoading(false) for event=', event)
                        useAuthStore.getState().setLoading(false)
                    } else if (isAuthCycle) {
                        console.log('[Auth] skipped setLoading(false) — signingIn=', signingIn, 'event=', event)
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
