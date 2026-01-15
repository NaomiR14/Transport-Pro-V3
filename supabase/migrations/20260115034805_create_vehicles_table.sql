-- Tabla vehicles (vehículos)
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    license_plate TEXT NOT NULL UNIQUE,
    serial_number TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL,
    year TEXT NOT NULL,
    max_load_capacity TEXT NOT NULL,
    vehicle_state TEXT NOT NULL CHECK (vehicle_state IN ('activo', 'inactivo', 'mantenimiento')),
    maintenance_data JSONB DEFAULT '{
        "maintenanceCycle": 0,
        "initialKm": 0,
        "prevMaintenanceKm": 0,
        "currentKm": 0,
        "remainingMaintenanceKm": 0,
        "maintenanceStatus": "ok"
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Habilitar RLS
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de RLS para vehicles
CREATE POLICY "Users can view vehicles" ON vehicles
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert vehicles" ON vehicles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update vehicles" ON vehicles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente', 'coordinador')
        )
    );

CREATE POLICY "Admin can delete vehicles" ON vehicles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX IF NOT EXISTS idx_vehicles_state ON vehicles(vehicle_state);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at DESC);