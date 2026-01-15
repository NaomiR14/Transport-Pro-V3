-- Tabla multas_conductores
CREATE TABLE IF NOT EXISTS multas_conductores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL,
    numero_viaje INTEGER NOT NULL,
    placa_vehiculo TEXT NOT NULL,
    conductor TEXT NOT NULL,
    infraccion TEXT NOT NULL,
    importe_multa NUMERIC(10, 2) NOT NULL,
    importe_pagado NUMERIC(10, 2) DEFAULT 0,
    debe NUMERIC(10, 2) GENERATED ALWAYS AS (importe_multa - importe_pagado) STORED,
    estado_pago TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_pago IN ('pagado', 'pendiente', 'parcial', 'vencido')),
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT fk_vehicle_multa FOREIGN KEY (placa_vehiculo) REFERENCES vehicles(license_plate) ON DELETE RESTRICT
);

-- Habilitar RLS
ALTER TABLE multas_conductores ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view multas" ON multas_conductores
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert multas" ON multas_conductores
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update multas" ON multas_conductores
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente', 'recursos_humanos')
        )
    );

CREATE POLICY "Admin can delete multas" ON multas_conductores
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_multas_conductores_updated_at
    BEFORE UPDATE ON multas_conductores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estado de pago automáticamente
CREATE OR REPLACE FUNCTION update_estado_pago_multa()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.importe_pagado >= NEW.importe_multa THEN
        NEW.estado_pago := 'pagado';
    ELSIF NEW.importe_pagado > 0 THEN
        NEW.estado_pago := 'parcial';
    ELSE
        NEW.estado_pago := 'pendiente';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado de pago
CREATE TRIGGER update_multa_estado_pago
    BEFORE INSERT OR UPDATE ON multas_conductores
    FOR EACH ROW
    EXECUTE FUNCTION update_estado_pago_multa();

-- Índices
CREATE INDEX IF NOT EXISTS idx_multas_placa ON multas_conductores(placa_vehiculo);
CREATE INDEX IF NOT EXISTS idx_multas_conductor ON multas_conductores(conductor);
CREATE INDEX IF NOT EXISTS idx_multas_estado_pago ON multas_conductores(estado_pago);
CREATE INDEX IF NOT EXISTS idx_multas_fecha ON multas_conductores(fecha DESC);