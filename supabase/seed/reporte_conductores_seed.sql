-- ============================================================
-- Seed: Datos de prueba para Reporte de Conductores
-- Propósito: Verificar el funcionamiento de /indicadores-conductor
-- Período cubierto: Enero–Marzo 2026 (año actual del proyecto)
-- Conductores: 5 activos (3 existentes + 2 nuevos)
-- Viajes: 28 en total
-- Multas: 4 (variedad de estados de pago)
--
-- INSTRUCCIONES DE USO:
--   Opción A — aplicar directamente a la base de datos local:
--     psql $DATABASE_URL -f supabase/seed/reporte_conductores_seed.sql
--
--   Opción B — reiniciar BD local (aplica todas las migraciones + seeds):
--     supabase db reset
--
--   Opción C — aplicar solo este archivo con Supabase CLI:
--     supabase db execute --file supabase/seed/reporte_conductores_seed.sql
--
-- DEPENDENCIAS (deben ejecutarse antes si no se usa db reset):
--   1. vehicles_seed.sql   → placas ABC-123, XYZ-789, GHI-789, JKL-012, MNO-345
--   2. conductores_seed.sql → conductores 12345678, 87654321, 55667788
-- ============================================================


-- ── 1. Conductores ────────────────────────────────────────────────────────────
-- Se agregan 2 conductores nuevos. ON CONFLICT preserva los existentes.
INSERT INTO conductores (
  documento_identidad, nombre_conductor, numero_licencia,
  direccion, telefono, email, activo, fecha_vencimiento_licencia
) VALUES
  ('99887766', 'Luis Ramírez Torres',    'LIC-2024-088',
   'Calle Norte 100, Lima',       '+51 1 333-4455',   'luis.ramirez@empresa.com',    true, '2027-05-20'),
  ('44556677', 'Patricia Mendoza Vega',  'LIC-2023-112',
   'Av. Lima 500, Arequipa',      '+51 54 222-3344',  'patricia.mendoza@empresa.com', true, '2026-11-30')
ON CONFLICT (documento_identidad) DO NOTHING;


-- ── 2. Rutas y Viajes ─────────────────────────────────────────────────────────
-- Campos GENERATED (NO insertar):
--   kms_recorridos, ingreso_total, volumen_combustible_gal,
--   gasto_total, recorrido_por_galon, ingreso_por_km
--
-- IMPORTANTE (migración 20260313014700):
--   total_combustible = monto total gastado en combustible (INPUT)
--   volumen_combustible_gal = GENERATED (total_combustible / precio_por_galon)
--   conductor = documento_identidad del conductor (FK)
INSERT INTO rutas_viajes (
  fecha_salida, fecha_llegada, placa_vehiculo, conductor,
  origen, destino,
  kms_inicial, kms_final,
  peso_carga_kg, costo_por_kg,
  estacion_combustible, tipo_combustible,
  precio_por_galon, total_combustible,
  gasto_peajes, gasto_comidas, otros_gastos, observaciones
) VALUES

  -- ────────────────────────────────────────────────────────────
  -- Juan Pérez García (12345678)  →  8 viajes | 1 multa
  -- Perfil: alto volumen, rutas largas, mayor ingreso
  -- ────────────────────────────────────────────────────────────

  -- Enero 2026  — Juan (total_combustible = volumen * precio)
  ('2026-01-05 07:00:00+00', '2026-01-06 18:00:00+00', 'ABC-123', '12345678',
   'Lima', 'Arequipa',  60000, 60820, 5000, 14.50,
   'Pecsa Benavides', 'Diesel', 46.00, 1610.00, 1200, 900, 300,
   'Viaje sin novedades'),

  ('2026-01-12 06:30:00+00', '2026-01-13 17:00:00+00', 'ABC-123', '12345678',
   'Arequipa', 'Cusco',  60820, 61470, 4200, 13.80,
   'Pecsa Benavides', 'Diesel', 46.00, 1380.00, 980, 850, 250,
   'Clima lluvioso en sierra'),

  ('2026-01-20 08:00:00+00', '2026-01-21 19:30:00+00', 'ABC-123', '12345678',
   'Lima', 'Trujillo',  61470, 62060, 6000, 15.00,
   'Primax Norte', 'Diesel', 47.00, 1880.00, 1100, 950, 400,
   'Entrega urgente, cliente satisfecho'),

  -- Febrero 2026  — Juan
  ('2026-02-03 07:00:00+00', '2026-02-04 16:30:00+00', 'ABC-123', '12345678',
   'Lima', 'Chiclayo',  62060, 62820, 5500, 14.00,
   'Pecsa Benavides', 'Diesel', 46.50, 1767.00, 1050, 900, 280,
   NULL),

  ('2026-02-18 08:30:00+00', '2026-02-19 18:00:00+00', 'ABC-123', '12345678',
   'Lima', 'Piura',     62820, 63830, 6500, 15.50,
   'Primax Norte', 'Diesel', 47.00, 2115.00, 1300, 1100, 450,
   'Carga frágil, manejo cuidadoso'),

  -- Marzo 2026  — Juan
  ('2026-03-04 06:00:00+00', '2026-03-05 17:30:00+00', 'ABC-123', '12345678',
   'Lima', 'Arequipa',  63830, 64650, 4800, 14.50,
   'Pecsa Benavides', 'Diesel', 46.00, 1656.00, 1200, 900, 300,
   NULL),

  ('2026-03-14 07:30:00+00', '2026-03-15 18:00:00+00', 'ABC-123', '12345678',
   'Arequipa', 'Puno',  64650, 65060, 3500, 13.50,
   'Repsol Sur', 'Diesel', 45.50, 1274.00, 800, 750, 200,
   NULL),

  ('2026-03-25 08:00:00+00', '2026-03-26 19:00:00+00', 'ABC-123', '12345678',
   'Lima', 'Ica',       65060, 65420, 5200, 14.20,
   'Pecsa Benavides', 'Diesel', 46.00, 1380.00, 700, 800, 250,
   'Ruta sin incidentes'),

  -- ────────────────────────────────────────────────────────────
  -- María López Hernández (87654321)  →  7 viajes | 0 multas
  -- Perfil: desempeño consistente, sin multas
  -- ────────────────────────────────────────────────────────────

  -- Enero 2026  — María
  ('2026-01-08 07:00:00+00', '2026-01-09 17:30:00+00', 'XYZ-789', '87654321',
   'Lima', 'Huancayo',  30000, 30620, 2000, 18.00,
   'Primax Javier Prado', 'Premium', 52.00, 1664.00, 900, 800, 200,
   NULL),

  ('2026-01-22 08:00:00+00', '2026-01-23 17:00:00+00', 'XYZ-789', '87654321',
   'Huancayo', 'Lima',  30620, 31240, 2200, 17.50,
   'Primax Javier Prado', 'Premium', 52.00, 1664.00, 900, 800, 200,
   NULL),

  -- Febrero 2026  — María
  ('2026-02-05 07:30:00+00', '2026-02-06 16:30:00+00', 'XYZ-789', '87654321',
   'Lima', 'Ica',       31240, 31600, 2500, 16.00,
   'Pecsa Centro', 'Premium', 51.50, 1287.50, 600, 700, 180,
   NULL),

  ('2026-02-14 08:00:00+00', '2026-02-15 17:00:00+00', 'XYZ-789', '87654321',
   'Ica', 'Arequipa',   31600, 32450, 3000, 17.00,
   'Repsol Sur', 'Premium', 52.50, 1995.00, 1100, 900, 300,
   'Carga refrigerada'),

  ('2026-02-25 07:00:00+00', '2026-02-26 16:00:00+00', 'XYZ-789', '87654321',
   'Arequipa', 'Lima',  32450, 33280, 2800, 16.50,
   'Primax Javier Prado', 'Premium', 52.00, 1872.00, 1050, 850, 220,
   NULL),

  -- Marzo 2026  — María
  ('2026-03-10 07:00:00+00', '2026-03-11 18:00:00+00', 'XYZ-789', '87654321',
   'Lima', 'Trujillo',  33280, 33850, 2400, 17.00,
   'Primax Norte', 'Premium', 52.00, 1716.00, 950, 820, 200,
   NULL),

  ('2026-03-22 08:30:00+00', '2026-03-23 17:30:00+00', 'XYZ-789', '87654321',
   'Trujillo', 'Chiclayo', 33850, 34010, 1800, 18.50,
   'Primax Norte', 'Premium', 52.00, 1144.00, 500, 650, 150,
   NULL),

  -- ────────────────────────────────────────────────────────────
  -- Ana García Silva (55667788)  →  4 viajes | 2 multas
  -- Perfil: volumen bajo, 2 multas con distinto estado de pago
  -- ────────────────────────────────────────────────────────────

  -- Enero 2026  — Ana
  ('2026-01-15 08:00:00+00', '2026-01-16 17:00:00+00', 'GHI-789', '55667788',
   'Lima', 'Ica',       12000, 12360, 1500, 12.00,
   'Pecsa Centro', 'Regular', 42.00, 924.00, 500, 600, 150,
   NULL),

  -- Febrero 2026  — Ana
  ('2026-02-10 07:30:00+00', '2026-02-11 16:30:00+00', 'GHI-789', '55667788',
   'Ica', 'Lima',       12360, 12720, 1800, 11.50,
   'Pecsa Centro', 'Regular', 42.00, 924.00, 500, 600, 150,
   NULL),

  ('2026-02-22 08:00:00+00', '2026-02-23 17:00:00+00', 'GHI-789', '55667788',
   'Lima', 'Chincha',   12720, 12960, 2000, 12.50,
   'Pecsa Centro', 'Regular', 42.50, 850.00, 400, 550, 120,
   NULL),

  -- Marzo 2026  — Ana
  ('2026-03-18 07:00:00+00', '2026-03-19 16:30:00+00', 'GHI-789', '55667788',
   'Lima', 'Pisco',     12960, 13240, 1600, 11.80,
   'Pecsa Centro', 'Regular', 42.00, 882.00, 450, 570, 130,
   NULL),

  -- ────────────────────────────────────────────────────────────
  -- Luis Ramírez Torres (99887766)  →  5 viajes | 1 multa
  -- Perfil: rutas de gran tonelaje, conductor nuevo
  -- ────────────────────────────────────────────────────────────

  -- Enero 2026  — Luis
  ('2026-01-10 07:00:00+00', '2026-01-11 18:00:00+00', 'JKL-012', '99887766',
   'Lima', 'Trujillo',  132000, 132570, 8000, 13.00,
   'Pecsa Norte', 'Diesel', 46.00, 1932.00, 1050, 900, 350,
   'Primera ruta larga del año'),

  ('2026-01-24 06:30:00+00', '2026-01-25 17:30:00+00', 'JKL-012', '99887766',
   'Trujillo', 'Chiclayo', 132570, 132730, 7500, 13.50,
   'Pecsa Norte', 'Diesel', 46.00, 1104.00, 500, 750, 250,
   NULL),

  -- Febrero 2026  — Luis
  ('2026-02-08 07:30:00+00', '2026-02-09 18:30:00+00', 'JKL-012', '99887766',
   'Lima', 'Piura',     132730, 133760, 9000, 13.20,
   'Primax Norte', 'Diesel', 47.00, 2444.00, 1400, 1000, 420,
   'Carga extra pesada'),

  -- Marzo 2026  — Luis
  ('2026-03-05 07:00:00+00', '2026-03-06 17:00:00+00', 'JKL-012', '99887766',
   'Lima', 'Arequipa',  133760, 134580, 8500, 13.80,
   'Pecsa Norte', 'Diesel', 46.50, 2046.00, 1200, 950, 380,
   NULL),

  ('2026-03-20 06:30:00+00', '2026-03-21 17:30:00+00', 'JKL-012', '99887766',
   'Arequipa', 'Lima',  134580, 135400, 7800, 14.00,
   'Repsol Sur', 'Diesel', 45.50, 1956.50, 1200, 950, 360,
   'Regreso sin novedad'),

  -- ────────────────────────────────────────────────────────────
  -- Patricia Mendoza Vega (44556677)  →  4 viajes | 0 multas
  -- Perfil: rutas medianas, sin incidentes
  -- ────────────────────────────────────────────────────────────

  -- Enero 2026  — Patricia
  ('2026-01-18 08:00:00+00', '2026-01-19 17:30:00+00', 'MNO-345', '44556677',
   'Lima', 'Chincha',   69500, 69740, 3000, 11.00,
   'Repsol Limatambo', 'Regular', 42.00, 840.00, 420, 600, 140,
   NULL),

  -- Febrero 2026  — Patricia
  ('2026-02-12 07:00:00+00', '2026-02-13 16:00:00+00', 'MNO-345', '44556677',
   'Lima', 'Ica',       69740, 70100, 3500, 11.50,
   'Repsol Limatambo', 'Regular', 42.00, 1008.00, 550, 650, 160,
   NULL),

  ('2026-02-27 08:30:00+00', '2026-02-28 17:30:00+00', 'MNO-345', '44556677',
   'Ica', 'Lima',       70100, 70460, 3200, 11.20,
   'Repsol Limatambo', 'Regular', 42.00, 966.00, 520, 620, 150,
   NULL),

  -- Marzo 2026  — Patricia
  ('2026-03-15 07:30:00+00', '2026-03-16 17:00:00+00', 'MNO-345', '44556677',
   'Lima', 'Nazca',     70460, 70920, 4000, 12.00,
   'Repsol Limatambo', 'Regular', 42.50, 1190.00, 680, 700, 190,
   'Zona de turismo, precaución en ruta');


-- ── 3. Multas ─────────────────────────────────────────────────────────────────
-- NOTA: `debe` es GENERATED; `estado_pago` se calcula automáticamente con trigger.
-- El campo `conductor` referencia conductores.documento_identidad.
INSERT INTO multas_conductores (
  fecha, numero_viaje, placa_vehiculo, conductor,
  infraccion, importe_multa, importe_pagado, observaciones
) VALUES
  -- Juan Pérez García (12345678) → pagada
  ('2026-01-21', 2001, 'ABC-123', '12345678',
   'Exceso de velocidad', 3500.00, 3500.00,
   'Multa pagada inmediatamente — zona escolar, exceso 25 km/h'),

  -- Ana García Silva (55667788) → pendiente (importe_pagado = 0)
  ('2026-01-16', 2002, 'GHI-789', '55667788',
   'No usar cinturón de seguridad', 800.00, 0.00,
   'Pendiente de pago — conductor y acompañante sin cinturón'),

  -- Ana García Silva (55667788) → parcial
  ('2026-02-11', 2003, 'GHI-789', '55667788',
   'Estacionamiento indebido', 1200.00, 600.00,
   'Pago parcial aceptado, saldo pendiente'),

  -- Luis Ramírez Torres (99887766) → pendiente
  ('2026-03-06', 2004, 'JKL-012', '99887766',
   'Circular sin documentos', 2000.00, 0.00,
   'Documentos olvidados — en trámite de regularización');
