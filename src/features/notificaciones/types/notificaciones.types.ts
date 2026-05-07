export type TipoNotificacion =
    | 'orden_nueva'
    | 'orden_estado'
    | 'mantenimiento_programado'
    | 'multa_nueva'
    | 'seguro_vencimiento'
    | 'sistema'

export interface Notificacion {
    id: string
    empresa_id: string
    user_id: string
    tipo: TipoNotificacion
    titulo: string
    mensaje: string
    referencia_id: string | null
    referencia_tipo: string | null
    leida: boolean
    created_at: string
}

export interface NotificacionStore {
    notificaciones: Notificacion[]
    unreadCount: number
    isOpen: boolean

    setNotificaciones: (notificaciones: Notificacion[]) => void
    addNotificacion: (notificacion: Notificacion) => void
    markAsRead: (id: string) => void
    markAllAsRead: () => void
    removeNotificacion: (id: string) => void
    setIsOpen: (open: boolean) => void
    togglePanel: () => void
}
