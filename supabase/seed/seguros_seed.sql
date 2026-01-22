-- Seed data para seguros_vehiculos
-- Nota: Ejecutar después de vehicles_seed.sql
-- El campo 'estado_poliza' se calcula automáticamente con trigger

INSERT INTO seguros_vehiculos (placa_vehiculo, aseguradora, poliza_seguro, fecha_inicio, fecha_vencimiento, importe_pagado, fecha_pago) VALUES
    -- Seguro vigente
    ('ABC-123', 'Qualitas Seguros', 'POL-2024-ABC-001', '2024-01-01', '2025-01-01', 15000.00, '2024-01-01'),
    
    -- Seguro por vencer (menos de 30 días)
    ('XYZ-789', 'AXA Seguros', 'POL-2023-XYZ-045', '2023-03-15', CURRENT_DATE + INTERVAL '20 days', 12500.00, '2023-03-15'),
    
    -- Seguro vigente
    ('DEF-456', 'GNP Seguros', 'POL-2024-DEF-078', '2024-02-01', '2025-02-01', 18000.00, '2024-02-01'),
    
    -- Seguro vencido
    ('JKL-012', 'Mapfre Seguros', 'POL-2022-JKL-089', '2022-06-01', '2023-06-01', 16500.00, '2022-06-01'),
    
    -- Seguro vigente
    ('MNO-345', 'HDI Seguros', 'POL-2023-MNO-156', '2023-09-15', '2024-09-15', 20000.00, '2023-09-15');

-- Nota: El campo 'estado_poliza' se calcula automáticamente con el trigger según:
-- - Si estado_poliza es 'cancelada' manualmente, se mantiene
-- - Si dias_restantes < 0 -> 'vencida'
-- - Si dias_restantes <= 30 -> 'por_vencer'
-- - Caso contrario -> 'vigente'
