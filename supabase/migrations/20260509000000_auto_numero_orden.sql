-- Número de orden auto-generado por empresa (secuencia correlativa por empresa_id)

-- 1. Quitar la restricción UNIQUE global (será reemplazada por una por empresa)
ALTER TABLE ordenes DROP CONSTRAINT IF EXISTS ordenes_numero_orden_key;

-- 2. Agregar columna de secuencia entera
ALTER TABLE ordenes ADD COLUMN IF NOT EXISTS numero_secuencia INTEGER;

-- 3. Retroalimentar registros existentes con números secuenciales por empresa
WITH ranked AS (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY empresa_id ORDER BY created_at ASC) AS rn
    FROM ordenes
)
UPDATE ordenes o
SET numero_secuencia = r.rn
FROM ranked r
WHERE o.id = r.id;

-- 4. Actualizar numero_orden de los registros existentes al nuevo formato
UPDATE ordenes
SET numero_orden = 'ORD-' || LPAD(numero_secuencia::text, 4, '0');

-- 5. Hacer la columna NOT NULL
ALTER TABLE ordenes ALTER COLUMN numero_secuencia SET NOT NULL;

-- 6. Restricción única por empresa (cada empresa tiene su propia secuencia)
ALTER TABLE ordenes
    ADD CONSTRAINT ordenes_empresa_secuencia_unique UNIQUE (empresa_id, numero_secuencia);

-- 7. Función que calcula el siguiente número y lo asigna
CREATE OR REPLACE FUNCTION generate_numero_orden()
RETURNS TRIGGER AS $$
DECLARE
    next_seq INTEGER;
BEGIN
    SELECT COALESCE(MAX(numero_secuencia), 0) + 1
    INTO next_seq
    FROM ordenes
    WHERE empresa_id = NEW.empresa_id;

    NEW.numero_secuencia := next_seq;
    NEW.numero_orden     := 'ORD-' || LPAD(next_seq::text, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger BEFORE INSERT
DROP TRIGGER IF EXISTS trigger_generate_numero_orden ON ordenes;
CREATE TRIGGER trigger_generate_numero_orden
    BEFORE INSERT ON ordenes
    FOR EACH ROW
    EXECUTE FUNCTION generate_numero_orden();
