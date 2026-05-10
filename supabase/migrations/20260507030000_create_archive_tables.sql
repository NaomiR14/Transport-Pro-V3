-- Tablas de archivo para registros históricos (> 12 meses).
-- ordenes entregadas y mantenimientos antiguos se mueven aquí
-- para mantener las tablas activas pequeñas y rápidas.
-- Los datos archivados siguen siendo accesibles en lectura vía RLS.

-- ─── Tablas de archivo ────────────────────────────────────────────────────────

CREATE TABLE ordenes_archivo (
    LIKE ordenes INCLUDING DEFAULTS,
    archivado_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE ordenes_archivo ADD PRIMARY KEY (id);
CREATE INDEX idx_ordenes_archivo_empresa ON ordenes_archivo(empresa_id, created_at DESC);

CREATE TABLE mantenimientos_archivo (
    LIKE mantenimientos_vehiculos INCLUDING DEFAULTS,
    archivado_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
ALTER TABLE mantenimientos_archivo ADD PRIMARY KEY (id);
CREATE INDEX idx_mantenimientos_archivo_empresa ON mantenimientos_archivo(empresa_id, fecha_entrada DESC);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

ALTER TABLE ordenes_archivo ENABLE ROW LEVEL SECURITY;
ALTER TABLE mantenimientos_archivo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ordenes_archivo_empresa_select" ON ordenes_archivo
    FOR SELECT USING (empresa_id = auth_empresa_id());

CREATE POLICY "mantenimientos_archivo_empresa_select" ON mantenimientos_archivo
    FOR SELECT USING (empresa_id = auth_empresa_id());

-- ─── Función de archivado ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_archivar_registros_antiguos()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_corte TIMESTAMPTZ := now() - INTERVAL '12 months';
BEGIN
    -- Órdenes entregadas con más de 12 meses
    WITH movidos AS (
        DELETE FROM ordenes
        WHERE created_at < v_corte
          AND estado = 'entregado'
        RETURNING *
    )
    INSERT INTO ordenes_archivo
    SELECT m.*, now() FROM movidos m;

    -- Mantenimientos con más de 12 meses
    WITH movidos AS (
        DELETE FROM mantenimientos_vehiculos
        WHERE created_at < v_corte
        RETURNING *
    )
    INSERT INTO mantenimientos_archivo
    SELECT m.*, now() FROM movidos m;
END;
$$;

-- ─── pg_cron: domingos a las 3:00 AM UTC ─────────────────────────────────────
-- Requiere: Supabase Dashboard → Database → Extensions → pg_cron → Enable
DO $$
BEGIN
    PERFORM cron.schedule(
        'archivar-registros-antiguos',
        '0 3 * * 0',
        'SELECT fn_archivar_registros_antiguos()'
    );
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'pg_cron no habilitado. Habilítalo en Supabase Dashboard → Extensions → pg_cron y ejecuta: SELECT cron.schedule(''archivar-registros-antiguos'', ''0 3 * * 0'', ''SELECT fn_archivar_registros_antiguos()'')';
END;
$$;
