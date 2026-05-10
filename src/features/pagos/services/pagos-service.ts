import { createClient } from '@/lib/supabase/client'
import { getEmpresaId } from '@/lib/supabase/get-empresa-id'
import type { EstadoSuscripcion, Factura } from '../types/pagos.types'

export class PagosService {
    private static async fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
        const res = await fetch(path, options)
        const body = await res.json()
        if (!res.ok) throw new Error(body.error ?? `Error en ${path}`)
        return body as T
    }

    static async getEstadoSuscripcion(): Promise<EstadoSuscripcion | null> {
        let empresaId: string
        try {
            empresaId = await getEmpresaId()
        } catch {
            return null
        }

        const supabase = createClient()
        const { data } = await supabase
            .from('empresas')
            .select('plan, plan_activo, plan_fecha_inicio, plan_fecha_fin, stripe_subscription_id, stripe_customer_id')
            .eq('id', empresaId)
            .single()

        return data as EstadoSuscripcion | null
    }

    static async iniciarCheckout(plan: string): Promise<string> {
        const { url } = await this.fetchApi<{ url: string }>('/api/stripe/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan }),
        })
        return url
    }

    static async abrirPortal(): Promise<string> {
        const { url } = await this.fetchApi<{ url: string }>('/api/stripe/portal', { method: 'POST' })
        return url
    }

    static async getFacturas(): Promise<Factura[]> {
        const { facturas } = await this.fetchApi<{ facturas: Factura[] }>('/api/stripe/facturas')
        return facturas
    }
}
