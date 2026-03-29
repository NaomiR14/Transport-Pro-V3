-- =====================================================
-- Función RPC: get_reporte_general
-- Retorna indicadores mensuales de la flota (o de un
-- vehículo específico) para un año dado.
-- Filtra por placa si se provee p_placa (NULL = toda la flota).
-- =====================================================

CREATE OR REPLACE FUNCTION get_reporte_general(
  p_anio   INTEGER,
  p_placa  TEXT DEFAULT NULL
)
RETURNS TABLE (
  mes              INTEGER,
  nro_viajes       BIGINT,
  kms_recorridos   NUMERIC,
  ingresos         NUMERIC,
  gastos           NUMERIC,
  combustible_gal  NUMERIC,
  carga_kg         NUMERIC,
  mant_preventivos BIGINT,
  mant_correctivos BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.mes,

    -- Número de viajes
    COALESCE((
      SELECT COUNT(*)::BIGINT
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
        AND (p_placa IS NULL OR r.placa_vehiculo = p_placa)
    ), 0) AS nro_viajes,

    -- Kilómetros recorridos
    COALESCE((
      SELECT SUM(r.kms_recorridos)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
        AND (p_placa IS NULL OR r.placa_vehiculo = p_placa)
    ), 0) AS kms_recorridos,

    -- Ingresos totales
    COALESCE((
      SELECT SUM(r.ingreso_total)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
        AND (p_placa IS NULL OR r.placa_vehiculo = p_placa)
    ), 0) AS ingresos,

    -- Gastos totales de ruta
    COALESCE((
      SELECT SUM(r.gasto_total)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
        AND (p_placa IS NULL OR r.placa_vehiculo = p_placa)
    ), 0) AS gastos,

    -- Combustible consumido (galones)
    COALESCE((
      SELECT SUM(r.volumen_combustible_gal)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
        AND (p_placa IS NULL OR r.placa_vehiculo = p_placa)
    ), 0) AS combustible_gal,

    -- Carga transportada (kg)
    COALESCE((
      SELECT SUM(r.peso_carga_kg)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR  FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
        AND (p_placa IS NULL OR r.placa_vehiculo = p_placa)
    ), 0) AS carga_kg,

    -- Mantenimientos preventivos
    COALESCE((
      SELECT COUNT(*)::BIGINT
      FROM mantenimientos_vehiculos mv
      WHERE mv.tipo = 'Preventivo'
        AND EXTRACT(YEAR  FROM mv.fecha_entrada::date) = p_anio
        AND EXTRACT(MONTH FROM mv.fecha_entrada::date) = m.mes
        AND (p_placa IS NULL OR mv.placa_vehiculo = p_placa)
    ), 0) AS mant_preventivos,

    -- Mantenimientos correctivos
    COALESCE((
      SELECT COUNT(*)::BIGINT
      FROM mantenimientos_vehiculos mv
      WHERE mv.tipo = 'Correctivo'
        AND EXTRACT(YEAR  FROM mv.fecha_entrada::date) = p_anio
        AND EXTRACT(MONTH FROM mv.fecha_entrada::date) = m.mes
        AND (p_placa IS NULL OR mv.placa_vehiculo = p_placa)
    ), 0) AS mant_correctivos

  FROM generate_series(1, 12) AS m(mes)
  ORDER BY m.mes;
END;
$$ LANGUAGE plpgsql STABLE;
