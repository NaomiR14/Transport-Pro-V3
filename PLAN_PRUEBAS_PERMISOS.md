# Plan de Pruebas - Sistema de Permisos y Roles

## 🎯 Objetivo
Verificar que todos los cambios del sistema de permisos funcionan correctamente en diferentes escenarios y con diferentes roles de usuario.

## 📋 Pre-requisitos

### 1. Base de Datos Preparada
- [ ] Tabla `profiles` con campos `nombre`, `apellido`, `role`
- [ ] Al menos un usuario de cada rol para pruebas
- [ ] Trigger que crea perfil automáticamente al registrarse

### 2. Usuarios de Prueba Sugeridos

Crear estos usuarios en Supabase Auth para probar todos los roles:

```sql
-- Verificar que los perfiles existen
SELECT id, email, nombre, apellido, role 
FROM profiles 
ORDER BY role;
```

| Email | Rol | Nombre | Apellido |
|-------|-----|--------|----------|
| admin@test.com | admin | Admin | Sistema |
| director@test.com | director | Director | Principal |
| gerente@test.com | gerente | Gerente | Operaciones |
| coordinador@test.com | coordinador | Coord | Logística |
| contador@test.com | contador | Contador | Finanzas |
| conductor@test.com | conductor | Juan | Pérez |

**Contraseña sugerida para todos**: `Test1234!` (cambiar en producción)

---

## 🧪 FASE 1: Registro y Perfil

### Test 1.1: Registro de Nuevo Usuario
**Objetivo**: Verificar campos nombre/apellido separados

**Pasos**:
1. Ir a `/registro`
2. Completar formulario:
   - Nombre: `Test`
   - Apellido: `Usuario`
   - Email: `nuevo@test.com`
   - Contraseña: `Test1234!`
   - Confirmar contraseña: `Test1234!`
3. Hacer clic en "Crear Cuenta"

**Resultados Esperados**:
- ✅ Se muestran campos separados para Nombre y Apellido
- ✅ Validación requiere ambos campos
- ✅ Mensaje de éxito mostrado
- ✅ Email de confirmación enviado
- ✅ Redirección automática a `/login` después de 5 segundos

**Verificar en Supabase**:
```sql
SELECT email, nombre, apellido, full_name 
FROM profiles 
WHERE email = 'nuevo@test.com';
```
- ✅ `nombre` = "Test"
- ✅ `apellido` = "Usuario"
- ✅ `full_name` = "Test Usuario"

---

### Test 1.2: Página de Perfil
**Objetivo**: Verificar visualización de nombre/apellido

**Pasos**:
1. Iniciar sesión con cualquier usuario
2. Ir a `/perfil`

**Resultados Esperados**:
- ✅ Muestra "Bienvenido, [Nombre] [Apellido]" en el encabezado
- ✅ Sección muestra campos separados:
  - Nombre: [valor]
  - Apellido: [valor]
- ✅ Muestra email
- ✅ Muestra rol traducido (ej: "Administrador", "Conductor")
- ✅ Botón "Actualizar" funciona

---

### Test 1.3: UserMenu
**Objetivo**: Verificar nombre/apellido en menú de usuario

**Pasos**:
1. Iniciar sesión
2. Observar esquina superior derecha
3. Hacer clic en el menú de usuario

**Resultados Esperados**:
- ✅ Avatar muestra inicial
- ✅ Nombre completo: "[Nombre] [Apellido]"
- ✅ Email mostrado
- ✅ Rol mostrado en badge (ej: "Administrador")
- ✅ Opciones "Mi Perfil" y "Configuración" visibles
- ✅ Opción "Cerrar Sesión" funciona

---

## 🧪 FASE 2: Sistema de Permisos

### Test 2.1: Sidebar - Rol Admin
**Objetivo**: Admin ve todos los módulos

**Pasos**:
1. Iniciar sesión como `admin@test.com`
2. Observar sidebar

**Resultados Esperados**:
- ✅ Muestra TODOS los módulos (14 items):
  - Dashboard
  - Órdenes de Transporte
  - Flota de Vehículos
  - Conductores
  - Rutas de Viaje
  - Multas de Conductores
  - Flujo de Caja
  - Indicadores por Vehículo
  - Indicadores por Conductor
  - Liquidaciones
  - Talleres
  - Mantenimiento de Vehículos
  - Seguros de Vehículos
  - Impuestos de Vehículos

---

### Test 2.2: Sidebar - Rol Conductor
**Objetivo**: Conductor ve solo módulos permitidos

**Pasos**:
1. Iniciar sesión como `conductor@test.com`
2. Observar sidebar

**Resultados Esperados**:
- ✅ Muestra SOLO 4 módulos:
  - Dashboard
  - Órdenes de Transporte
  - Rutas de Viaje
  - Multas de Conductores
- ✅ NO muestra:
  - Flota de Vehículos
  - Flujo de Caja
  - Liquidaciones
  - Indicadores
  - Mantenimiento
  - Seguros
  - Impuestos

---

### Test 2.3: Sidebar - Rol Contador
**Objetivo**: Contador ve módulos financieros

**Pasos**:
1. Iniciar sesión como `contador@test.com`
2. Observar sidebar

**Resultados Esperados**:
- ✅ Muestra módulos:
  - Dashboard
  - Flujo de Caja
  - Liquidaciones
  - Impuestos de Vehículos
  - Seguros de Vehículos
  - Indicadores por Vehículo
- ✅ NO muestra:
  - Órdenes
  - Conductores
  - Rutas
  - Multas
  - Talleres
  - Mantenimiento

---

### Test 2.4: Dashboard - Filtrado de Módulos
**Objetivo**: Dashboard solo muestra tarjetas de módulos accesibles

**Para cada rol**:
1. Iniciar sesión
2. Ir a dashboard (`/`)
3. Contar tarjetas visibles

**Resultados Esperados por Rol**:

| Rol | Tarjetas Esperadas |
|-----|-------------------|
| admin | 13 (todas) |
| director | 13 |
| gerente | 13 |
| coordinador | 7 |
| contador | 6 |
| conductor | 4 |

**Verificación**:
- ✅ Solo aparecen módulos permitidos
- ✅ Tarjetas clickeables llevan al módulo
- ✅ Diseño responsive funciona

---

## 🧪 FASE 3: Componente RequirePermission

### Test 3.1: Acceso Permitido
**Objetivo**: Usuario con permisos ve el contenido

**Pasos**:
1. Crear archivo de prueba `src/app/test-permisos/page.tsx`:
```tsx
import { RequirePermission } from '@/components/auth'

export default function TestPage() {
  return (
    <RequirePermission module="dashboard">
      <div className="p-8">
        <h1>Contenido Protegido</h1>
        <p>Si ves esto, tienes acceso al dashboard</p>
      </div>
    </RequirePermission>
  )
}
```
2. Iniciar sesión como admin
3. Ir a `/test-permisos`

**Resultados Esperados**:
- ✅ Se muestra el contenido
- ✅ Sin errores en consola
- ✅ No hay redirección

---

### Test 3.2: Acceso Denegado - Fallback por Defecto
**Objetivo**: Usuario sin permisos ve mensaje por defecto

**Pasos**:
1. Modificar test para módulo restringido:
```tsx
<RequirePermission module="flujo_caja">
  <div>Contenido de Flujo de Caja</div>
</RequirePermission>
```
2. Iniciar sesión como `conductor@test.com`
3. Ir a `/test-permisos`

**Resultados Esperados**:
- ✅ NO se muestra el contenido protegido
- ✅ Se muestra mensaje de "Acceso Restringido"
- ✅ Tarjeta con icono de alerta naranja
- ✅ Botones "Volver al Dashboard" y "Volver Atrás" funcionan

---

### Test 3.3: Acceso Denegado - Redirección
**Objetivo**: Redirección a página de acceso denegado

**Pasos**:
1. Modificar test:
```tsx
<RequirePermission module="flujo_caja" redirectOnDenied={true}>
  <div>Contenido</div>
</RequirePermission>
```
2. Iniciar sesión como conductor
3. Ir a `/test-permisos`

**Resultados Esperados**:
- ✅ Redirección automática a `/acceso-denegado`
- ✅ URL incluye parámetros: `?modulo=flujo_caja&accion=view`
- ✅ Página muestra información contextual

---

### Test 3.4: Acceso Denegado - Fallback Personalizado
**Objetivo**: Usar fallback personalizado

**Pasos**:
1. Modificar test:
```tsx
<RequirePermission 
  module="flujo_caja"
  fallback={
    <div className="p-8 text-center">
      <h2>No Autorizado</h2>
      <p>Contacta al administrador</p>
    </div>
  }
>
  <div>Contenido</div>
</RequirePermission>
```
2. Iniciar sesión como conductor
3. Ir a `/test-permisos`

**Resultados Esperados**:
- ✅ Se muestra el fallback personalizado
- ✅ NO se muestra el mensaje por defecto

---

### Test 3.5: Verificación de Acción Específica
**Objetivo**: Verificar permisos por acción (view, create, edit, delete)

**Pasos**:
1. Modificar test:
```tsx
<RequirePermission module="ordenes" action="delete">
  <button>Eliminar Orden</button>
</RequirePermission>
```
2. Probar con diferentes roles:
   - Admin (debería ver)
   - Conductor (no debería ver)

**Resultados Esperados**:
- ✅ Admin ve el botón
- ✅ Conductor NO ve el botón

---

## 🧪 FASE 4: Página de Acceso Denegado

### Test 4.1: Acceso Directo
**Objetivo**: Verificar página funciona correctamente

**Pasos**:
1. Iniciar sesión como conductor
2. Ir directamente a:
```
/acceso-denegado?modulo=vehiculos&accion=edit
```

**Resultados Esperados**:
- ✅ Página se muestra correctamente
- ✅ Icono de alerta naranja visible
- ✅ Título "Acceso Restringido"
- ✅ Muestra información del usuario:
  - Email del conductor
  - Rol: "Conductor"
- ✅ Mensaje indica:
  - "No tienes permisos para **editar** en el módulo de **vehiculos**"
- ✅ Botones funcionan:
  - "Ir al Dashboard" → redirige a `/`
  - "Volver Atrás" → regresa a página anterior
- ✅ Sección "¿Necesitas acceso?" visible

---

### Test 4.2: Sin Parámetros
**Objetivo**: Página funciona sin query params

**Pasos**:
1. Ir a `/acceso-denegado` (sin parámetros)

**Resultados Esperados**:
- ✅ Usa valores por defecto:
  - Módulo: "este módulo"
  - Acción: "ver"

---

## 🧪 FASE 5: Página de Administración de Roles

### Test 5.1: Acceso como Admin
**Objetivo**: Admin puede ver página de roles

**Pasos**:
1. Iniciar sesión como admin
2. Ir a `/admin/roles`

**Resultados Esperados**:
- ✅ Página se carga correctamente
- ✅ Título "Administración de Roles"
- ✅ Alert azul "En desarrollo"
- ✅ 6 tarjetas de roles visibles:
  - Administrador
  - Director
  - Gerente
  - Coordinador
  - Contador
  - Conductor
- ✅ Cada tarjeta muestra:
  - Icono con color
  - Nombre del rol
  - Descripción
  - Contador de usuarios
  - Módulos con acceso (badges)
  - Botón "Ver detalles" (deshabilitado)
- ✅ Sección "Funcionalidades Planificadas"

---

### Test 5.2: Acceso como No-Admin
**Objetivo**: Usuarios sin permisos no acceden

**Pasos**:
1. Iniciar sesión como conductor
2. Intentar ir a `/admin/roles`

**Resultados Esperados**:
- ✅ Se muestra mensaje de acceso restringido
- ✅ NO se muestra contenido de la página
- ✅ Opciones para volver disponibles

---

## 🧪 FASE 6: Integración End-to-End

### Test 6.1: Flujo Completo - Rol Coordinador
**Objetivo**: Verificar experiencia completa de un coordinador

**Pasos**:
1. Cerrar sesión
2. Ir a `/registro`
3. Registrar nuevo usuario:
   - Nombre: Coord
   - Apellido: Nuevo
   - Email: coord.nuevo@test.com
   - Contraseña: Test1234!
4. Confirmar email (si está configurado)
5. Iniciar sesión con `coord.nuevo@test.com`
6. **Actualizar rol manualmente en Supabase**:
```sql
UPDATE profiles 
SET role = 'coordinador' 
WHERE email = 'coord.nuevo@test.com';
```
7. Refrescar página (F5)
8. Verificar sidebar
9. Ir al dashboard
10. Intentar acceder a módulos permitidos y no permitidos
11. Ir a `/perfil`
12. Revisar UserMenu
13. Intentar ir a `/admin/roles`

**Resultados Esperados**:
- ✅ Registro exitoso con nombre/apellido
- ✅ Sidebar muestra solo 7 módulos
- ✅ Dashboard muestra solo 7 tarjetas
- ✅ Puede acceder a: Órdenes, Rutas, Conductores, Vehículos, Talleres, Mantenimiento
- ✅ NO puede acceder a: Flujo de Caja, Liquidaciones, Seguros, Impuestos
- ✅ Perfil muestra "Coord Nuevo"
- ✅ UserMenu muestra "Coord Nuevo" y badge "Coordinador"
- ✅ NO puede acceder a `/admin/roles`

---

### Test 6.2: Cambio de Rol en Tiempo Real
**Objetivo**: Verificar que los permisos se actualizan

**Pasos**:
1. Iniciar sesión como conductor
2. Anotar módulos visibles en sidebar
3. En otra pestaña, cambiar rol en Supabase:
```sql
UPDATE profiles 
SET role = 'gerente' 
WHERE email = 'conductor@test.com';
```
4. En la app, hacer clic en "Actualizar" en perfil
5. Observar cambios

**Resultados Esperados**:
- ✅ Sidebar se actualiza con más módulos
- ✅ Dashboard muestra más tarjetas
- ✅ Rol cambia en UserMenu
- ✅ Ahora puede acceder a módulos antes restringidos

---

## 🧪 FASE 7: Casos Edge

### Test 7.1: Usuario Sin Rol Asignado
**Objetivo**: Manejar usuario sin rol en profile

**Pasos**:
1. Crear usuario en Supabase Auth
2. NO asignar rol en profiles (o role = NULL)
3. Intentar iniciar sesión

**Resultados Esperados**:
- ✅ Login exitoso
- ✅ Sidebar muestra solo Dashboard
- ✅ Dashboard muestra mensaje o solo dashboard
- ✅ No hay crashes

---

### Test 7.2: Sin Conexión a Internet
**Objetivo**: App funciona offline

**Pasos**:
1. Iniciar sesión
2. Desconectar internet
3. Navegar por la app

**Resultados Esperados**:
- ✅ UI sigue funcionando
- ✅ Sidebar muestra últimos permisos cargados
- ✅ Mensajes de error apropiados si hay queries

---

### Test 7.3: Múltiples Pestañas
**Objetivo**: Consistencia entre pestañas

**Pasos**:
1. Abrir app en 2 pestañas
2. Iniciar sesión en pestaña 1
3. Observar pestaña 2

**Resultados Esperados**:
- ✅ Ambas pestañas sincronizan
- ✅ Permisos consistentes
- ✅ Cerrar sesión en una cierra en ambas

---

## 📊 Resumen de Pruebas

### Checklist General

**Registro y Perfil**
- [ ] 1.1 Registro con nombre/apellido
- [ ] 1.2 Página de perfil
- [ ] 1.3 UserMenu

**Sistema de Permisos**
- [ ] 2.1 Sidebar - Admin (todos los módulos)
- [ ] 2.2 Sidebar - Conductor (4 módulos)
- [ ] 2.3 Sidebar - Contador (6 módulos)
- [ ] 2.4 Dashboard filtrado

**RequirePermission**
- [ ] 3.1 Acceso permitido
- [ ] 3.2 Fallback por defecto
- [ ] 3.3 Redirección
- [ ] 3.4 Fallback personalizado
- [ ] 3.5 Acciones específicas

**Página Acceso Denegado**
- [ ] 4.1 Con parámetros
- [ ] 4.2 Sin parámetros

**Admin de Roles**
- [ ] 5.1 Acceso admin
- [ ] 5.2 Acceso denegado no-admin

**Integración**
- [ ] 6.1 Flujo completo coordinador
- [ ] 6.2 Cambio de rol en tiempo real

**Casos Edge**
- [ ] 7.1 Usuario sin rol
- [ ] 7.2 Sin internet
- [ ] 7.3 Múltiples pestañas

---

## 🐛 Reporte de Bugs

Si encuentras problemas, documenta:

```markdown
### Bug: [Título descriptivo]

**Severidad**: Alta / Media / Baja

**Pasos para reproducir**:
1. ...
2. ...
3. ...

**Resultado esperado**:
...

**Resultado actual**:
...

**Captura de pantalla**:
[adjuntar]

**Navegador**: Chrome / Firefox / Safari
**Sistema**: macOS / Windows / Linux
**Usuario de prueba**: email del usuario
```

---

## ✅ Criterios de Éxito

La implementación es exitosa si:

1. ✅ Todos los usuarios pueden registrarse con nombre/apellido
2. ✅ Perfiles muestran información correcta
3. ✅ Sidebar se filtra según permisos de cada rol
4. ✅ Dashboard solo muestra módulos accesibles
5. ✅ RequirePermission protege correctamente el contenido
6. ✅ Página de acceso denegado funciona
7. ✅ Admin puede ver página de roles
8. ✅ No hay errores en consola
9. ✅ No hay crashes al cambiar entre roles
10. ✅ UI es responsive y funciona en móviles

---

## 🚀 Comandos Útiles para Pruebas

```bash
# Verificar que la app compila
npm run build

# Iniciar servidor de desarrollo
npm run dev

# Ver logs en tiempo real
# Abrir DevTools → Console

# Limpiar caché del navegador
# Chrome: Cmd+Shift+Delete (Mac) / Ctrl+Shift+Delete (Win)
```

### Queries SQL Útiles

```sql
-- Ver todos los usuarios y sus roles
SELECT email, nombre, apellido, role, created_at 
FROM profiles 
ORDER BY created_at DESC;

-- Cambiar rol de un usuario
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'usuario@test.com';

-- Verificar perfiles sin rol
SELECT * FROM profiles WHERE role IS NULL;

-- Contar usuarios por rol
SELECT role, COUNT(*) as total 
FROM profiles 
GROUP BY role;
```

---

## 📝 Notas Finales

- Ejecutar pruebas en orden recomendado
- Usar usuarios de prueba, NO usuarios reales
- Documentar cualquier comportamiento inesperado
- Verificar en diferentes navegadores
- Probar en móvil además de desktop
- Borrar caché entre pruebas si es necesario

**Tiempo estimado**: 2-3 horas para todas las pruebas

¡Buena suerte con las pruebas! 🎉
