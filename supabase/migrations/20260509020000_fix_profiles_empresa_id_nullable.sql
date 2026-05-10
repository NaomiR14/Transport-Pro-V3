-- =====================================================
-- FIX: profiles.empresa_id debe ser nullable
--
-- harden_security.sql cambió el trigger handle_new_user para insertar
-- empresa_id=NULL por seguridad, pero no dropeó el NOT NULL constraint
-- de la migración de multi-tenancy. Esto causaba "Database error creating
-- new user" en el trigger. El API route asigna empresa_id después con
-- service_role, por lo que la columna puede ser nullable.
-- =====================================================
ALTER TABLE public.profiles ALTER COLUMN empresa_id DROP NOT NULL;
