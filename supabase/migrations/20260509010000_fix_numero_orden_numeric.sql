-- Corregir numero_orden a formato numérico puro (1, 2, 3...)
-- La migración anterior aplicó el formato ORD-XXXX; este patch lo convierte a entero.

-- 1. Actualizar registros existentes quitando el prefijo "ORD-"
UPDATE ordenes
SET numero_orden = numero_secuencia::text
WHERE numero_orden ~ '^ORD-';

-- 2. Recrear la función del trigger con formato numérico puro
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
    NEW.numero_orden     := next_seq::text;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
