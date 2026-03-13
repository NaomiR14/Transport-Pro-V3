-- Forzar recreación de todas las vistas para eliminar referencias a vehicle_state

-- Paso 1: Eliminar todas las vistas dependientes primero
DROP VIEW IF EXISTS rutas_viajes_with_vehicle_state CASCADE;
DROP VIEW IF EXISTS vehicles_with_calculated_stats CASCADE;

-- Paso 2: Recrear vehicles_with_calculated_stats SIN vehicle_state
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
    v.maintenance_data,
    v.created_at,
    v.updated_at,
    
    -- Campos calculados
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
    -- Estado Calculado del Vehículo (SIN referencia a vehicle_state)
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

-- Paso 3: Recrear rutas_viajes_with_vehicle_state
CREATE VIEW rutas_viajes_with_vehicle_state AS
SELECT 
    r.id,
    r.fecha_salida,
    r.fecha_llegada,
    r.placa_vehiculo,
    v.estado_calculado AS estado_vehiculo_calculado,
    r.conductor,
    c.nombre_conductor,
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
    r.created_at,
    r.updated_at
FROM rutas_viajes r
LEFT JOIN vehicles_with_calculated_stats v ON r.placa_vehiculo = v.license_plate
LEFT JOIN conductores c ON r.conductor = c.documento_identidad;

-- Comentarios
COMMENT ON VIEW vehicles_with_calculated_stats IS 
'Vista que extiende vehicles con campos calculados. El estado es 100% calculado, no usa vehicle_state.';

COMMENT ON VIEW rutas_viajes_with_vehicle_state IS 
'Vista que proporciona toda la información de rutas_viajes con el estado calculado del vehículo desde vehicles_with_calculated_stats.';

-- Permisos
ALTER VIEW vehicles_with_calculated_stats SET (security_invoker = true);
ALTER VIEW rutas_viajes_with_vehicle_state SET (security_invoker = true);

GRANT SELECT ON vehicles_with_calculated_stats TO authenticated;
GRANT SELECT ON vehicles_with_calculated_stats TO anon;
GRANT SELECT ON rutas_viajes_with_vehicle_state TO authenticated;
GRANT SELECT ON rutas_viajes_with_vehicle_state TO anon;
