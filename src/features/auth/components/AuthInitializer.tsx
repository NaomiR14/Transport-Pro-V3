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
        console.log('[Auth] loadProfileDirect done, empresa_id=', profile.empresa_id)
    } else {
        console.warn('[Auth] loadProfileDirect: no profile for user', session.user.id)
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

                console.log('[Auth] event=', event, 'user=', session?.user?.id ?? null)

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
                            await loadProfileDirect(session)
                        }
                    } else {
                        useAuthStore.getState().setUser(null)
                        useAuthStore.getState().setProfile(null)
                    }
                } catch (err) {
                    console.error('[Auth] error for event=', event, err)
                } finally {
                    if (event === 'SIGNED_IN') signingIn = false
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
