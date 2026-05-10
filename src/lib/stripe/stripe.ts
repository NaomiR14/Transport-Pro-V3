import Stripe from 'stripe'

// Singleton server-side — solo importar en Server Components o API Routes
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia',
})

export const PLAN_PRICE_IDS: Record<string, string> = {
    basico:       process.env.STRIPE_PRICE_BASICO!,
    profesional:  process.env.STRIPE_PRICE_PROFESIONAL!,
    enterprise:   process.env.STRIPE_PRICE_ENTERPRISE!,
}

export const PLAN_NAMES: Record<string, string> = {
    basico:      'Básico',
    profesional: 'Profesional',
    enterprise:  'Enterprise',
}
