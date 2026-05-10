-- =====================================================
-- Agrega campos de Stripe a la tabla empresas
-- =====================================================

ALTER TABLE empresas
    ADD COLUMN IF NOT EXISTS stripe_customer_id      TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS stripe_subscription_id  TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS plan_activo             BOOLEAN     DEFAULT false,
    ADD COLUMN IF NOT EXISTS plan_fecha_inicio       TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS plan_fecha_fin          TIMESTAMPTZ;

-- Índice para buscar por customer y subscription
CREATE INDEX IF NOT EXISTS idx_empresas_stripe_customer ON empresas(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_empresas_stripe_sub     ON empresas(stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;

-- Función RPC (SECURITY DEFINER) usada por el webhook server-side
-- Recibe el customer_id de Stripe y actualiza el estado de suscripción
CREATE OR REPLACE FUNCTION actualizar_suscripcion_empresa(
    p_customer_id     TEXT,
    p_subscription_id TEXT,
    p_plan            TEXT,
    p_activo          BOOLEAN,
    p_fecha_inicio    TIMESTAMPTZ DEFAULT NULL,
    p_fecha_fin       TIMESTAMPTZ DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE empresas
    SET
        stripe_subscription_id = p_subscription_id,
        plan                   = p_plan,
        plan_activo            = p_activo,
        plan_fecha_inicio      = p_fecha_inicio,
        plan_fecha_fin         = p_fecha_fin,
        updated_at             = now()
    WHERE stripe_customer_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
