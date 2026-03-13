-- Migration: Swap total_combustible and volumen_combustible_gal
-- Now total_combustible is the input field and volumen_combustible_gal is calculated

-- Step 0: Drop dependent view first
DROP VIEW IF EXISTS rutas_viajes_with_vehicle_state CASCADE;

-- Step 1: Drop dependent GENERATED columns
ALTER TABLE rutas_viajes 
DROP COLUMN IF EXISTS ingreso_por_km,
DROP COLUMN IF EXISTS recorrido_por_galon,
DROP COLUMN IF EXISTS gasto_total,
DROP COLUMN IF EXISTS total_combustible;

-- Step 2: Change volumen_combustible_gal to GENERATED
ALTER TABLE rutas_viajes DROP COLUMN IF EXISTS volumen_combustible_gal;

-- Step 3: Add total_combustible as a normal column (user input)
ALTER TABLE rutas_viajes 
ADD COLUMN total_combustible NUMERIC(10, 2) NOT NULL DEFAULT 0;

-- Step 4: Add volumen_combustible_gal as GENERATED (calculated from total_combustible)
ALTER TABLE rutas_viajes 
ADD COLUMN volumen_combustible_gal NUMERIC(10, 2) GENERATED ALWAYS AS (
    CASE 
        WHEN precio_por_galon > 0 THEN total_combustible / precio_por_galon
        ELSE 0
    END
) STORED;

-- Step 5: Recreate gasto_total using total_combustible directly
ALTER TABLE rutas_viajes 
ADD COLUMN gasto_total NUMERIC(10, 2) GENERATED ALWAYS AS (
    total_combustible + gasto_peajes + gasto_comidas + otros_gastos
) STORED;

-- Step 6: Recreate recorrido_por_galon (km/gallon efficiency)
-- Note: Cannot reference another GENERATED column, so we expand the formula
ALTER TABLE rutas_viajes 
ADD COLUMN recorrido_por_galon NUMERIC(10, 2) GENERATED ALWAYS AS (
    CASE 
        WHEN total_combustible > 0 AND precio_por_galon > 0 
        THEN (kms_final - kms_inicial) / (total_combustible / precio_por_galon)
        ELSE 0
    END
) STORED;

-- Step 7: Recreate ingreso_por_km
ALTER TABLE rutas_viajes 
ADD COLUMN ingreso_por_km NUMERIC(10, 2) GENERATED ALWAYS AS (
    CASE 
        WHEN (kms_final - kms_inicial) > 0 THEN (peso_carga_kg * costo_por_kg) / (kms_final - kms_inicial)
        ELSE 0
    END
) STORED;

-- Step 8: Remove default from total_combustible (it should always be provided)
ALTER TABLE rutas_viajes ALTER COLUMN total_combustible DROP DEFAULT;

-- Comments for documentation
COMMENT ON COLUMN rutas_viajes.total_combustible IS 'Total amount spent on fuel (user input)';
COMMENT ON COLUMN rutas_viajes.volumen_combustible_gal IS 'Calculated fuel volume in gallons = total_combustible / precio_por_galon';
COMMENT ON COLUMN rutas_viajes.gasto_total IS 'Total expenses = total_combustible + peajes + comidas + otros_gastos';

-- Step 9: Recreate the dependent view
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
    r.total_combustible,
    r.volumen_combustible_gal,
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

COMMENT ON VIEW rutas_viajes_with_vehicle_state IS 
'Vista que proporciona toda la información de rutas_viajes con el estado calculado del vehículo y el nombre del conductor.';

ALTER VIEW rutas_viajes_with_vehicle_state SET (security_invoker = true);

GRANT SELECT ON rutas_viajes_with_vehicle_state TO authenticated;
GRANT SELECT ON rutas_viajes_with_vehicle_state TO anon;
