import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { stripe, PLAN_PRICE_IDS, PLAN_NAMES } from '@/lib/stripe/stripe'

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

        const { plan } = await request.json()

        if (!plan || !PLAN_PRICE_IDS[plan]) {
            return NextResponse.json({ error: 'Plan inválido' }, { status: 400 })
        }

        const { data: empresa } = await supabaseAdmin
            .from('empresas')
            .select('id, nombre, email_contacto, stripe_customer_id')
            .eq('id', profile.empresa_id)
            .single()

        if (!empresa) {
            return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 })
        }

        // Crear o recuperar Customer de Stripe
        let customerId = empresa.stripe_customer_id
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: empresa.email_contacto,
                name: empresa.nombre,
                metadata: { empresa_id: empresa.id },
            })
            customerId = customer.id

            await supabaseAdmin
                .from('empresas')
                .update({ stripe_customer_id: customerId })
                .eq('id', empresa.id)
        }

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [{ price: PLAN_PRICE_IDS[plan], quantity: 1 }],
            success_url: `${siteUrl}/configuracion/suscripcion?success=1&plan=${plan}`,
            cancel_url: `${siteUrl}/configuracion/suscripcion?canceled=1`,
            metadata: {
                empresa_id: empresa.id,
                plan,
            },
            subscription_data: {
                metadata: { empresa_id: empresa.id, plan },
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error('Error creando sesión de checkout:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
