'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
    PLANES,
    PlanCard,
    EstadoSuscripcionCard,
    useEstadoSuscripcion,
    useIniciarCheckout,
} from '@/features/pagos'
import type { PlanTipo } from '@/features/pagos'

export default function PlanesPage() {
    const searchParams = useSearchParams()
    const { data: estado, isLoading } = useEstadoSuscripcion()
    const { mutate: iniciarCheckout, isPending } = useIniciarCheckout()

    useEffect(() => {
        if (searchParams.get('success') === '1') {
            toast.success(`¡Suscripción activada! Bienvenido al plan ${searchParams.get('plan') ?? ''}.`)
        }
        if (searchParams.get('canceled') === '1') {
            toast.info('Pago cancelado. Puedes intentarlo de nuevo cuando quieras.')
        }
    }, [searchParams])

    const handleSuscribirse = (plan: PlanTipo) => {
        iniciarCheckout(plan)
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Planes y precios</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Elige el plan que mejor se adapte al tamaño de tu flota
                </p>
            </div>

            {/* Estado de suscripción actual */}
            {isLoading ? (
                <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
            ) : estado ? (
                <EstadoSuscripcionCard estado={estado} />
            ) : null}

            {/* Grilla de planes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {PLANES.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        planActual={estado?.plan ?? null}
                        isPlanActivo={estado?.plan_activo ?? false}
                        onSuscribirse={handleSuscribirse}
                        isLoading={isPending}
                    />
                ))}
            </div>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
                Los precios se cobran mensualmente. Puedes cancelar en cualquier momento desde el portal de facturación.
            </p>
        </div>
    )
}
