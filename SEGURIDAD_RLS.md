# Seguridad - Políticas RLS para Producción

## ⚠️ IMPORTANTE

Actualmente las políticas RLS están configuradas de forma **MUY PERMISIVA** para facilitar el desarrollo. **ANTES de pasar a producción**, debes ajustarlas.

---

## 📊 Políticas Actuales (Desarrollo)

### Tabla: `profiles`

```sql
-- Política actual (MUY PERMISIVA)
CREATE POLICY "simple_select_policy" ON profiles
    FOR SELECT
    USING (true);  -- ⚠️ Cualquiera puede leer TODOS los perfiles
```

**Problema:**
- Usuarios pueden ver información de TODOS los demás usuarios
- No hay restricción de datos sensibles
- Expone nombres, apellidos, roles, departamentos, etc.

---

## 🔒 Políticas Recomendadas para Producción

### Opción 1: Restricción por Rol (Recomendado)

```sql
-- Eliminar política permisiva
DROP POLICY IF EXISTS "simple_select_policy" ON profiles;

-- 1. Usuarios pueden ver su propio perfil
CREATE POLICY "users_read_own_profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 2. Admin, Director y Gerente pueden ver todos los perfiles
CREATE POLICY "managers_read_all_profiles" ON profiles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles AS p
            WHERE p.id = auth.uid()
            AND p.role IN ('admin', 'director', 'gerente')
            LIMIT 1
        )
    );

-- 3. RR.HH. puede ver perfiles de conductores
CREATE POLICY "rrhh_read_drivers" ON profiles
    FOR SELECT
    USING (
        role = 'conductor'
        AND EXISTS (
            SELECT 1 FROM profiles AS p
            WHERE p.id = auth.uid()
            AND p.role IN ('recursos_humanos', 'administrativo')
            LIMIT 1
        )
    );
```

### Opción 2: Vista Pública Limitada

Crear una vista con solo campos públicos:

```sql
-- Vista con información pública
CREATE VIEW public_profiles AS
SELECT 
    id,
    nombre,
    apellido,
    avatar_url,
    role
FROM profiles;

-- Permitir SELECT en la vista
GRANT SELECT ON public_profiles TO authenticated;

-- En tu código, usar public_profiles en lugar de profiles
-- para consultas donde no necesitas datos sensibles
```

---

## 🛡️ Política de Actualización (UPDATE)

```sql
-- Política actual
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
```

**Mejora Recomendada:**

```sql
-- Usuarios solo pueden actualizar campos específicos
CREATE POLICY "users_update_own_basic_info" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        -- No permitir cambiar el rol
        AND (OLD.role = NEW.role)
    );

-- Solo admin puede cambiar roles
CREATE POLICY "admin_update_roles" ON profiles
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    )
    WITH CHECK (true);
```

---

## 📝 Campos Sensibles

Considera ocultar estos campos para usuarios normales:

### Sensibles:
- `phone` - Número de teléfono personal
- `department` - Información organizacional
- `position` - Cargo/puesto
- `created_at` - Fecha de creación
- `updated_at` - Fecha de actualización

### Públicos:
- `nombre` - Nombre
- `apellido` - Apellido
- `avatar_url` - Foto de perfil
- `role` - Rol (puede ser público o privado según necesidad)

---

## 🔍 Auditoría de Accesos

Considera agregar una tabla de auditoría:

```sql
CREATE TABLE profile_access_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    accessor_id UUID REFERENCES auth.users(id),
    accessed_profile_id UUID REFERENCES profiles(id),
    accessed_at TIMESTAMP DEFAULT NOW()
);

-- Trigger para registrar accesos
CREATE OR REPLACE FUNCTION log_profile_access()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profile_access_log (accessor_id, accessed_profile_id)
    VALUES (auth.uid(), NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profile_access_trigger
AFTER SELECT ON profiles
FOR EACH ROW
EXECUTE FUNCTION log_profile_access();
```

---

## ✅ Checklist de Seguridad para Producción

Antes de desplegar:

- [ ] Reemplazar `simple_select_policy` con políticas restrictivas
- [ ] Agregar política para cambio de roles (solo admin)
- [ ] Probar que usuarios NO pueden ver perfiles que no deben
- [ ] Probar que admin PUEDE ver todos los perfiles
- [ ] Verificar que usuarios NO pueden cambiar su propio rol
- [ ] Considerar agregar auditoría de accesos
- [ ] Documentar políticas en el equipo
- [ ] Hacer pruebas de penetración básicas

---

## 🧪 Probar Políticas

```sql
-- 1. Como usuario normal
SET ROLE authenticated;
SET request.jwt.claim.sub = 'UUID_DEL_CONDUCTOR';

-- Intentar ver otros perfiles (debería fallar)
SELECT * FROM profiles WHERE id != 'UUID_DEL_CONDUCTOR';

-- 2. Como admin
SET request.jwt.claim.sub = 'UUID_DEL_ADMIN';

-- Ver todos los perfiles (debería funcionar)
SELECT * FROM profiles;

-- 3. Limpiar
RESET ROLE;
```

---

## 📚 Referencias

- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Security Best Practices](https://supabase.com/docs/guides/platform/security)

---

## ⚠️ RESUMEN

**Estado Actual**: Desarrollo (cualquiera puede leer todo)  
**Estado Requerido**: Producción (acceso restringido por rol)  
**Acción**: Aplicar políticas restrictivas antes de producción
