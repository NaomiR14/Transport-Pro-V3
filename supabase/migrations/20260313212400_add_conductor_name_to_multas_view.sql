-- Migration: Add conductor name view for multas_conductores

-- Create view with conductor name
CREATE OR REPLACE VIEW multas_conductores_with_names AS
SELECT 
    m.id,
    m.fecha,
    m.numero_viaje,
    m.placa_vehiculo,
    m.conductor,
    c.nombre_conductor,
    m.infraccion,
    m.importe_multa,
    m.importe_pagado,
    m.debe,
    m.estado_pago,
    m.observaciones,
    m.created_at,
    m.updated_at
FROM multas_conductores m
LEFT JOIN conductores c ON m.conductor = c.documento_identidad;

-- Comments
COMMENT ON VIEW multas_conductores_with_names IS 
'Vista que proporciona toda la información de multas_conductores con el nombre del conductor.';

-- Permissions
ALTER VIEW multas_conductores_with_names SET (security_invoker = true);

GRANT SELECT ON multas_conductores_with_names TO authenticated;
GRANT SELECT ON multas_conductores_with_names TO anon;
