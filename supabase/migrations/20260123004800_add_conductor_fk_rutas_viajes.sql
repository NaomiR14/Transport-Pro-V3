-- Migración para agregar FK de conductor en rutas_viajes
-- Cambiamos de TEXT a referencia a conductores.documento_identidad

-- Paso 1: Agregar nueva columna con el tipo correcto
ALTER TABLE rutas_viajes 
ADD COLUMN conductor_id TEXT;

-- Paso 2: Migrar datos existentes
-- Intentar hacer match con documento_identidad o nombre_conductor
UPDATE rutas_viajes 
SET conductor_id = c.documento_identidad
FROM conductores c
WHERE rutas_viajes.conductor = c.nombre_conductor 
   OR rutas_viajes.conductor = c.documento_identidad;

-- Paso 3: Verificar cuántos registros no pudieron ser migrados
DO $$
DECLARE
    unmapped_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unmapped_count
    FROM rutas_viajes
    WHERE conductor IS NOT NULL AND conductor_id IS NULL;
    
    IF unmapped_count > 0 THEN
        RAISE NOTICE 'ADVERTENCIA: % registros de rutas_viajes no pudieron ser mapeados a conductores existentes', unmapped_count;
        RAISE NOTICE 'Estos registros mantendrán conductor_id = NULL. Revisa los datos manualmente.';
    ELSE
        RAISE NOTICE 'Migración exitosa: todos los conductores fueron mapeados correctamente';
    END IF;
END $$;

-- Paso 4: Eliminar la columna antigua
ALTER TABLE rutas_viajes 
DROP COLUMN conductor;

-- Paso 5: Renombrar la nueva columna
ALTER TABLE rutas_viajes 
RENAME COLUMN conductor_id TO conductor;

-- Paso 6: Agregar la Foreign Key
ALTER TABLE rutas_viajes 
ADD CONSTRAINT fk_conductor_rutas 
    FOREIGN KEY (conductor) 
    REFERENCES conductores(documento_identidad) 
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- Paso 7: Agregar índice para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_rutas_viajes_conductor_fk ON rutas_viajes(conductor);

-- Paso 8: Actualizar constraint para que sea NOT NULL si todos los datos son válidos
-- (comentado por seguridad, descomentar si todos los registros tienen conductor válido)
-- ALTER TABLE rutas_viajes ALTER COLUMN conductor SET NOT NULL;

-- Comentario para documentación
COMMENT ON COLUMN rutas_viajes.conductor IS 'Documento de identidad del conductor (FK a conductores.documento_identidad)';
