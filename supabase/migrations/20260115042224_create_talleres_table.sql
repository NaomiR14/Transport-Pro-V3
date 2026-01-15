-- Tabla talleres
CREATE TABLE IF NOT EXISTS talleres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    open_hours TEXT NOT NULL,
    notes TEXT,
    rate NUMERIC(3, 2) DEFAULT 0 CHECK (rate >= 0 AND rate <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar RLS
ALTER TABLE talleres ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para talleres
CREATE POLICY "Users can view talleres" ON talleres
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert talleres" ON talleres
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update talleres" ON talleres
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente')
        )
    );

CREATE POLICY "Admin can delete talleres" ON talleres
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_talleres_updated_at
    BEFORE UPDATE ON talleres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Índices
CREATE INDEX IF NOT EXISTS idx_talleres_name ON talleres(name);
CREATE INDEX IF NOT EXISTS idx_talleres_rate ON talleres(rate DESC);