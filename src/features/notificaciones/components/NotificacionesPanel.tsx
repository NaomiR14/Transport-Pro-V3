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
    ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNotificacionesStore } from '../store/notificaciones-store'
import {
    useNotificaciones,
    useMarkAsRead,
    useMarkAllAsRead,
    useDeleteNotificacion,
} from '../hooks/use-notificaciones'
import type { TipoNotificacion } from '../types/notificaciones.types'

const TIPO_CONFIG: Record<TipoNotificacion, {
    icon: React.ElementType
    iconColor: string
    iconBg: string
    label: string
}> = {
    orden_nueva:              { icon: Package,       iconColor: 'text-blue-600',   iconBg: 'bg-blue-50 dark:bg-blue-900/30',   label: 'Orden' },
    orden_estado:             { icon: Package,       iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 dark:bg-indigo-900/30', label: 'Estado' },
    mantenimiento_programado: { icon: Wrench,        iconColor: 'text-amber-600',  iconBg: 'bg-amber-50 dark:bg-amber-900/30',  label: 'Mantenimiento' },
    multa_nueva:              { icon: AlertTriangle, iconColor: 'text-red-600',    iconBg: 'bg-red-50 dark:bg-red-900/30',      label: 'Multa' },
    seguro_vencimiento:       { icon: Shield,        iconColor: 'text-orange-600', iconBg: 'bg-orange-50 dark:bg-orange-900/30',label: 'Seguro' },
    sistema:                  { icon: Info,          iconColor: 'text-slate-600',  iconBg: 'bg-slate-100 dark:bg-slate-800',    label: 'Sistema' },
}

const REFERENCIA_RUTAS: Record<string, string> = {
    ordenes:  '/ordenes',
    vehiculos: '/vehiculos',
    seguros:  '/seguros',
    multas:   '/multas',
}

function NotifSkeleton() {
    return (
        <div className="px-4 py-3 space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                    <div className="flex-1 space-y-2 py-0.5">
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export function NotificacionesPanel() {
    const router = useRouter()
    const panelRef = useRef<HTMLDivElement>(null)

    const { notificaciones, unreadCount, isOpen, setIsOpen } = useNotificacionesStore()
    const { isLoading } = useNotificaciones()
    const { mutate: markAsRead } = useMarkAsRead()
    const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead()
    const { mutate: deleteNotif } = useDeleteNotificacion()

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
            {/* Bell button */}
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Notificaciones"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className={cn("h-5 w-5 transition-all duration-200", unreadCount > 0 && "text-blue-600 dark:text-blue-400")} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </Button>

            {/* Dropdown panel */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 px-4 py-3.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                                    <Bell className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Notificaciones</p>
                                    <p className="text-[10px] text-slate-400">
                                        {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        disabled={isMarkingAll}
                                        className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-all"
                                        title="Marcar todas como leídas"
                                    >
                                        <CheckCheck className="h-3 w-3" />
                                        Leer todas
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="ml-1 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-all"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-h-[420px] overflow-y-auto">
                        {isLoading ? (
                            <NotifSkeleton />
                        ) : notificaciones.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 px-6 gap-3">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center ring-4 ring-slate-100 dark:ring-slate-800">
                                    <BellOff className="h-7 w-7 text-slate-400 dark:text-slate-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sin notificaciones</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Estás al día con todo</p>
                                </div>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {notificaciones.map((notif) => {
                                    const config = TIPO_CONFIG[notif.tipo] ?? TIPO_CONFIG.sistema
                                    const Icon = config.icon
                                    const isClickable = !!(notif.referencia_tipo && notif.referencia_id && REFERENCIA_RUTAS[notif.referencia_tipo])

                                    return (
                                        <div
                                            key={notif.id}
                                            className={cn(
                                                'flex gap-3 px-4 py-3.5 group transition-all duration-150 relative',
                                                !notif.leida && 'bg-blue-50/60 dark:bg-blue-950/20',
                                                isClickable && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60',
                                                !notif.leida && 'border-l-2 border-blue-500 dark:border-blue-400',
                                            )}
                                            onClick={() => handleNotificacionClick(notif.id, notif.referencia_tipo, notif.referencia_id)}
                                        >
                                            {/* Icon */}
                                            <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', config.iconBg)}>
                                                <Icon className={cn('h-4 w-4', config.iconColor)} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={cn(
                                                        'text-sm leading-snug',
                                                        !notif.leida
                                                            ? 'font-semibold text-slate-900 dark:text-white'
                                                            : 'font-medium text-slate-700 dark:text-slate-300'
                                                    )}>
                                                        {notif.titulo}
                                                    </p>
                                                    {!notif.leida && (
                                                        <span className="shrink-0 mt-1.5 h-2 w-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                                    {notif.mensaje}
                                                </p>
                                                <div className="flex items-center justify-between mt-1.5">
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                                                    </span>
                                                    {isClickable && (
                                                        <span className="text-[10px] text-blue-500 dark:text-blue-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Ver <ArrowRight className="h-2.5 w-2.5" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quick actions */}
                                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                                                {!notif.leida && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); markAsRead(notif.id) }}
                                                        title="Marcar como leída"
                                                        className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                    >
                                                        <Check className="h-3 w-3" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id) }}
                                                    title="Eliminar"
                                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notificaciones.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                                Mostrando las últimas {notificaciones.length} notificaciones
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
