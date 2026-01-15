-- Agregar constraint UNIQUE al campo name de la tabla talleres
ALTER TABLE talleres ADD CONSTRAINT unique_taller_name UNIQUE (name);