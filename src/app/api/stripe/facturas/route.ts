import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe/stripe'

const supabaseAdmin = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
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

        if (!profile || profile.role !== 'admin') {
            return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
        }

        const { data: empresa } = await supabaseAdmin
            .from('empresas')
            .select('stripe_customer_id')
            .eq('id', profile.empresa_id)
            .single()

        if (!empresa?.stripe_customer_id) {
            return NextResponse.json({ facturas: [] })
        }

        const invoices = await stripe.invoices.list({
            customer: empresa.stripe_customer_id,
            limit: 24,
        })

        const facturas = invoices.data.map((inv) => ({
            id: inv.id,
            number: inv.number ?? null,
            amount_paid: inv.amount_paid,
            currency: inv.currency,
            status: (inv.status ?? 'open') as 'paid' | 'open' | 'void' | 'uncollectible' | 'draft',
            created: inv.created,
            invoice_pdf: inv.invoice_pdf ?? null,
            hosted_invoice_url: inv.hosted_invoice_url ?? null,
            period_start: inv.period_start,
            period_end: inv.period_end,
        }))

        return NextResponse.json({ facturas })
    } catch (error: any) {
        console.error('Error obteniendo facturas:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
