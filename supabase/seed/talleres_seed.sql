-- Seed data para talleres (talleres de prueba)
-- Nota: Ejecutar después de la migración de talleres

INSERT INTO talleres (name, address, phone_number, email, contact_person, open_hours, notes, rate) VALUES
    ('Taller Mecánico Central', 'Av. Industrial 245, Zona Centro', '+52 55 1111-2222', 'contacto@tallercentral.com', 'Roberto Méndez', 'Lun-Vie: 8:00-18:00, Sáb: 9:00-14:00', 'Especializado en mantenimiento preventivo y correctivo de vehículos pesados', 4.5),
    
    ('AutoService Express', 'Calle Reforma 567, Col. Moderna', '+52 55 3333-4444', 'servicio@autoexpress.com', 'Laura Sánchez', 'Lun-Sáb: 7:00-20:00', 'Servicio rápido y especializado en vehículos ligeros', 4.2),
    
    ('Taller Diesel Pro', 'Carretera Nacional Km 15.5', '+52 55 5555-6666', 'info@dieselpro.com', 'Miguel Ángel Torres', 'Lun-Vie: 7:00-19:00, Sáb: 8:00-15:00', 'Expertos en motores diesel y transmisiones', 4.8),
    
    ('Mecánica Integral Plus', 'Boulevard Periférico 890, Col. Industrial', '+52 55 7777-8888', 'contacto@integralplus.com', 'Patricia Ramírez', 'Lun-Vie: 8:30-18:30, Sáb: 9:00-13:00', 'Servicio completo de mecánica, electricidad y planchado', 4.0),
    
    ('Servicio Automotriz del Norte', 'Av. Constitución 432, Zona Norte', '+52 55 9999-0000', 'atencion@sanorte.com', 'Fernando Gutiérrez', 'Lun-Vie: 8:00-17:00', 'Mantenimiento general y reparaciones mayores', 3.9);
