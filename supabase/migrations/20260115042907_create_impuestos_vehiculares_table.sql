-- Tabla impuestos_vehiculares
CREATE TABLE IF NOT EXISTS impuestos_vehiculares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa_vehiculo TEXT NOT NULL,
    tipo_impuesto TEXT NOT NULL,
    anio_impuesto INTEGER NOT NULL,
    impuesto_monto NUMERIC(10, 2) NOT NULL,
    fecha_pago DATE NOT NULL,
    estado_pago TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado_pago IN ('pagado', 'pendiente', 'vencido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT fk_vehicle_impuesto FOREIGN KEY (placa_vehiculo) REFERENCES vehicles(license_plate) ON DELETE RESTRICT,
    CONSTRAINT unique_impuesto_vehiculo_anio UNIQUE (placa_vehiculo, tipo_impuesto, anio_impuesto)
);

-- Habilitar RLS
ALTER TABLE impuestos_vehiculares ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view impuestos" ON impuestos_vehiculares
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert impuestos" ON impuestos_vehiculares
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update impuestos" ON impuestos_vehiculares
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente', 'administrativo', 'contador')
        )
    );

CREATE POLICY "Admin can delete impuestos" ON impuestos_vehiculares
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_impuestos_vehiculares_updated_at
    BEFORE UPDATE ON impuestos_vehiculares
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estado de pago automáticamente
CREATE OR REPLACE FUNCTION update_estado_pago_impuesto()
RETURNS TRIGGER AS $$
BEGIN
    -- Si la fecha de pago es en el pasado y el estado es pendiente, marcar como vencido
    IF NEW.fecha_pago < CURRENT_DATE AND NEW.estado_pago = 'pendiente' THEN
        NEW.estado_pago := 'vencido';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado de pago
CREATE TRIGGER update_impuesto_estado_pago
    BEFORE INSERT OR UPDATE ON impuestos_vehiculares
    FOR EACH ROW
    EXECUTE FUNCTION update_estado_pago_impuesto();

-- Índices
CREATE INDEX IF NOT EXISTS idx_impuestos_placa ON impuestos_vehiculares(placa_vehiculo);
CREATE INDEX IF NOT EXISTS idx_impuestos_anio ON impuestos_vehiculares(anio_impuesto DESC);
CREATE INDEX IF NOT EXISTS idx_impuestos_estado_pago ON impuestos_vehiculares(estado_pago);
CREATE INDEX IF NOT EXISTS idx_impuestos_fecha_pago ON impuestos_vehiculares(fecha_pago);