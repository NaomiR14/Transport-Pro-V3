-- ============================================================================
-- Eliminar columna vehicle_state y actualizar vista
-- El estado del vehículo será 100% calculado
-- ============================================================================

-- Paso 1: Recrear la vista sin vehicle_state
DROP VIEW IF EXISTS vehicles_with_calculated_stats;

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
    -- Campos originales del vehículo (SIN vehicle_state)
    v.id,
    v.type,
    v.brand,
    v.model,
    v.license_plate,
    v.serial_number,
    v.color,
    v.year,
    v.max_load_capacity,
    -- vehicle_state ELIMINADO
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
    
    -- Estado Calculado del Vehículo (SIN referencia a vehicle_state)
    -- Prioridad: 1) En Mantenimiento, 2) Seguro Vencido, 3) Seguro Por Vencer, 4) Disponible
    CASE 
        WHEN ma.placa_vehiculo IS NOT NULL THEN 'En Mantenimiento'
        WHEN sa.estado_poliza IN ('vencida') THEN 'Seguro Vencido'
        WHEN sa.estado_poliza IN ('por_vencer') THEN 'Seguro Por Vencer'
        -- Línea "WHEN v.vehicle_state = 'inactivo' THEN 'Inactivo'" ELIMINADA
        ELSE 'Disponible'
    END AS estado_calculado,
    
    -- Alerta de Mantenimiento
    -- ≤5% restante → "Mantener", ≤20% → "Falta poco", otro → "Al día"
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

-- Comentarios para documentación
COMMENT ON VIEW vehicles_with_calculated_stats IS 
'Vista que extiende vehicles con campos calculados basados en las fórmulas del Excel de Control de Flota.
Incluye: estado calculado, alertas de mantenimiento, kms restantes, estado de seguro, etc.
El estado es 100% calculado, no usa vehicle_state.';

COMMENT ON COLUMN vehicles_with_calculated_stats.estado_calculado IS 
'Estado automático: "En Mantenimiento" si tiene manto activo, "Seguro Vencido" si póliza vencida, "Seguro Por Vencer" si está por vencer, sino "Disponible"';

COMMENT ON COLUMN vehicles_with_calculated_stats.alerta_mantenimiento IS 
'Alerta basada en % del ciclo: "Mantener" (≥95%), "Falta poco" (≥80%), "Al día" (<80%)';

COMMENT ON COLUMN vehicles_with_calculated_stats.kms_restantes_mantenimiento IS 
'Kilómetros restantes = ciclo - (odómetro_actual - último_km_preventivo)';

-- Paso 2: Eliminar la columna vehicle_state de la tabla vehicles
ALTER TABLE vehicles DROP COLUMN IF EXISTS vehicle_state;

-- Paso 3: Actualizar el CHECK constraint si existía
-- (Ya no aplica porque la columna fue eliminada)
