-- ============================================================================
-- INSERT DEMO DATA — Empresa Default (00000000-0000-0000-0000-000000000001)
-- ============================================================================
-- Ejecutar desde Supabase Dashboard → SQL Editor
-- No crea empresa ni usuario — usa los existentes.
-- ============================================================================

DO $$ BEGIN

-- Vehículos
INSERT INTO vehicles (type, brand, model, license_plate, serial_number, color, year, max_load_capacity, maintenance_data, empresa_id) VALUES
    ('Camion',    'Kenworth',      'T680',         'DMO-001', 'KW-T680-2022-001', 'Blanco',   2022, 25000, '{"maintenanceCycle":15000,"initialKm":0,"prevMaintenanceKm":45000,"currentKm":52000,"remainingMaintenanceKm":8000,"maintenanceStatus":"ok"}'::jsonb,       '00000000-0000-0000-0000-000000000001'),
    ('Camion',    'Freightliner',  'Cascadia 126', 'DMO-002', 'FL-CAS-2021-088', 'Gris',     2021, 22000, '{"maintenanceCycle":15000,"initialKm":0,"prevMaintenanceKm":90000,"currentKm":103500,"remainingMaintenanceKm":1500,"maintenanceStatus":"critico"}'::jsonb,  '00000000-0000-0000-0000-000000000001'),
    ('Camioneta', 'Toyota',        'Hilux 4x4',   'DMO-003', 'TY-HLX-2023-042', 'Negro',    2023,  1500, '{"maintenanceCycle":10000,"initialKm":0,"prevMaintenanceKm":20000,"currentKm":24000,"remainingMaintenanceKm":6000,"maintenanceStatus":"ok"}'::jsonb,       '00000000-0000-0000-0000-000000000001'),
    ('Camion',    'Volvo',         'FH 540',      'DMO-004', 'VL-FH5-2020-019', 'Rojo',     2020, 30000, '{"maintenanceCycle":20000,"initialKm":0,"prevMaintenanceKm":160000,"currentKm":174000,"remainingMaintenanceKm":6000,"maintenanceStatus":"ok"}'::jsonb,      '00000000-0000-0000-0000-000000000001'),
    ('Autobus',   'Mercedes Benz', 'O-500 RS',    'DMO-005', 'MB-O5R-2019-231', 'Plateado', 2019,  8000, '{"maintenanceCycle":12000,"initialKm":0,"prevMaintenanceKm":240000,"currentKm":251500,"remainingMaintenanceKm":500,"maintenanceStatus":"critico"}'::jsonb,  '00000000-0000-0000-0000-000000000001'),
    ('Camion',    'Chevrolet',     'NHR 2.8T',    'DMO-006', 'CH-NHR-2022-315', 'Azul',     2022,  3500, '{"maintenanceCycle":8000,"initialKm":0,"prevMaintenanceKm":16000,"currentKm":19200,"remainingMaintenanceKm":4800,"maintenanceStatus":"ok"}'::jsonb,        '00000000-0000-0000-0000-000000000001')
ON CONFLICT (license_plate) DO NOTHING;

-- Conductores
INSERT INTO conductores (documento_identidad, nombre_conductor, numero_licencia, direccion, telefono, calificacion, email, activo, fecha_vencimiento_licencia, empresa_id) VALUES
    ('10001001', 'Carlos Andrés Restrepo Ríos',   'LIC-COL-2024-1001', 'Cra 15 #80-21, Bogotá',      '+57 311 234-5678', 4.8, 'c.restrepo@demo.com', true,  '2027-03-15',                        '00000000-0000-0000-0000-000000000001'),
    ('10001002', 'María José Herrera Salcedo',    'LIC-COL-2023-1002', 'Cl 49 #65-12, Medellín',     '+57 314 876-5432', 4.6, 'm.herrera@demo.com',  true,  CURRENT_DATE + INTERVAL '20 days',   '00000000-0000-0000-0000-000000000001'),
    ('10001003', 'Diego Fernando Cardona Ospina', 'LIC-COL-2022-1003', 'Av 6N #25-40, Cali',         '+57 318 555-1234', 3.9, 'd.cardona@demo.com',  false, CURRENT_DATE - INTERVAL '45 days',   '00000000-0000-0000-0000-000000000001'),
    ('10001004', 'Lina Marcela Torres Acosta',    'LIC-COL-2024-1004', 'Cl 72 #50-30, Barranquilla', '+57 321 456-7890', 4.4, 'l.torres@demo.com',   true,  '2026-11-20',                        '00000000-0000-0000-0000-000000000001'),
    ('10001005', 'Jesús Antonio Vargas Mendoza',  'LIC-COL-2024-1005', 'Cra 27 #48-15, Bucaramanga', '+57 315 987-6543', 4.2, 'j.vargas@demo.com',   true,  '2026-08-05',                        '00000000-0000-0000-0000-000000000001'),
    ('10001006', 'Sandra Patricia Ríos Moreno',   'LIC-COL-2023-1006', 'Cl 10 #15-22, Cartagena',    '+57 320 321-0987', 4.7, 's.rios@demo.com',     true,  '2025-12-30',                        '00000000-0000-0000-0000-000000000001')
ON CONFLICT (documento_identidad) DO NOTHING;

-- Talleres
INSERT INTO talleres (name, address, phone_number, email, contact_person, open_hours, notes, rate, empresa_id) VALUES
    ('TecniKenworth Bogotá',              'Av. Boyacá #12-30, Bogotá',           '+57 601 100-2001', 'servicio@tecnikenworth.co', 'Julián Osprey',  'Lun-Vie: 7:00-18:00, Sáb: 8:00-13:00', 'Concesionario oficial Kenworth.',                             4.8, '00000000-0000-0000-0000-000000000001'),
    ('Taller Diesel del Valle',           'Cra 8 #15-40, Cali',                  '+57 602 200-3002', 'info@dieselvalle.co',       'Rodrigo Salcedo','Lun-Sáb: 7:00-19:00',                  'Especialistas en motores Cummins y Detroit.',                 4.5, '00000000-0000-0000-0000-000000000001'),
    ('AutoFuerza Industrial Medellín',    'Cl 65 #48-22, Medellín',              '+57 604 300-4003', 'autofuerza@demo.co',        'Camila Herrera', 'Lun-Vie: 8:00-17:30',                  'Servicio completo para flota.',                               4.3, '00000000-0000-0000-0000-000000000001'),
    ('Freightliner Service Barranquilla', 'Zona Franca Lote 5, Barranquilla',    '+57 605 400-5004', 'baq@flservice.co',          'Andrés Polo',    'Lun-Vie: 7:30-18:00',                  'Centro autorizado Freightliner. Stock de repuestos 24h.',    4.7, '00000000-0000-0000-0000-000000000001'),
    ('Volvo Trucks Bucaramanga',          'Av. Quebrada Seca Km 2, Bucaramanga', '+57 607 500-6005', 'buc@volvotrucks.co',        'Nelson García',  'Lun-Vie: 7:00-17:00, Sáb: 8:00-12:00','Distribuidor oficial Volvo Trucks. Diagnóstico VCADS.',      4.9, '00000000-0000-0000-0000-000000000001'),
    ('ExpressAuto Cartagena',             'Mamonal Km 10, Cartagena',            '+57 605 600-7006', 'cartagena@expressauto.co',  'Isabel Mendez',  'Lun-Sáb: 6:00-20:00',                  'Taller 24/7 para emergencias. Grúa incluida.',               4.1, '00000000-0000-0000-0000-000000000001')
ON CONFLICT (name) DO NOTHING;

-- Rutas / Viajes
INSERT INTO rutas_viajes (fecha_salida, fecha_llegada, placa_vehiculo, conductor, origen, destino, kms_inicial, kms_final, peso_carga_kg, costo_por_kg, estacion_combustible, tipo_combustible, precio_por_galon, total_combustible, gasto_peajes, gasto_comidas, otros_gastos, observaciones, empresa_id) VALUES
    ('2026-01-10 05:00:00+00','2026-01-10 13:30:00+00','DMO-001','10001001','Bogotá',   'Medellín',     52000, 52410, 18000,12.5,'Terpel Autopista Norte','Diesel', 14800,1850000,280000, 95000,45000,'Viaje sin novedades. Clima óptimo en La Pintada.',          '00000000-0000-0000-0000-000000000001'),
    ('2026-01-15 04:30:00+00','2026-01-15 14:00:00+00','DMO-002','10001002','Medellín', 'Cali',        103500,103950, 15000,13.0,'Biomax Palmira',         'Diesel', 14900,1920000,310000, 88000,30000,'Pequeño retraso por derrumbe en la vía.',                  '00000000-0000-0000-0000-000000000001'),
    ('2026-01-22 03:00:00+00','2026-01-23 06:00:00+00','DMO-004','10001004','Bogotá',   'Cartagena',   174000,175020, 28000, 9.8,'Primax Magangué',        'Diesel', 14750,3200000,520000,175000,80000,'Ruta Bogotá-Magangué-Cartagena. Carga de acero.',          '00000000-0000-0000-0000-000000000001'),
    ('2026-02-05 04:00:00+00','2026-02-06 10:00:00+00','DMO-001','10001005','Cali',     'Barranquilla', 52410, 53380, 20000,12.0,'Texaco Bello',           'Diesel', 14850,2650000,430000,150000,65000,'Parada nocturna en Montería. Carga de textiles.',          '00000000-0000-0000-0000-000000000001'),
    ('2026-02-12 06:00:00+00','2026-02-12 13:00:00+00','DMO-003','10001006','Bogotá',   'Bucaramanga',  24000, 24390,  1200,18.0,'Terpel Tunja',           'Premium',17500, 420000, 95000, 55000,20000,'Entrega urgente de repuestos industriales.',               '00000000-0000-0000-0000-000000000001'),
    ('2026-02-20 05:00:00+00','2026-02-21 09:00:00+00','DMO-006','10001003','Medellín', 'Barranquilla', 19200, 19905,  3000,16.5,'Biomax Montería',        'Diesel', 14900,1100000,320000,110000,40000,'Carga de alimentos. Conductor ya retirado.',               '00000000-0000-0000-0000-000000000001');

-- Mantenimientos
INSERT INTO mantenimientos_vehiculos (placa_vehiculo, taller, fecha_entrada, fecha_salida, tipo, kilometraje, paquete_mantenimiento, causas, costo_total, fecha_pago, observaciones, empresa_id) VALUES
    ('DMO-001','TecniKenworth Bogotá',              '2025-11-05','2025-11-07','Preventivo',  45000,'Preventivo 45K',   'Mantenimiento programado 15.000 km',            3800000,'2025-11-10','Cambio aceite 15W40, filtros. Todo OK.',                      '00000000-0000-0000-0000-000000000001'),
    ('DMO-002','Freightliner Service Barranquilla', '2026-01-08','2026-01-12','Correctivo', 103200,'Correctivo Motor', 'Falla en turbocompresor, pérdida de potencia', 12500000,NULL,        'Reemplazo turbocompresor Holset. Garantía 6 meses.',          '00000000-0000-0000-0000-000000000001'),
    ('DMO-005','ExpressAuto Cartagena',             '2026-02-18',NULL,        'Preventivo', 251500,'Preventivo 250K',  'Mantenimiento mayor 12.000 km',                 8200000,NULL,        'En proceso: frenos, suspensión y sistema eléctrico.',         '00000000-0000-0000-0000-000000000001'),
    ('DMO-004','Volvo Trucks Bucaramanga',          '2025-12-10','2025-12-13','Preventivo', 160000,'Preventivo 160K',  'Mantenimiento 20.000 km con diagnóstico VCADS',  5600000,'2025-12-15','Diagnóstico limpio. Cambio líquido frenos.',                  '00000000-0000-0000-0000-000000000001'),
    ('DMO-003','AutoFuerza Industrial Medellín',    '2026-01-20','2026-01-21','Preventivo',  20000,'Preventivo 20K',   'Mantenimiento de rutina Hilux',                   950000,'2026-01-22','Cambio aceite 5W30, alineación. Condiciones óptimas.',        '00000000-0000-0000-0000-000000000001'),
    ('DMO-006','Taller Diesel del Valle',           '2026-02-01','2026-02-05','Correctivo',  19000,'Correctivo Frenos','Ruido metálico en frenos delanteros',             1800000,NULL,        'Reemplazo discos y pastillas. 30 días para pago.',            '00000000-0000-0000-0000-000000000001');

-- Multas (conductor = documento_identidad, no el nombre)
INSERT INTO multas_conductores (fecha, numero_viaje, placa_vehiculo, conductor, infraccion, importe_multa, importe_pagado, observaciones, empresa_id) VALUES
    ('2026-01-10',4001,'DMO-001','10001001','Exceso de velocidad',              820000,820000,'Radar Autopista Medellín. Exceso 18 km/h. Pagada.',        '00000000-0000-0000-0000-000000000001'),
    ('2026-01-15',4002,'DMO-002','10001002','No respetar señal de pare',        615000,300000,'Cámara Cali. Convenio de pago en 2 cuotas.',               '00000000-0000-0000-0000-000000000001'),
    ('2026-01-22',4003,'DMO-004','10001004','Sobrepeso en báscula',            2050000,     0,'Báscula Gamarra. Exceso 12%. En trámite de impugnación.', '00000000-0000-0000-0000-000000000001'),
    ('2026-02-05',4004,'DMO-003','10001006','Uso de celular conduciendo',       410000,410000,'Agente Bogotá. Cancelada al día siguiente.',               '00000000-0000-0000-0000-000000000001'),
    ('2025-12-10',4005,'DMO-006','10001003','Documentos del vehículo vencidos', 820000,     0,'SOAT vencido. Conductor retirado. Empresa asume multa.',   '00000000-0000-0000-0000-000000000001'),
    ('2026-02-20',4006,'DMO-005','10001006','No respetar preferencia peatonal', 410000,205000,'Cartagena Centro. Primer pago realizado.',                 '00000000-0000-0000-0000-000000000001');

-- Seguros
INSERT INTO seguros_vehiculos (placa_vehiculo, aseguradora, poliza_seguro, fecha_inicio, fecha_vencimiento, importe_pagado, fecha_pago, empresa_id) VALUES
    ('DMO-001','Sura Seguros Colombia','POL-SURA-2025-DMO001','2025-06-01','2026-06-01',          4200000,'2025-06-01','00000000-0000-0000-0000-000000000001'),
    ('DMO-002','Bolívar Seguros',      'POL-BOL-2025-DMO002', '2025-03-15',CURRENT_DATE + INTERVAL '18 days',5800000,'2025-03-15','00000000-0000-0000-0000-000000000001'),
    ('DMO-003','Allianz Colombia',     'POL-ALL-2025-DMO003', '2025-09-01','2026-09-01',          1900000,'2025-09-01','00000000-0000-0000-0000-000000000001'),
    ('DMO-004','AXA Colpatria',        'POL-AXA-2024-DMO004', '2024-01-15','2025-01-15',          6500000,'2024-01-15','00000000-0000-0000-0000-000000000001'),
    ('DMO-005','Mapfre Colombia',      'POL-MAP-2025-DMO005', '2025-04-01','2026-04-01',          7200000,'2025-04-01','00000000-0000-0000-0000-000000000001'),
    ('DMO-006','HDI Seguros',          'POL-HDI-2026-DMO006', '2025-02-28',CURRENT_DATE + INTERVAL '12 days',2100000,'2025-02-28','00000000-0000-0000-0000-000000000001');

-- Impuestos
INSERT INTO impuestos_vehiculares (placa_vehiculo, tipo_impuesto, anio_impuesto, impuesto_monto, fecha_pago, estado_pago, empresa_id) VALUES
    ('DMO-001','Rodamiento',2026,2850000,'2026-01-20',                      'pagado',   '00000000-0000-0000-0000-000000000001'),
    ('DMO-002','Rodamiento',2026,2600000,CURRENT_DATE + INTERVAL '30 days', 'pendiente','00000000-0000-0000-0000-000000000001'),
    ('DMO-003','Rodamiento',2025, 980000,'2025-02-10',                      'pagado',   '00000000-0000-0000-0000-000000000001'),
    ('DMO-004','Rodamiento',2025,3400000,'2025-01-15',                      'pagado',   '00000000-0000-0000-0000-000000000001'),
    ('DMO-005','Rodamiento',2026,4100000,CURRENT_DATE + INTERVAL '60 days', 'pendiente','00000000-0000-0000-0000-000000000001'),
    ('DMO-006','Rodamiento',2025,1200000,CURRENT_DATE - INTERVAL '90 days', 'pendiente','00000000-0000-0000-0000-000000000001');

-- Órdenes (referenciando rutas por origen+destino+placa)
INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte, empresa_id)
SELECT 'ORD-DEMO-001','DMO-001',id,'entregado','CP-BOG-MDE-2026-001','00000000-0000-0000-0000-000000000001'
FROM rutas_viajes WHERE origen='Bogotá' AND destino='Medellín' AND placa_vehiculo='DMO-001' LIMIT 1;

INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte, empresa_id)
SELECT 'ORD-DEMO-002','DMO-002',id,'entregado','CP-MDE-CLO-2026-002','00000000-0000-0000-0000-000000000001'
FROM rutas_viajes WHERE origen='Medellín' AND destino='Cali' AND placa_vehiculo='DMO-002' LIMIT 1;

INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte, empresa_id)
SELECT 'ORD-DEMO-003','DMO-004',id,'entregado',NULL,'00000000-0000-0000-0000-000000000001'
FROM rutas_viajes WHERE origen='Bogotá' AND destino='Cartagena' AND placa_vehiculo='DMO-004' LIMIT 1;

INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte, empresa_id)
SELECT 'ORD-DEMO-004','DMO-001',id,'transito','CP-CLO-BAQ-2026-004','00000000-0000-0000-0000-000000000001'
FROM rutas_viajes WHERE origen='Cali' AND destino='Barranquilla' AND placa_vehiculo='DMO-001' LIMIT 1;

INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte, empresa_id)
SELECT 'ORD-DEMO-005','DMO-003',id,'entregado','CP-BOG-BUC-2026-005','00000000-0000-0000-0000-000000000001'
FROM rutas_viajes WHERE origen='Bogotá' AND destino='Bucaramanga' AND placa_vehiculo='DMO-003' LIMIT 1;

INSERT INTO ordenes (numero_orden, placa_vehiculo, ruta_viaje_id, estado, carta_porte, empresa_id)
SELECT 'ORD-DEMO-006','DMO-006',id,'pendiente',NULL,'00000000-0000-0000-0000-000000000001'
FROM rutas_viajes WHERE origen='Medellín' AND destino='Barranquilla' AND placa_vehiculo='DMO-006' LIMIT 1;

-- Egresos varios (6 meses — Ene-Jun 2026)
INSERT INTO egresos_varios (anio, mes, gastos_personal, otros_egresos, empresa_id) VALUES
    (2026,1,28500000,4200000,'00000000-0000-0000-0000-000000000001'),
    (2026,2,28500000,3800000,'00000000-0000-0000-0000-000000000001'),
    (2026,3,29000000,5100000,'00000000-0000-0000-0000-000000000001'),
    (2026,4,29000000,4600000,'00000000-0000-0000-0000-000000000001'),
    (2026,5,30500000,3900000,'00000000-0000-0000-0000-000000000001'),
    (2026,6,30500000,6200000,'00000000-0000-0000-0000-000000000001')
ON CONFLICT (empresa_id, anio, mes) DO UPDATE
    SET gastos_personal = EXCLUDED.gastos_personal,
        otros_egresos   = EXCLUDED.otros_egresos;

END $$;

-- Verificación
SELECT entidad, total FROM (
    SELECT 'Vehículos'      AS entidad, COUNT(*)::TEXT AS total FROM vehicles                WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Conductores',  COUNT(*)::TEXT FROM conductores              WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Talleres',     COUNT(*)::TEXT FROM talleres                 WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Rutas',        COUNT(*)::TEXT FROM rutas_viajes             WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Mantenimientos',COUNT(*)::TEXT FROM mantenimientos_vehiculos WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Multas',       COUNT(*)::TEXT FROM multas_conductores       WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Seguros',      COUNT(*)::TEXT FROM seguros_vehiculos        WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Impuestos',    COUNT(*)::TEXT FROM impuestos_vehiculares    WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Órdenes',      COUNT(*)::TEXT FROM ordenes                 WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
    UNION ALL SELECT 'Egresos varios',COUNT(*)::TEXT FROM egresos_varios          WHERE empresa_id = '00000000-0000-0000-0000-000000000001'
) t ORDER BY entidad;
