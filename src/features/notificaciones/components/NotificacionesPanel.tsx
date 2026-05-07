'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Bell,
    BellOff,
    Check,
    CheckCheck,
    Package,
    Wrench,
    AlertTriangle,
    Shield,
    Info,
    Trash2,
    X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNotificacionesStore } from '../store/notificaciones-store'
import {
    useNotificaciones,
    useMarkAsRead,
    useMarkAllAsRead,
    useDeleteNotificacion,
} from '../hooks/use-notificaciones'
import type { TipoNotificacion } from '../types/notificaciones.types'

const TIPO_CONFIG: Record<TipoNotificacion, { icon: React.ElementType; color: string }> = {
    orden_nueva:              { icon: Package,       color: 'text-blue-500' },
    orden_estado:             { icon: Package,       color: 'text-indigo-500' },
    mantenimiento_programado: { icon: Wrench,        color: 'text-yellow-500' },
    multa_nueva:              { icon: AlertTriangle, color: 'text-red-500' },
    seguro_vencimiento:       { icon: Shield,        color: 'text-orange-500' },
    sistema:                  { icon: Info,          color: 'text-slate-500' },
}

const REFERENCIA_RUTAS: Record<string, string> = {
    ordenes:  '/ordenes',
    vehiculos: '/vehiculos',
    seguros:  '/seguros',
    multas:   '/multas',
}

export function NotificacionesPanel() {
    const router = useRouter()
    const panelRef = useRef<HTMLDivElement>(null)

    const { notificaciones, unreadCount, isOpen, setIsOpen } = useNotificacionesStore()
    const { isLoading } = useNotificaciones()
    const { mutate: markAsRead } = useMarkAsRead()
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead()
    const { mutate: deleteNotif } = useDeleteNotificacion()

    // Cerrar al hacer click fuera del panel
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [setIsOpen])

    const handleNotificacionClick = (id: string, referencia_tipo: string | null, referencia_id: string | null) => {
        markAsRead(id)
        if (referencia_tipo && referencia_id && REFERENCIA_RUTAS[referencia_tipo]) {
            setIsOpen(false)
            router.push(REFERENCIA_RUTAS[referencia_tipo])
        }
    }

    return (
        <div className="relative" ref={panelRef}>
            {/* Botón campana */}
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                aria-label="Notificaciones"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px] border-0">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Button>

            {/* Panel dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* Header del panel */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                            <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                Notificaciones
                            </span>
                            {unreadCount > 0 && (
                                <Badge variant="outline" className="text-xs h-5 px-1.5 bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                                    {unreadCount} nuevas
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                    onClick={() => markAllAsRead()}
                                    disabled={isMarkingAll}
                                    title="Marcar todas como leídas"
                                >
                                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                                    Leer todas
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                                Cargando...
                            </div>
                        ) : notificaciones.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                                <BellOff className="h-8 w-8 opacity-40" />
                                <p className="text-sm">Sin notificaciones</p>
                            </div>
                        ) : (
                            notificaciones.map((notif) => {
                                const config = TIPO_CONFIG[notif.tipo] ?? TIPO_CONFIG.sistema
                                const Icon = config.icon
                                const isClickable = !!(notif.referencia_tipo && notif.referencia_id && REFERENCIA_RUTAS[notif.referencia_tipo])

                                return (
                                    <div
                                        key={notif.id}
                                        className={[
                                            'flex gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0 group',
                                            !notif.leida ? 'bg-blue-50/50 dark:bg-blue-900/10' : '',
                                            isClickable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60' : '',
                                        ].join(' ')}
                                        onClick={() => handleNotificacionClick(notif.id, notif.referencia_tipo, notif.referencia_id)}
                                    >
                                        {/* Icono tipo */}
                                        <div className={`mt-0.5 shrink-0 ${config.color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm leading-snug truncate ${!notif.leida ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {notif.titulo}
                                                </p>
                                                {!notif.leida && (
                                                    <span className="mt-1 shrink-0 h-2 w-2 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                                {notif.mensaje}
                                            </p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                                {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                                            </p>
                                        </div>

                                        {/* Acciones rápidas (visibles en hover) */}
                                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            {!notif.leida && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); markAsRead(notif.id) }}
                                                    title="Marcar como leída"
                                                    className="text-slate-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id) }}
                                                title="Eliminar"
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
