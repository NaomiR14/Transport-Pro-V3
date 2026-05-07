export type PlanTipo = 'basico' | 'profesional' | 'enterprise'

export interface Factura {
    id: string
    number: string | null
    amount_paid: number
    currency: string
    status: 'paid' | 'open' | 'void' | 'uncollectible' | 'draft'
    created: number
    invoice_pdf: string | null
    hosted_invoice_url: string | null
    period_start: number
    period_end: number
}

export interface PlanConfig {
    id: PlanTipo
    nombre: string
    precio: number
    descripcion: string
    caracteristicas: string[]
    destacado?: boolean
}

export interface EstadoSuscripcion {
    plan: PlanTipo
    plan_activo: boolean
    plan_fecha_inicio: string | null
    plan_fecha_fin: string | null
    stripe_subscription_id: string | null
}

export const PLANES: PlanConfig[] = [
    {
        id: 'basico',
        nombre: 'Básico',
        precio: 49,
        descripcion: 'Ideal para flotas pequeñas',
        caracteristicas: [
            'Hasta 10 vehículos',
            'Acceso a módulos principales',
            'Reportes básicos',
        ],
    },
    {
        id: 'profesional',
        nombre: 'Profesional',
        precio: 99,
        descripcion: 'Para empresas en crecimiento',
        caracteristicas: [
            'Hasta 50 vehículos',
            'Todo lo del plan Básico',
            'Flujo de caja',
            'Notificaciones en tiempo real',
        ],
        destacado: true,
    },
    {
        id: 'enterprise',
        nombre: 'Enterprise',
        precio: 199,
        descripcion: 'Solución completa para grandes flotas',
        caracteristicas: [
            'Vehículos ilimitados',
            'Todo lo del plan Profesional',
            'Onboarding personalizado',
            'Soporte prioritario',
        ],
    },
]
