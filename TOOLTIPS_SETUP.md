# Sistema de Tooltips para Permisos

## Estado Actual

El sidebar ya incluye tooltips básicos usando el atributo `title` nativo de HTML. Esto funciona para mostrar el nombre completo del módulo cuando el sidebar está colapsado.

## Mejora Propuesta: Tooltips Explicativos de Permisos

### Objetivo
Mostrar mensajes informativos cuando un módulo no está disponible debido a permisos insuficientes.

### Implementación Recomendada

#### 1. Instalar @radix-ui/react-tooltip

```bash
npm install @radix-ui/react-tooltip
```

#### 2. Crear componente Tooltip UI

Crear `src/components/ui/tooltip.tsx`:

```tsx
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

#### 3. Actualizar SidebarNav con Tooltips de Permisos

Modificar `src/components/layout/sidebar-nav.tsx`:

```tsx
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// Dentro del componente, envolver toda la navegación
<TooltipProvider delayDuration={300}>
  <nav className="flex-1 overflow-y-auto py-4 px-3">
    <ul className="space-y-2">
      {allNavItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        const hasAccess = canAccessModule(item.module)

        // Si no tiene acceso, mostrar tooltip explicativo
        if (!hasAccess) {
          return (
            <li key={item.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "flex items-center rounded-lg text-sm font-medium cursor-not-allowed opacity-50",
                      isOpen ? "px-4 py-3" : "px-3 py-3 justify-center"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 flex-shrink-0", isOpen && "mr-3")} />
                    {isOpen && <span className="truncate">{item.title}</span>}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">Acceso Restringido</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Tu rol no tiene permisos para acceder a {item.title}.
                  </p>
                </TooltipContent>
              </Tooltip>
            </li>
          )
        }

        // Si tiene acceso, renderizar normalmente
        return (
          <li key={item.href}>
            <Link href={item.href} ... >
              {/* Contenido actual */}
            </Link>
          </li>
        )
      })}
    </ul>
  </nav>
</TooltipProvider>
```

#### 4. Alternativa: Mostrar Módulos Deshabilitados

Si prefieres mostrar todos los módulos pero deshabilitados visualmente:

```tsx
{allNavItems.map((item) => {
  const hasAccess = canAccessModule(item.module)
  
  if (!hasAccess) {
    return (
      <Tooltip key={item.href}>
        <TooltipTrigger asChild>
          <div className="opacity-40 cursor-not-allowed">
            {/* Renderizar item deshabilitado */}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          No tienes permisos para este módulo
        </TooltipContent>
      </Tooltip>
    )
  }
  
  return <Link key={item.href} ... />
})}
```

### Mensajes de Tooltip por Rol

Puedes personalizar los mensajes según el rol:

```tsx
const getPermissionMessage = (module: Module, role: UserRole): string => {
  const messages: Record<UserRole, string> = {
    conductor: "Este módulo solo está disponible para personal administrativo",
    contador: "Este módulo requiere permisos de gestión operativa",
    comercial: "Este módulo requiere permisos administrativos",
    // ... más mensajes personalizados
  }
  
  return messages[role] || "No tienes permisos para acceder a este módulo"
}
```

## Beneficios

1. **Transparencia**: Los usuarios entienden por qué no pueden acceder
2. **Mejor UX**: Mensajes claros en lugar de opciones ocultas
3. **Autoservicio**: Los usuarios saben qué permisos necesitan solicitar
4. **Feedback visual**: Indicadores claros de permisos

## Estado Actual (Sin tooltips avanzados)

Actualmente, el sidebar solo muestra los módulos a los que el usuario tiene acceso (filtrados). Los módulos sin permisos simplemente no aparecen, lo cual es un diseño válido y limpio.

**Opción 1 (Actual)**: Ocultar módulos sin permisos ✓
**Opción 2 (Propuesta)**: Mostrar todos con tooltips explicativos

Ambas son válidas. La Opción 1 es más limpia, la Opción 2 es más informativa.
