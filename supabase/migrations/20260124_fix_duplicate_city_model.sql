-- Eliminar el registro duplicado de 'City' (id=5)
-- y renumerar los IDs posteriores
DELETE FROM vehicle_models WHERE id = 5 AND name = 'City';

-- Actualizar los IDs de los modelos posteriores para que sean secuenciales
UPDATE vehicle_models SET id = 5 WHERE id = 6;  -- Civic
UPDATE vehicle_models SET id = 6 WHERE id = 7;  -- Pilot
UPDATE vehicle_models SET id = 7 WHERE id = 8;  -- Legend
UPDATE vehicle_models SET id = 8 WHERE id = 9;  -- Intoura
UPDATE vehicle_models SET id = 9 WHERE id = 10; -- Sprinter City
UPDATE vehicle_models SET id = 10 WHERE id = 11; -- Sprinter Transfer
UPDATE vehicle_models SET id = 11 WHERE id = 12; -- Sprinter Travel
UPDATE vehicle_models SET id = 12 WHERE id = 13; -- Eclipse Cross
UPDATE vehicle_models SET id = 13 WHERE id = 14; -- Outlander
UPDATE vehicle_models SET id = 14 WHERE id = 15; -- Xpander
UPDATE vehicle_models SET id = 15 WHERE id = 16; -- Qasqai
UPDATE vehicle_models SET id = 16 WHERE id = 17; -- Santa Fe
UPDATE vehicle_models SET id = 17 WHERE id = 18; -- Sentra
UPDATE vehicle_models SET id = 18 WHERE id = 19; -- Tiida
UPDATE vehicle_models SET id = 19 WHERE id = 20; -- Versa
UPDATE vehicle_models SET id = 20 WHERE id = 21; -- Q-500
UPDATE vehicle_models SET id = 21 WHERE id = 22; -- R-450
UPDATE vehicle_models SET id = 22 WHERE id = 23; -- Camry
UPDATE vehicle_models SET id = 23 WHERE id = 24; -- Corolla
UPDATE vehicle_models SET id = 24 WHERE id = 25; -- Hilux
UPDATE vehicle_models SET id = 25 WHERE id = 26; -- Rav4
UPDATE vehicle_models SET id = 26 WHERE id = 27; -- Rush
UPDATE vehicle_models SET id = 27 WHERE id = 28; -- Fest
UPDATE vehicle_models SET id = 28 WHERE id = 29; -- Gol
UPDATE vehicle_models SET id = 29 WHERE id = 30; -- Tiguan
UPDATE vehicle_models SET id = 30 WHERE id = 31; -- Xtreme

-- Resetear la secuencia
SELECT setval('vehicle_models_id_seq', (SELECT MAX(id) FROM vehicle_models));
