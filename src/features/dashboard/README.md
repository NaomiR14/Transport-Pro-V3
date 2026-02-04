# Dashboard Feature

Feature de Dashboard con integración completa a Supabase para métricas en tiempo real.

## Estructura

```
dashboard/
├── components/          # Componentes del dashboard
│   ├── TotalSalesCard.tsx          # Tarjeta de ingresos totales
│   ├── ProductStatistics.tsx       # Gráfico de distribución de vehículos
│   ├── CustomerHabbitsChart.tsx    # Gráfico de uso mensual
│   ├── CustomerGrowth.tsx          # Crecimiento de conductores por región
│   ├── DashboardMetrics.tsx        # Dashboard completo con métricas
│   └── DashboardContent.tsx        # Página principal de inicio
├── hooks/               # React Query hooks
│   └── useDashboardMetrics.ts      # Hooks para obtener datos de Supabase
└── index.ts            # Exports públicos
```

## Componentes

### DashboardContent
Página principal de inicio (`/`) que muestra:
- Landing page para usuarios no autenticados
- Grid de módulos disponibles según permisos del usuario
- Stats cards con información de sesión y rol

### DashboardMetrics
Dashboard completo con métricas (`/dashboard`) que incluye:
- 4 stat cards principales (vehículos, conductores, alertas)
- Tarjeta de ingresos totales con cambio porcentual
- Gráfico de distribución de vehículos por tipo (pie chart)
- Gráfico de uso mensual (bar chart)
- Conductores por región con barras de progreso
- 3 stat cards adicionales (rutas, mantenimiento, disponibilidad)

### TotalSalesCard
Tarjeta con gradiente azul que muestra ingresos totales y cambio porcentual.

**Props:**
- `value: string | number` - Valor de ingresos
- `change?: number` - Cambio porcentual
- `period?: string` - Periodo de comparación
- `loading?: boolean` - Estado de carga

### ProductStatistics
Gráfico circular (pie chart) con distribución de vehículos por tipo.

**Props:**
- `data: ProductData[]` - Array con datos de distribución
- `loading?: boolean` - Estado de carga

**ProductData:**
```typescript
interface ProductData {
  name: string        // Tipo de vehículo
  value: number       // Cantidad
  percentage: number  // Porcentaje
}
```

### CustomerHabbitsChart
Gráfico de barras con uso mensual de vehículos (en ruta vs disponibles).

**Props:**
- `data: MonthlyData[]` - Array con datos mensuales
- `loading?: boolean` - Estado de carga
- `selectedYear?: string` - Año seleccionado
- `onYearChange?: (year: string) => void` - Callback al cambiar año

**MonthlyData:**
```typescript
interface MonthlyData {
  month: string      // Mes (Ene, Feb, Mar...)
  enRuta: number     // Vehículos en ruta
  disponibles: number // Vehículos disponibles
}
```

### CustomerGrowth
Lista de conductores por región con barras de progreso y crecimiento.

**Props:**
- `data: RegionData[]` - Array con datos por región
- `loading?: boolean` - Estado de carga

**RegionData:**
```typescript
interface RegionData {
  country: string   // Ciudad/región
  flag: string      // Emoji de bandera
  drivers: number   // Cantidad de conductores
  growth: number    // Porcentaje de crecimiento
}
```

## Hooks

### useDashboardMetrics()
Obtiene métricas generales del dashboard desde Supabase.

**Retorna:**
```typescript
interface DashboardMetrics {
  totalVehicles: number           // Total de vehículos
  availableVehicles: number       // Vehículos disponibles
  inRouteVehicles: number         // Vehículos en ruta
  maintenanceVehicles: number     // Vehículos en mantenimiento
  totalDrivers: number            // Total de conductores
  activeDrivers: number           // Conductores activos
  totalRoutes: number             // Total de rutas
  completedRoutes: number         // Rutas completadas
  pendingAlerts: number           // Alertas pendientes
  totalRevenue: number            // Ingresos totales (simulado)
  revenueChange: number           // Cambio porcentual (simulado)
}
```

**Consultas Supabase:**
- `vehicles` - Cuenta vehículos por estado
- `conductores` - Cuenta conductores por estado
- `rutas_viajes` - Cuenta rutas por estado
- `multas_conductores` - Cuenta multas pendientes

**Cache:** 5 minutos

### useVehicleDistribution()
Obtiene distribución de vehículos por tipo.

**Retorna:**
```typescript
interface VehicleDistribution {
  name: string        // Tipo de vehículo
  value: number       // Cantidad
  percentage: number  // Porcentaje del total
}[]
```

**Consulta Supabase:**
- `vehicles` - Agrupa por campo `type`

**Cache:** 10 minutos

### useMonthlyUsage()
Obtiene uso mensual de vehículos.

**Retorna:**
```typescript
interface MonthlyUsage {
  month: string       // Mes
  enRuta: number      // Cantidad en ruta
  disponibles: number // Cantidad disponible
}[]
```

**Nota:** Actualmente retorna datos simulados. En producción debería consultar una tabla de histórico.

**Cache:** 10 minutos

### useDriversByRegion()
Obtiene conductores agrupados por región/ciudad.

**Retorna:**
```typescript
interface DriverByRegion {
  country: string   // Ciudad
  flag: string      // Emoji
  drivers: number   // Cantidad
  growth: number    // Crecimiento (simulado)
}[]
```

**Consulta Supabase:**
- `conductores` - Agrupa por `ciudad_residencia`

**Cache:** 10 minutos

## Uso

### Importar componentes
```typescript
import {
  DashboardContent,
  DashboardMetrics,
  TotalSalesCard,
  ProductStatistics,
  CustomerHabbitsChart,
  CustomerGrowth
} from '@/features/dashboard'
```

### Importar hooks
```typescript
import {
  useDashboardMetrics,
  useVehicleDistribution,
  useMonthlyUsage,
  useDriversByRegion
} from '@/features/dashboard'
```

### Ejemplo de uso de hooks
```typescript
function MyComponent() {
  const { data: metrics, isLoading } = useDashboardMetrics()
  
  if (isLoading) return <div>Cargando...</div>
  
  return (
    <div>
      <p>Total vehículos: {metrics.totalVehicles}</p>
      <p>Disponibles: {metrics.availableVehicles}</p>
    </div>
  )
}
```

## Rutas

- `/` - DashboardContent (inicio con módulos)
- `/dashboard` - DashboardMetrics (métricas completas)

## Integración con Supabase

Los hooks utilizan `createClient()` de `@/lib/supabase/client` para consultar:

**Tablas consultadas:**
- `vehicles` - Flota de vehículos
- `conductores` - Conductores
- `rutas_viajes` - Rutas y viajes
- `multas_conductores` - Multas

**Estados de vehículos:**
- `Disponible` - Vehículo listo para uso
- `En Uso` - Vehículo en ruta
- `En Mantenimiento` - Vehículo en taller

**Estados de conductores:**
- `Activo` - Conductor disponible
- `Inactivo` - Conductor no disponible

**Estados de rutas:**
- `Completado` - Ruta finalizada
- Otros estados según tabla

## React Query

Todos los hooks utilizan `useQuery` de `@tanstack/react-query`:

**Configuración:**
- `staleTime`: 5-10 minutos según hook
- `queryKey`: Identificador único para cache
- Refetch automático al enfocar ventana
- Cache compartido entre componentes

## Estilos

Usa DealDeck Design System:
- Colores primarios: Blue (#3b82f6)
- Colores secundarios: Purple (#8b5cf6), Green (#10b981), Amber (#f59e0b)
- Componentes de UI: shadcn/ui
- Gráficos: recharts

## Estado de Carga

Todos los componentes incluyen estado de loading:
- Skeleton loaders para cards
- Spinners para gráficos
- Animación de pulse en elementos

## Dark Mode

Todos los componentes soportan dark mode:
- Variables CSS con `dark:` prefix
- Transiciones suaves entre modos
- Colores adaptados para legibilidad

## Mejoras Futuras

### Datos en Tiempo Real
- Implementar subscripciones de Supabase para updates automáticos
- Agregar indicador de última actualización

### Histórico Mensual Real
- Crear tabla `vehicle_usage_history` en Supabase
- Implementar job para guardar snapshots diarios
- Actualizar `useMonthlyUsage()` para consultar histórico real

### Filtros y Personalización
- Agregar filtros de fecha
- Permitir personalizar métricas visibles
- Guardar preferencias en perfil de usuario

### Exportación de Reportes
- Agregar botón de exportar a PDF/Excel
- Generar reportes programados

### Alertas Inteligentes
- Definir umbrales para alertas
- Notificaciones push para eventos críticos
- Dashboard de alertas separado
