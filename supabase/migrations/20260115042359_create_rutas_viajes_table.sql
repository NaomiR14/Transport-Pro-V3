-- Tabla rutas_viajes
CREATE TABLE IF NOT EXISTS rutas_viajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_salida TIMESTAMP WITH TIME ZONE NOT NULL,
    fecha_llegada TIMESTAMP WITH TIME ZONE NOT NULL,
    placa_vehiculo TEXT NOT NULL,
    conductor TEXT NOT NULL,
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    kms_inicial NUMERIC(10, 2) NOT NULL,
    kms_final NUMERIC(10, 2) NOT NULL,
    kms_recorridos NUMERIC(10, 2) GENERATED ALWAYS AS (kms_final - kms_inicial) STORED,
    peso_carga_kg NUMERIC(10, 2) NOT NULL,
    costo_por_kg NUMERIC(10, 2) NOT NULL,
    ingreso_total NUMERIC(10, 2) GENERATED ALWAYS AS (peso_carga_kg * costo_por_kg) STORED,
    estacion_combustible TEXT NOT NULL,
    tipo_combustible TEXT NOT NULL,
    precio_por_galon NUMERIC(10, 2) NOT NULL,
    volumen_combustible_gal NUMERIC(10, 2) NOT NULL,
    total_combustible NUMERIC(10, 2) GENERATED ALWAYS AS (volumen_combustible_gal * precio_por_galon) STORED,
    gasto_peajes NUMERIC(10, 2) DEFAULT 0,
    gasto_comidas NUMERIC(10, 2) DEFAULT 0,
    otros_gastos NUMERIC(10, 2) DEFAULT 0,
    gasto_total NUMERIC(10, 2) GENERATED ALWAYS AS (
        (volumen_combustible_gal * precio_por_galon) + gasto_peajes + gasto_comidas + otros_gastos
    ) STORED,
    recorrido_por_galon NUMERIC(10, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN volumen_combustible_gal > 0 THEN (kms_final - kms_inicial) / volumen_combustible_gal
            ELSE 0
        END
    ) STORED,
    ingreso_por_km NUMERIC(10, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN (kms_final - kms_inicial) > 0 THEN (peso_carga_kg * costo_por_kg) / (kms_final - kms_inicial)
            ELSE 0
        END
    ) STORED,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    CONSTRAINT fk_vehicle FOREIGN KEY (placa_vehiculo) REFERENCES vehicles(license_plate) ON DELETE RESTRICT,
    CONSTRAINT check_kms CHECK (kms_final >= kms_inicial),
    CONSTRAINT check_fechas CHECK (fecha_llegada >= fecha_salida)
);

-- Habilitar RLS
ALTER TABLE rutas_viajes ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view rutas_viajes" ON rutas_viajes
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert rutas_viajes" ON rutas_viajes
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authorized users can update rutas_viajes" ON rutas_viajes
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director', 'gerente', 'coordinador')
        )
    );

CREATE POLICY "Admin can delete rutas_viajes" ON rutas_viajes
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Trigger para updated_at
CREATE TRIGGER update_rutas_viajes_updated_at
    BEFORE UPDATE ON rutas_viajes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Índices
CREATE INDEX IF NOT EXISTS idx_rutas_viajes_placa ON rutas_viajes(placa_vehiculo);
CREATE INDEX IF NOT EXISTS idx_rutas_viajes_conductor ON rutas_viajes(conductor);
CREATE INDEX IF NOT EXISTS idx_rutas_viajes_fecha_salida ON rutas_viajes(fecha_salida DESC);
CREATE INDEX IF NOT EXISTS idx_rutas_viajes_fecha_llegada ON rutas_viajes(fecha_llegada DESC);