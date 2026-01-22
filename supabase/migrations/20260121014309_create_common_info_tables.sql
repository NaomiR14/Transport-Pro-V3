-- Tabla fuel_types (Tipos de combustible)
CREATE TABLE IF NOT EXISTS fuel_types (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
);

-- Tabla fuel_stations (Estaciones de combustible)
CREATE TABLE IF NOT EXISTS fuel_stations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Tabla vehicle_brands (Marcas de vehículos)
CREATE TABLE IF NOT EXISTS vehicle_brands (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Tabla vehicle_models (Modelos de vehículos)
CREATE TABLE IF NOT EXISTS vehicle_models (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES vehicle_brands(id) ON DELETE CASCADE
);

-- Tabla vehicle_types (Tipos de vehículos)
CREATE TABLE IF NOT EXISTS vehicle_types (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
);

-- Tabla maintenance_types (Tipos de mantenimiento)
CREATE TABLE IF NOT EXISTS maintenance_types (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
);

-- Tabla maintenance_plans (Planes de mantenimiento)
CREATE TABLE IF NOT EXISTS maintenance_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Tabla maintenance_services (Servicios de mantenimiento)
CREATE TABLE IF NOT EXISTS maintenance_services (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    CONSTRAINT fk_plan FOREIGN KEY (plan_id) REFERENCES maintenance_plans(id) ON DELETE CASCADE
);

-- Tabla traffic_ticket_types (Tipos de multas de tránsito)
CREATE TABLE IF NOT EXISTS traffic_ticket_types (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL UNIQUE
);

-- Insertar datos constantes en fuel_types
INSERT INTO fuel_types (id, type) VALUES
    (1, 'Diesel'),
    (2, 'GLP'),
    (3, 'GNV'),
    (4, 'Premium'),
    (5, 'Regular');

-- Insertar datos constantes en fuel_stations
INSERT INTO fuel_stations (id, name) VALUES
    (1, 'Pecsa Benavides'),
    (2, 'Pecsa Pro'),
    (3, 'Pecsa Villa Sol'),
    (4, 'Primax Javier Prado'),
    (5, 'Primax Santa Catalina'),
    (6, 'Repsol Limatambo'),
    (7, 'Repsol Panamericanas'),
    (8, 'Varios');

-- Insertar datos constantes en vehicle_brands
INSERT INTO vehicle_brands (id, name) VALUES
    (1, 'BMW'),
    (2, 'Honda'),
    (3, 'Hyundai'),
    (4, 'Mercedes Benz'),
    (5, 'Mitsubishi'),
    (6, 'Nissan'),
    (7, 'Scania'),
    (8, 'Toyota'),
    (9, 'Volswagen');

-- Insertar datos constantes en vehicle_models
INSERT INTO vehicle_models (id, brand_id, name) VALUES
    (1, 1, 'Coupe'),
    (2, 1, 'E92'),
    (3, 2, 'Accord'),
    (4, 2, 'City'),
    (5, 2, 'City'),
    (6, 2, 'Civic'),
    (7, 2, 'Pilot'),
    (8, 2, 'Legend'),
    (9, 4, 'Intoura'),
    (10, 4, 'Sprinter City'),
    (11, 4, 'Sprinter Transfer'),
    (12, 4, 'Sprinter Travel'),
    (13, 5, 'Eclipse Cross'),
    (14, 5, 'Outlander'),
    (15, 5, 'Xpander'),
    (16, 6, 'Qasqai'),
    (17, 6, 'Santa Fe'),
    (18, 6, 'Sentra'),
    (19, 6, 'Tiida'),
    (20, 6, 'Versa'),
    (21, 7, 'Q-500'),
    (22, 7, 'R-450'),
    (23, 8, 'Camry'),
    (24, 8, 'Corolla'),
    (25, 8, 'Hilux'),
    (26, 8, 'Rav4'),
    (27, 8, 'Rush'),
    (28, 9, 'Fest'),
    (29, 9, 'Gol'),
    (30, 9, 'Tiguan'),
    (31, 9, 'Xtreme');

-- Insertar datos constantes en vehicle_types
INSERT INTO vehicle_types (id, type) VALUES
    (1, 'Auto'),
    (2, 'Autobus'),
    (3, 'Camion');

-- Insertar datos constantes en maintenance_types
INSERT INTO maintenance_types (id, type) VALUES
    (1, 'Preventivo'),
    (2, 'Correctivo');

-- Insertar datos constantes en maintenance_plans
INSERT INTO maintenance_plans (id, name) VALUES
    (1, 'Preventivo 01'),
    (2, 'Preventivo 02'),
    (3, 'Preventivo 03'),
    (4, 'Preventivo 04'),
    (5, 'Preventivo 05'),
    (6, 'Correctivo 01'),
    (7, 'Correctivo 02'),
    (8, 'Correctivo 03');

-- Insertar datos constantes en maintenance_services
INSERT INTO maintenance_services (id, plan_id, description) VALUES
    (1, 1, 'Ajuste del Tiempo del Motor'),
    (2, 1, 'Ajuste del Tiempo del Motor'),
    (3, 1, 'Cambio de Aceite y Filtro de Aceite'),
    (4, 1, 'Cambio de Filtro de Aire'),
    (5, 1, 'Inspección de la Correa de Distribución'),
    (6, 1, 'Inspección del Sistema de Frenos'),
    (7, 2, 'Inspección del Sistema de Suspensión'),
    (8, 2, 'Mantenimiento de la Batería'),
    (9, 2, 'Mantenimiento del Sistema de Combustible'),
    (10, 2, 'Mantenimiento del Sistema de Dirección'),
    (11, 3, 'Reemplazo de Bujías, Cables y Correas Serpentinas'),
    (12, 3, 'Revisión de Amortiguadoress'),
    (13, 3, 'Revisión de Luces'),
    (14, 3, 'Revisión del Dispositivo de Acoplamiento'),
    (15, 4, 'Revisión del Sistema de Admisión, Mangueras y Tuberías'),
    (16, 4, 'Revisión del Sistema de Escape'),
    (17, 4, 'Servicio Completo de Mantenimiento Automotriz'),
    (18, 5, 'Verificación de Neumáticos'),
    (19, 5, 'Verificación de Niveles de Fluidos'),
    (20, 5, 'Verificación del Funcionamiento del Motor'),
    (21, 5, 'Verificación del Sistema de Transmisión'),
    (22, 6, 'Planchado y pintado'),
    (23, 7, 'Cambio de puertas'),
    (24, 8, 'Eliminación de inperfecciones de la pintura');

-- Insertar datos constantes en traffic_ticket_types
INSERT INTO traffic_ticket_types (id, type) VALUES
    (1, 'Accidente imprudencial'),
    (2, 'Alta velocidad'),
    (3, 'Conductor alcoholizado'),
    (4, 'Conductor temerario'),
    (5, 'Mal estacionado'),
    (6, 'Se pasó la luz roja');

-- Resetear las secuencias para que los próximos IDs sean correctos
SELECT setval('fuel_types_id_seq', (SELECT MAX(id) FROM fuel_types));
SELECT setval('fuel_stations_id_seq', (SELECT MAX(id) FROM fuel_stations));
SELECT setval('vehicle_brands_id_seq', (SELECT MAX(id) FROM vehicle_brands));
SELECT setval('vehicle_models_id_seq', (SELECT MAX(id) FROM vehicle_models));
SELECT setval('vehicle_types_id_seq', (SELECT MAX(id) FROM vehicle_types));
SELECT setval('maintenance_types_id_seq', (SELECT MAX(id) FROM maintenance_types));
SELECT setval('maintenance_plans_id_seq', (SELECT MAX(id) FROM maintenance_plans));
SELECT setval('maintenance_services_id_seq', (SELECT MAX(id) FROM maintenance_services));
SELECT setval('traffic_ticket_types_id_seq', (SELECT MAX(id) FROM traffic_ticket_types));

-- Habilitar RLS en todas las tablas
ALTER TABLE fuel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_ticket_types ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: SELECT público (todos pueden leer), INSERT/UPDATE/DELETE solo admin

-- fuel_types
CREATE POLICY "Public can view fuel_types" ON fuel_types
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage fuel_types" ON fuel_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- fuel_stations
CREATE POLICY "Public can view fuel_stations" ON fuel_stations
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage fuel_stations" ON fuel_stations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- vehicle_brands
CREATE POLICY "Public can view vehicle_brands" ON vehicle_brands
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage vehicle_brands" ON vehicle_brands
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- vehicle_models
CREATE POLICY "Public can view vehicle_models" ON vehicle_models
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage vehicle_models" ON vehicle_models
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- vehicle_types
CREATE POLICY "Public can view vehicle_types" ON vehicle_types
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage vehicle_types" ON vehicle_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- maintenance_types
CREATE POLICY "Public can view maintenance_types" ON maintenance_types
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage maintenance_types" ON maintenance_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- maintenance_plans
CREATE POLICY "Public can view maintenance_plans" ON maintenance_plans
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage maintenance_plans" ON maintenance_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- maintenance_services
CREATE POLICY "Public can view maintenance_services" ON maintenance_services
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage maintenance_services" ON maintenance_services
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- traffic_ticket_types
CREATE POLICY "Public can view traffic_ticket_types" ON traffic_ticket_types
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage traffic_ticket_types" ON traffic_ticket_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'director')
        )
    );

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_vehicle_models_brand ON vehicle_models(brand_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_services_plan ON maintenance_services(plan_id);
