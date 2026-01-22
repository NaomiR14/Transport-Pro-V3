-- Seed data para vehicles (vehículos de prueba)
-- Nota: Ejecutar después de la migración de vehicles

INSERT INTO vehicles (type, brand, model, license_plate, serial_number, color, year, max_load_capacity, vehicle_state, maintenance_data) VALUES
    ('Camion', 'Toyota', 'Hilux', 'ABC-123', 'SN-TOY-2020-001', 'Blanco', '2020', '1500 kg', 'activo', '{"maintenanceCycle": 10000, "initialKm": 0, "prevMaintenanceKm": 50000, "currentKm": 55000, "remainingMaintenanceKm": 5000, "maintenanceStatus": "ok"}'::jsonb),
    
    ('Auto', 'Nissan', 'Sentra', 'XYZ-789', 'SN-NIS-2019-045', 'Gris', '2019', '500 kg', 'activo', '{"maintenanceCycle": 8000, "initialKm": 0, "prevMaintenanceKm": 40000, "currentKm": 46000, "remainingMaintenanceKm": 2000, "maintenanceStatus": "ok"}'::jsonb),
    
    ('Camion', 'Mercedes Benz', 'Sprinter Transfer', 'DEF-456', 'SN-MER-2021-078', 'Negro', '2021', '2000 kg', 'mantenimiento', '{"maintenanceCycle": 12000, "initialKm": 0, "prevMaintenanceKm": 24000, "currentKm": 36500, "remainingMaintenanceKm": -500, "maintenanceStatus": "critico"}'::jsonb),
    
    ('Auto', 'Toyota', 'Corolla', 'GHI-789', 'SN-TOY-2022-012', 'Rojo', '2022', '450 kg', 'activo', '{"maintenanceCycle": 8000, "initialKm": 0, "prevMaintenanceKm": 8000, "currentKm": 12000, "remainingMaintenanceKm": 4000, "maintenanceStatus": "ok"}'::jsonb),
    
    ('Camion', 'Scania', 'R-450', 'JKL-012', 'SN-SCA-2018-089', 'Azul', '2018', '5000 kg', 'activo', '{"maintenanceCycle": 15000, "initialKm": 0, "prevMaintenanceKm": 120000, "currentKm": 132000, "remainingMaintenanceKm": 3000, "maintenanceStatus": "ok"}'::jsonb),
    
    ('Autobus', 'Mercedes Benz', 'Intoura', 'MNO-345', 'SN-MER-2020-156', 'Blanco', '2020', '3500 kg', 'activo', '{"maintenanceCycle": 12000, "initialKm": 0, "prevMaintenanceKm": 60000, "currentKm": 69500, "remainingMaintenanceKm": 2500, "maintenanceStatus": "ok"}'::jsonb),
    
    ('Auto', 'Honda', 'Civic', 'PQR-678', 'SN-HON-2021-203', 'Plateado', '2021', '480 kg', 'inactivo', '{"maintenanceCycle": 8000, "initialKm": 0, "prevMaintenanceKm": 32000, "currentKm": 38000, "remainingMaintenanceKm": 2000, "maintenanceStatus": "ok"}'::jsonb),
    
    ('Camion', 'Toyota', 'Rav4', 'STU-901', 'SN-TOY-2019-334', 'Verde', '2019', '1200 kg', 'activo', '{"maintenanceCycle": 10000, "initialKm": 0, "prevMaintenanceKm": 70000, "currentKm": 77800, "remainingMaintenanceKm": 2200, "maintenanceStatus": "ok"}'::jsonb);
