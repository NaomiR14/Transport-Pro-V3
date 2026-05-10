import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Notificacion, NotificacionStore } from '../types/notificaciones.types'

export const useNotificacionesStore = create<NotificacionStore>()(
    devtools(
        immer((set) => ({
            notificaciones: [],
            unreadCount: 0,
            isOpen: false,

            setNotificaciones: (notificaciones: Notificacion[]) =>
                set((state) => {
                    state.notificaciones = notificaciones
                    state.unreadCount = notificaciones.filter((n) => !n.leida).length
                }),

            addNotificacion: (notificacion: Notificacion) =>
                set((state) => {
                    // Evitar duplicados si Realtime entrega el mismo evento dos veces
                    const exists = state.notificaciones.some((n) => n.id === notificacion.id)
                    if (!exists) {
                        state.notificaciones.unshift(notificacion)
                        if (!notificacion.leida) {
                            state.unreadCount += 1
                        }
                    }
                }),

            markAsRead: (id: string) =>
                set((state) => {
                    const notif = state.notificaciones.find((n) => n.id === id)
                    if (notif && !notif.leida) {
                        notif.leida = true
                        state.unreadCount = Math.max(0, state.unreadCount - 1)
                    }
                }),

            markAllAsRead: () =>
                set((state) => {
                    state.notificaciones.forEach((n) => { n.leida = true })
                    state.unreadCount = 0
                }),

            removeNotificacion: (id: string) =>
                set((state) => {
                    const notif = state.notificaciones.find((n) => n.id === id)
                    if (notif && !notif.leida) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1)
                    }
                    state.notificaciones = state.notificaciones.filter((n) => n.id !== id)
                }),

            setIsOpen: (open: boolean) =>
                set((state) => { state.isOpen = open }),

            togglePanel: () =>
                set((state) => { state.isOpen = !state.isOpen }),
        })),
        { name: 'notificaciones-store' }
    )
)
