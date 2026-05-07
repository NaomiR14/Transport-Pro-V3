import { createClient } from '@/lib/supabase/client'
import type { Notificacion } from '../types/notificaciones.types'

export class NotificacionesService {
    private static tableName = 'notificaciones'

    static async getNotificaciones(limit = 50): Promise<Notificacion[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw new Error(`Error al obtener notificaciones: ${error.message}`)
        return (data as Notificacion[]) ?? []
    }

    static async getUnreadCount(): Promise<number> {
        const supabase = createClient()
        const { count, error } = await supabase
            .from(this.tableName)
            .select('*', { count: 'exact', head: true })
            .eq('leida', false)

        if (error) throw new Error(`Error al contar notificaciones: ${error.message}`)
        return count ?? 0
    }

    static async markAsRead(id: string): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase
            .from(this.tableName)
            .update({ leida: true })
            .eq('id', id)

        if (error) throw new Error(`Error al marcar notificación: ${error.message}`)
    }

    static async markAllAsRead(): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase
            .from(this.tableName)
            .update({ leida: true })
            .eq('leida', false)

        if (error) throw new Error(`Error al marcar notificaciones: ${error.message}`)
    }

    static async deleteNotificacion(id: string): Promise<void> {
        const supabase = createClient()
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq('id', id)

        if (error) throw new Error(`Error al eliminar notificación: ${error.message}`)
    }
}
