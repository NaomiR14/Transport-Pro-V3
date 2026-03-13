-- Crear vista para rutas con estado calculado del vehículo desde la vista de vehículos
CREATE OR REPLACE VIEW rutas_viajes_with_vehicle_state AS
SELECT 
    r.id,
    r.fecha_salida,
    r.fecha_llegada,
    r.placa_vehiculo,
    -- Obtener el estado calculado del vehículo desde la vista
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
    r.created_at,
    r.updated_at
FROM rutas_viajes r
LEFT JOIN vehicles_with_calculated_stats v ON r.placa_vehiculo = v.license_plate;

-- Comentario explicativo de la vista
COMMENT ON VIEW rutas_viajes_with_vehicle_state IS 
'Vista que proporciona toda la información de rutas_viajes con el estado calculado del vehículo
desde la vista vehicles_with_calculated_stats. El estado_vehiculo_calculado refleja el estado actual
del vehículo (Disponible, En Mantenimiento, Seguro Vencido, Seguro Por Vencer).';

-- Habilitar RLS en la vista (hereda las políticas de la tabla base)
ALTER VIEW rutas_viajes_with_vehicle_state SET (security_invoker = true);

-- Otorgar permisos de SELECT en la vista
GRANT SELECT ON rutas_viajes_with_vehicle_state TO authenticated;
GRANT SELECT ON rutas_viajes_with_vehicle_state TO anon;
