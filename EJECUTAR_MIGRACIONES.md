# Guía: Aplicar Migraciones y Seed en Supabase Cloud

## 📋 Pre-requisitos

- [x] Tener acceso a Supabase Dashboard
- [x] Conocer la URL del proyecto
- [x] Tener permisos de administrador

---

## 🔍 PASO 1: Verificar Migraciones Existentes

### 1.1 Ir a SQL Editor
1. Abrir [Supabase Dashboard](https://app.supabase.com)
2. Seleccionar proyecto: **Transport-Pro-V3**
3. Click en **SQL Editor** (menú lateral izquierdo)

### 1.2 Verificar Tabla Profiles
Ejecutar esta query:

```sql
-- Verificar estructura de tabla profiles
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND table_schema = 'public'
ORDER BY ordinal_position;
```

**✅ Resultado Esperado:**
Debe mostrar columnas:
- `id` (uuid)
- `nombre` (text)
- `apellido` (text)
- `avatar_url` (text)
- `role` (text)
- `phone` (text)
- `department` (text)
- `position` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**❌ Si falta alguna columna:**
→ Continuar con PASO 2 para aplicar migraciones

**✅ Si todo está correcto:**
→ Saltar a PASO 3 (verificar trigger)

---

## 🚀 PASO 2: Aplicar Migraciones (Si es necesario)

### 2.1 Aplicar Migración de Profiles (Si no existe)

Si la tabla `profiles` no tiene las columnas correctas, ejecutar:

```sql
-- Solo ejecutar si la tabla no tiene nombre/apellido separados
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS nombre TEXT,
ADD COLUMN IF NOT EXISTS apellido TEXT;

-- Agregar índice para role si no existe
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
```

### 2.2 Aplicar Migración del Trigger Actualizado

**Archivo:** `supabase/migrations/20260116000000_update_handle_new_user_trigger.sql`

En SQL Editor, ejecutar:

```sql
-- Actualizar función handle_new_user para manejar nombre y apellido correctamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_nombre TEXT;
    user_apellido TEXT;
    full_name TEXT;
BEGIN
    -- Obtener nombre del metadata o del email
    user_nombre := COALESCE(
        NEW.raw_user_meta_data->>'nombre',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1)
    );
    
    -- Obtener apellido del metadata o del email
    user_apellido := COALESCE(
        NEW.raw_user_meta_data->>'apellido',
        SPLIT_PART(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 2)
    );
    
    -- Si apellido está vacío, intentar extraer del email
    IF user_apellido = '' OR user_apellido IS NULL THEN
        user_apellido := SPLIT_PART(NEW.email, '@', 1);
    END IF;

    INSERT INTO public.profiles (id, nombre, apellido, role)
    VALUES (
        NEW.id,
        user_nombre,
        user_apellido,
        COALESCE(
            NEW.raw_user_meta_data->>'role',
            CASE 
                WHEN NEW.email ILIKE '%@transportpro.com' THEN 'admin'
                ELSE 'conductor'
            END
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**✅ Resultado Esperado:**
```
Success. No rows returned
CREATE FUNCTION
```

---

## 🧪 PASO 3: Verificar Trigger

Ejecutar:

```sql
-- Ver triggers activos
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**✅ Resultado Esperado:**
```
trigger_name: on_auth_user_created
event_manipulation: INSERT
event_object_table: users
action_statement: EXECUTE FUNCTION public.handle_new_user()
```

**❌ Si no existe:**
Ejecutar:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 👥 PASO 4: Ejecutar Seed de Usuarios de Prueba

### 4.1 Verificar Usuarios Existentes

```sql
-- Ver usuarios de prueba existentes
SELECT email, id 
FROM auth.users 
WHERE email LIKE '%@test.com';
```

**Si hay usuarios:**
```sql
-- Eliminar usuarios de prueba anteriores
DELETE FROM auth.users WHERE email LIKE '%@test.com';
```

### 4.2 Ejecutar Seed

1. Abrir archivo: `supabase/seed/test_users.sql`
2. Copiar **TODO** el contenido
3. Pegar en SQL Editor
4. Click en **Run** (o Ctrl+Enter)

**✅ Resultado Esperado:**
```
NOTICE:  Creando usuarios de prueba...
NOTICE:  Usuario creado: admin@test.com (uuid)
NOTICE:  Usuario creado: director@test.com (uuid)
NOTICE:  Usuario creado: gerente@test.com (uuid)
NOTICE:  Usuario creado: coordinador@test.com (uuid)
NOTICE:  Usuario creado: supervisor@test.com (uuid)
NOTICE:  Usuario creado: rrhh@test.com (uuid)
NOTICE:  Usuario creado: contador@test.com (uuid)
NOTICE:  Usuario creado: comercial@test.com (uuid)
NOTICE:  Usuario creado: conductor@test.com (uuid)
NOTICE:  ✅ Seed completado: 9 usuarios de prueba creados
NOTICE:  Contraseña para todos: Test1234!

(9 rows returned)
```

**Deberías ver una tabla con:**
| email | nombre | apellido | role |
|-------|--------|----------|------|
| admin@test.com | Admin | Sistema | admin |
| comercial@test.com | Vendedor | Comercial | comercial |
| contador@test.com | Contador | Finanzas | contador |
| conductor@test.com | Juan | Pérez | conductor |
| coordinador@test.com | Coord | Logística | coordinador |
| director@test.com | Director | Principal | director |
| gerente@test.com | Gerente | Operaciones | gerente |
| rrhh@test.com | RRHH | Gestor | recursos_humanos |
| supervisor@test.com | Super | Visor | supervisor |

---

## ✅ PASO 5: Verificación Final

### 5.1 Verificar en Authentication Tab

1. Ir a **Authentication** → **Users** en Supabase Dashboard
2. Deberías ver **9 usuarios** con emails `*@test.com`
3. Todos deberían tener **email confirmado** (✅ verde)

### 5.2 Verificar Perfiles

```sql
-- Verificación completa
SELECT 
    u.email,
    p.nombre,
    p.apellido,
    p.role,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email LIKE '%@test.com'
ORDER BY p.role;
```

**✅ Checklist:**
- [ ] 9 usuarios creados
- [ ] Todos tienen `nombre` y `apellido`
- [ ] Todos tienen `role` asignado
- [ ] Todos tienen `email_confirmado = true`
- [ ] Los roles son correctos para cada usuario

---

## 🎯 PASO 6: Probar Login

### Opción 1: Desde la App

1. Iniciar app: `npm run dev`
2. Ir a `http://localhost:3000/login`
3. Probar login con:
   - Email: `admin@test.com`
   - Password: `Test1234!`

**✅ Resultado Esperado:**
- Login exitoso
- Redirección al dashboard
- UserMenu muestra "Admin Sistema"
- Sidebar muestra todos los módulos

### Opción 2: Desde Supabase Dashboard

1. Ir a **Authentication** → **Users**
2. Click en cualquier usuario de prueba
3. Ver detalles del perfil

---

## 🐛 Solución de Problemas

### Error: "permission denied for table auth.users"

**Causa:** No tienes permisos suficientes

**Solución:**
- Asegúrate de estar usando el SQL Editor como administrador
- Verifica que estás en el proyecto correcto

### Error: "function crypt does not exist"

**Causa:** Extensión pgcrypto no instalada

**Solución:**
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

### Error: "duplicate key value"

**Causa:** Usuarios ya existen

**Solución:**
```sql
DELETE FROM auth.users WHERE email LIKE '%@test.com';
-- Luego volver a ejecutar el seed
```

### Los usuarios se crean pero no aparecen perfiles

**Causa:** El trigger no se ejecutó

**Solución:**
1. Verificar que el trigger existe (PASO 3)
2. Si existe, crear perfiles manualmente:
```sql
INSERT INTO profiles (id, nombre, apellido, role)
SELECT 
    id,
    SPLIT_PART(email, '@', 1) as nombre,
    'Test' as apellido,
    'conductor' as role
FROM auth.users
WHERE email LIKE '%@test.com'
ON CONFLICT (id) DO NOTHING;

-- Luego actualizar roles correctos
UPDATE profiles SET role = 'admin' WHERE email = 'admin@test.com';
UPDATE profiles SET role = 'director' WHERE email = 'director@test.com';
-- etc...
```

---

## 📝 Checklist Final

Antes de continuar con el plan de pruebas:

- [ ] Tabla `profiles` tiene columnas `nombre` y `apellido`
- [ ] Trigger `handle_new_user` actualizado
- [ ] 9 usuarios de prueba creados en `auth.users`
- [ ] 9 perfiles creados en `profiles`
- [ ] Todos los emails confirmados
- [ ] Todos los roles asignados correctamente
- [ ] Login funciona con `admin@test.com / Test1234!`
- [ ] UserMenu muestra nombre y apellido
- [ ] Sidebar muestra módulos según rol

---

## ✨ Siguiente Paso

Una vez completados todos los pasos:

→ **Ejecutar Plan de Pruebas:** `PLAN_PRUEBAS_PERMISOS.md`

¡Todo listo para probar el sistema de permisos! 🚀
