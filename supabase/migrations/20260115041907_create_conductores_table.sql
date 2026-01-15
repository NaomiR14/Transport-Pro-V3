-- Tabla conductores
CREATE TABLE IF NOT EXISTS conductores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    documento_identidad TEXT NOT NULL UNIQUE,
    nombre_conductor TEXT NOT NULL,
    numero_licencia TEXT NOT NULL UNIQUE,
    direccion TEXT NOT NULL,
    telefono TEXT NOT NULL,
    calificacion NUMERIC(3, 2) DEFAULT 0 CHECK (calificacion >= 0 AND calificacion <= 5),
    email TEXT NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_vencimiento_licencia DATE NOT NULL,
    estado_licencia TEXT NOT NULL DEFAULT 'vigente' CHECK (estado_licencia IN ('vigente', 'por_vencer', 'vencida')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar RLS
ALTER TABLE conductores ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para conductores
CREATE POLICY "Users can view conductores" ON conductores
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert conductores" ON conductores
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update conductores" ON conductores
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente', 'recursos_humanos')
        )
    );

CREATE POLICY "Admin can delete conductores" ON conductores
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_conductores_updated_at
    BEFORE UPDATE ON conductores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar estado de licencia automáticamente
CREATE OR REPLACE FUNCTION update_estado_licencia()
RETURNS TRIGGER AS $$
BEGIN
    -- Calcular días restantes hasta vencimiento
    DECLARE
        dias_restantes INTEGER;
    BEGIN
        dias_restantes := NEW.fecha_vencimiento_licencia - CURRENT_DATE;
        
        IF dias_restantes < 0 THEN
            NEW.estado_licencia := 'vencida';
        ELSIF dias_restantes <= 30 THEN
            NEW.estado_licencia := 'por_vencer';
        ELSE
            NEW.estado_licencia := 'vigente';
        END IF;
        
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar estado de licencia
CREATE TRIGGER update_conductor_estado_licencia
    BEFORE INSERT OR UPDATE ON conductores
    FOR EACH ROW
    EXECUTE FUNCTION update_estado_licencia();

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_conductores_documento ON conductores(documento_identidad);
CREATE INDEX IF NOT EXISTS idx_conductores_licencia ON conductores(numero_licencia);
CREATE INDEX IF NOT EXISTS idx_conductores_estado_licencia ON conductores(estado_licencia);
CREATE INDEX IF NOT EXISTS idx_conductores_activo ON conductores(activo);