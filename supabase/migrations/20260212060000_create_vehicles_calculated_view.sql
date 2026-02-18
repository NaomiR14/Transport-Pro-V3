-- ============================================================================
-- Vista vehicles_with_calculated_stats
-- Implementa las fórmulas del Excel de Control de Flota
-- ============================================================================

-- Eliminar vista si existe (para poder recrearla)
DROP VIEW IF EXISTS vehicles_with_calculated_stats;

-- Crear la vista con todos los campos calculados
CREATE VIEW vehicles_with_calculated_stats AS
WITH 
-- Subquery: Último mantenimiento preventivo por vehículo
ultimo_mantenimiento_preventivo AS (
    SELECT 
        placa_vehiculo,
        MAX(kilometraje) AS ultimo_km_preventivo,
        MAX(fecha_salida) AS ultima_fecha_preventivo
    FROM mantenimientos_vehiculos 
    WHERE tipo = 'Preventivo'
    GROUP BY placa_vehiculo
),

-- Subquery: Mantenimiento activo (fecha_salida > hoy o sin fecha_salida)
mantenimiento_activo AS (
    SELECT DISTINCT placa_vehiculo
    FROM mantenimientos_vehiculos
    WHERE fecha_salida IS NULL 
       OR fecha_salida > CURRENT_DATE
),

-- Subquery: Último km del odómetro desde rutas
ultimo_odometro AS (
    SELECT 
        placa_vehiculo,
        MAX(kms_final) AS ultimo_km_odometro
    FROM rutas_viajes
    GROUP BY placa_vehiculo
),

-- Subquery: Estado del seguro más reciente
seguro_actual AS (
    SELECT DISTINCT ON (placa_vehiculo)
        placa_vehiculo,
        estado_poliza,
        fecha_vencimiento
    FROM seguros_vehiculos
    ORDER BY placa_vehiculo, fecha_vencimiento DESC
)

SELECT 
    -- Campos originales del vehículo
    v.id,
    v.type,
    v.brand,
    v.model,
    v.license_plate,
    v.serial_number,
    v.color,
    v.year,
    v.max_load_capacity,
    v.vehicle_state,
    v.maintenance_data,
    v.created_at,
    v.updated_at,
    
    -- ========== CAMPOS CALCULADOS ==========
    
    -- Ciclo de mantenimiento (desde maintenance_data JSON)
    COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) AS ciclo_mantenimiento,
    
    -- Km inicial del vehículo
    COALESCE((v.maintenance_data->>'initialKm')::NUMERIC, 0) AS km_inicial,
    
    -- Último Km de Mantenimiento Preventivo
    COALESCE(ump.ultimo_km_preventivo, (v.maintenance_data->>'prevMaintenanceKm')::NUMERIC, 0) AS ultimo_km_preventivo,
    
    -- Último Km del Odómetro (el mayor entre rutas y maintenance_data)
    GREATEST(
        COALESCE(uo.ultimo_km_odometro, 0),
        COALESCE((v.maintenance_data->>'currentKm')::NUMERIC, 0)
    ) AS ultimo_km_odometro,
    
    -- Estado del seguro
    COALESCE(sa.estado_poliza, 'sin_seguro') AS estado_seguro,
    
    -- Fecha vencimiento seguro
    sa.fecha_vencimiento AS fecha_vencimiento_seguro,
    
    -- Kms Restantes para Mantenimiento
    -- Fórmula: ciclo - (odómetro_actual - último_km_preventivo)
    GREATEST(
        COALESCE((v.maintenance_data->>'maintenanceCycle')::NUMERIC, 5000) - (
            GREATEST(
                COALESCE(uo.ultimo_km_odometro, 0),
                COALESCE((v.maintenance_data->>'currentKm')::NUMERIC, 0)
            ) - COALESCE(ump.ultimo_km_preventivo, (v.maintenance_data->>'prevMaintenanceKm')::NUMERIC, 0)
        ),
        0
    ) AS kms_restantes_mantenimiento,
    
    -- Porcentaje de km usados del ciclo
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
    
    -- Estado Calculado del Vehículo
    -- Prioridad: 1) En Mantenimiento, 2) Seguro Vencido, 3) Disponible
    CASE 
        WHEN ma.placa_vehiculo IS NOT NULL THEN 'En Mantenimiento'
        WHEN sa.estado_poliza IN ('vencida') THEN 'Seguro Vencido'
        WHEN sa.estado_poliza IN ('por_vencer') THEN 'Seguro Por Vencer'
        WHEN v.vehicle_state = 'inactivo' THEN 'Inactivo'
        ELSE 'Disponible'
    END AS estado_calculado,
    
    -- Alerta de Mantenimiento
    -- ≤5% restante → "Mantener", ≤20% → "Falta poco", otro → "Aun no"
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
    
    -- Indicador si tiene mantenimiento activo
    (ma.placa_vehiculo IS NOT NULL) AS tiene_mantenimiento_activo,
    
    -- Indicador si tiene seguro vencido
    (sa.estado_poliza = 'vencida') AS tiene_seguro_vencido

FROM vehicles v
LEFT JOIN ultimo_mantenimiento_preventivo ump ON ump.placa_vehiculo = v.license_plate
LEFT JOIN mantenimiento_activo ma ON ma.placa_vehiculo = v.license_plate
LEFT JOIN ultimo_odometro uo ON uo.placa_vehiculo = v.license_plate
LEFT JOIN seguro_actual sa ON sa.placa_vehiculo = v.license_plate;

-- ============================================================================
-- Comentarios para documentación
-- ============================================================================
COMMENT ON VIEW vehicles_with_calculated_stats IS 
'Vista que extiende vehicles con campos calculados basados en las fórmulas del Excel de Control de Flota.
Incluye: estado calculado, alertas de mantenimiento, kms restantes, estado de seguro, etc.';

COMMENT ON COLUMN vehicles_with_calculated_stats.estado_calculado IS 
'Estado automático: "En Mantenimiento" si tiene manto activo, "Seguro Vencido" si póliza vencida, sino "Disponible"';

COMMENT ON COLUMN vehicles_with_calculated_stats.alerta_mantenimiento IS 
'Alerta basada en % del ciclo: "Mantener" (≥95%), "Falta poco" (≥80%), "Al día" (<80%)';

COMMENT ON COLUMN vehicles_with_calculated_stats.kms_restantes_mantenimiento IS 
'Kilómetros restantes = ciclo - (odómetro_actual - último_km_preventivo)';

-- ============================================================================
-- Política RLS para la vista (hereda de vehicles)
-- ============================================================================
-- Nota: Las vistas en PostgreSQL heredan los permisos de las tablas base
-- No requiere políticas RLS adicionales

-- ============================================================================
-- Índices adicionales para mejorar rendimiento de la vista
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_mantenimientos_tipo_placa 
    ON mantenimientos_vehiculos(placa_vehiculo, tipo);

-- Índice simplificado sin predicado CURRENT_DATE (no es inmutable)
CREATE INDEX IF NOT EXISTS idx_mantenimientos_fecha_salida 
    ON mantenimientos_vehiculos(fecha_salida);

CREATE INDEX IF NOT EXISTS idx_rutas_placa_kms 
    ON rutas_viajes(placa_vehiculo, kms_final DESC);

CREATE INDEX IF NOT EXISTS idx_seguros_placa_vencimiento 
    ON seguros_vehiculos(placa_vehiculo, fecha_vencimiento DESC);
