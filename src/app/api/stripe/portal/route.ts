import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe/stripe'
import logger from '@/lib/logger'

const supabaseAdmin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role, empresa_id')
            .eq('id', user.id)
            .single()

        if (!profile || !['admin', 'director'].includes(profile.role)) {
            return NextResponse.json({ error: 'Sin permisos para gestionar suscripciones' }, { status: 403 })
        }

        const { data: empresa } = await supabaseAdmin
            .from('empresas')
            .select('stripe_customer_id')
            .eq('id', profile.empresa_id)
            .single()

        if (!empresa?.stripe_customer_id) {
            return NextResponse.json({ error: 'Sin suscripción activa' }, { status: 400 })
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: empresa.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/configuracion/suscripcion?portal_return=1`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        logger.error({ err: error }, 'Error creando sesión de portal')
        const msg = error?.message ?? 'Error interno del servidor'
        return NextResponse.json({ error: msg }, { status: 500 })
    }
}
