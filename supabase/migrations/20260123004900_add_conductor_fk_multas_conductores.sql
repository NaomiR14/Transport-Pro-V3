-- Migración para agregar FK de conductor en multas_conductores
-- Cambiamos de TEXT a referencia a conductores.documento_identidad

-- Paso 1: Agregar nueva columna con el tipo correcto
ALTER TABLE multas_conductores 
ADD COLUMN conductor_id TEXT;

-- Paso 2: Migrar datos existentes
-- Intentar hacer match con documento_identidad o nombre_conductor
UPDATE multas_conductores 
SET conductor_id = c.documento_identidad
FROM conductores c
WHERE multas_conductores.conductor = c.nombre_conductor 
   OR multas_conductores.conductor = c.documento_identidad;

-- Paso 3: Verificar cuántos registros no pudieron ser migrados
DO $$
DECLARE
    unmapped_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO unmapped_count
    FROM multas_conductores
    WHERE conductor IS NOT NULL AND conductor_id IS NULL;
    
    IF unmapped_count > 0 THEN
        RAISE NOTICE 'ADVERTENCIA: % registros de multas_conductores no pudieron ser mapeados a conductores existentes', unmapped_count;
        RAISE NOTICE 'Estos registros mantendrán conductor_id = NULL. Revisa los datos manualmente.';
    ELSE
        RAISE NOTICE 'Migración exitosa: todos los conductores fueron mapeados correctamente';
    END IF;
END $$;

-- Paso 4: Eliminar la columna antigua
ALTER TABLE multas_conductores 
DROP COLUMN conductor;

-- Paso 5: Renombrar la nueva columna
ALTER TABLE multas_conductores 
RENAME COLUMN conductor_id TO conductor;

-- Paso 6: Agregar la Foreign Key
ALTER TABLE multas_conductores 
ADD CONSTRAINT fk_conductor_multas 
    FOREIGN KEY (conductor) 
    REFERENCES conductores(documento_identidad) 
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

-- Paso 7: El índice ya existe (idx_multas_conductor), pero lo recreamos por si acaso
DROP INDEX IF EXISTS idx_multas_conductor;
CREATE INDEX idx_multas_conductor ON multas_conductores(conductor);

-- Paso 8: Actualizar constraint para que sea NOT NULL si todos los datos son válidos
-- (comentado por seguridad, descomentar si todos los registros tienen conductor válido)
-- ALTER TABLE multas_conductores ALTER COLUMN conductor SET NOT NULL;

-- Comentario para documentación
COMMENT ON COLUMN multas_conductores.conductor IS 'Documento de identidad del conductor (FK a conductores.documento_identidad)';
