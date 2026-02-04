# Auth Feature - Arquitectura Screaming

Feature de autenticación y autorización con arquitectura modular.

## Estructura

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx          # Formulario de inicio de sesión
│   ├── AuthInitializer.tsx    # Inicializa estado de auth al cargar app
│   ├── AuthLoading.tsx        # Loading mientras verifica auth
│   ├── ProtectedRoute.tsx     # HOC para rutas protegidas
│   ├── RequirePermission.tsx  # HOC para verificar permisos
│   └── UserMenu.tsx           # Menú de usuario en header
├── hooks/
│   ├── useAuth.ts             # Hook principal de autenticación
│   └── usePermissions.ts      # Hook para verificar permisos por rol
├── types/
│   └── auth.types.ts          # Tipos de usuario, roles y permisos
└── index.ts                    # Exports públicos
```

## Uso

### Importar desde el feature

```tsx
// En lugar de:
import { useAuth } from '@/hooks/auth/useAuth'
import LoginForm from '@/components/auth/LoginForm'

// Usar:
import { useAuth, LoginForm } from '@/features/auth'
```

### Componentes Disponibles

#### LoginForm
Formulario completo de inicio de sesión con validación.

```tsx
import { LoginForm } from '@/features/auth'

export default function LoginPage() {
  return <LoginForm />
}
```

#### AuthInitializer
Inicializa el estado de autenticación al cargar la aplicación.

```tsx
import { AuthInitializer } from '@/features/auth'

// En root layout
<AuthInitializer />
```

#### ProtectedRoute
Protege rutas que requieren autenticación.

```tsx
import { ProtectedRoute } from '@/features/auth'

export default function PrivatePage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  )
}
```

#### RequirePermission
Verifica permisos específicos antes de renderizar.

```tsx
import { RequirePermission } from '@/features/auth'

<RequirePermission module="vehiculos" action="edit">
  <EditButton />
</RequirePermission>
```

### Hooks Disponibles

#### useAuth
Hook principal para acceder al estado de autenticación.

```tsx
import { useAuth } from '@/features/auth'

function MyComponent() {
  const { user, profile, isAuthenticated, signOut } = useAuth()
  
  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Rol: {profile?.role}</p>
      <button onClick={signOut}>Cerrar Sesión</button>
    </div>
  )
}
```

#### usePermissions
Hook para verificar permisos basados en roles.

```tsx
import { usePermissions } from '@/features/auth'

function VehiclesPage() {
  const { checkPermission, canAccessModule, getRoleName } = usePermissions()
  
  const canEdit = checkPermission('vehiculos', 'edit')
  const canDelete = checkPermission('vehiculos', 'delete')
  
  return (
    <div>
      <h1>Vehículos - Rol: {getRoleName()}</h1>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </div>
  )
}
```

## Roles y Permisos

### Roles Disponibles
- `admin`: Acceso completo
- `director`: Acceso completo a operaciones
- `gerente`: Acceso completo a operaciones
- `coordinador`: Operaciones, rutas, conductores, vehículos
- `supervisor`: Vehículos, mantenimiento, talleres, seguros
- `recursos_humanos`: Conductores, multas, liquidaciones
- `administrativo`: Conductores, multas, liquidaciones
- `contador`: Finanzas, liquidaciones, impuestos
- `comercial`: Clientes, órdenes (solo vista)
- `atencion_cliente`: Clientes, órdenes (solo vista)
- `conductor`: Vista limitada

### Módulos
- `dashboard`, `ordenes`, `vehiculos`, `conductores`, `rutas`
- `multas`, `flujo_caja`, `indicadores_vehiculo`, `indicadores_conductor`
- `liquidaciones`, `talleres`, `mantenimiento_vehiculos`
- `seguros`, `impuestos_vehiculares`, `clientes`

### Acciones
- `view`: Ver/leer
- `create`: Crear nuevo
- `edit`: Editar existente
- `delete`: Eliminar

## Integración con Supabase

El feature se integra con Supabase para:
- Autenticación de usuarios
- Gestión de sesiones
- Almacenamiento de perfiles
- Row Level Security (RLS)

## Estado Global

El estado de autenticación se maneja con Zustand:
- `@/store/auth-store.ts` - Store global de auth
- Persistido en localStorage
- Sincronizado con Supabase

## Migraciones Futuras

Este feature está listo para migrarse completamente cuando se decida:
- Mover `auth-store.ts` a `src/features/auth/store/`
- Actualizar imports en toda la aplicación
- Mantener compatibilidad hacia atrás con exports desde index.ts
