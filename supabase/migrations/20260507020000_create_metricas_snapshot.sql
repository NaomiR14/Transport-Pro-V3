-- Snapshots mensuales de métricas por empresa.
-- Permite ver tendencias históricas sin depender de datos en vivo.
-- La función fn_crear_snapshots_mensuales() se ejecuta vía pg_cron
-- el 1ro de cada mes y guarda el snapshot del mes anterior.

CREATE TABLE metricas_snapshot (
    id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
    empresa_id UUID        NOT NULL REFERENCES empresas(id) ON DELETE CASCADE,
    tipo       TEXT        NOT NULL CHECK (tipo IN ('conductores', 'general')),
    anio       INTEGER     NOT NULL,
    mes        INTEGER     NOT NULL CHECK (mes BETWEEN 1 AND 12),
    datos      JSONB       NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (empresa_id, tipo, anio, mes)
);

CREATE INDEX idx_metricas_snapshot_lookup ON metricas_snapshot(empresa_id, tipo, anio, mes);

ALTER TABLE metricas_snapshot ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario autenticado de la empresa puede leer sus snapshots
CREATE POLICY "metricas_snapshot_empresa_select" ON metricas_snapshot
    FOR SELECT USING (empresa_id = auth_empresa_id());

-- ─── Función: snapshot de conductores para un mes/empresa ─────────────────────
CREATE OR REPLACE FUNCTION fn_snapshot_conductores_mes(
    p_empresa_id UUID,
    p_anio       INTEGER,
    p_mes        INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_agg(row_to_json(r)) INTO v_result
    FROM (
        SELECT
            c.documento_identidad,
            c.nombre_conductor,
            COALESCE((
                SELECT COUNT(*)::BIGINT FROM rutas_viajes r
                WHERE r.conductor    = c.documento_identidad
                  AND r.empresa_id   = p_empresa_id
                  AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
                  AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
            ), 0) AS nro_viajes,
            COALESCE((
                SELECT SUM(r.kms_recorridos) FROM rutas_viajes r
                WHERE r.conductor    = c.documento_identidad
                  AND r.empresa_id   = p_empresa_id
                  AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
                  AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
            ), 0) AS kms_recorridos,
            COALESCE((
                SELECT SUM(r.peso_carga_kg) FROM rutas_viajes r
                WHERE r.conductor    = c.documento_identidad
                  AND r.empresa_id   = p_empresa_id
                  AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
                  AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
            ), 0) AS carga_kg,
            COALESCE((
                SELECT SUM(r.ingreso_total) FROM rutas_viajes r
                WHERE r.conductor    = c.documento_identidad
                  AND r.empresa_id   = p_empresa_id
                  AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
                  AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
            ), 0) AS ingresos,
            COALESCE((
                SELECT COUNT(*)::BIGINT FROM multas_conductores mc
                WHERE mc.conductor   = c.documento_identidad
                  AND mc.empresa_id  = p_empresa_id
                  AND EXTRACT(YEAR  FROM mc.fecha::date) = p_anio
                  AND EXTRACT(MONTH FROM mc.fecha::date) = p_mes
            ), 0) AS nro_multas,
            COALESCE((
                SELECT SUM(mc.importe_multa) FROM multas_conductores mc
                WHERE mc.conductor   = c.documento_identidad
                  AND mc.empresa_id  = p_empresa_id
                  AND EXTRACT(YEAR  FROM mc.fecha::date) = p_anio
                  AND EXTRACT(MONTH FROM mc.fecha::date) = p_mes
            ), 0) AS gastos_multas
        FROM conductores c
        WHERE c.empresa_id = p_empresa_id
          AND c.activo = true
        ORDER BY c.nombre_conductor
    ) r;

    RETURN COALESCE(v_result, '[]'::JSONB);
END;
$$;

-- ─── Función: snapshot general mensual por empresa ────────────────────────────
CREATE OR REPLACE FUNCTION fn_snapshot_general_mes(
    p_empresa_id UUID,
    p_anio       INTEGER,
    p_mes        INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'mes',              p_mes,
        'nro_viajes',       COALESCE((
            SELECT COUNT(*)::BIGINT FROM rutas_viajes r
            WHERE r.empresa_id = p_empresa_id
              AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
              AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
        ), 0),
        'kms_recorridos',   COALESCE((
            SELECT SUM(r.kms_recorridos) FROM rutas_viajes r
            WHERE r.empresa_id = p_empresa_id
              AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
              AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
        ), 0),
        'ingresos',         COALESCE((
            SELECT SUM(r.ingreso_total) FROM rutas_viajes r
            WHERE r.empresa_id = p_empresa_id
              AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
              AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
        ), 0),
        'gastos',           COALESCE((
            SELECT SUM(r.gasto_total) FROM rutas_viajes r
            WHERE r.empresa_id = p_empresa_id
              AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
              AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
        ), 0),
        'combustible_gal',  COALESCE((
            SELECT SUM(r.volumen_combustible_gal) FROM rutas_viajes r
            WHERE r.empresa_id = p_empresa_id
              AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
              AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
        ), 0),
        'carga_kg',         COALESCE((
            SELECT SUM(r.peso_carga_kg) FROM rutas_viajes r
            WHERE r.empresa_id = p_empresa_id
              AND EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
              AND EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes
        ), 0),
        'mant_preventivos', COALESCE((
            SELECT COUNT(*)::BIGINT FROM mantenimientos_vehiculos mv
            WHERE mv.empresa_id = p_empresa_id
              AND mv.tipo = 'Preventivo'
              AND EXTRACT(YEAR  FROM mv.fecha_entrada::date) = p_anio
              AND EXTRACT(MONTH FROM mv.fecha_entrada::date) = p_mes
        ), 0),
        'mant_correctivos', COALESCE((
            SELECT COUNT(*)::BIGINT FROM mantenimientos_vehiculos mv
            WHERE mv.empresa_id = p_empresa_id
              AND mv.tipo = 'Correctivo'
              AND EXTRACT(YEAR  FROM mv.fecha_entrada::date) = p_anio
              AND EXTRACT(MONTH FROM mv.fecha_entrada::date) = p_mes
        ), 0)
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- ─── Función principal: itera todas las empresas, snapshot del mes anterior ───
CREATE OR REPLACE FUNCTION fn_crear_snapshots_mensuales()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_empresa RECORD;
    v_fecha   DATE    := date_trunc('month', now()) - INTERVAL '1 month';
    v_anio    INTEGER := EXTRACT(YEAR  FROM v_fecha)::INTEGER;
    v_mes     INTEGER := EXTRACT(MONTH FROM v_fecha)::INTEGER;
BEGIN
    FOR v_empresa IN SELECT id FROM empresas LOOP
        INSERT INTO metricas_snapshot (empresa_id, tipo, anio, mes, datos)
        VALUES (
            v_empresa.id, 'conductores', v_anio, v_mes,
            fn_snapshot_conductores_mes(v_empresa.id, v_anio, v_mes)
        )
        ON CONFLICT (empresa_id, tipo, anio, mes)
        DO UPDATE SET datos = EXCLUDED.datos, created_at = now();

        INSERT INTO metricas_snapshot (empresa_id, tipo, anio, mes, datos)
        VALUES (
            v_empresa.id, 'general', v_anio, v_mes,
            fn_snapshot_general_mes(v_empresa.id, v_anio, v_mes)
        )
        ON CONFLICT (empresa_id, tipo, anio, mes)
        DO UPDATE SET datos = EXCLUDED.datos, created_at = now();
    END LOOP;
END;
$$;

-- ─── pg_cron: 1ro de cada mes a las 2:00 AM UTC ───────────────────────────────
-- Requiere: Supabase Dashboard → Database → Extensions → pg_cron → Enable
DO $$
BEGIN
    PERFORM cron.schedule(
        'snapshot-metricas-mensual',
        '0 2 1 * *',
        'SELECT fn_crear_snapshots_mensuales()'
    );
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'pg_cron no habilitado. Habilítalo en Supabase Dashboard → Extensions → pg_cron y ejecuta: SELECT cron.schedule(''snapshot-metricas-mensual'', ''0 2 1 * *'', ''SELECT fn_crear_snapshots_mensuales()'')';
END;
$$;
