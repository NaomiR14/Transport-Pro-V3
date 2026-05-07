'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { NotificacionesService } from '../services/notificaciones-service'
import { useNotificacionesStore } from '../store/notificaciones-store'
import type { Notificacion } from '../types/notificaciones.types'

export { useNotificacionesStore } from '../store/notificaciones-store'

const QUERY_KEYS = {
    notificaciones: ['notificaciones'] as const,
    list: () => [...QUERY_KEYS.notificaciones, 'list'] as const,
    unread: () => [...QUERY_KEYS.notificaciones, 'unread'] as const,
}

export function useNotificaciones() {
    return useQuery({
        queryKey: QUERY_KEYS.list(),
        queryFn: () => NotificacionesService.getNotificaciones(),
    })
}

/** Suscripción Realtime: escucha INSERTs en la tabla del usuario autenticado */
export function useNotificacionesRealtime(userId: string | undefined) {
    const { addNotificacion } = useNotificacionesStore()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!userId) return

        const supabase = createClient()

        const channel = supabase
            .channel(`notificaciones:user:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notificaciones',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    const nueva = payload.new as Notificacion
                    addNotificacion(nueva)
                    queryClient.setQueryData(
                        QUERY_KEYS.list(),
                        (old: Notificacion[] = []) =>
                            old.some(n => n.id === nueva.id) ? old : [nueva, ...old]
                    )
                    toast(nueva.titulo, {
                        description: nueva.mensaje,
                        duration: 5000,
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, addNotificacion, queryClient])
}

/** Marca una notificación como leída */
export function useMarkAsRead() {
    const { markAsRead } = useNotificacionesStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => NotificacionesService.markAsRead(id),
        onMutate: (id) => {
            markAsRead(id)
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones })
        },
    })
}

/** Marca todas las notificaciones como leídas */
export function useMarkAllAsRead() {
    const { markAllAsRead } = useNotificacionesStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => NotificacionesService.markAllAsRead(),
        onMutate: () => {
            markAllAsRead()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones })
            toast.success('Todas las notificaciones marcadas como leídas')
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones })
            toast.error('Error al marcar notificaciones')
        },
    })
}

/** Elimina una notificación */
export function useDeleteNotificacion() {
    const { removeNotificacion } = useNotificacionesStore()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => NotificacionesService.deleteNotificacion(id),
        onMutate: (id) => {
            removeNotificacion(id)
        },
        onError: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notificaciones })
        },
    })
}
