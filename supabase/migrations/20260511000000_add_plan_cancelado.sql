-- Agrega campo para rastrear suscripciones canceladas al final del período
ALTER TABLE empresas ADD COLUMN IF NOT EXISTS plan_cancelado BOOLEAN DEFAULT false;

-- Actualiza el RPC para incluir plan_cancelado
CREATE OR REPLACE FUNCTION actualizar_suscripcion_empresa(
    p_customer_id     TEXT,
    p_subscription_id TEXT,
    p_plan            TEXT,
    p_activo          BOOLEAN,
    p_cancelado       BOOLEAN DEFAULT false,
    p_fecha_inicio    TIMESTAMPTZ DEFAULT NULL,
    p_fecha_fin       TIMESTAMPTZ DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE empresas
    SET
        stripe_subscription_id = p_subscription_id,
        plan                   = p_plan,
        plan_activo            = p_activo,
        plan_cancelado         = p_cancelado,
        plan_fecha_inicio      = p_fecha_inicio,
        plan_fecha_fin         = p_fecha_fin,
        updated_at             = now()
    WHERE stripe_customer_id = p_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
