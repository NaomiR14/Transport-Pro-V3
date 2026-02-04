-- Migración para actualizar las foreign keys de ON DELETE RESTRICT a ON DELETE CASCADE
-- Esto permite eliminar vehículos y conductores incluso si tienen registros relacionados

-- 1. RUTAS_VIAJES - FK de vehículo
-- Primero eliminar la constraint existente
ALTER TABLE rutas_viajes DROP CONSTRAINT IF EXISTS fk_vehicle;
ALTER TABLE rutas_viajes DROP CONSTRAINT IF EXISTS rutas_viajes_placa_vehiculo_fkey;

-- Recrear con CASCADE
ALTER TABLE rutas_viajes 
ADD CONSTRAINT fk_vehicle 
    FOREIGN KEY (placa_vehiculo) 
    REFERENCES vehicles(license_plate) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 2. RUTAS_VIAJES - FK de conductor (si ya existe)
ALTER TABLE rutas_viajes DROP CONSTRAINT IF EXISTS fk_conductor_rutas;
ALTER TABLE rutas_viajes DROP CONSTRAINT IF EXISTS rutas_viajes_conductor_fkey;

-- Recrear con CASCADE
ALTER TABLE rutas_viajes 
ADD CONSTRAINT fk_conductor_rutas 
    FOREIGN KEY (conductor) 
    REFERENCES conductores(documento_identidad) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 3. MULTAS_CONDUCTORES - FK de vehículo
ALTER TABLE multas_conductores DROP CONSTRAINT IF EXISTS fk_vehicle_multa;
ALTER TABLE multas_conductores DROP CONSTRAINT IF EXISTS multas_conductores_placa_vehiculo_fkey;

-- Recrear con CASCADE
ALTER TABLE multas_conductores 
ADD CONSTRAINT fk_vehicle_multa 
    FOREIGN KEY (placa_vehiculo) 
    REFERENCES vehicles(license_plate) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 4. MULTAS_CONDUCTORES - FK de conductor (si ya existe)
ALTER TABLE multas_conductores DROP CONSTRAINT IF EXISTS fk_conductor_multas;
ALTER TABLE multas_conductores DROP CONSTRAINT IF EXISTS multas_conductores_conductor_fkey;

-- Recrear con CASCADE
ALTER TABLE multas_conductores 
ADD CONSTRAINT fk_conductor_multas 
    FOREIGN KEY (conductor) 
    REFERENCES conductores(documento_identidad) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 5. MANTENIMIENTOS_VEHICULOS - FK de vehículo
ALTER TABLE mantenimientos_vehiculos DROP CONSTRAINT IF EXISTS fk_vehicle_mantenimiento;
ALTER TABLE mantenimientos_vehiculos DROP CONSTRAINT IF EXISTS mantenimientos_vehiculos_placa_vehiculo_fkey;

-- Recrear con CASCADE
ALTER TABLE mantenimientos_vehiculos 
ADD CONSTRAINT fk_vehicle_mantenimiento 
    FOREIGN KEY (placa_vehiculo) 
    REFERENCES vehicles(license_plate) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 6. MANTENIMIENTOS_VEHICULOS - FK de taller
ALTER TABLE mantenimientos_vehiculos DROP CONSTRAINT IF EXISTS fk_taller;
ALTER TABLE mantenimientos_vehiculos DROP CONSTRAINT IF EXISTS mantenimientos_vehiculos_taller_fkey;

-- Recrear con CASCADE
ALTER TABLE mantenimientos_vehiculos 
ADD CONSTRAINT fk_taller 
    FOREIGN KEY (taller) 
    REFERENCES talleres(name) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 7. SEGUROS_VEHICULOS - FK de vehículo
ALTER TABLE seguros_vehiculos DROP CONSTRAINT IF EXISTS fk_vehicle_seguro;
ALTER TABLE seguros_vehiculos DROP CONSTRAINT IF EXISTS seguros_vehiculos_placa_vehiculo_fkey;

-- Recrear con CASCADE
ALTER TABLE seguros_vehiculos 
ADD CONSTRAINT fk_vehicle_seguro 
    FOREIGN KEY (placa_vehiculo) 
    REFERENCES vehicles(license_plate) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- 8. IMPUESTOS_VEHICULARES - FK de vehículo
ALTER TABLE impuestos_vehiculares DROP CONSTRAINT IF EXISTS fk_vehicle_impuesto;
ALTER TABLE impuestos_vehiculares DROP CONSTRAINT IF EXISTS impuestos_vehiculares_placa_vehiculo_fkey;

-- Recrear con CASCADE
ALTER TABLE impuestos_vehiculares 
ADD CONSTRAINT fk_vehicle_impuesto 
    FOREIGN KEY (placa_vehiculo) 
    REFERENCES vehicles(license_plate) 
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- Comentarios para documentación
COMMENT ON CONSTRAINT fk_vehicle ON rutas_viajes IS 'FK a vehicles con CASCADE - eliminar rutas al eliminar vehículo';
COMMENT ON CONSTRAINT fk_conductor_rutas ON rutas_viajes IS 'FK a conductores con CASCADE - eliminar rutas al eliminar conductor';
COMMENT ON CONSTRAINT fk_vehicle_multa ON multas_conductores IS 'FK a vehicles con CASCADE - eliminar multas al eliminar vehículo';
COMMENT ON CONSTRAINT fk_conductor_multas ON multas_conductores IS 'FK a conductores con CASCADE - eliminar multas al eliminar conductor';

-- Notificación
DO $$
BEGIN
    RAISE NOTICE 'Foreign keys actualizadas a ON DELETE CASCADE exitosamente';
END $$;
