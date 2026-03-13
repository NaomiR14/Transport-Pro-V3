-- Limpiar referencias a estado_vehiculo en rutas_viajes
-- Esta migración elimina la columna estado_vehiculo y el trigger relacionado
-- porque ahora usamos estado_vehiculo_calculado desde la vista

-- Paso 1: Eliminar el trigger si existe
DROP TRIGGER IF EXISTS sync_estado_vehiculo_on_rutas ON rutas_viajes;

-- Paso 2: Eliminar la función del trigger
DROP FUNCTION IF EXISTS sync_estado_vehiculo_rutas() CASCADE;

-- Paso 3: Eliminar el índice asociado
DROP INDEX IF EXISTS idx_rutas_viajes_estado_vehiculo;

-- Paso 4: Eliminar la constraint de check
ALTER TABLE rutas_viajes 
DROP CONSTRAINT IF EXISTS check_estado_vehiculo_rutas;

-- Paso 5: Eliminar la columna estado_vehiculo
ALTER TABLE rutas_viajes 
DROP COLUMN IF EXISTS estado_vehiculo;

-- Comentario explicativo
COMMENT ON TABLE rutas_viajes IS 
'Tabla de rutas de viajes. El estado del vehículo se obtiene dinámicamente desde la vista rutas_viajes_with_vehicle_state que calcula el estado en tiempo real.';
