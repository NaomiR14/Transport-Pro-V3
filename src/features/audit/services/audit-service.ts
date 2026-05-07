import { createClient } from '@/lib/supabase/client'
import type { AuditFilters, AuditLog } from '../types/audit.types'

const PAGE_SIZE = 50

export class AuditService {
    static async getAuditLogs(filters: AuditFilters = {}, page = 0): Promise<AuditLog[]> {
        const supabase = createClient()

        let query = supabase
            .from('audit_log')
            .select('*, profiles(nombre, apellido)')
            .order('created_at', { ascending: false })
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

        if (filters.tabla)       query = query.eq('tabla', filters.tabla)
        if (filters.accion)      query = query.eq('accion', filters.accion)
        if (filters.fecha_desde) query = query.gte('created_at', filters.fecha_desde)
        if (filters.fecha_hasta) query = query.lte('created_at', `${filters.fecha_hasta}T23:59:59Z`)

        const { data, error } = await query
        if (error) throw error
        return (data ?? []) as AuditLog[]
    }
}
