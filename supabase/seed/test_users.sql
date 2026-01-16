-- ============================================================================
-- SEED: Usuarios de Prueba para Sistema de Permisos
-- ============================================================================
-- 
-- Este archivo crea usuarios de prueba para cada rol del sistema.
-- ADVERTENCIA: Solo usar en entornos de desarrollo/testing
--
-- Contraseña para todos: Test1234!
--
-- Para ejecutar este seed:
-- 1. Desde Supabase Dashboard → SQL Editor → ejecutar este script
-- 2. O desde CLI: supabase db reset (resetea y aplica migraciones + seed)
--
-- ============================================================================

-- Función auxiliar para crear usuarios (simulando registro)
-- NOTA: Esta función es solo para seed, en producción los usuarios se crean via auth.signUp()
CREATE OR REPLACE FUNCTION seed_test_user(
    p_email TEXT,
    p_password TEXT,
    p_nombre TEXT,
    p_apellido TEXT,
    p_role TEXT
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Generar UUID para el usuario
    new_user_id := gen_random_uuid();
    
    -- Insertar en auth.users (esto simula el registro)
    -- NOTA: En producción real, usar auth.signUp() desde el cliente
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        aud,
        role
    ) VALUES (
        new_user_id,
        '00000000-0000-0000-0000-000000000000',
        p_email,
        crypt(p_password, gen_salt('bf')),  -- Hashear contraseña
        NOW(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
            'nombre', p_nombre,
            'apellido', p_apellido,
            'full_name', p_nombre || ' ' || p_apellido
        ),
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        'authenticated',
        'authenticated'
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Insertar perfil (o actualizar si existe)
    INSERT INTO public.profiles (id, nombre, apellido, role)
    VALUES (new_user_id, p_nombre, p_apellido, p_role)
    ON CONFLICT (id) 
    DO UPDATE SET 
        nombre = EXCLUDED.nombre,
        apellido = EXCLUDED.apellido,
        role = EXCLUDED.role;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CREAR USUARIOS DE PRUEBA
-- ============================================================================

DO $$
DECLARE
    v_admin_id UUID;
    v_director_id UUID;
    v_gerente_id UUID;
    v_coordinador_id UUID;
    v_supervisor_id UUID;
    v_rrhh_id UUID;
    v_contador_id UUID;
    v_comercial_id UUID;
    v_conductor_id UUID;
BEGIN
    -- Verificar si los usuarios ya existen
    IF EXISTS (SELECT 1 FROM auth.users WHERE email IN (
        'admin@test.com',
        'director@test.com',
        'gerente@test.com',
        'coordinador@test.com',
        'supervisor@test.com',
        'rrhh@test.com',
        'contador@test.com',
        'comercial@test.com',
        'conductor@test.com'
    )) THEN
        RAISE NOTICE 'Algunos usuarios de prueba ya existen. Actualizando...';
        
        -- Eliminar usuarios existentes para recrearlos
        DELETE FROM auth.users WHERE email IN (
            'admin@test.com',
            'director@test.com',
            'gerente@test.com',
            'coordinador@test.com',
            'supervisor@test.com',
            'rrhh@test.com',
            'contador@test.com',
            'comercial@test.com',
            'conductor@test.com'
        );
    END IF;

    RAISE NOTICE 'Creando usuarios de prueba...';

    -- 1. ADMINISTRADOR
    v_admin_id := seed_test_user(
        'admin@test.com',
        'Test1234!',
        'Admin',
        'Sistema',
        'admin'
    );
    RAISE NOTICE 'Usuario creado: admin@test.com (%)' , v_admin_id;

    -- 2. DIRECTOR
    v_director_id := seed_test_user(
        'director@test.com',
        'Test1234!',
        'Director',
        'Principal',
        'director'
    );
    RAISE NOTICE 'Usuario creado: director@test.com (%)' , v_director_id;

    -- 3. GERENTE
    v_gerente_id := seed_test_user(
        'gerente@test.com',
        'Test1234!',
        'Gerente',
        'Operaciones',
        'gerente'
    );
    RAISE NOTICE 'Usuario creado: gerente@test.com (%)' , v_gerente_id;

    -- 4. COORDINADOR
    v_coordinador_id := seed_test_user(
        'coordinador@test.com',
        'Test1234!',
        'Coord',
        'Logística',
        'coordinador'
    );
    RAISE NOTICE 'Usuario creado: coordinador@test.com (%)' , v_coordinador_id;

    -- 5. SUPERVISOR
    v_supervisor_id := seed_test_user(
        'supervisor@test.com',
        'Test1234!',
        'Super',
        'Visor',
        'supervisor'
    );
    RAISE NOTICE 'Usuario creado: supervisor@test.com (%)' , v_supervisor_id;

    -- 6. RECURSOS HUMANOS
    v_rrhh_id := seed_test_user(
        'rrhh@test.com',
        'Test1234!',
        'RRHH',
        'Gestor',
        'recursos_humanos'
    );
    RAISE NOTICE 'Usuario creado: rrhh@test.com (%)' , v_rrhh_id;

    -- 7. CONTADOR
    v_contador_id := seed_test_user(
        'contador@test.com',
        'Test1234!',
        'Contador',
        'Finanzas',
        'contador'
    );
    RAISE NOTICE 'Usuario creado: contador@test.com (%)' , v_contador_id;

    -- 8. COMERCIAL
    v_comercial_id := seed_test_user(
        'comercial@test.com',
        'Test1234!',
        'Vendedor',
        'Comercial',
        'comercial'
    );
    RAISE NOTICE 'Usuario creado: comercial@test.com (%)' , v_comercial_id;

    -- 9. CONDUCTOR
    v_conductor_id := seed_test_user(
        'conductor@test.com',
        'Test1234!',
        'Juan',
        'Pérez',
        'conductor'
    );
    RAISE NOTICE 'Usuario creado: conductor@test.com (%)' , v_conductor_id;

    RAISE NOTICE '✅ Seed completado: 9 usuarios de prueba creados';
    RAISE NOTICE 'Contraseña para todos: Test1234!';
END $$;

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Mostrar usuarios creados
SELECT 
    u.email,
    p.nombre,
    p.apellido,
    p.role,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email LIKE '%@test.com'
ORDER BY p.role;

-- Limpiar función auxiliar (opcional)
DROP FUNCTION IF EXISTS seed_test_user(TEXT, TEXT, TEXT, TEXT, TEXT);

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
--
-- 1. SEGURIDAD: Este seed solo debe ejecutarse en desarrollo/testing
-- 2. Las contraseñas están hasheadas con bcrypt
-- 3. Todos los usuarios tienen email confirmado (email_confirmed_at)
-- 4. Los perfiles se crean automáticamente via trigger handle_new_user()
-- 5. Para eliminar usuarios de prueba:
--    DELETE FROM auth.users WHERE email LIKE '%@test.com';
--
-- 6. Para cambiar rol de un usuario:
--    UPDATE profiles SET role = 'admin' WHERE email = 'usuario@test.com';
--
-- 7. Roles disponibles:
--    - admin
--    - director
--    - gerente
--    - coordinador
--    - supervisor
--    - recursos_humanos
--    - administrativo
--    - contador
--    - comercial
--    - atencion_cliente
--    - conductor
--
-- ============================================================================
