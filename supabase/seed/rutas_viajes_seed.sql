-- Seed data para rutas_viajes (datos del mock)
-- Nota: Ejecutar después de vehicles_seed.sql y conductores_seed.sql
--
-- Campos GENERATED (NO insertar):
--   kms_recorridos, ingreso_total, volumen_combustible_gal,
--   gasto_total, recorrido_por_galon, ingreso_por_km
--
-- IMPORTANTE (migración 20260313014700_swap_combustible_fields):
--   - total_combustible = campo de entrada (monto total gastado en combustible)
--   - volumen_combustible_gal = GENERATED (total_combustible / precio_por_galon)
--   El campo conductor referencia conductores.documento_identidad (no el nombre)

INSERT INTO rutas_viajes (
    fecha_salida, fecha_llegada, placa_vehiculo, conductor,
    origen, destino, kms_inicial, kms_final,
    peso_carga_kg, costo_por_kg,
    estacion_combustible, tipo_combustible,
    precio_por_galon, total_combustible,
    gasto_peajes, gasto_comidas, otros_gastos, observaciones
) VALUES
    -- Ruta 1: Lima - Arequipa
    ('2024-01-15 08:00:00+00', '2024-01-18 18:30:00+00',
     'ABC-123', '12345678',
     'Lima', 'Arequipa', 15000, 15540, 2500, 12.5,
     'Pecsa Benavides', 'Diesel', 45.80, 1250.34, 850, 1200, 350,
     'Viaje sin inconvenientes, clima favorable'),

    -- Ruta 2: Arequipa - Lima
    ('2024-01-20 06:00:00+00', '2024-01-22 17:45:00+00',
     'XYZ-789', '87654321',
     'Arequipa', 'Lima', 8920, 9580, 1800, 15.0,
     'Primax Javier Prado', 'Premium', 52.30, 1569.00, 720, 980, 220,
     'Tráfico pesado en salida'),

    -- Ruta 3: Lima - Cusco
    ('2024-01-25 07:30:00+00', '2024-01-26 19:00:00+00',
     'DEF-456', '12345678',
     'Lima', 'Cusco', 12300, 13020, 3200, 10.8,
     'Repsol Limatambo', 'Regular', 42.10, 1894.50, 1100, 1350, 480,
     'Vehiculo reportó fallas menores, enviar a mantenimiento');

-- Campos GENERATED calculados automáticamente por la BD:
-- - kms_recorridos      = kms_final - kms_inicial
-- - ingreso_total       = peso_carga_kg * costo_por_kg
-- - volumen_combustible_gal = total_combustible / precio_por_galon
-- - gasto_total         = total_combustible + gasto_peajes + gasto_comidas + otros_gastos
-- - recorrido_por_galon = kms_recorridos / volumen_combustible_gal
-- - ingreso_por_km      = ingreso_total / kms_recorridos
