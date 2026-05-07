'use client'

import { Check, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { PlanConfig, PlanTipo } from '../types/pagos.types'

interface PlanCardProps {
    plan: PlanConfig
    planActual: PlanTipo | null
    isPlanActivo: boolean
    onSuscribirse: (plan: PlanTipo) => void
    isLoading: boolean
}

export function PlanCard({ plan, planActual, isPlanActivo, onSuscribirse, isLoading }: PlanCardProps) {
    const esPlanActual = planActual === plan.id && isPlanActivo

    return (
        <div className={[
            'relative flex flex-col rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md',
            plan.destacado
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900',
        ].join(' ')}>
            {plan.destacado && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-3 py-0.5 flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Más popular
                    </Badge>
                </div>
            )}

            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{plan.nombre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{plan.descripcion}</p>
            </div>

            <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">${plan.precio}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm"> / mes</span>
            </div>

            <ul className="space-y-2 mb-8 flex-1">
                {plan.caracteristicas.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {c}
                    </li>
                ))}
            </ul>

            {esPlanActual ? (
                <Button disabled variant="outline" className="w-full">
                    Plan actual
                </Button>
            ) : (
                <Button
                    onClick={() => onSuscribirse(plan.id)}
                    disabled={isLoading}
                    className={plan.destacado
                        ? 'w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        : 'w-full'
                    }
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {planActual && isPlanActivo ? 'Cambiar plan' : 'Comenzar'}
                </Button>
            )}
        </div>
    )
}
