-- Crear vista para seguros con campos calculados
-- Esta vista reemplaza el uso de estado_poliza por estado_calculado

CREATE OR REPLACE VIEW seguros_vehiculos_with_calculated_state AS
SELECT 
    id,
    placa_vehiculo,
    aseguradora,
    poliza_seguro,
    fecha_inicio,
    fecha_vencimiento,
    importe_pagado,
    fecha_pago,
    created_at,
    updated_at,
    -- Calcular días restantes
    (fecha_vencimiento - CURRENT_DATE) AS dias_restantes,
    -- Calcular estado en español capitalizado basado en fecha de vencimiento
    CASE 
        WHEN (fecha_vencimiento - CURRENT_DATE) < 0 THEN 'Vencida'
        WHEN (fecha_vencimiento - CURRENT_DATE) <= 30 THEN 'Por Vencer'
        ELSE 'Vigente'
    END AS estado_calculado
FROM seguros_vehiculos;

-- Comentario explicativo de la vista
COMMENT ON VIEW seguros_vehiculos_with_calculated_state IS 
'Vista que proporciona estado calculado y días restantes para seguros de vehículos. 
El estado_calculado se basa automáticamente en la fecha de vencimiento:
- Vigente: más de 30 días para vencer
- Por Vencer: 30 días o menos para vencer
- Vencida: fecha de vencimiento ya pasada
Los días restantes se calculan como diferencia entre fecha_vencimiento y fecha actual.';

-- Crear índice en la tabla base para optimizar la vista
CREATE INDEX IF NOT EXISTS idx_seguros_fecha_vencimiento_estado 
ON seguros_vehiculos(fecha_vencimiento, estado_poliza);

-- Habilitar RLS en la vista (hereda las políticas de la tabla base)
ALTER VIEW seguros_vehiculos_with_calculated_state SET (security_invoker = true);

-- Otorgar permisos de SELECT en la vista
GRANT SELECT ON seguros_vehiculos_with_calculated_state TO authenticated;
GRANT SELECT ON seguros_vehiculos_with_calculated_state TO anon;
