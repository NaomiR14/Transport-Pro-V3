-- Tabla mantenimientos_vehiculos
CREATE TABLE IF NOT EXISTS mantenimientos_vehiculos (
    id SERIAL PRIMARY KEY,
    placa_vehiculo TEXT NOT NULL,
    taller TEXT NOT NULL,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE,
    tipo TEXT NOT NULL CHECK (tipo IN ('Preventivo', 'Correctivo')),
    kilometraje NUMERIC(10, 2) NOT NULL,
    paquete_mantenimiento TEXT NOT NULL,
    causas TEXT NOT NULL,
    costo_total NUMERIC(10, 2) NOT NULL,
    fecha_pago DATE,
    observaciones TEXT,
    estado TEXT NOT NULL DEFAULT 'En Proceso' CHECK (estado IN ('En Proceso', 'Completado', 'Pendiente Pago')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT fk_vehicle_mantenimiento FOREIGN KEY (placa_vehiculo) REFERENCES vehicles(license_plate) ON DELETE RESTRICT,
    CONSTRAINT fk_taller FOREIGN KEY (taller) REFERENCES talleres(name) ON DELETE RESTRICT
);

-- Habilitar RLS
ALTER TABLE mantenimientos_vehiculos ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view mantenimientos" ON mantenimientos_vehiculos
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert mantenimientos" ON mantenimientos_vehiculos
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update mantenimientos" ON mantenimientos_vehiculos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente', 'coordinador')
        )
    );

CREATE POLICY "Admin can delete mantenimientos" ON mantenimientos_vehiculos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_mantenimientos_vehiculos_updated_at
    BEFORE UPDATE ON mantenimientos_vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estado automáticamente
CREATE OR REPLACE FUNCTION update_estado_mantenimiento()
RETURNS TRIGGER AS $$
BEGIN
    -- Si tiene fecha de salida y fecha de pago, está completado
    IF NEW.fecha_salida IS NOT NULL AND NEW.fecha_pago IS NOT NULL THEN
        NEW.estado := 'Completado';
    -- Si tiene fecha de salida pero no pago, está pendiente de pago
    ELSIF NEW.fecha_salida IS NOT NULL AND NEW.fecha_pago IS NULL THEN
        NEW.estado := 'Pendiente Pago';
    -- Si no tiene fecha de salida, está en proceso
    ELSE
        NEW.estado := 'En Proceso';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado
CREATE TRIGGER update_mantenimiento_estado
    BEFORE INSERT OR UPDATE ON mantenimientos_vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION update_estado_mantenimiento();

-- Índices
CREATE INDEX IF NOT EXISTS idx_mantenimientos_placa ON mantenimientos_vehiculos(placa_vehiculo);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_taller ON mantenimientos_vehiculos(taller);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_estado ON mantenimientos_vehiculos(estado);
CREATE INDEX IF NOT EXISTS idx_mantenimientos_fecha_entrada ON mantenimientos_vehiculos(fecha_entrada DESC);