-- =====================================================
-- Códigos de descuento para usuarios beta
-- =====================================================
-- Flujo:
--   1. Empresa se registra → ingresa un código en el form
--   2. /api/validate-discount verifica el código (esta tabla)
--   3. Si es válido, el precio en Stripe se ajusta via coupon
--      o bien se activa plan_activo directamente para acceso
--      gratuito durante el período del código
-- =====================================================

-- Tabla principal de códigos
CREATE TABLE codigos_descuento (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo              TEXT NOT NULL UNIQUE,
    descripcion         TEXT NOT NULL,
    tipo                TEXT NOT NULL CHECK (tipo IN ('porcentaje', 'monto_fijo', 'meses_gratis')),
    valor               NUMERIC(10, 2) NOT NULL,  -- % / monto COP / nro meses
    max_usos            INTEGER DEFAULT 1,         -- NULL = ilimitado
    usos_actuales       INTEGER DEFAULT 0,
    stripe_coupon_id    TEXT,                      -- ID del cupón en Stripe (opcional)
    activo              BOOLEAN DEFAULT true,
    fecha_expiracion    TIMESTAMPTZ,               -- NULL = sin expiración
    created_at          TIMESTAMPTZ DEFAULT now(),
    updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Tabla de redenciones: una empresa solo puede usar un código una vez
CREATE TABLE redenciones_descuento (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_id       UUID NOT NULL REFERENCES codigos_descuento(id),
    empresa_id      UUID NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    redimido_en     TIMESTAMPTZ DEFAULT now(),
    stripe_invoice  TEXT,    -- invoice/subscription ID donde se aplicó
    UNIQUE(codigo_id, empresa_id)
);

-- Índices
CREATE INDEX idx_codigos_descuento_codigo  ON codigos_descuento(codigo);
CREATE INDEX idx_codigos_descuento_activo  ON codigos_descuento(activo) WHERE activo = true;
CREATE INDEX idx_redenciones_empresa       ON redenciones_descuento(empresa_id);

-- Trigger updated_at
CREATE TRIGGER update_codigos_descuento_updated_at
    BEFORE UPDATE ON codigos_descuento
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS: solo service_role lee/escribe (se accede desde API routes server-side)
ALTER TABLE codigos_descuento    ENABLE ROW LEVEL SECURITY;
ALTER TABLE redenciones_descuento ENABLE ROW LEVEL SECURITY;

-- No hay políticas para authenticated: estas tablas se acceden solo desde
-- API routes con supabaseAdmin (service_role), nunca desde el cliente.

-- =====================================================
-- Función RPC: validar y redimir código
-- Llamada desde la API route con service_role.
-- Retorna: { valido, tipo, valor, mensaje }
-- =====================================================
CREATE OR REPLACE FUNCTION redimir_codigo_descuento(
    p_codigo        TEXT,
    p_empresa_id    UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_codigo     codigos_descuento%ROWTYPE;
    v_resultado  JSONB;
BEGIN
    -- Buscar código
    SELECT * INTO v_codigo
    FROM codigos_descuento
    WHERE codigo = UPPER(TRIM(p_codigo));

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valido', false, 'mensaje', 'Código no existe');
    END IF;

    IF NOT v_codigo.activo THEN
        RETURN jsonb_build_object('valido', false, 'mensaje', 'Código inactivo');
    END IF;

    IF v_codigo.fecha_expiracion IS NOT NULL AND v_codigo.fecha_expiracion < now() THEN
        RETURN jsonb_build_object('valido', false, 'mensaje', 'Código expirado');
    END IF;

    IF v_codigo.max_usos IS NOT NULL AND v_codigo.usos_actuales >= v_codigo.max_usos THEN
        RETURN jsonb_build_object('valido', false, 'mensaje', 'Código agotado');
    END IF;

    -- Verificar si esta empresa ya lo usó
    IF EXISTS (
        SELECT 1 FROM redenciones_descuento
        WHERE codigo_id = v_codigo.id AND empresa_id = p_empresa_id
    ) THEN
        RETURN jsonb_build_object('valido', false, 'mensaje', 'Tu empresa ya usó este código');
    END IF;

    -- Registrar redención
    INSERT INTO redenciones_descuento (codigo_id, empresa_id)
    VALUES (v_codigo.id, p_empresa_id);

    -- Incrementar contador
    UPDATE codigos_descuento
    SET usos_actuales = usos_actuales + 1
    WHERE id = v_codigo.id;

    RETURN jsonb_build_object(
        'valido',            true,
        'tipo',              v_codigo.tipo,
        'valor',             v_codigo.valor,
        'descripcion',       v_codigo.descripcion,
        'stripe_coupon_id',  v_codigo.stripe_coupon_id,
        'mensaje',           '¡Código aplicado con éxito!'
    );
END;
$$;

-- =====================================================
-- Códigos beta iniciales
-- Ejecutar manualmente en el Dashboard para crear los
-- primeros códigos. Agregar más con INSERT directo.
-- =====================================================

-- 2 meses gratis de bienvenida (50 usos)
INSERT INTO codigos_descuento (codigo, descripcion, tipo, valor, max_usos, fecha_expiracion)
VALUES (
    'WELCOME',
    '2 meses gratis de bienvenida a TransportPro',
    'meses_gratis',
    2,
    50,
    '2026-12-31 23:59:59+00'
);

-- 50% descuento primer mes (referidos, ilimitado)
INSERT INTO codigos_descuento (codigo, descripcion, tipo, valor, max_usos, fecha_expiracion)
VALUES (
    'REFERIDO50',
    '50% de descuento en el primer mes por referido',
    'porcentaje',
    50,
    NULL,   -- ilimitado
    '2026-12-31 23:59:59+00'
);

-- Acceso gratuito 6 meses (socios estratégicos, 10 usos)
INSERT INTO codigos_descuento (codigo, descripcion, tipo, valor, max_usos, fecha_expiracion)
VALUES (
    'SOCIO6M',
    '6 meses de acceso gratuito para socios estratégicos',
    'meses_gratis',
    6,
    10,
    NULL    -- sin expiración
);
