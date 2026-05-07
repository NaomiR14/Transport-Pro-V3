import { createClient } from '@/lib/supabase/client'
import type { EstadoSuscripcion, Factura } from '../types/pagos.types'

export class PagosService {
    static async getEstadoSuscripcion(): Promise<EstadoSuscripcion | null> {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('empresa_id')
            .eq('id', user.id)
            .single()

        if (!profile?.empresa_id) return null

        const { data } = await supabase
            .from('empresas')
            .select('plan, plan_activo, plan_fecha_inicio, plan_fecha_fin, stripe_subscription_id')
            .eq('id', profile.empresa_id)
            .single()

        return data as EstadoSuscripcion | null
    }

    static async iniciarCheckout(plan: string): Promise<string> {
        const res = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan }),
        })

        if (!res.ok) {
            const body = await res.json()
            throw new Error(body.error ?? 'Error iniciando checkout')
        }

        const { url } = await res.json()
        return url as string
    }

    static async abrirPortal(): Promise<string> {
        const res = await fetch('/api/stripe/portal', {
            method: 'POST',
        })

        if (!res.ok) {
            const body = await res.json()
            throw new Error(body.error ?? 'Error abriendo portal')
        }

        const { url } = await res.json()
        return url as string
    }

    static async getFacturas(): Promise<Factura[]> {
        const res = await fetch('/api/stripe/facturas')

        if (!res.ok) {
            const body = await res.json()
            throw new Error(body.error ?? 'Error obteniendo facturas')
        }

        const { facturas } = await res.json()
        return facturas as Factura[]
    }
}
