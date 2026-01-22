-- Seed data para impuestos_vehiculares (datos del mock)
-- Nota: Ejecutar después de vehicles_seed.sql
-- El campo 'estado_pago' se calcula automáticamente con trigger

INSERT INTO impuestos_vehiculares (placa_vehiculo, tipo_impuesto, anio_impuesto, impuesto_monto, fecha_pago, estado_pago) VALUES
    -- Impuesto pagado
    ('ABC-123', 'Tenencia', 2024, 8500, '2024-01-15', 'pagado'),
    
    -- Impuesto pendiente (fecha de pago futura)
    ('XYZ-789', 'Verificación', 2024, 1200, '2024-03-20', 'pendiente'),
    
    -- Impuesto vencido (fecha de pago pasada y estado pendiente)
    ('DEF-456', 'Tenencia', 2023, 7800, '2023-12-30', 'pendiente'),
    
    -- Impuesto pagado
    ('ABC-123', 'Verificación', 2023, 1100, '2023-06-15', 'pagado');

-- Nota: El campo 'estado_pago' tiene un trigger que:
-- - Si fecha_pago < CURRENT_DATE y estado_pago = 'pendiente' -> cambia a 'vencido'
-- - Para que funcione correctamente, debe ejecutarse el trigger o actualizar manualmente el estado
