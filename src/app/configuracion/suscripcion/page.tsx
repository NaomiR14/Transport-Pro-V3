'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/features/auth'
import { usePermissions } from '@/features/auth'
import {
    useEstadoSuscripcion,
    useIniciarCheckout,
    useAbrirPortal,
    useFacturas,
    PLANES,
    PlanCard,
} from '@/features/pagos'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Crown,
    CreditCard,
    Receipt,
    LayoutDashboard,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    FileText,
    Loader2,
    Lock,
    ShieldCheck,
} from 'lucide-react'

const PLAN_COLORS: Record<string, string> = {
    basico: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
    profesional: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300',
    enterprise: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300',
}

const PLAN_LABELS: Record<string, string> = {
    basico: 'Básico',
    profesional: 'Profesional',
    enterprise: 'Enterprise',
}

const INVOICE_STATUS: Record<string, { label: string; className: string }> = {
    paid: { label: 'Pagada', className: 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400' },
    open: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400' },
    void: { label: 'Anulada', className: 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400' },
    uncollectible: { label: 'Incobrable', className: 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400' },
    draft: { label: 'Borrador', className: 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-800 dark:text-slate-400' },
}

function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
    }).format(amount / 100)
}

function SearchParamsHandler() {
    const searchParams = useSearchParams()

    useEffect(() => {
        const plan = searchParams.get('plan')
        if (searchParams.get('success') === '1') {
            toast.success(
                plan
                    ? `¡Suscripción al plan ${PLAN_LABELS[plan] ?? plan} activada con éxito!`
                    : '¡Suscripción activada con éxito!'
            )
        }
        if (searchParams.get('canceled') === '1') {
            toast.info('Proceso de suscripción cancelado')
        }
    }, [])

    return null
}

function PlanSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
                <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            </div>
        </div>
    )
}

export default function SuscripcionPage() {
    const router = useRouter()
    const { profile } = useAuth()
    const { role } = usePermissions()

    const isAdmin = role === 'admin'

    const { data: suscripcion, isLoading: loadingEstado } = useEstadoSuscripcion({ enabled: isAdmin })
    const { mutate: iniciarCheckout, isPending: checkoutPending } = useIniciarCheckout()
    const { mutate: abrirPortal, isPending: portalPending } = useAbrirPortal()
    const { data: facturas, isLoading: loadingFacturas } = useFacturas()

    useEffect(() => {
        if (role && !isAdmin) {
            router.replace('/')
        }
    }, [role, isAdmin, router])

    if (!isAdmin) return null

    const fechaInicio = suscripcion?.plan_fecha_inicio
        ? format(new Date(suscripcion.plan_fecha_inicio), "d 'de' MMMM, yyyy", { locale: es })
        : null
    const fechaFin = suscripcion?.plan_fecha_fin
        ? format(new Date(suscripcion.plan_fecha_fin), "d 'de' MMMM, yyyy", { locale: es })
        : null

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Suspense fallback={null}>
                <SearchParamsHandler />
            </Suspense>

            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <Crown className="h-5 w-5 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mi Suscripción</h1>
                </div>
                <p className="text-slate-500 dark:text-slate-400 ml-11 text-sm">
                    Gestiona tu plan, método de pago y facturas
                </p>
            </div>

            <Tabs defaultValue="plan">
                <TabsList className="mb-6 h-auto flex-wrap gap-1">
                    <TabsTrigger value="plan" className="gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Plan actual
                    </TabsTrigger>
                    <TabsTrigger value="cambiar" className="gap-2">
                        <Crown className="h-4 w-4" />
                        Cambiar plan
                    </TabsTrigger>
                    <TabsTrigger value="pago" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        Método de pago
                    </TabsTrigger>
                    <TabsTrigger value="facturas" className="gap-2">
                        <Receipt className="h-4 w-4" />
                        Facturas
                    </TabsTrigger>
                </TabsList>

                {/* ── Tab: Plan actual ── */}
                <TabsContent value="plan">
                    {loadingEstado ? (
                        <PlanSkeleton />
                    ) : suscripcion ? (
                        <div className="space-y-4">
                            <Card>
                                <CardContent className="pt-6 pb-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 shrink-0">
                                                <CreditCard className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Plan activo</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="outline"
                                                        className={PLAN_COLORS[suscripcion.plan] ?? PLAN_COLORS.basico}
                                                    >
                                                        {PLAN_LABELS[suscripcion.plan] ?? suscripcion.plan}
                                                    </Badge>
                                                    {suscripcion.plan_activo ? (
                                                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-1">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Activo
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-1">
                                                            <AlertCircle className="h-3 w-3" />
                                                            Inactivo
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {suscripcion.stripe_subscription_id && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => abrirPortal()}
                                                disabled={portalPending}
                                                className="shrink-0"
                                            >
                                                {portalPending ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                                                ) : (
                                                    <ExternalLink className="h-4 w-4 mr-1.5" />
                                                )}
                                                Portal de Stripe
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="pt-5 pb-5">
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                                            Inicio del plan
                                        </p>
                                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                                            {fechaInicio ?? '—'}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-5 pb-5">
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">
                                            {suscripcion.plan_activo ? 'Próxima renovación' : 'Venció el'}
                                        </p>
                                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                                            {fechaFin ?? '—'}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-14 text-center">
                                <Crown className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400 mb-4">
                                    No tienes una suscripción activa
                                </p>
                                <Button onClick={() => router.push('/planes')}>
                                    Ver planes disponibles
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* ── Tab: Cambiar plan ── */}
                <TabsContent value="cambiar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PLANES.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                planActual={suscripcion?.plan ?? null}
                                isPlanActivo={suscripcion?.plan_activo ?? false}
                                onSuscribirse={(id) => iniciarCheckout(id)}
                                isLoading={checkoutPending}
                            />
                        ))}
                    </div>
                </TabsContent>

                {/* ── Tab: Método de pago ── */}
                <TabsContent value="pago">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ShieldCheck className="h-5 w-5 text-green-500" />
                                Pago gestionado de forma segura por Stripe
                            </CardTitle>
                            <CardDescription>
                                Tu información de pago está cifrada y protegida. Nunca almacenamos los datos de tu tarjeta en nuestros servidores.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <Lock className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Desde el portal de Stripe puedes actualizar tu tarjeta, cambiar el método de pago y descargar recibos de pago de forma segura.
                                </p>
                            </div>
                            <div>
                                <Button
                                    onClick={() => abrirPortal()}
                                    disabled={portalPending || !suscripcion?.stripe_subscription_id}
                                    className="gap-2"
                                >
                                    {portalPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <ExternalLink className="h-4 w-4" />
                                    )}
                                    Gestionar método de pago en Stripe
                                </Button>
                                {!suscripcion?.stripe_subscription_id && (
                                    <p className="text-xs text-slate-400 mt-2">
                                        Activa una suscripción para gestionar tu método de pago.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ── Tab: Facturas ── */}
                <TabsContent value="facturas">
                    {loadingFacturas ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            ))}
                        </div>
                    ) : !facturas?.length ? (
                        <Card>
                            <CardContent className="py-14 text-center">
                                <Receipt className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">No hay facturas aún</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="overflow-hidden">
                            {/* Table header */}
                            <div className="grid grid-cols-[1fr_1fr_120px_110px_80px] gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                <span>Factura</span>
                                <span>Período</span>
                                <span>Monto</span>
                                <span>Estado</span>
                                <span className="text-right">Ver</span>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {facturas.map((factura) => {
                                    const status = INVOICE_STATUS[factura.status] ?? INVOICE_STATUS.open
                                    return (
                                        <div
                                            key={factura.id}
                                            className="grid grid-cols-[1fr_1fr_120px_110px_80px] gap-4 items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                                        >
                                            <span className="text-sm font-mono font-medium text-slate-900 dark:text-white truncate">
                                                {factura.number ?? factura.id.slice(0, 14)}
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                                {format(new Date(factura.period_start * 1000), 'MMM yyyy', { locale: es })}
                                                {' – '}
                                                {format(new Date(factura.period_end * 1000), 'MMM yyyy', { locale: es })}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                {formatAmount(factura.amount_paid, factura.currency)}
                                            </span>
                                            <Badge variant="outline" className={status.className}>
                                                {status.label}
                                            </Badge>
                                            <div className="flex items-center justify-end gap-1">
                                                {factura.hosted_invoice_url && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <a href={factura.hosted_invoice_url} target="_blank" rel="noopener noreferrer" title="Ver factura">
                                                            <ExternalLink className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {factura.invoice_pdf && (
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                                        <a href={factura.invoice_pdf} target="_blank" rel="noopener noreferrer" title="Descargar PDF">
                                                            <FileText className="h-3.5 w-3.5" />
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
