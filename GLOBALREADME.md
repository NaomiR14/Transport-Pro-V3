# Relacion de Archivos

graph TB
    %% ========== CAPA DE PRESENTACIÓN ==========
    subgraph "Capa de Presentación (UI)"
        A[TalleresPage.tsx] --> B[EditTallerModal.tsx]
        A --> C[Componentes UI]
    end

    C --> D[Button, Input, Table, etc.]
    
    %% ========== CAPA DE ESTADO ==========
    subgraph "Capa de Estado (State Management)"
        E[useTallerStore<br/>Zustand Store]
        F[useTalleres Hooks<br/>React Query]
    end
    
    A --> E
    A --> F
    B --> E
    B --> F
    
    %% ========== CAPA DE SERVICIOS ==========
    subgraph "Capa de Servicios (Business Logic)"
        G[TalleresService.ts<br/>Clase de Servicio]
        H[ApiClient.ts<br/>Cliente HTTP]
    end
    
    F --> G
    G --> H
    
    %% ========== CAPA DE TIPOS ==========
    subgraph "Capa de Tipos (Type Definitions)"
        I[taller.ts<br/>Interfaces]
        J[api-base-client-types.ts<br/>Tipos API]
    end
    
    A --> I
    B --> I
    E --> I
    F --> I
    G --> I
    H --> J
    
    %% ========== ESTILOS ==========
    subgraph "Estilos"
        K[UI Components<br/>shadcn/ui]
    end
    
    A --> K
    B --> K

    %% Estilos
    classDef presentation fill:#e1f5fe
    classDef state fill:#f3e5f5
    classDef service fill:#e8f5e8
    classDef types fill:#fff3e0
    classDef styles fill:#fce4ec
    
    class A,B,C presentation
    class D,E,F state
    class G,H service
    class I,J types
    class K styles

## **📋 Relaciones entre Archivos:**

### **1. Página Principal (`TalleresPage.tsx`)**

**Depende de:**

- `useTalleres.ts` → Para obtener datos y ejecutar mutations
- `useTallerStore.ts` → Para gestionar estado local y filtros
- `EditTallerModal.tsx` → Para funciones de edición y creación
- `taller.ts` → Para definiciones de tipos TypeScript

### **2. Modal de Edición (`EditTallerModal.tsx`)**

**Depende de:**

- `useTalleres.ts` → Para mutations (crear/actualizar)
- `useTallerStore.ts` → Para sincronizar cambios de estado
- `taller.ts` → Para tipos y esquemas de validación

### **3. Hooks (`useTalleres.ts`)**

**Depende de:**

- `TalleresService.ts` → Para comunicación con la API de supabase
- `useTallerStore.ts` → Para mantener el estado sincronizado
- `taller.ts` → Para definiciones de tipos

### **4. Servicio (`TalleresService.ts`)**

**Depende de:**

- `ApiClient.ts` → Para realizar peticiones HTTP a supabase
- `taller.ts` → Para interfaces de datos

### **5. Store (`useTallerStore.ts`)**

**Depende de:**

- `taller.ts` → Para definir tipos del estado

## **🎯 Flujos de Operación:**

### **🔍 Cargar Talleres:**

```
TalleresPage → useTalleres → TalleresService → ApiClient → API
```

### **✏️ Editar Taller:**

```
EditTallerModal → useUpdateTaller → TalleresService → ApiClient → API
                      ↓
                useTallerStore (actualiza estado)
```

### **➕ Crear Taller:**

```
EditTallerModal → useCreateTaller → TalleresService → ApiClient → API
                      ↓
                useTallerStore (añade al estado)
```

### **⚡ Toggle Estado:**

```
TalleresPage → useToggleTallerStatus → TalleresService → ApiClient → API
                         ↓
                   useTallerStore (actualiza estado)
```

```tsx
TalleresPage.tsx (UI)
    ↓ (usa hooks)
useTalleres.ts (React Query Hooks)
    ↓ (usa servicio)
TalleresService.ts (Lógica de Negocio)
    ↓ (usa cliente HTTP)
ApiClient.ts (Cliente HTTP Base)
    ↓ (hace fetch)
API Backend (JSON/HTTP)
```

## **📊 Responsabilidades por Capa:**

| **Capa** | **Archivos** | **Responsabilidad** |
| --- | --- | --- |
| **UI** | `TalleresPage.tsx`, `EditTallerModal.tsx` | Renderizar interfaz, manejar eventos |
| **Estado** | `useTalleres.ts`, `useTallerStore.ts` | Gestionar estado, caching, sincronización |
| **Servicios** | `TalleresService.ts` | Lógica de negocio, transformación de datos |
| **HTTP** | `ApiClient.ts` | Comunicación HTTP, manejo de errores |
| **Tipos** | `taller.ts`, `api-base-client-types.ts` | Definiciones TypeScript, contratos |

## **🔧 Patrones Implementados:**

1. **Separación de Concerns** → Cada capa tiene responsabilidad única
2. **Repository Pattern** → `TalleresService` abstrae la fuente de datos
3. **Observer Pattern** → React Query observa cambios y actualiza UI
4. **Container/Presenter** → Hooks separan lógica de presentación
5. **Singleton** → `ApiClient` es instancia única reutilizable