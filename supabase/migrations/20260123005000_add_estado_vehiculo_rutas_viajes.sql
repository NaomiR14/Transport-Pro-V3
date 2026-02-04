-- Migración OPCIONAL para agregar campo estado_vehiculo en rutas_viajes
-- Este campo existe en el Excel pero no en la implementación actual de Supabase
-- Solo ejecutar si se requiere en la aplicación

-- Agregar la columna estado_vehiculo
ALTER TABLE rutas_viajes 
ADD COLUMN estado_vehiculo TEXT;

-- Agregar CHECK constraint para validar valores permitidos
ALTER TABLE rutas_viajes 
ADD CONSTRAINT check_estado_vehiculo_rutas 
    CHECK (estado_vehiculo IN ('activo', 'inactivo', 'mantenimiento', 'disponible', 'en_uso') OR estado_vehiculo IS NULL);

-- Agregar índice si se va a filtrar frecuentemente por este campo
CREATE INDEX IF NOT EXISTS idx_rutas_viajes_estado_vehiculo ON rutas_viajes(estado_vehiculo);

-- Opcional: Sincronizar automáticamente con el estado del vehículo
-- Este trigger copiará el estado actual del vehículo al momento de crear/actualizar la ruta
CREATE OR REPLACE FUNCTION sync_estado_vehiculo_rutas()
RETURNS TRIGGER AS $$
BEGIN
    -- Al insertar o actualizar, obtener el estado actual del vehículo
    IF NEW.estado_vehiculo IS NULL THEN
        SELECT vehicle_state INTO NEW.estado_vehiculo
        FROM vehicles
        WHERE license_plate = NEW.placa_vehiculo;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger (comentado por defecto, descomentar si se necesita sincronización automática)
-- CREATE TRIGGER sync_estado_vehiculo_on_rutas
--     BEFORE INSERT OR UPDATE ON rutas_viajes
--     FOR EACH ROW
--     EXECUTE FUNCTION sync_estado_vehiculo_rutas();

-- Comentario para documentación
COMMENT ON COLUMN rutas_viajes.estado_vehiculo IS 'Estado del vehículo al momento del viaje (opcional, puede ser NULL)';

-- Nota: Este campo es opcional. Si no se necesita, puedes revertir esta migración con:
-- ALTER TABLE rutas_viajes DROP COLUMN estado_vehiculo;
-- DROP FUNCTION IF EXISTS sync_estado_vehiculo_rutas() CASCADE;
