-- Migración para corregir tipos de datos en la tabla vehicles
-- Cambiar year de TEXT a INTEGER y max_load_capacity de TEXT a NUMERIC

-- Primero, agregar columnas temporales con el tipo correcto
ALTER TABLE vehicles 
ADD COLUMN year_temp INTEGER,
ADD COLUMN max_load_capacity_temp NUMERIC(10, 2);

-- Migrar datos existentes (convertir TEXT a números)
-- Para year: extraer solo números, usar 2020 como default si es NULL o inválido
UPDATE vehicles 
SET year_temp = CASE 
    WHEN year IS NOT NULL AND year ~ '^[0-9]+$' THEN year::INTEGER
    ELSE 2020  -- Valor por defecto para registros sin año
END;

-- Para max_load_capacity: extraer números y convertir, usar 1000 como default si es NULL o inválido
UPDATE vehicles 
SET max_load_capacity_temp = CASE 
    WHEN max_load_capacity IS NOT NULL AND max_load_capacity ~ '^[0-9]+\.?[0-9]*$' THEN max_load_capacity::NUMERIC(10, 2)
    WHEN max_load_capacity IS NOT NULL AND max_load_capacity ~ '^[0-9]+,?[0-9]*$' THEN REPLACE(max_load_capacity, ',', '.')::NUMERIC(10, 2)
    ELSE 1000.00  -- Valor por defecto en kg para registros sin capacidad
END;

-- Reportar registros que fueron actualizados con valores por defecto
DO $$
DECLARE
    year_defaults INTEGER;
    capacity_defaults INTEGER;
BEGIN
    SELECT COUNT(*) INTO year_defaults
    FROM vehicles
    WHERE year IS NULL OR year !~ '^[0-9]+$';
    
    SELECT COUNT(*) INTO capacity_defaults
    FROM vehicles
    WHERE max_load_capacity IS NULL 
       OR (max_load_capacity !~ '^[0-9]+\.?[0-9]*$' AND max_load_capacity !~ '^[0-9]+,?[0-9]*$');
    
    IF year_defaults > 0 THEN
        RAISE NOTICE 'ADVERTENCIA: % vehículos tenían year NULL o inválido. Se estableció 2020 por defecto.', year_defaults;
    END IF;
    
    IF capacity_defaults > 0 THEN
        RAISE NOTICE 'ADVERTENCIA: % vehículos tenían max_load_capacity NULL o inválido. Se estableció 1000 kg por defecto.', capacity_defaults;
    END IF;
END $$;

-- Eliminar las columnas antiguas
ALTER TABLE vehicles 
DROP COLUMN year,
DROP COLUMN max_load_capacity;

-- Renombrar las columnas temporales
ALTER TABLE vehicles 
RENAME COLUMN year_temp TO year;

ALTER TABLE vehicles 
RENAME COLUMN max_load_capacity_temp TO max_load_capacity;

-- Agregar constraints NOT NULL si se requieren
ALTER TABLE vehicles 
ALTER COLUMN year SET NOT NULL,
ALTER COLUMN max_load_capacity SET NOT NULL;

-- Agregar CHECK constraint para year (debe ser razonable)
ALTER TABLE vehicles 
ADD CONSTRAINT check_year_range CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1);

-- Agregar CHECK constraint para max_load_capacity (debe ser positivo)
ALTER TABLE vehicles 
ADD CONSTRAINT check_max_load_positive CHECK (max_load_capacity > 0);

-- Comentarios para documentación
COMMENT ON COLUMN vehicles.year IS 'Año de fabricación del vehículo (INTEGER)';
COMMENT ON COLUMN vehicles.max_load_capacity IS 'Capacidad máxima de carga en kilogramos (NUMERIC)';
