-- =====================================================
-- Función RPC: get_reporte_conductores
-- Retorna indicadores por conductor para un año dado
-- y opcionalmente un mes específico.
-- Si p_mes es NULL → todo el año.
-- =====================================================

CREATE OR REPLACE FUNCTION get_reporte_conductores(
  p_anio INTEGER,
  p_mes  INTEGER DEFAULT NULL
)
RETURNS TABLE (
  documento_identidad TEXT,
  nombre_conductor    TEXT,
  nro_viajes          BIGINT,
  kms_recorridos      NUMERIC,
  carga_kg            NUMERIC,
  ingresos            NUMERIC,
  nro_multas          BIGINT,
  gastos_multas       NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.documento_identidad,
    c.nombre_conductor,

    -- Número de viajes
    COALESCE((
      SELECT COUNT(*)::BIGINT
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS nro_viajes,

    -- Kilómetros recorridos
    COALESCE((
      SELECT SUM(r.kms_recorridos)
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS kms_recorridos,

    -- Carga transportada (kg)
    COALESCE((
      SELECT SUM(r.peso_carga_kg)
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS carga_kg,

    -- Ingresos totales
    COALESCE((
      SELECT SUM(r.ingreso_total)
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS ingresos,

    -- Número de multas
    COALESCE((
      SELECT COUNT(*)::BIGINT
      FROM multas_conductores mc
      WHERE mc.conductor = c.documento_identidad
        AND EXTRACT(YEAR FROM mc.fecha::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM mc.fecha::date) = p_mes)
    ), 0) AS nro_multas,

    -- Gastos por multas
    COALESCE((
      SELECT SUM(mc.importe_multa)
      FROM multas_conductores mc
      WHERE mc.conductor = c.documento_identidad
        AND EXTRACT(YEAR FROM mc.fecha::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM mc.fecha::date) = p_mes)
    ), 0) AS gastos_multas

  FROM conductores c
  WHERE c.activo = true
  ORDER BY c.nombre_conductor;
END;
$$ LANGUAGE plpgsql STABLE;
