-- =====================================================
-- MIGRACIÓN: Multi-Tenancy - Aislamiento por Empresa
-- =====================================================
-- Esta migración convierte la app en multi-tenant:
-- 1. Crea tabla `empresas`
-- 2. Agrega `empresa_id` a todas las tablas de datos
-- 3. Reemplaza políticas RLS permisivas con aislamiento por empresa
-- 4. Actualiza trigger handle_new_user
-- 5. Crea función RPC para registro de empresa
-- =====================================================

-- =====================================================
-- PASO 1: Crear tabla empresas
-- =====================================================
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    nit TEXT UNIQUE,
    email_contacto TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    plan TEXT DEFAULT 'basico' CHECK (plan IN ('basico', 'profesional', 'enterprise')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para updated_at
CREATE TRIGGER update_empresas_updated_at
    BEFORE UPDATE ON empresas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;

-- Índices
CREATE INDEX idx_empresas_activo ON empresas(activo);
CREATE INDEX idx_empresas_nit ON empresas(nit);

-- =====================================================
-- PASO 2: Crear empresa default para datos existentes
-- =====================================================
INSERT INTO empresas (id, nombre, nit, email_contacto)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Empresa Default (Migración)',
    'DEFAULT-NIT',
    'admin@default.com'
);

-- =====================================================
-- PASO 3: Agregar empresa_id a todas las tablas
-- =====================================================

-- profiles
ALTER TABLE profiles ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE profiles SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE profiles ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_profiles_empresa ON profiles(empresa_id);

-- vehicles
ALTER TABLE vehicles ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE vehicles SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE vehicles ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_vehicles_empresa ON vehicles(empresa_id);

-- conductores
ALTER TABLE conductores ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE conductores SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE conductores ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_conductores_empresa ON conductores(empresa_id);

-- talleres
ALTER TABLE talleres ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE talleres SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE talleres ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_talleres_empresa ON talleres(empresa_id);

-- rutas_viajes
ALTER TABLE rutas_viajes ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE rutas_viajes SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE rutas_viajes ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_rutas_viajes_empresa ON rutas_viajes(empresa_id);

-- mantenimientos_vehiculos
ALTER TABLE mantenimientos_vehiculos ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE mantenimientos_vehiculos SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE mantenimientos_vehiculos ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_mantenimientos_empresa ON mantenimientos_vehiculos(empresa_id);

-- multas_conductores
ALTER TABLE multas_conductores ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE multas_conductores SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE multas_conductores ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_multas_empresa ON multas_conductores(empresa_id);

-- seguros_vehiculos
ALTER TABLE seguros_vehiculos ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE seguros_vehiculos SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE seguros_vehiculos ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_seguros_empresa ON seguros_vehiculos(empresa_id);

-- impuestos_vehiculares
ALTER TABLE impuestos_vehiculares ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE impuestos_vehiculares SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE impuestos_vehiculares ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_impuestos_empresa ON impuestos_vehiculares(empresa_id);

-- egresos_varios
ALTER TABLE egresos_varios ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE egresos_varios SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE egresos_varios ALTER COLUMN empresa_id SET NOT NULL;
-- Actualizar unique constraint para incluir empresa_id
ALTER TABLE egresos_varios DROP CONSTRAINT IF EXISTS egresos_varios_anio_mes_key;
ALTER TABLE egresos_varios ADD CONSTRAINT egresos_varios_empresa_anio_mes_key UNIQUE(empresa_id, anio, mes);
CREATE INDEX idx_egresos_empresa ON egresos_varios(empresa_id);

-- ordenes
ALTER TABLE ordenes ADD COLUMN empresa_id UUID REFERENCES empresas(id);
UPDATE ordenes SET empresa_id = '00000000-0000-0000-0000-000000000001' WHERE empresa_id IS NULL;
ALTER TABLE ordenes ALTER COLUMN empresa_id SET NOT NULL;
CREATE INDEX idx_ordenes_empresa ON ordenes(empresa_id);

-- =====================================================
-- PASO 4: Helper function para obtener empresa_id del usuario actual
-- =====================================================
CREATE OR REPLACE FUNCTION auth_empresa_id()
RETURNS UUID AS $$
    SELECT empresa_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =====================================================
-- PASO 5: Eliminar TODAS las políticas RLS existentes
-- =====================================================

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin and directors can view all profiles" ON profiles;
DROP POLICY IF EXISTS "simple_select_policy" ON profiles;
DROP POLICY IF EXISTS "Admin can update any profile role" ON profiles;

-- vehicles (permisivas genéricas)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'vehicles' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON vehicles', pol.policyname);
    END LOOP;
END $$;

-- conductores
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'conductores' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON conductores', pol.policyname);
    END LOOP;
END $$;

-- talleres
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'talleres' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON talleres', pol.policyname);
    END LOOP;
END $$;

-- rutas_viajes
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'rutas_viajes' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON rutas_viajes', pol.policyname);
    END LOOP;
END $$;

-- mantenimientos_vehiculos
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'mantenimientos_vehiculos' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON mantenimientos_vehiculos', pol.policyname);
    END LOOP;
END $$;

-- multas_conductores
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'multas_conductores' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON multas_conductores', pol.policyname);
    END LOOP;
END $$;

-- seguros_vehiculos
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'seguros_vehiculos' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON seguros_vehiculos', pol.policyname);
    END LOOP;
END $$;

-- impuestos_vehiculares
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'impuestos_vehiculares' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON impuestos_vehiculares', pol.policyname);
    END LOOP;
END $$;

-- egresos_varios
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'egresos_varios' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON egresos_varios', pol.policyname);
    END LOOP;
END $$;

-- ordenes
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'ordenes' LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON ordenes', pol.policyname);
    END LOOP;
END $$;

-- =====================================================
-- PASO 6: Crear políticas RLS de aislamiento por empresa
-- =====================================================

-- === EMPRESAS ===
CREATE POLICY "empresa_read_own" ON empresas
    FOR SELECT TO authenticated
    USING (id = auth_empresa_id());

CREATE POLICY "empresa_update_own" ON empresas
    FOR UPDATE TO authenticated
    USING (id = auth_empresa_id())
    WITH CHECK (id = auth_empresa_id());

-- === PROFILES ===
-- Los usuarios ven todos los perfiles de su empresa
CREATE POLICY "profiles_select_empresa" ON profiles
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Admin puede actualizar cualquier perfil de su empresa
CREATE POLICY "profiles_admin_update" ON profiles
    FOR UPDATE TO authenticated
    USING (
        empresa_id = auth_empresa_id()
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (empresa_id = auth_empresa_id());

-- Admin puede insertar perfiles en su empresa (para crear empleados)
CREATE POLICY "profiles_admin_insert" ON profiles
    FOR INSERT TO authenticated
    WITH CHECK (
        empresa_id = auth_empresa_id()
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- === VEHICLES ===
CREATE POLICY "vehicles_select_empresa" ON vehicles
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "vehicles_insert_empresa" ON vehicles
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "vehicles_update_empresa" ON vehicles
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "vehicles_delete_empresa" ON vehicles
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === CONDUCTORES ===
CREATE POLICY "conductores_select_empresa" ON conductores
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "conductores_insert_empresa" ON conductores
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "conductores_update_empresa" ON conductores
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "conductores_delete_empresa" ON conductores
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === TALLERES ===
CREATE POLICY "talleres_select_empresa" ON talleres
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "talleres_insert_empresa" ON talleres
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "talleres_update_empresa" ON talleres
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "talleres_delete_empresa" ON talleres
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === RUTAS_VIAJES ===
CREATE POLICY "rutas_select_empresa" ON rutas_viajes
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "rutas_insert_empresa" ON rutas_viajes
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "rutas_update_empresa" ON rutas_viajes
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "rutas_delete_empresa" ON rutas_viajes
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === MANTENIMIENTOS_VEHICULOS ===
CREATE POLICY "mantenimientos_select_empresa" ON mantenimientos_vehiculos
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "mantenimientos_insert_empresa" ON mantenimientos_vehiculos
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "mantenimientos_update_empresa" ON mantenimientos_vehiculos
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "mantenimientos_delete_empresa" ON mantenimientos_vehiculos
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === MULTAS_CONDUCTORES ===
CREATE POLICY "multas_select_empresa" ON multas_conductores
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "multas_insert_empresa" ON multas_conductores
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "multas_update_empresa" ON multas_conductores
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "multas_delete_empresa" ON multas_conductores
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === SEGUROS_VEHICULOS ===
CREATE POLICY "seguros_select_empresa" ON seguros_vehiculos
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "seguros_insert_empresa" ON seguros_vehiculos
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "seguros_update_empresa" ON seguros_vehiculos
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "seguros_delete_empresa" ON seguros_vehiculos
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === IMPUESTOS_VEHICULARES ===
CREATE POLICY "impuestos_select_empresa" ON impuestos_vehiculares
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "impuestos_insert_empresa" ON impuestos_vehiculares
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "impuestos_update_empresa" ON impuestos_vehiculares
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "impuestos_delete_empresa" ON impuestos_vehiculares
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === EGRESOS_VARIOS ===
CREATE POLICY "egresos_select_empresa" ON egresos_varios
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "egresos_insert_empresa" ON egresos_varios
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "egresos_update_empresa" ON egresos_varios
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "egresos_delete_empresa" ON egresos_varios
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- === ORDENES ===
CREATE POLICY "ordenes_select_empresa" ON ordenes
    FOR SELECT TO authenticated
    USING (empresa_id = auth_empresa_id());

CREATE POLICY "ordenes_insert_empresa" ON ordenes
    FOR INSERT TO authenticated
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "ordenes_update_empresa" ON ordenes
    FOR UPDATE TO authenticated
    USING (empresa_id = auth_empresa_id())
    WITH CHECK (empresa_id = auth_empresa_id());

CREATE POLICY "ordenes_delete_empresa" ON ordenes
    FOR DELETE TO authenticated
    USING (empresa_id = auth_empresa_id());

-- =====================================================
-- PASO 7: Recrear vistas para incluir empresa_id
-- =====================================================

-- Vista vehicles_with_calculated_stats
DROP VIEW IF EXISTS vehicles_with_calculated_stats CASCADE;

CREATE VIEW vehicles_with_calculated_stats AS
WITH 
ultimo_mantenimiento_preventivo AS (
    SELECT 
        placa_vehiculo,
        MAX(kilometraje) AS ultimo_km_preventivo,
        MAX(fecha_salida) AS ultima_fecha_preventivo
    FROM mantenimientos_vehiculos 
    WHERE tipo = 'Preventivo'
    GROUP BY placa_vehiculo
),
mantenimiento_activo AS (
    SELECT DISTINCT placa_vehiculo
    FROM mantenimientos_vehiculos
    WHERE fecha_salida IS NULL 
       OR fecha_salida > CURRENT_DATE
),
ultimo_odometro AS (
    SELECT 
        placa_vehiculo,
        MAX(kms_final) AS ultimo_km_odometro
    FROM rutas_viajes
    GROUP BY placa_vehiculo
),
seguro_actual AS (
    SELECT DISTINCT ON (placa_vehiculo)
        placa_vehiculo,
        estado_poliza,
        fecha_vencimiento
    FROM seguros_vehiculos
    ORDER BY placa_vehiculo, fecha_vencimiento DESC
)
SELECT 
    v.id,
    v.type,
    v.brand,
    v.model,
    v.license_plate,
    v.serial_number,
    v.color,
    v.year,
    v.max_load_capacity,
    v.maintenance_data,
    v.empresa_id,
    v.created_at,
    v.updated_at,
    COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) AS ciclo_mantenimiento,
    COALESCE((v.maintenance_data->>'initialKm')::NUMERIC, 0) AS km_inicial,
    COALESCE(ump.ultimo_km_preventivo, (v.maintenance_data->>'prevMaintenanceKm')::NUMERIC, 0) AS ultimo_km_preventivo,
    GREATEST(
        COALESCE(uo.ultimo_km_odometro, 0),
        COALESCE((v.maintenance_data->>'currentKm')::NUMERIC, 0)
    ) AS ultimo_km_odometro,
    COALESCE(sa.estado_poliza, 'sin_seguro') AS estado_seguro,
    sa.fecha_vencimiento AS fecha_vencimiento_seguro,
    GREATEST(
        COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) - (
            GREATEST(
                COALESCE(uo.ultimo_km_odometro, 0),
                COALESCE((v.maintenance_data->>'currentKm')::NUMERIC, 0)
            ) - COALESCE(ump.ultimo_km_preventivo, (v.maintenance_data->>'prevMaintenanceKm')::NUMERIC, 0)
        ),
        0
    ) AS kms_restantes_mantenimiento,
    CASE 
        WHEN COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) = 0 THEN 0
        ELSE ROUND(
            (
                GREATEST(
                    COALESCE(uo.ultimo_km_odometro, 0),
                    COALESCE((v.maintenance_data->>'currentKm')::NUMERIC, 0)
                ) - COALESCE(ump.ultimo_km_preventivo, (v.maintenance_data->>'prevMaintenanceKm')::NUMERIC, 0)
            ) * 100.0 / COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000),
            1
        )
    END AS porcentaje_ciclo_usado,
    CASE 
        WHEN ma.placa_vehiculo IS NOT NULL THEN 'En Mantenimiento'
        WHEN sa.estado_poliza IN ('vencida') THEN 'Seguro Vencido'
        WHEN sa.estado_poliza IN ('por_vencer') THEN 'Seguro Por Vencer'
        ELSE 'Disponible'
    END AS estado_calculado,
    CASE 
        WHEN ma.placa_vehiculo IS NOT NULL THEN 'En Mantenimiento'
        WHEN COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) = 0 THEN 'Sin Ciclo'
        WHEN (
            GREATEST(
                COALESCE(uo.ultimo_km_odometro, 0),
                COALESCE((v.maintenance_data->>'currentKm')::NUMERIC, 0)
            ) - COALESCE(ump.ultimo_km_preventivo, (v.maintenance_data->>'prevMaintenanceKm')::NUMERIC, 0)
        ) >= COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) * 0.95 THEN 'Mantener'
        WHEN (
            GREATEST(
                COALESCE(uo.ultimo_km_odometro, 0),
                COALESCE((v.maintenance_data->>'currentKm')::NUMERIC, 0)
            ) - COALESCE(ump.ultimo_km_preventivo, (v.maintenance_data->>'prevMaintenanceKm')::NUMERIC, 0)
        ) >= COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) * 0.80 THEN 'Falta poco'
        ELSE 'Al día'
    END AS alerta_mantenimiento,
    (ma.placa_vehiculo IS NOT NULL) AS tiene_mantenimiento_activo,
    (sa.estado_poliza = 'vencida') AS tiene_seguro_vencido
FROM vehicles v
LEFT JOIN ultimo_mantenimiento_preventivo ump ON ump.placa_vehiculo = v.license_plate
LEFT JOIN mantenimiento_activo ma ON ma.placa_vehiculo = v.license_plate
LEFT JOIN ultimo_odometro uo ON uo.placa_vehiculo = v.license_plate
LEFT JOIN seguro_actual sa ON sa.placa_vehiculo = v.license_plate;

ALTER VIEW vehicles_with_calculated_stats SET (security_invoker = true);
GRANT SELECT ON vehicles_with_calculated_stats TO authenticated;

-- Vista seguros_vehiculos_with_calculated_state
DROP VIEW IF EXISTS seguros_vehiculos_with_calculated_state;

CREATE VIEW seguros_vehiculos_with_calculated_state AS
SELECT 
    id,
    placa_vehiculo,
    aseguradora,
    poliza_seguro,
    fecha_inicio,
    fecha_vencimiento,
    importe_pagado,
    fecha_pago,
    empresa_id,
    created_at,
    updated_at,
    (fecha_vencimiento - CURRENT_DATE) AS dias_restantes,
    CASE 
        WHEN (fecha_vencimiento - CURRENT_DATE) < 0 THEN 'Vencida'
        WHEN (fecha_vencimiento - CURRENT_DATE) <= 30 THEN 'Por Vencer'
        ELSE 'Vigente'
    END AS estado_calculado
FROM seguros_vehiculos;

ALTER VIEW seguros_vehiculos_with_calculated_state SET (security_invoker = true);
GRANT SELECT ON seguros_vehiculos_with_calculated_state TO authenticated;

-- Vista rutas_viajes_with_vehicle_state
DROP VIEW IF EXISTS rutas_viajes_with_vehicle_state;

CREATE VIEW rutas_viajes_with_vehicle_state AS
SELECT 
    r.id,
    r.fecha_salida,
    r.fecha_llegada,
    r.placa_vehiculo,
    v.estado_calculado AS estado_vehiculo_calculado,
    r.conductor,
    r.origen,
    r.destino,
    r.kms_inicial,
    r.kms_final,
    r.kms_recorridos,
    r.peso_carga_kg,
    r.costo_por_kg,
    r.ingreso_total,
    r.estacion_combustible,
    r.tipo_combustible,
    r.precio_por_galon,
    r.volumen_combustible_gal,
    r.total_combustible,
    r.gasto_peajes,
    r.gasto_comidas,
    r.otros_gastos,
    r.gasto_total,
    r.recorrido_por_galon,
    r.ingreso_por_km,
    r.observaciones,
    r.empresa_id,
    r.created_at,
    r.updated_at
FROM rutas_viajes r
LEFT JOIN vehicles_with_calculated_stats v ON r.placa_vehiculo = v.license_plate;

ALTER VIEW rutas_viajes_with_vehicle_state SET (security_invoker = true);
GRANT SELECT ON rutas_viajes_with_vehicle_state TO authenticated;

-- Vista ordenes_with_details
DROP VIEW IF EXISTS ordenes_with_details;

CREATE VIEW ordenes_with_details AS
SELECT
    o.id,
    o.numero_orden,
    o.placa_vehiculo,
    o.ruta_viaje_id,
    o.estado,
    o.carta_porte,
    o.empresa_id,
    o.created_at,
    o.updated_at,
    r.conductor AS conductor_documento,
    c.nombre_conductor,
    r.origen,
    r.destino,
    r.fecha_salida,
    r.fecha_llegada,
    CASE
        WHEN now() < r.fecha_salida::timestamptz THEN 'pendiente'
        WHEN now() >= r.fecha_salida::timestamptz AND now() <= r.fecha_llegada::timestamptz THEN 'transito'
        WHEN now() > r.fecha_llegada::timestamptz THEN 'entregado'
        ELSE 'pendiente'
    END AS estado_sugerido
FROM ordenes o
LEFT JOIN rutas_viajes r ON o.ruta_viaje_id = r.id
LEFT JOIN conductores c ON r.conductor = c.documento_identidad;

ALTER VIEW ordenes_with_details SET (security_invoker = true);
GRANT SELECT ON ordenes_with_details TO authenticated;

-- =====================================================
-- PASO 8: Actualizar funciones RPC para respetar empresa_id
-- =====================================================

-- Actualizar get_flujo_caja_anual para filtrar por empresa
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
DECLARE
  v_empresa_id UUID;
BEGIN
  v_empresa_id := auth_empresa_id();
  
  RETURN QUERY
  SELECT
    m.mes,
    COALESCE((
      SELECT SUM(r.ingreso_total)
      FROM rutas_viajes r
      WHERE r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS ingresos,
    COALESCE((
      SELECT SUM(r.total_combustible)
      FROM rutas_viajes r
      WHERE r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS combustible,
    COALESCE((
      SELECT SUM(r.gasto_peajes)
      FROM rutas_viajes r
      WHERE r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS peajes,
    COALESCE((
      SELECT SUM(r.gasto_comidas)
      FROM rutas_viajes r
      WHERE r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND EXTRACT(MONTH FROM r.fecha_llegada::date) = m.mes
    ), 0) AS comidas,
    COALESCE((
      SELECT SUM(s.importe_pagado)
      FROM seguros_vehiculos s
      WHERE s.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM s.fecha_pago::date) = p_anio
        AND EXTRACT(MONTH FROM s.fecha_pago::date) = m.mes
    ), 0) AS seguros,
    COALESCE((
      SELECT SUM(i.impuesto_monto)
      FROM impuestos_vehiculares i
      WHERE i.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM i.fecha_pago::date) = p_anio
        AND EXTRACT(MONTH FROM i.fecha_pago::date) = m.mes
    ), 0) AS impuestos,
    COALESCE((
      SELECT SUM(mc.importe_multa)
      FROM multas_conductores mc
      WHERE mc.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM mc.fecha::date) = p_anio
        AND EXTRACT(MONTH FROM mc.fecha::date) = m.mes
    ), 0) AS multas,
    COALESCE((
      SELECT SUM(mv.costo_total)
      FROM mantenimientos_vehiculos mv
      WHERE mv.empresa_id = v_empresa_id
        AND mv.fecha_pago IS NOT NULL
        AND EXTRACT(YEAR FROM mv.fecha_pago::date) = p_anio
        AND EXTRACT(MONTH FROM mv.fecha_pago::date) = m.mes
    ), 0) AS mantenimiento,
    COALESCE((
      SELECT ev.gastos_personal
      FROM egresos_varios ev
      WHERE ev.empresa_id = v_empresa_id
        AND ev.anio = p_anio AND ev.mes = m.mes
    ), 0) AS gastos_personal,
    COALESCE((
      SELECT ev.otros_egresos
      FROM egresos_varios ev
      WHERE ev.empresa_id = v_empresa_id
        AND ev.anio = p_anio AND ev.mes = m.mes
    ), 0) AS otros_egresos
  FROM generate_series(1, 12) AS m(mes)
  ORDER BY m.mes;
END;
$$ LANGUAGE plpgsql STABLE;

-- Actualizar get_reporte_conductores para filtrar por empresa
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
DECLARE
  v_empresa_id UUID;
BEGIN
  v_empresa_id := auth_empresa_id();
  
  RETURN QUERY
  SELECT
    c.documento_identidad,
    c.nombre_conductor,
    COALESCE((
      SELECT COUNT(*)::BIGINT
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS nro_viajes,
    COALESCE((
      SELECT SUM(r.kms_recorridos)
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS kms_recorridos,
    COALESCE((
      SELECT SUM(r.peso_carga_kg)
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS carga_kg,
    COALESCE((
      SELECT SUM(r.ingreso_total)
      FROM rutas_viajes r
      WHERE r.conductor = c.documento_identidad
        AND r.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM r.fecha_llegada::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM r.fecha_llegada::date) = p_mes)
    ), 0) AS ingresos,
    COALESCE((
      SELECT COUNT(*)::BIGINT
      FROM multas_conductores mc
      WHERE mc.conductor = c.documento_identidad
        AND mc.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM mc.fecha::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM mc.fecha::date) = p_mes)
    ), 0) AS nro_multas,
    COALESCE((
      SELECT SUM(mc.importe_multa)
      FROM multas_conductores mc
      WHERE mc.conductor = c.documento_identidad
        AND mc.empresa_id = v_empresa_id
        AND EXTRACT(YEAR FROM mc.fecha::date) = p_anio
        AND (p_mes IS NULL OR EXTRACT(MONTH FROM mc.fecha::date) = p_mes)
    ), 0) AS gastos_multas
  FROM conductores c
  WHERE c.activo = true
    AND c.empresa_id = v_empresa_id
  ORDER BY c.nombre_conductor;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- PASO 9: Actualizar handle_new_user trigger
-- El trigger ahora NO asigna empresa_id automáticamente.
-- empresa_id se asigna via API routes (registro empresa / crear empleado)
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_nombre TEXT;
    user_apellido TEXT;
    user_empresa_id UUID;
BEGIN
    user_nombre := COALESCE(
        NEW.raw_user_meta_data->>'nombre',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)
    );
    
    user_apellido := COALESCE(
        NEW.raw_user_meta_data->>'apellido',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 2)
    );
    
    IF user_apellido = '' OR user_apellido IS NULL THEN
        user_apellido := SPLIT_PART(NEW.email, '@', 1);
    END IF;

    -- empresa_id viene del metadata (establecido por API routes)
    user_empresa_id := (NEW.raw_user_meta_data->>'empresa_id')::UUID;

    INSERT INTO public.profiles (id, nombre, apellido, role, empresa_id)
    VALUES (
        NEW.id,
        user_nombre,
        user_apellido,
        COALESCE(NEW.raw_user_meta_data->>'role', 'conductor'),
        user_empresa_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- PASO 10: Política especial para que el trigger pueda insertar profiles
-- (SECURITY DEFINER necesita poder insertar sin RLS)
-- =====================================================
-- El trigger usa SECURITY DEFINER, así que bypasea RLS automáticamente.
-- Pero necesitamos permitir que service_role pueda insertar en profiles
-- para el registro de empresa.

-- Permitir inserción anónima temporal para el trigger handle_new_user
-- (el trigger corre como SECURITY DEFINER, así que no necesita política adicional)

-- =====================================================
-- PASO 11: Comentarios
-- =====================================================
COMMENT ON TABLE empresas IS 'Tabla central de empresas/organizaciones para multi-tenancy';
COMMENT ON FUNCTION auth_empresa_id() IS 'Retorna el empresa_id del usuario autenticado actual. Usada en políticas RLS.';
