-- Agregar el nombre del conductor a la vista de rutas
-- Esto permite mostrar el nombre en lugar del documento en la UI

-- Paso 1: Eliminar la vista existente
DROP VIEW IF EXISTS rutas_viajes_with_vehicle_state CASCADE;

-- Paso 2: Recrear la vista con el nombre del conductor
CREATE VIEW rutas_viajes_with_vehicle_state AS
SELECT 
    r.id,
    r.fecha_salida,
    r.fecha_llegada,
    r.placa_vehiculo,
    v.estado_calculado AS estado_vehiculo_calculado,
    r.conductor,
    -- Agregar nombre del conductor desde la tabla conductores
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

-- Comentario
COMMENT ON VIEW rutas_viajes_with_vehicle_state IS 
'Vista que proporciona toda la información de rutas_viajes con el estado calculado del vehículo y el nombre del conductor.';

-- Permisos
ALTER VIEW rutas_viajes_with_vehicle_state SET (security_invoker = true);

GRANT SELECT ON rutas_viajes_with_vehicle_state TO authenticated;
GRANT SELECT ON rutas_viajes_with_vehicle_state TO anon;
