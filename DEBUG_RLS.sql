-- ============================================================================
-- DEBUG: Políticas RLS de Profiles
-- ============================================================================

-- 1. Ver políticas actuales
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual::text as condition
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 2. Ver si RLS está habilitado
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';

-- 3. Probar query directa (debería funcionar como superuser)
SELECT id, nombre, apellido, role 
FROM profiles 
WHERE email = 'admin@test.com';

-- ============================================================================
-- SOLUCIÓN TEMPORAL: Agregar política para que usuarios autenticados vean su perfil
-- ============================================================================

-- Eliminar política existente si está mal configurada
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Crear política correcta
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT 
    USING (auth.uid() = id);

-- IMPORTANTE: También crear política para que todos puedan leer (solo si es necesario)
-- SOLO para desarrollo/debugging - NO usar en producción
DROP POLICY IF EXISTS "Allow authenticated users to read profiles" ON profiles;
CREATE POLICY "Allow authenticated users to read profiles" ON profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Ver políticas después del cambio
SELECT policyname, cmd, qual::text
FROM pg_policies
WHERE tablename = 'profiles';

-- Probar query como usuario autenticado (esto simula lo que hace la app)
SET ROLE authenticated;
SET request.jwt.claim.sub = 'b35a9e53-dbda-4a63-8b90-98ec4802378f'; -- ID del admin

SELECT id, nombre, apellido, role 
FROM profiles 
WHERE id = 'b35a9e53-dbda-4a63-8b90-98ec4802378f';

RESET ROLE;

-- ============================================================================
-- NOTAS
-- ============================================================================
--
-- Si el problema persiste:
-- 1. Verificar que auth.uid() devuelve el UUID correcto
-- 2. Verificar que el token JWT tiene el claim correcto
-- 3. Considerar deshabilitar temporalmente RLS:
--
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
--
-- (Recuerda rehabilitarlo después para pruebas de seguridad)
-- ============================================================================
