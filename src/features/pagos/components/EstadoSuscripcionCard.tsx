'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { EstadoSuscripcion } from '../types/pagos.types'

const PLAN_BADGE: Record<string, string> = {
    basico:      'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
    profesional: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
    enterprise:  'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300',
}

const PLAN_LABEL: Record<string, string> = {
    basico: 'Básico', profesional: 'Profesional', enterprise: 'Enterprise',
}

interface Props {
    estado: EstadoSuscripcion
}

export function EstadoSuscripcionCard({ estado }: Props) {
    const fechaFin = estado.plan_fecha_fin
        ? format(new Date(estado.plan_fecha_fin), "d 'de' MMMM, yyyy", { locale: es })
        : null

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 flex items-start gap-4">
            <div className="flex items-center gap-4">
                <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Suscripción actual</p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={PLAN_BADGE[estado.plan] ?? PLAN_BADGE.basico}>
                            {PLAN_LABEL[estado.plan] ?? estado.plan}
                        </Badge>
                        {estado.plan_activo ? (
                            <Badge className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400" variant="outline">
                                Activa
                            </Badge>
                        ) : (
                            <Badge className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400" variant="outline">
                                Inactiva
                            </Badge>
                        )}
                    </div>
                    {fechaFin && (
                        <p className="text-xs text-slate-400 mt-1">
                            {estado.plan_activo ? 'Renueva el' : 'Venció el'}: {fechaFin}
                        </p>
                    )}
                </div>
            </div>

        </div>
    )
}
