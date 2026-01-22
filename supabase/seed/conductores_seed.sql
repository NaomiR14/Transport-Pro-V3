-- Seed data para conductores (datos de prueba del mock)
-- Nota: Ejecutar después de la migración de conductores

INSERT INTO conductores (documento_identidad, nombre_conductor, numero_licencia, direccion, telefono, calificacion, email, activo, fecha_vencimiento_licencia) VALUES
    ('12345678', 'Juan Pérez García', 'LIC-2024-001', 'Av. Principal 123, Ciudad de México', '+52 55 1234-5678', 4.5, 'juan.perez@empresa.com', true, '2025-06-15'),
    
    ('87654321', 'María López Hernández', 'LIC-2023-045', 'Calle Secundaria 456, Guadalajara', '+52 33 9876-5432', 4.8, 'maria.lopez@empresa.com', true, CURRENT_DATE + INTERVAL '25 days'),
    
    ('11223344', 'Carlos Rodríguez Martínez', 'LIC-2022-078', 'Boulevard Norte 789, Monterrey', '+52 81 5555-1234', 3.9, 'carlos.rodriguez@empresa.com', false, CURRENT_DATE - INTERVAL '60 days'),
    
    ('55667788', 'Ana García Silva', 'LIC-2024-012', 'Plaza Central 321, Puebla', '+52 222 3456-7890', 4.2, 'ana.garcia@empresa.com', true, '2026-01-10');

-- Nota: Los estados de licencia (vigente, por_vencer, vencida) se calcularán automáticamente con el trigger
