-- Crear tabla de órdenes
CREATE TABLE ordenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_orden TEXT UNIQUE NOT NULL,
    placa_vehiculo TEXT NOT NULL,
    ruta_viaje_id UUID NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'transito', 'entregado')),
    carta_porte TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Foreign keys
    CONSTRAINT fk_orden_vehiculo
        FOREIGN KEY (placa_vehiculo)
        REFERENCES vehicles(license_plate)
        ON DELETE RESTRICT,

    CONSTRAINT fk_orden_ruta
        FOREIGN KEY (ruta_viaje_id)
        REFERENCES rutas_viajes(id)
        ON DELETE RESTRICT
);

-- Índices
CREATE INDEX idx_ordenes_estado ON ordenes(estado);
CREATE INDEX idx_ordenes_placa ON ordenes(placa_vehiculo);
CREATE INDEX idx_ordenes_ruta ON ordenes(ruta_viaje_id);
CREATE INDEX idx_ordenes_numero ON ordenes(numero_orden);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_ordenes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_ordenes_updated_at
    BEFORE UPDATE ON ordenes
    FOR EACH ROW
    EXECUTE FUNCTION update_ordenes_updated_at();

-- RLS (permisivo para desarrollo, igual que el resto del proyecto)
ALTER TABLE ordenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ordenes_select_policy" ON ordenes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "ordenes_insert_policy" ON ordenes
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "ordenes_update_policy" ON ordenes
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "ordenes_delete_policy" ON ordenes
    FOR DELETE TO authenticated USING (true);

-- Permisos para anon (lectura)
CREATE POLICY "ordenes_anon_select" ON ordenes
    FOR SELECT TO anon USING (true);

-- Vista con detalles de la orden (vehículo, conductor, ruta, estado sugerido)
CREATE VIEW ordenes_with_details AS
SELECT
    o.id,
    o.numero_orden,
    o.placa_vehiculo,
    o.ruta_viaje_id,
    o.estado,
    o.carta_porte,
    o.created_at,
    o.updated_at,
    -- Datos del conductor (via ruta)
    r.conductor AS conductor_documento,
    c.nombre_conductor,
    -- Datos de la ruta
    r.origen,
    r.destino,
    r.fecha_salida,
    r.fecha_llegada,
    -- Estado sugerido calculado desde fechas de la ruta
    CASE
        WHEN now() < r.fecha_salida::timestamptz THEN 'pendiente'
        WHEN now() >= r.fecha_salida::timestamptz AND now() <= r.fecha_llegada::timestamptz THEN 'transito'
        WHEN now() > r.fecha_llegada::timestamptz THEN 'entregado'
        ELSE 'pendiente'
    END AS estado_sugerido
FROM ordenes o
LEFT JOIN rutas_viajes r ON o.ruta_viaje_id = r.id
LEFT JOIN conductores c ON r.conductor = c.documento_identidad;

-- Comentario
COMMENT ON VIEW ordenes_with_details IS
'Vista que proporciona toda la información de órdenes con datos del vehículo, conductor (via ruta), ruta y estado sugerido calculado.';

-- Permisos de la vista
ALTER VIEW ordenes_with_details SET (security_invoker = true);
GRANT SELECT ON ordenes_with_details TO authenticated;
GRANT SELECT ON ordenes_with_details TO anon;
