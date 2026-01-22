-- Seed data para mantenimientos_vehiculos
-- Nota: Ejecutar después de vehicles_seed.sql y talleres_seed.sql
-- Los estados se calcularán automáticamente con el trigger

INSERT INTO mantenimientos_vehiculos (placa_vehiculo, taller, fecha_entrada, fecha_salida, tipo, kilometraje, paquete_mantenimiento, causas, costo_total, fecha_pago, observaciones) VALUES
    -- Mantenimiento completado y pagado
    ('ABC-123', 'Taller Mecánico Central', '2024-01-10', '2024-01-15', 'Preventivo', 50000, 'Preventivo 01', 'Mantenimiento programado cada 10,000 km', 3500.00, '2024-01-20', 'Cambio de aceite, filtros y revisión general completada sin inconvenientes'),
    
    -- Mantenimiento completado pero pendiente de pago
    ('DEF-456', 'Taller Diesel Pro', '2024-02-05', '2024-02-12', 'Correctivo', 36500, 'Correctivo 02', 'Falla en sistema de frenos, requiere reemplazo de pastillas y discos', 8500.00, NULL, 'Reparación mayor completada, vehículo funcionando correctamente, pendiente pago'),
    
    -- Mantenimiento en proceso (sin fecha de salida)
    ('JKL-012', 'AutoService Express', '2024-02-18', NULL, 'Preventivo', 132000, 'Preventivo 03', 'Mantenimiento programado de 15,000 km', 4200.00, NULL, 'En proceso: revisión de suspensión y cambio de amortiguadores'),
    
    -- Otro mantenimiento completado y pagado
    ('XYZ-789', 'Mecánica Integral Plus', '2024-01-25', '2024-01-28', 'Preventivo', 46000, 'Preventivo 02', 'Mantenimiento regular 8,000 km', 2800.00, '2024-01-30', 'Servicio de rutina completado, próximo mantenimiento en 54,000 km'),
    
    -- Mantenimiento completado, pendiente pago
    ('MNO-345', 'Servicio Automotriz del Norte', '2024-02-10', '2024-02-16', 'Correctivo', 69500, 'Correctivo 01', 'Ruidos extraños en motor, requiere ajuste de válvulas', 5600.00, NULL, 'Trabajo completado, motor funcionando normalmente. Cliente solicitó 15 días para pago');

-- Nota: El campo 'estado' no se incluye porque es calculado automáticamente por el trigger:
-- - Si tiene fecha_salida Y fecha_pago -> 'Completado'
-- - Si tiene fecha_salida pero NO fecha_pago -> 'Pendiente Pago'
-- - Si NO tiene fecha_salida -> 'En Proceso'
