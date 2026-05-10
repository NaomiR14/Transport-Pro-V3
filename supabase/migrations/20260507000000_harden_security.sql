-- =====================================================
-- MIGRACIÓN: Endurecimiento de seguridad
-- Fecha: 2026-05-07
--
-- Problemas que corrige:
-- 1. Trigger handle_new_user leía role/empresa_id de raw_user_meta_data,
--    permitiendo que cualquier cliente público hiciera signup con role='admin'.
-- 2. Política profiles_update_own permitía que un usuario cambiara su propio
--    campo 'role' o 'empresa_id' directamente vía UPDATE.
-- 3. Política empresa_update_own no requería rol 'admin', cualquier usuario
--    autenticado podía modificar los datos de su empresa.
-- =====================================================

-- =====================================================
-- FIX 0: Hacer empresa_id nullable en profiles
-- El trigger ahora inserta NULL y la API route lo asigna después con service_role.
-- La columna fue puesta NOT NULL en la migración de multi-tenancy pero
-- esa restricción impide el flujo de dos pasos trigger → API route.
-- =====================================================
ALTER TABLE public.profiles ALTER COLUMN empresa_id DROP NOT NULL;

-- =====================================================
-- FIX 1: Trigger handle_new_user seguro
-- El trigger NUNCA lee role ni empresa_id de metadata.
-- Siempre inserta role='conductor' y empresa_id=NULL.
-- Las rutas API (service_role) actualizan el profile después.
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_nombre TEXT;
    user_apellido TEXT;
BEGIN
    user_nombre := COALESCE(
        NEW.raw_user_meta_data->>'nombre',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)
    );

    user_apellido := COALESCE(
        NEW.raw_user_meta_data->>'apellido',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 2)
    );

    IF user_apellido = '' OR user_apellido IS NULL THEN
        user_apellido := SPLIT_PART(NEW.email, '@', 1);
    END IF;

    -- role siempre 'conductor' — nunca desde metadata del cliente
    -- empresa_id siempre NULL — asignado por API route con service_role después
    INSERT INTO public.profiles (id, nombre, apellido, role, empresa_id)
    VALUES (
        NEW.id,
        user_nombre,
        user_apellido,
        'conductor',
        NULL
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FIX 2: Política profiles_update_own
-- Impide que un usuario cambie su propio role o empresa_id.
-- Solo puede actualizar campos de información personal.
-- =====================================================
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;

CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid()
        -- Bloquea cambio de rol: el nuevo valor debe ser igual al actual
        AND role = (SELECT role FROM profiles WHERE id = auth.uid())
        -- Bloquea cambio de empresa: debe permanecer en la misma empresa
        AND empresa_id = auth_empresa_id()
    );

-- =====================================================
-- FIX 3: Política empresa_update_own
-- Solo el admin de la empresa puede modificar los datos de la empresa.
-- =====================================================
DROP POLICY IF EXISTS "empresa_update_own" ON empresas;

CREATE POLICY "empresa_update_own" ON empresas
    FOR UPDATE TO authenticated
    USING (
        id = auth_empresa_id()
        AND EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    )
    WITH CHECK (id = auth_empresa_id());
