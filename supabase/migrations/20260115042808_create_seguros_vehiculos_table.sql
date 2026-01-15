-- Tabla seguros_vehiculos
CREATE TABLE IF NOT EXISTS seguros_vehiculos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa_vehiculo TEXT NOT NULL,
    aseguradora TEXT NOT NULL,
    poliza_seguro TEXT NOT NULL UNIQUE,
    fecha_inicio DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    importe_pagado NUMERIC(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    estado_poliza TEXT NOT NULL DEFAULT 'vigente' CHECK (estado_poliza IN ('vigente', 'vencida', 'por_vencer', 'cancelada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT fk_vehicle_seguro FOREIGN KEY (placa_vehiculo) REFERENCES vehicles(license_plate) ON DELETE RESTRICT,
    CONSTRAINT check_fechas_seguro CHECK (fecha_vencimiento >= fecha_inicio)
);

-- Habilitar RLS
ALTER TABLE seguros_vehiculos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view seguros" ON seguros_vehiculos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert seguros" ON seguros_vehiculos
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update seguros" ON seguros_vehiculos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente', 'administrativo')
        )
    );

CREATE POLICY "Admin can delete seguros" ON seguros_vehiculos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_seguros_vehiculos_updated_at
    BEFORE UPDATE ON seguros_vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estado de póliza automáticamente
CREATE OR REPLACE FUNCTION update_estado_poliza()
RETURNS TRIGGER AS $$
BEGIN
    DECLARE
        dias_restantes INTEGER;
    BEGIN
        dias_restantes := NEW.fecha_vencimiento - CURRENT_DATE;
        
        IF NEW.estado_poliza = 'cancelada' THEN
            -- No cambiar si está manualmente cancelada
            RETURN NEW;
        ELSIF dias_restantes < 0 THEN
            NEW.estado_poliza := 'vencida';
        ELSIF dias_restantes <= 30 THEN
            NEW.estado_poliza := 'por_vencer';
        ELSE
            NEW.estado_poliza := 'vigente';
        END IF;
        
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado de póliza
CREATE TRIGGER update_seguro_estado_poliza
    BEFORE INSERT OR UPDATE ON seguros_vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION update_estado_poliza();

-- Índices
CREATE INDEX IF NOT EXISTS idx_seguros_placa ON seguros_vehiculos(placa_vehiculo);
CREATE INDEX IF NOT EXISTS idx_seguros_poliza ON seguros_vehiculos(poliza_seguro);
CREATE INDEX IF NOT EXISTS idx_seguros_estado ON seguros_vehiculos(estado_poliza);
CREATE INDEX IF NOT EXISTS idx_seguros_vencimiento ON seguros_vehiculos(fecha_vencimiento);