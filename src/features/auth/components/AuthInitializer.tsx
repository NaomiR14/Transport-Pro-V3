'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/auth-store'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'

// Fetches the profile via the PostgREST REST API directly, bypassing the
// Supabase JS client. This avoids the internal auth-lock deadlock that occurs
// when supabase.from() is called inside an onAuthStateChange callback while
// the client is still processing its own SIGNED_IN token refresh.
async function loadProfileDirect(session: Session) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?id=eq.${session.user.id}&select=*`
    const res = await fetch(url, {
        headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${session.access_token}`,
            Accept: 'application/json',
        },
    })

    if (!res.ok) throw new Error(`loadProfile HTTP ${res.status}`)

    const [profile] = await res.json()
    if (profile) {
        useAuthStore.getState().setProfile(profile)
    } else {
        console.error('[Auth] No se encontró perfil para el usuario', session.user.id)
    }
}

export default function AuthInitializer() {
    useEffect(() => {
        const supabase = createClient()
        let mounted = true
        // Prevents INITIAL_SESSION from releasing isLoading while SIGNED_IN is
        // still processing its own loadProfileDirect.
        let signingIn = false

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                const isAuthCycle = event === 'INITIAL_SESSION' || event === 'SIGNED_IN'

                if (event === 'SIGNED_IN') {
                    signingIn = true
                    useAuthStore.getState().setLoading(true)
                }

                try {
                    if (session?.user) {
                        useAuthStore.getState().setUser(session.user)
                        if (isAuthCycle) {
                            await loadProfileDirect(session)
                        }
                    } else {
                        useAuthStore.getState().setUser(null)
                        useAuthStore.getState().setProfile(null)
                    }
                } catch (err) {
                    console.error('[Auth] Error en evento', event, err)
                } finally {
                    if (event === 'SIGNED_IN') signingIn = false
                    if (mounted && isAuthCycle && !signingIn) {
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
