-- Seed data para ordenes
-- Nota: Ejecutar DESPUÉS de rutas_viajes_seed.sql (requiere que existan rutas y vehículos)
--
-- Este seed inserta órdenes referenciando las rutas creadas en rutas_viajes_seed.sql.
-- Como los IDs de rutas_viajes son generados automáticamente, usamos subqueries
-- para referenciarlos por origen+destino+placa.

-- Orden 1: Pendiente - Lima a Arequipa (con carta porte)
INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte)
SELECT
    'ORD-2024-001',
    'ABC-123',
    id,
    'pendiente',
    'CP-2024-00158'
FROM rutas_viajes
WHERE origen = 'Lima' AND destino = 'Arequipa' AND placa_vehiculo = 'ABC-123'
LIMIT 1;

-- Orden 2: En tránsito - Arequipa a Lima (sin carta porte)
INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte)
SELECT
    'ORD-2024-002',
    'XYZ-789',
    id,
    'transito',
    NULL
FROM rutas_viajes
WHERE origen = 'Arequipa' AND destino = 'Lima' AND placa_vehiculo = 'XYZ-789'
LIMIT 1;

-- Orden 3: Entregada - Lima a Cusco (con carta porte)
INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte)
SELECT
    'ORD-2024-003',
    'DEF-456',
    id,
    'entregado',
    'CP-2024-00203'
FROM rutas_viajes
WHERE origen = 'Lima' AND destino = 'Cusco' AND placa_vehiculo = 'DEF-456'
LIMIT 1;

-- Orden 4: Pendiente - misma ruta que orden 1 pero otra orden (sin carta porte)
INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte)
SELECT
    'ORD-2024-004',
    'ABC-123',
    id,
    'pendiente',
    NULL
FROM rutas_viajes
WHERE origen = 'Lima' AND destino = 'Arequipa' AND placa_vehiculo = 'ABC-123'
LIMIT 1;

-- Orden 5: En tránsito - Lima a Cusco (con carta porte)
INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte)
SELECT
    'ORD-2024-005',
    'DEF-456',
    id,
    'transito',
    'CP-2024-00210'
FROM rutas_viajes
WHERE origen = 'Lima' AND destino = 'Cusco' AND placa_vehiculo = 'DEF-456'
LIMIT 1;
