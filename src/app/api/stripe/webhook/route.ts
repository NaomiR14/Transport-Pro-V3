import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe/stripe'
import type Stripe from 'stripe'

export const runtime = 'nodejs'

const supabaseAdmin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_BY_PRICE: Record<string, string> = {
    [process.env.STRIPE_PRICE_BASICO!]:      'basico',
    [process.env.STRIPE_PRICE_PROFESIONAL!]: 'profesional',
    [process.env.STRIPE_PRICE_ENTERPRISE!]:  'enterprise',
}

async function updateEmpresaSuscripcion(
    customerId: string,
    subscriptionId: string,
    plan: string,
    activo: boolean,
    fechaInicio?: Date | null,
    fechaFin?: Date | null,
) {
    const { error } = await supabaseAdmin.rpc('actualizar_suscripcion_empresa', {
        p_customer_id:     customerId,
        p_subscription_id: subscriptionId,
        p_plan:            plan,
        p_activo:          activo,
        p_fecha_inicio:    fechaInicio?.toISOString() ?? null,
        p_fecha_fin:       fechaFin?.toISOString() ?? null,
    })
    if (error) console.error('Error actualizando suscripción:', error)
}

function getSubPeriod(sub: Stripe.Subscription): { inicio: Date | null; fin: Date | null } {
    const item = sub.items.data[0]
    if (!item) return { inicio: null, fin: null }
    return {
        inicio: new Date(item.current_period_start * 1000),
        fin:    new Date(item.current_period_end * 1000),
    }
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
    const details = invoice.parent?.subscription_details
    if (!details?.subscription) return null
    return typeof details.subscription === 'string'
        ? details.subscription
        : details.subscription.id
}

export async function POST(request: NextRequest) {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    if (!sig) {
        return NextResponse.json({ error: 'Sin firma de Stripe' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
        console.error('Webhook signature error:', err.message)
        return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session
            if (session.mode !== 'subscription') break

            const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
                expand: ['items'],
            })
            const priceId = sub.items.data[0]?.price.id
            const plan = PLAN_BY_PRICE[priceId] ?? 'basico'
            const { inicio, fin } = getSubPeriod(sub)

            await updateEmpresaSuscripcion(
                session.customer as string,
                sub.id,
                plan,
                true,
                inicio,
                fin,
            )
            break
        }

        case 'invoice.paid': {
            const invoice = event.data.object as Stripe.Invoice
            const subscriptionId = getInvoiceSubscriptionId(invoice)
            if (!subscriptionId) break

            const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['items'] })
            const priceId = sub.items.data[0]?.price.id
            const plan = PLAN_BY_PRICE[priceId] ?? 'basico'
            const { inicio, fin } = getSubPeriod(sub)

            await updateEmpresaSuscripcion(
                invoice.customer as string,
                sub.id,
                plan,
                true,
                inicio,
                fin,
            )
            break
        }

        case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice
            const subscriptionId = getInvoiceSubscriptionId(invoice)
            if (!subscriptionId) break

            const sub = await stripe.subscriptions.retrieve(subscriptionId, { expand: ['items'] })
            const priceId = sub.items.data[0]?.price.id
            const plan = PLAN_BY_PRICE[priceId] ?? 'basico'

            await updateEmpresaSuscripcion(
                invoice.customer as string,
                sub.id,
                plan,
                false,
            )
            break
        }

        case 'customer.subscription.deleted': {
            const sub = event.data.object as Stripe.Subscription
            await updateEmpresaSuscripcion(
                sub.customer as string,
                sub.id,
                'basico',
                false,
            )
            break
        }

        default:
            break
    }

    return NextResponse.json({ received: true })
}
