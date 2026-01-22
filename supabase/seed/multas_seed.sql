-- Seed data para multas_conductores (datos del mock)
-- Nota: Ejecutar después de vehicles_seed.sql
-- Los campos 'debe' y 'estado_pago' se calculan automáticamente

INSERT INTO multas_conductores (fecha, numero_viaje, placa_vehiculo, conductor, infraccion, importe_multa, importe_pagado, observaciones) VALUES
    ('2024-01-15', 1001, 'ABC-123', 'Juan Pérez López', 'Exceso de velocidad', 2500, 2500, 'Multa pagada en tiempo y forma - Zona escolar, exceso 20km/h'),
    
    ('2024-01-18', 1005, 'DEF-456', 'María García Rodríguez', 'No respetar señalamiento', 1800, 1000, 'Pago parcial realizado, pendiente saldo - Semáforo en rojo'),
    
    ('2024-01-20', 1008, 'GHI-789', 'Carlos López Martínez', 'Estacionamiento indebido', 1200, 0, 'Multa recién recibida, en proceso de revisión - Centro histórico'),
    
    ('2024-01-22', 1012, 'JKL-012', 'Ana Rodríguez Sánchez', 'Circular sin verificación', 3500, 0, 'Multa vencida, aplicar recargos del 20% - Verificación vehicular'),
    
    ('2024-01-25', 1015, 'MNO-345', 'Roberto Sánchez Hernández', 'Sobrepeso en báscula', 5000, 2500, 'Convenio de pago establecido - Exceso 15% peso máximo'),
    
    ('2024-01-28', 1018, 'PQR-678', 'Laura Martínez González', 'Documentos vencidos', 2200, 0, 'Esperando renovación de documentos - Licencia vencida'),
    
    ('2024-02-01', 1022, 'STU-901', 'Miguel Ángel Ramírez', 'Uso de celular al conducir', 1500, 1500, 'Multa pagada con descuento por pronto pago'),
    
    ('2024-02-05', 1025, 'ABC-123', 'Isabel Flores Castro', 'No usar cinturón de seguridad', 800, 800, 'Conductor y acompañante sin cinturón'),
    
    ('2024-02-10', 1030, 'XYZ-789', 'Fernando Castro Díaz', 'Circular sin placas', 3000, 1500, 'Placas en trámite, pago parcial aceptado'),
    
    ('2024-02-15', 1035, 'DEF-456', 'Sofía Hernández Ruiz', 'Obstruir la vía pública', 2000, 0, 'Carga mal estibada bloqueando circulación');

-- Nota: 
-- - El campo 'debe' es GENERATED y se calcula como: (importe_multa - importe_pagado)
-- - El campo 'estado_pago' se calcula automáticamente con trigger:
--   * Si importe_pagado >= importe_multa -> 'pagado'
--   * Si importe_pagado > 0 -> 'parcial'
--   * Si importe_pagado = 0 -> 'pendiente'
--   * 'vencido' debe ser establecido manualmente por lógica de fechas
