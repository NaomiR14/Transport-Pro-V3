# Seed - Usuarios de Prueba

## 📦 Usuarios Creados

| Email | Contraseña | Rol | Nombre | Apellido |
|-------|-----------|-----|--------|----------|
| admin@test.com | Test1234! | admin | Admin | Sistema |
| director@test.com | Test1234! | director | Director | Principal |
| gerente@test.com | Test1234! | gerente | Gerente | Operaciones |
| coordinador@test.com | Test1234! | coordinador | Coord | Logística |
| contador@test.com | Test1234! | contador | Contador | Finanzas |
| conductor@test.com | Test1234! | conductor | Juan | Pérez |

## 🚀 Ejecutar Seed

### Desde Supabase Dashboard:

1. Ir a [Supabase Dashboard](https://app.supabase.com)
2. Seleccionar tu proyecto
3. Ir a **SQL Editor**
4. Copiar y pegar contenido de `test_users.sql`
5. Hacer clic en **Run**

### Verificar:

```sql
SELECT email, nombre, apellido, role 
FROM profiles 
WHERE email LIKE '%@test.com'
ORDER BY role;
```

## 🧹 Limpiar

```sql
DELETE FROM auth.users WHERE email LIKE '%@test.com';
```
