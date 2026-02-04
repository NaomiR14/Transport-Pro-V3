# DealDeck Implementation Guide

## ✅ Componentes Creados

### 1. Sistema de Diseño
- **`DEALDECK_DESIGN_SYSTEM.md`**: Guía completa del sistema de diseño con colores, patrones y ejemplos
- **`src/app/globals.css`**: Variables CSS actualizadas con tema DealDeck (blue-centric)

### 2. Componentes Base

#### Layout Components (`src/shared/components/layout/`)
- **`DashboardLayout.tsx`**: Layout principal que combina Sidebar + Header + Content
- **`Sidebar.tsx`**: Navegación lateral con logo, menú, upgrade section y perfil
- **`Header.tsx`**: Barra superior con título, búsqueda, notificaciones y menú de usuario

#### Common Components (`src/shared/components/common/`)
- **`StatsCard.tsx`**: Tarjeta de estadísticas con valor, cambio porcentual e ícono

### 3. Ejemplo de Dashboard
- **`src/app/dashboard-example.tsx`**: Página de ejemplo con layout DealDeck completo

## 🎨 Paleta de Colores

### Azules Principales
```css
--primary: 37 99 235     /* blue-600 - Botones primarios */
--secondary: 219 234 254 /* blue-100 - Fondos suaves */
```

### Acentos
```css
--chart-1: 59 130 246  /* blue-500 - Chart principal */
--chart-2: 139 92 246  /* purple-500 - Chart secundario */
--chart-3: 16 185 129  /* emerald-500 - Success */
--chart-4: 245 158 11  /* amber-500 - Warning */
--chart-5: 239 68 68   /* red-500 - Danger */
```

## 📦 Cómo Usar los Componentes

### Ejemplo 1: Página con DashboardLayout

```tsx
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout'

export default function MyPage() {
  return (
    <DashboardLayout 
      title="Mi Página" 
      subtitle="Descripción de la página"
    >
      {/* Tu contenido aquí */}
    </DashboardLayout>
  )
}
```

### Ejemplo 2: StatsCard

```tsx
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Truck } from 'lucide-react'

<StatsCard
  title="Total Vehículos"
  value="34,760"
  change={{ value: 2.6, label: 'vs mes anterior' }}
  icon={Truck}
  iconBgColor="bg-blue-50 dark:bg-blue-900/20"
  iconColor="text-blue-600 dark:text-blue-400"
/>
```

### Ejemplo 3: Grid de Stats

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <StatsCard title="Métrica 1" value="100" icon={Icon1} />
  <StatsCard title="Métrica 2" value="200" icon={Icon2} />
  <StatsCard title="Métrica 3" value="300" icon={Icon3} />
  <StatsCard title="Métrica 4" value="400" icon={Icon4} />
</div>
```

## 🚀 Próximos Pasos

### Fase 1: Actualizar Páginas Existentes ✅ (Completado)
- [x] Crear componentes base
- [x] Actualizar tema global
- [x] Crear ejemplo de dashboard

### Fase 2: Migrar Vehículos a Arquitectura Screaming
```
src/features/vehiculos/
├── components/
│   ├── VehiculosTable.tsx
│   ├── VehiculoForm.tsx
│   ├── VehiculoStats.tsx
│   └── VehiculoFilters.tsx
├── hooks/
│   └── use-vehiculos.ts
├── services/
│   └── vehiculo-service.ts
├── store/
│   └── vehiculo-store.ts
├── types/
│   └── vehiculo.types.ts
└── index.ts
```

### Fase 3: Actualizar Página de Vehículos
- [ ] Aplicar DashboardLayout
- [ ] Reemplazar cards por StatsCard
- [ ] Aplicar estilos DealDeck a tabla
- [ ] Actualizar formularios con nuevos estilos

### Fase 4: Repetir para Otros Módulos
- [ ] Conductores
- [ ] Rutas
- [ ] Mantenimiento
- [ ] Seguros
- [ ] Multas
- [ ] Impuestos
- [ ] Talleres

## 📝 Convenciones de Estilo

### Colores por Contexto
- **Azul (`blue-*`)**: Navegación, acciones primarias, información
- **Verde (`green-*`)**: Éxito, métricas positivas, disponible
- **Rojo (`red-*`)**: Error, métricas negativas, crítico
- **Naranja (`orange-*`)**: Advertencia, urgente
- **Púrpura (`purple-*`)**: Secundario, especial

### Badges de Estado
```tsx
// Positivo
<span className="bg-green-100 text-green-700">+2.6%</span>

// Negativo
<span className="bg-red-100 text-red-700">-1.2%</span>

// Neutral
<span className="bg-gray-100 text-gray-600">Sin cambios</span>
```

### Íconos
- Usar `lucide-react` para todos los íconos
- Tamaño estándar: `h-5 w-5` (inline), `h-6 w-6` (destacado)
- Siempre acompañar con fondo de color suave en stats cards

### Espaciado
- Gap entre cards: `gap-4` o `gap-6`
- Padding de contenido: `p-6` o `p-8`
- Margin entre secciones: `mb-6` o `mb-8`

## 🔧 Utilidades Útiles

### Imports Comunes
```tsx
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
```

### Clases Tailwind Frecuentes
```tsx
// Card con hover
className="hover:shadow-lg transition-shadow duration-200"

// Texto de título
className="text-2xl font-bold text-gray-900 dark:text-white"

// Texto secundario
className="text-sm text-gray-500 dark:text-gray-400"

// Badge de estado
className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"

// Grid responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
```

## 🎯 Checklist de Migración por Página

Al migrar una página existente:
- [ ] Envolver con `DashboardLayout` con título apropiado
- [ ] Reemplazar stats por `StatsCard` components
- [ ] Aplicar `bg-gray-50 dark:bg-gray-950` al fondo
- [ ] Usar cards con `hover:shadow-lg transition-shadow`
- [ ] Actualizar colores a palette azul
- [ ] Asegurar badges usan fondos de color (no solo borders)
- [ ] Verificar responsive (móvil, tablet, desktop)
- [ ] Probar dark mode
- [ ] Validar accesibilidad (focus states, contrast)

## 📚 Referencias
- **Design System**: `DEALDECK_DESIGN_SYSTEM.md`
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/icons
- **Radix UI**: https://www.radix-ui.com/primitives/docs/overview/introduction
