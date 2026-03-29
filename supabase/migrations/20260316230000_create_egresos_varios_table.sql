-- =====================================================
-- Tabla: egresos_varios
-- Almacena gastos de personal y otros egresos por mes/año
-- para el módulo de Flujo de Caja
-- =====================================================

CREATE TABLE egresos_varios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anio INTEGER NOT NULL,
  mes INTEGER NOT NULL CHECK (mes >= 1 AND mes <= 12),
  gastos_personal NUMERIC DEFAULT 0,
  otros_egresos NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(anio, mes)
);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_egresos_varios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_egresos_varios_updated_at
  BEFORE UPDATE ON egresos_varios
  FOR EACH ROW
  EXECUTE FUNCTION update_egresos_varios_updated_at();

-- RLS permisivo (desarrollo)
ALTER TABLE egresos_varios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all for authenticated users" ON egresos_varios
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- Función RPC: get_flujo_caja_anual
-- Retorna todos los datos agregados del flujo de caja
-- para un año dado, en una sola llamada a BD
-- =====================================================

CREATE OR REPLACE FUNCTION get_flujo_caja_anual(p_anio INTEGER)
RETURNS TABLE (
  mes INTEGER,
  ingresos NUMERIC,
  combustible NUMERIC,
  peajes NUMERIC,
  comidas NUMERIC,
  seguros NUMERIC,
  impuestos NUMERIC,
  multas NUMERIC,
  mantenimiento NUMERIC,
  gastos_personal NUMERIC,
  otros_egresos NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.mes,
    -- Ingresos: SUM(ingreso_total) de rutas_viajes por fecha_llegada
    COALESCE((
      SELECT SUM(r.ingreso_total)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS ingresos,
    -- Combustible: SUM(total_combustible) de rutas_viajes
    COALESCE((
      SELECT SUM(r.total_combustible)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS combustible,
    -- Peajes: SUM(gasto_peajes) de rutas_viajes
    COALESCE((
      SELECT SUM(r.gasto_peajes)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS peajes,
    -- Comidas: SUM(gasto_comidas) de rutas_viajes
    COALESCE((
      SELECT SUM(r.gasto_comidas)
      FROM rutas_viajes r
      WHERE EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS comidas,
    -- Seguros: SUM(importe_pagado) de seguros_vehiculos
    COALESCE((
      SELECT SUM(s.importe_pagado)
      FROM seguros_vehiculos s
      WHERE EXTRACT(YEAR FROM s.fecha_pago::date) = p_anio
        AND EXTRACT(MONTH FROM s.fecha_pago::date) = m.mes
    ), 0) AS seguros,
    -- Impuestos: SUM(impuesto_monto) de impuestos_vehiculares
    COALESCE((
      SELECT SUM(i.impuesto_monto)
      FROM impuestos_vehiculares i
      WHERE EXTRACT(YEAR FROM i.fecha_pago::date) = p_anio
        AND EXTRACT(MONTH FROM i.fecha_pago::date) = m.mes
    ), 0) AS impuestos,
    -- Multas: SUM(importe_multa) de multas_conductores
    COALESCE((
      SELECT SUM(mc.importe_multa)
      FROM multas_conductores mc
      WHERE EXTRACT(YEAR FROM mc.fecha::date) = p_anio
        AND EXTRACT(MONTH FROM mc.fecha::date) = m.mes
    ), 0) AS multas,
    -- Mantenimiento: SUM(costo_total) de mantenimientos_vehiculos
    COALESCE((
      SELECT SUM(mv.costo_total)
      FROM mantenimientos_vehiculos mv
      WHERE mv.fecha_pago IS NOT NULL
        AND EXTRACT(YEAR FROM mv.fecha_pago::date) = p_anio
        AND EXTRACT(MONTH FROM mv.fecha_pago::date) = m.mes
    ), 0) AS mantenimiento,
    -- Gastos Personal: de egresos_varios
    COALESCE((
      SELECT ev.gastos_personal
      FROM egresos_varios ev
      WHERE ev.anio = p_anio AND ev.mes = m.mes
    ), 0) AS gastos_personal,
    -- Otros Egresos: de egresos_varios
    COALESCE((
      SELECT ev.otros_egresos
      FROM egresos_varios ev
      WHERE ev.anio = p_anio AND ev.mes = m.mes
    ), 0) AS otros_egresos
  FROM generate_series(1, 12) AS m(mes)
  ORDER BY m.mes;
END;
$$ LANGUAGE plpgsql STABLE;
