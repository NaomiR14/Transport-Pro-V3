# Componentes de Autenticación

## RequirePermission

Componente para proteger páginas y contenido según permisos del usuario.

### Uso Básico

```tsx
import { RequirePermission } from '@/components/auth'

export default function VehiculosPage() {
    return (
        <RequirePermission module="vehiculos">
            <div>
                {/* Contenido de la página */}
                <h1>Gestión de Vehículos</h1>
            </div>
        </RequirePermission>
    )
}
```

### Con Acción Específica

```tsx
import { RequirePermission } from '@/components/auth'

export default function CrearVehiculoPage() {
    return (
        <RequirePermission module="vehiculos" action="create">
            <div>
                <h1>Crear Nuevo Vehículo</h1>
                {/* Formulario de creación */}
            </div>
        </RequirePermission>
    )
}
```

### Con Fallback Personalizado

```tsx
import { RequirePermission } from '@/components/auth'

export default function AdminPage() {
    return (
        <RequirePermission 
            module="dashboard" 
            action="view"
            fallback={
                <div>
                    <h1>Acceso Denegado</h1>
                    <p>Solo administradores pueden ver esta página.</p>
                </div>
            }
        >
            <div>
                <h1>Panel de Administración</h1>
            </div>
        </RequirePermission>
    )
}
```

### Con Redirección a Página de Acceso Denegado

```tsx
import { RequirePermission } from '@/components/auth'

export default function VehiculosPage() {
    return (
        <RequirePermission 
            module="vehiculos" 
            action="edit"
            redirectOnDenied={true}
        >
            <div>
                <h1>Editar Vehículos</h1>
                {/* Si no tiene permisos, será redirigido a /acceso-denegado */}
            </div>
        </RequirePermission>
    )
}
```

### Props

- `module` (required): El módulo que se desea proteger. Tipos disponibles:
  - `'dashboard'`
  - `'ordenes'`
  - `'vehiculos'`
  - `'conductores'`
  - `'rutas'`
  - `'multas'`
  - `'flujo_caja'`
  - `'indicadores_vehiculo'`
  - `'indicadores_conductor'`
  - `'liquidaciones'`
  - `'talleres'`
  - `'mantenimiento_vehiculos'`
  - `'seguros'`
  - `'impuestos_vehiculares'`
  - `'clientes'`

- `action` (optional): La acción que se requiere permiso. Default: `'view'`
  - `'view'` - Ver/leer
  - `'create'` - Crear
  - `'edit'` - Editar
  - `'delete'` - Eliminar

- `fallback` (optional): Componente personalizado a mostrar si no hay permisos. Si no se proporciona, muestra un mensaje por defecto.

- `redirectOnDenied` (optional): Si es `true`, redirige a `/acceso-denegado` cuando no hay permisos. Default: `false`

- `children` (required): El contenido a proteger.

## UserMenu

Menú desplegable que muestra información del usuario y opciones de cuenta.

### Uso

```tsx
import { UserMenu } from '@/components/auth'

export default function Header() {
    return (
        <header>
            <nav>
                {/* ... */}
                <UserMenu />
            </nav>
        </header>
    )
}
```

El componente automáticamente:
- Muestra el nombre y apellido del usuario (o email si no están disponibles)
- Muestra el rol del usuario
- Proporciona enlaces a perfil y configuración
- Incluye opción para cerrar sesión
