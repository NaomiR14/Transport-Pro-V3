-- Seed data para rutas_viajes (datos del mock)
-- Nota: Ejecutar después de vehicles_seed.sql
-- NO incluir campos calculados GENERATED: kms_recorridos, ingreso_total, total_combustible, gasto_total, recorrido_por_galon, ingreso_por_km

INSERT INTO rutas_viajes (
    fecha_salida, 
    fecha_llegada, 
    placa_vehiculo, 
    conductor, 
    origen, 
    destino, 
    kms_inicial, 
    kms_final, 
    peso_carga_kg, 
    costo_por_kg, 
    estacion_combustible, 
    tipo_combustible, 
    precio_por_galon, 
    volumen_combustible_gal, 
    gasto_peajes, 
    gasto_comidas, 
    otros_gastos, 
    observaciones
) VALUES
    -- Ruta 1: Ciudad de México - Guadalajara
    (
        '2024-01-15 08:00:00+00',
        '2024-01-18 18:30:00+00',
        'ABC-123',
        'Juan Pérez García',
        'Ciudad de México',
        'Guadalajara',
        15000,
        15540,
        2500,
        12.5,
        'Pecsa Benavides',
        'Diesel',
        45.80,
        27.3,
        850,
        1200,
        350,
        'Viaje sin inconvenientes, clima favorable'
    ),
    
    -- Ruta 2: Guadalajara - Monterrey
    (
        '2024-01-20 06:00:00+00',
        '2024-01-22 17:45:00+00',
        'XYZ-789',
        'María López Hernández',
        'Guadalajara',
        'Monterrey',
        8920,
        9580,
        1800,
        15.0,
        'Primax Javier Prado',
        'Premium',
        52.30,
        30.0,
        720,
        980,
        220,
        'Tráfico pesado en salida de Guadalajara'
    ),
    
    -- Ruta 3: Monterrey - Puebla
    (
        '2024-01-25 07:30:00+00',
        '2024-01-26 19:00:00+00',
        'DEF-456',
        'Carlos Rodríguez Martínez',
        'Monterrey',
        'Puebla',
        12300,
        13020,
        3200,
        10.8,
        'Repsol Limatambo',
        'Regular',
        42.10,
        45.0,
        1100,
        1350,
        480,
        'Vehiculo reportó fallas menores, enviar a mantenimiento'
    );

-- Nota: Los siguientes campos se calculan automáticamente en la DB (GENERATED ALWAYS):
-- - kms_recorridos = kms_final - kms_inicial
-- - ingreso_total = peso_carga_kg * costo_por_kg
-- - total_combustible = volumen_combustible_gal * precio_por_galon
-- - gasto_total = total_combustible + gasto_peajes + gasto_comidas + otros_gastos
-- - recorrido_por_galon = kms_recorridos / volumen_combustible_gal
-- - ingreso_por_km = ingreso_total / kms_recorridos
