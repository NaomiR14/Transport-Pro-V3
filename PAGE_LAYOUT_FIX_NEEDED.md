# 🔧 Páginas que Necesitan Corrección - Layout Issues

## ❌ Problema Identificado

Las páginas de conductores, seguros, talleres, rutas, multas, impuestos y mantenimiento tienen **dos problemas principales**:

### 1. Headers Duplicados
- Estas páginas tienen su propio `<header>` completo
- El `ProtectedLayout` ya proporciona `MainHeader` y `SidebarNav`
- Esto causa que el contenido esté fuera del viewport (se ve en blanco)

### 2. Imports Antiguos  
- Están importando desde las rutas anteriores (`@/hooks/use-*`, `@/store/*`, `@/types/*`)
- Esos archivos fueron eliminados durante el refactor a screaming architecture
- Necesitan importar desde `@/features/*`

---

## ✅ Solución - Patrón Correcto

### Página que Funciona: `src/app/vehiculos/page.tsx`

```tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
// ... otros imports de UI

// ✅ Import correcto desde features
import {
    useDeleteVehicle,
    useFilteredVehicles,
    useVehiclesStats,
    useVehicleFilterOptions,
    useVehicleStore,
    Vehicle
} from "@/features/vehiculos"

export default function VehiculosPage() {
    // ... state y hooks

    // ✅ Error handling simple
    if (error) {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Gestión de Vehículos
                    </h1>
                </div>
                <Card>
                    {/* Error content */}
                </Card>
            </div>
        )
    }

    // ✅ Layout limpio sin headers adicionales
    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Gestión de Vehículos
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Administra la flota de vehículos
                </p>
            </div>

            {/* Stats Cards */}
            <div className="mb-6">
                {/* ... */}
            </div>

            {/* Main Card con tabla */}
            <Card>
                {/* ... */}
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <EditModal {...props} />
            )}
        </div>
    )
}
```

---

## 📋 Páginas que Necesitan Corrección

### 1. `src/app/conductores/page.tsx`

**Cambios Necesarios:**

**Imports:**
```tsx
// ❌ Antiguo
import { useDeleteConductor, useFilteredConductores, useConductoresStats, useConductorFilterOptions } from "@/hooks/use-conductores"
import { useConductorStore } from "@/store/conductor-store"
import { Conductor } from "@/types/conductor-types"
import EditConductorModal from "@/components/EditConductorModal"

// ✅ Nuevo
import {
  useDeleteConductor,
  useFilteredConductores,
  useConductoresStats,
  useConductorFilterOptions,
  useConductorStore,
  ConductorFormModal as EditConductorModal,
  type Conductor
} from "@/features/conductores"
```

**Layout:**
```tsx
// ❌ Remover
<div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
        {/* Header completo */}
    </header>
    <main>
        {/* Contenido */}
    </main>
</div>

// ✅ Reemplazar con
<div className="p-6">
    <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestión de Conductores
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
                Administra la información de los conductores
            </p>
        </div>
        <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Conductor
        </Button>
    </div>
    {/* Rest of content */}
</div>
```

---

### 2. `src/app/seguros/page.tsx`

**Imports:**
```tsx
// ❌ Antiguo
import EditSeguroModal from "@/components/EditSeguroModal"
import { useDeleteSeguro, useFilteredSeguros, useSegurosStats, useSeguroFilterOptions } from "@/hooks/use-seguros"
import { useSeguroStore } from "@/store/seguros-store"
import { Seguro } from "@/types/seguros-types"

// ✅ Nuevo
import {
  useDeleteSeguro,
  useFilteredSeguros,
  useSegurosStats,
  useSeguroFilterOptions,
  useSeguroStore,
  SeguroFormModal as EditSeguroModal,
  type Seguro
} from "@/features/seguros"
```

---

### 3. `src/app/talleres/page.tsx`

**Imports:**
```tsx
// ❌ Antiguo
import EditTallerModal from "@/components/EditTallerModal"
import { useDeleteTaller, useFilteredTalleres, useTalleresStats } from "@/hooks/use-talleres"
import { useTalleresStore } from "@/store/talleres-store"
import { Taller } from "@/types/taller-types"

// ✅ Nuevo
import {
  useDeleteTaller,
  useFilteredTalleres,
  useTalleresStats,
  useTalleresStore,
  TallerFormModal as EditTallerModal,
  type Taller
} from "@/features/talleres"
```

---

### 4. `src/app/rutas/page.tsx`

**Imports:**
```tsx
// ❌ Antiguo
import EditRutaViajeModal from "@/components/EditRutaViajeModal"
import { useDeleteRutaViaje, useFilteredRutasViaje, useRutasViajeStats } from "@/hooks/use-rutas-viaje"
import { useRutasViajeStore } from "@/store/ruta-viaje-store"
import { RutaViaje } from "@/types/ruta-viaje-types"

// ✅ Nuevo
import {
  useDeleteRutaViaje,
  useFilteredRutasViaje,
  useRutasViajeStats,
  useRutasViajeStore,
  RutaViajeFormModal as EditRutaViajeModal,
  type RutaViaje
} from "@/features/rutas"
```

---

### 5. `src/app/multas/page.tsx`

**Imports:**
```tsx
// ❌ Antiguo
import EditMultasConductoresModal from "@/components/EditMultasConductoresModal"
import { useDeleteMultaConductor, useFilteredMultas, useMultasStats } from "@/hooks/use-multas-conductores"
import { useMultasStore } from "@/store/multas-conductores-store"
import { MultaConductor } from "@/types/multas-conductores-types"

// ✅ Nuevo
import {
  useDeleteMultaConductor,
  useFilteredMultas,
  useMultasStats,
  useMultasStore,
  MultaFormModal as EditMultasConductoresModal,
  type MultaConductor
} from "@/features/multas"
```

---

### 6. `src/app/impuestos-vehiculares/page.tsx`

**Imports:**
```tsx
// ❌ Antiguo
import EditImpuestoModal from "@/components/EditImpuestoModal"
import { useDeleteImpuesto, useFilteredImpuestos, useImpuestosStats } from "@/hooks/use-impuestos-vehiculares"
import { useImpuestosStore } from "@/store/impuesto-vehicular-store"
import { ImpuestoVehicular } from "@/types/impuesto-vehicular-types"

// ✅ Nuevo
import {
  useDeleteImpuesto,
  useFilteredImpuestos,
  useImpuestosStats,
  useImpuestosStore,
  ImpuestoFormModal as EditImpuestoModal,
  type ImpuestoVehicular
} from "@/features/impuestos"
```

---

### 7. `src/app/mantenimiento-vehiculos/page.tsx`

**Imports:**
```tsx
// ❌ Antiguo
import EditMantenimientoVehiculoModal from "@/components/EditMantenimientoVehiculoModal"
import { useFilteredMantenimientos, useCreateMantenimiento, useUpdateMantenimiento } from "@/hooks/use-mantenimiento-vehiculos"
import { useMantenimientoVehiculoStore } from "@/store/mantenimiento-vehiculos-store"
import { MantenimientoVehiculo, CreateMantenimientoVehiculoRequest } from "@/types/mantenimiento-vehiculos-types"

// ✅ Nuevo
import {
  useFilteredMantenimientos,
  useCreateMantenimiento,
  useUpdateMantenimiento,
  useMantenimientoVehiculoStore,
  MantenimientoFormModal as EditMantenimientoVehiculoModal,
  type MantenimientoVehiculo,
  type CreateMantenimientoVehiculoRequest
} from "@/features/mantenimiento"
```

---

## 🛠️ Pasos para Corregir Cada Página

1. **Actualizar imports**
   - Cambiar de `@/hooks/*`, `@/store/*`, `@/types/*`, `@/components/*`
   - A `@/features/{feature-name}`

2. **Remover header duplicado**
   - Eliminar todo el `<header>` tag
   - Eliminar `<main>` wrapper
   - Eliminar `<div className="min-h-screen bg-gray-50">`

3. **Usar layout simple**
   - Solo `<div className="p-6">`
   - Agregar encabezado simple con título y botón de acción
   - Mantener el resto del contenido (stats, tabla, modal)

4. **Agregar dark mode classes**
   - `dark:text-white` a títulos
   - `dark:text-gray-400` a descripciones
   - `dark:bg-gray-800` a cards si es necesario

5. **Verificar cierre de tags**
   - Asegurarse de que todos los `div`, `Card`, etc. se cierren correctamente
   - El modal debe estar dentro del div principal pero fuera del Card

---

## 🎯 Resultado Esperado

Después de aplicar los cambios:

✅ Las páginas se ven correctamente (no en blanco)  
✅ El header del ProtectedLayout es visible  
✅ El sidebar funciona correctamente  
✅ Los botones CRUD funcionan  
✅ Los modals se abren y cierran  
✅ Dark mode funciona  
✅ El proyecto compila sin errores  

---

## 🚀 Comando para Verificar

```bash
npm run build
```

Si todas las páginas están corregidas, deberías ver:
```
✓ Compiled successfully
✓ Generating static pages (18/18)
```

---

*Última actualización: Febrero 2026*
