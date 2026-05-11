'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth, usePermissions } from '@/features/auth'
import { useQueryClient } from '@tanstack/react-query'
import {
    useEstadoSuscripcion,
    useIniciarCheckout,
    useAbrirPortal,
    useFacturas,
    PLANES,
} from '@/features/pagos'
import type { EstadoSuscripcion, Factura } from '@/features/pagos'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import {
    Check, Crown, ExternalLink, Loader2,
    AlertCircle, CheckCircle2, FileText, Receipt,
} from 'lucide-react'

const PLAN_LABELS: Record<string, string> = {
    basico: 'Básico',
    profesional: 'Profesional',
    enterprise: 'Enterprise',
}

const INVOICE_STATUS: Record<string, { label: string; className: string }> = {
    paid:          { label: 'Pagada',    className: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400' },
    open:          { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400' },
    void:          { label: 'Anulada',   className: 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400' },
    uncollectible: { label: 'Incobrable',className: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400' },
    draft:         { label: 'Borrador',  className: 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400' },
}

function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(amount / 100)
}

// Handles redirect params from Stripe checkout and portal returns
function StripeRedirectHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const queryClient = useQueryClient()

    useEffect(() => {
        if (searchParams.get('success') === '1') {
            router.replace('/?activated=1')
            return
        }
        if (searchParams.get('canceled') === '1') {
            toast.info('Proceso de suscripción cancelado')
            router.replace('/configuracion/suscripcion')
            return
        }
        if (searchParams.get('portal_return') === '1') {
            // Invalidate so the page reflects any changes made in the portal
            queryClient.invalidateQueries({ queryKey: ['pagos', 'suscripcion'] })
            router.replace('/configuracion/suscripcion')
        }
    }, [])

    return null
}

// ── State A: plan selection ──────────────────────────────────────────────────

function PlanSelectionCard({ plan, isLoading, onSelect }: {
    plan: typeof PLANES[0]
    isLoading: boolean
    onSelect: (id: string) => void
}) {
    return (
        <div className={cn(
            'relative flex flex-col rounded-2xl border p-6 transition-all duration-200 bg-white dark:bg-slate-900',
            plan.destacado
                ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md',
        )}>
            {plan.destacado && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                        Más popular
                    </span>
                </div>
            )}

            <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.nombre}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{plan.descripcion}</p>
            </div>

            <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${plan.precio}</span>
                <span className="text-slate-400 ml-1 text-sm">/mes</span>
            </div>

            <ul className="space-y-2.5 mb-8 flex-1">
                {plan.caracteristicas.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        {c}
                    </li>
                ))}
            </ul>

            <Button
                className="w-full font-semibold"
                variant={plan.destacado ? 'default' : 'outline'}
                onClick={() => onSelect(plan.id)}
                disabled={isLoading}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Elegir plan
            </Button>
        </div>
    )
}

function SinSuscripcion({ onSelect, isLoading }: { onSelect: (id: string) => void; isLoading: boolean }) {
    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Elige tu plan</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Comienza hoy. Cancela cuando quieras.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PLANES.map((plan) => (
                    <PlanSelectionCard key={plan.id} plan={plan} isLoading={isLoading} onSelect={onSelect} />
                ))}
            </div>
        </div>
    )
}

// ── Shared invoices list ─────────────────────────────────────────────────────

function FacturasList({ facturas, isLoading }: { facturas?: Factura[]; isLoading: boolean }) {
    if (isLoading) {
        return (
            <div className="space-y-2 mt-4">
                {[1, 2].map((i) => (
                    <div key={i} className="h-11 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        )
    }
    if (!facturas?.length) {
        return <p className="text-sm text-slate-400 mt-3">No hay facturas aún.</p>
    }
    return (
        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {facturas.map((f) => {
                const status = INVOICE_STATUS[f.status] ?? INVOICE_STATUS.open
                return (
                    <div key={f.id} className="flex items-center justify-between py-3 text-sm">
                        <div className="flex items-center gap-3 min-w-0">
                            <Receipt className="h-4 w-4 text-slate-400 shrink-0" />
                            <span className="font-mono text-slate-700 dark:text-slate-300 truncate">
                                {f.number ?? f.id.slice(0, 14)}
                            </span>
                            <span className="text-slate-400 text-xs hidden sm:inline shrink-0">
                                {format(new Date(f.period_start * 1000), 'MMM yyyy', { locale: es })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="font-semibold text-slate-900 dark:text-white">
                                {formatAmount(f.amount_paid, f.currency)}
                            </span>
                            <Badge variant="outline" className={cn('text-xs', status.className)}>
                                {status.label}
                            </Badge>
                            {f.hosted_invoice_url && (
                                <a href={f.hosted_invoice_url} target="_blank" rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-blue-600 transition-colors" title="Ver factura">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}
                            {f.invoice_pdf && (
                                <a href={f.invoice_pdf} target="_blank" rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-blue-600 transition-colors" title="Descargar PDF">
                                    <FileText className="h-3.5 w-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// ── State B: active subscription ─────────────────────────────────────────────

function SuscripcionActiva({ suscripcion, onCancel, isLoadingCancel, facturas, isLoadingFacturas }: {
    suscripcion: EstadoSuscripcion
    onCancel: () => void
    isLoadingCancel: boolean
    facturas?: Factura[]
    isLoadingFacturas: boolean
}) {
    const fechaFin = suscripcion.plan_fecha_fin
        ? format(new Date(suscripcion.plan_fecha_fin), "d 'de' MMMM 'de' yyyy", { locale: es })
        : null

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Plan info */}
            <Card>
                <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0">
                            <Crown className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Plan {PLAN_LABELS[suscripcion.plan] ?? suscripcion.plan}
                                </h2>
                                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Activo
                                </Badge>
                            </div>
                            {fechaFin && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Próxima renovación: <span className="font-medium text-slate-700 dark:text-slate-300">{fechaFin}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Facturas */}
            <Card>
                <CardContent className="pt-5 pb-5">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Facturas
                    </h3>
                    <FacturasList facturas={facturas} isLoading={isLoadingFacturas} />
                </CardContent>
            </Card>

            {/* Cancel */}
            <Card className="border-red-100 dark:border-red-900/30">
                <CardContent className="pt-5 pb-5">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Cancelar suscripción
                            </p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Tu acceso continúa hasta el final del período actual. Después podrás elegir un nuevo plan.
                            </p>
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
                            onClick={onCancel}
                            disabled={isLoadingCancel}
                        >
                            {isLoadingCancel
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                                : <ExternalLink className="h-3.5 w-3.5 mr-1.5" />}
                            Cancelar
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// ── State C: cancelled but within paid period ────────────────────────────────

function SuscripcionCancelada({ suscripcion, facturas, isLoadingFacturas }: {
    suscripcion: EstadoSuscripcion
    facturas?: Factura[]
    isLoadingFacturas: boolean
}) {
    const fechaFin = suscripcion.plan_fecha_fin
        ? format(new Date(suscripcion.plan_fecha_fin), "d 'de' MMMM 'de' yyyy", { locale: es })
        : null

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <Card className="border-amber-200 dark:border-amber-900/40">
                <CardContent className="pt-6 pb-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 shrink-0">
                            <AlertCircle className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Plan {PLAN_LABELS[suscripcion.plan] ?? suscripcion.plan}
                                </h2>
                                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/20 dark:text-amber-400">
                                    Cancelado
                                </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Tu acceso continúa hasta el{' '}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">{fechaFin ?? '—'}</span>.
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                                Después de esa fecha podrás elegir un nuevo plan.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-5 pb-5">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Facturas
                    </h3>
                    <FacturasList facturas={facturas} isLoading={isLoadingFacturas} />
                </CardContent>
            </Card>
        </div>
    )
}

// ── Loading skeleton ─────────────────────────────────────────────────────────

function Skeleton() {
    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <div className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-36 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
    )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SuscripcionPage() {
    const router = useRouter()
    const { profile } = useAuth()
    const { role } = usePermissions()
    const isAdmin = role === 'admin'

    const { data: suscripcion, isLoading } = useEstadoSuscripcion({ enabled: isAdmin })
    const { mutate: iniciarCheckout, isPending: checkoutPending } = useIniciarCheckout()
    const { mutate: abrirPortal, isPending: portalPending } = useAbrirPortal()
    const { data: facturas, isLoading: loadingFacturas } = useFacturas()

    useEffect(() => {
        if (role && !isAdmin) router.replace('/')
    }, [role, isAdmin, router])

    if (!isAdmin) return null

    const planActivo = suscripcion?.plan_activo ?? false
    const planCancelado = suscripcion?.plan_cancelado ?? false
    const isCancelledInPeriod = planActivo && planCancelado

    const pageTitle = planActivo
        ? { icon: <Crown className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50 dark:bg-blue-900/20' }
        : isCancelledInPeriod
        ? { icon: <Crown className="h-5 w-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-900/20' }
        : null

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Suspense fallback={null}>
                <StripeRedirectHandler />
            </Suspense>

            {/* Header — only for active/cancelled states */}
            {pageTitle && (
                <div className="mb-6 flex items-center gap-3">
                    <div className={cn('p-2 rounded-xl', pageTitle.bg)}>
                        {pageTitle.icon}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Mi Suscripción</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Gestiona tu plan y facturación</p>
                    </div>
                </div>
            )}

            {isLoading ? (
                <Skeleton />
            ) : planActivo ? (
                <SuscripcionActiva
                    suscripcion={suscripcion!}
                    onCancel={() => abrirPortal()}
                    isLoadingCancel={portalPending}
                    facturas={facturas}
                    isLoadingFacturas={loadingFacturas}
                />
            ) : isCancelledInPeriod ? (
                <SuscripcionCancelada
                    suscripcion={suscripcion!}
                    facturas={facturas}
                    isLoadingFacturas={loadingFacturas}
                />
            ) : (
                <SinSuscripcion
                    onSelect={(plan) => iniciarCheckout(plan)}
                    isLoading={checkoutPending}
                />
            )}
        </div>
    )
}
