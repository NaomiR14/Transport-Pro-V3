-- Solución simple: solo eliminar duplicados 'City' si existen
-- Los IDs pueden quedar con espacios, no es crítico para el funcionamiento

-- Eliminar cualquier duplicado 'City' que tenga el mismo brand_id que otro 'City'
DELETE FROM vehicle_models 
WHERE name = 'City' 
AND id NOT IN (
    SELECT MIN(id) 
    FROM vehicle_models 
    WHERE name = 'City' 
    GROUP BY brand_id
);

-- Resetear la secuencia
SELECT setval('vehicle_models_id_seq', COALESCE((SELECT MAX(id) FROM vehicle_models), 1));
