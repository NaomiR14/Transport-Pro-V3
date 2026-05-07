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

    if (plan.destacado) {
        return (
            <div className="relative flex flex-col rounded-3xl p-8 shadow-2xl shadow-blue-300/40 dark:shadow-blue-900/40 scale-105 bg-gradient-to-b from-blue-600 to-blue-700 text-white">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md">
                        <Star className="h-3 w-3 fill-amber-900" />
                        Más popular
                    </span>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white">{plan.nombre}</h3>
                    <p className="text-sm text-blue-200 mt-0.5">{plan.descripcion}</p>
                </div>

                <div className="mb-6">
                    <span className="text-5xl font-extrabold text-white">${plan.precio}</span>
                    <span className="text-blue-200 text-sm ml-1"> / mes</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                    {plan.caracteristicas.map((c) => (
                        <li key={c} className="flex items-start gap-2.5 text-sm text-blue-100">
                            <Check className="h-4 w-4 text-blue-200 mt-0.5 shrink-0" />
                            {c}
                        </li>
                    ))}
                </ul>

                {esPlanActual ? (
                    <Button disabled className="w-full bg-white/20 text-white border-white/30 hover:bg-white/20 rounded-2xl">
                        Plan actual
                    </Button>
                ) : (
                    <Button
                        onClick={() => onSuscribirse(plan.id)}
                        disabled={isLoading}
                        className="w-full bg-white text-blue-700 hover:bg-blue-50 shadow-md rounded-2xl font-semibold py-3"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {planActual && isPlanActivo ? 'Cambiar plan' : 'Comenzar'}
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className="relative flex flex-col rounded-3xl border border-gray-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.nombre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{plan.descripcion}</p>
            </div>

            <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${plan.precio}</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm ml-1"> / mes</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
                {plan.caracteristicas.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                        {c}
                    </li>
                ))}
            </ul>

            {esPlanActual ? (
                <Button disabled variant="outline" className="w-full rounded-2xl">
                    Plan actual
                </Button>
            ) : (
                <Button
                    onClick={() => onSuscribirse(plan.id)}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-lg hover:shadow-blue-500/20 rounded-2xl font-semibold py-3 transition-all"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {planActual && isPlanActivo ? 'Cambiar plan' : 'Comenzar'}
                </Button>
            )}
        </div>
    )
}
