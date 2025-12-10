// app/auth/callback/route.ts - VERSIÓN BALANCEADA
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        try {
            const supabase = await createClient()
            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Error en callback auth:', error)
                return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
            }

            // Redirigir al dashboard principal
            return NextResponse.redirect(new URL('/', request.url))

        } catch (error) {
            console.error('Error inesperado en callback:', error)
            return NextResponse.redirect(new URL('/login?error=unexpected', request.url))
        }
    }

    // Si no hay código, algo salió mal
    return NextResponse.redirect(new URL('/login', request.url))
}