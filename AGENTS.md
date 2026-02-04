# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Transport-Pro-V3 is a professional transport management system built with **Next.js 15**, **TypeScript**, **Supabase (PostgreSQL)**, and **Tailwind CSS**. The application uses hexagonal architecture with clear separation between presentation, state management, services, and data layers.

## Essential Commands

### Development
```bash
npm run dev              # Start dev server with Turbopack (http://localhost:3000)
npm run build            # Build for production with Turbopack
npm start                # Start production server
npm run lint             # Run ESLint
```

### Database (Supabase)
```bash
supabase db reset        # Reset local database and apply all migrations
supabase db push         # Push migrations to remote Supabase instance
supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql  # Create database backup
```

**IMPORTANT:** Always create a database backup before applying migrations to production.

### Testing Database Connections
```bash
# Test Supabase connection from Node
node -e "const { createClient } = require('@supabase/supabase-js'); const client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY); client.from('profiles').select('count').then(console.log);"
```

## Architecture

### Layered Architecture Pattern

The codebase follows a strict layered architecture with clear responsibilities:

```
UI Layer (Pages/Components)
    ↓
State Layer (Zustand Stores + React Query Hooks)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (SupabaseRepository)
    ↓
Supabase (Database)
```

### Key Architectural Principles

1. **Repository Pattern**: `src/lib/supabase/repository.ts` provides generic CRUD operations. All database access goes through SupabaseRepository instances.

2. **Service Layer**: Each domain module (vehicles, conductores, talleres, etc.) has a dedicated service in `src/services/api/` that encapsulates business logic and uses repositories.

3. **State Management**: 
   - **Zustand stores** (`src/store/`) for local/synchronous state
   - **React Query hooks** (`src/hooks/`) for server state, caching, and mutations
   
4. **Type Safety**: All entities have TypeScript interfaces in `src/types/`. The `database.types.ts` is auto-generated from Supabase schema.

### Directory Structure

```
src/
├── app/                    # Next.js 15 App Router pages
├── components/
│   ├── auth/              # Authentication components
│   ├── layout/            # Layout components (header, sidebar)
│   ├── ui/                # shadcn/ui components
│   └── Edit*Modal.tsx     # Domain-specific modals
├── hooks/
│   ├── auth/              # useAuth, usePermissions
│   └── use-*.ts           # React Query hooks per domain
├── lib/
│   └── supabase/          # Supabase client, repository, middleware
├── services/
│   ├── api/               # Service classes per domain
│   └── auth-service.ts    # Authentication service
├── store/                 # Zustand stores per domain
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Authentication & Authorization

### Authentication Flow
1. User signs in via `src/app/login/page.tsx`
2. `AuthInitializer` component (`src/components/auth/AuthInitializer.tsx`) initializes auth state on app load
3. User and profile data stored in Zustand store (`src/store/auth-store.ts`)
4. Protected routes wrapped with `ProtectedRoute` component

### Role-Based Access Control (RBAC)

Roles are defined in `src/types/auth.ts`:
- **admin**: Full access to all modules
- **director, gerente**: Full operational access
- **coordinador**: Operations, routes, drivers, vehicles
- **supervisor**: Vehicles, maintenance, workshops, insurance
- **recursos_humanos, administrativo**: Drivers, fines, settlements
- **contador**: Finance, settlements, taxes, insurance
- **comercial, atencion_cliente**: Clients, orders (view-only)
- **conductor**: Limited view access

**Use `usePermissions()` hook** to check access:
```typescript
const { checkPermission, canAccessModule } = usePermissions()

if (!checkPermission('vehiculos', 'edit')) {
  // Disable edit functionality
}
```

## Database & Migrations

### Supabase Configuration
- **URL**: Stored in `NEXT_PUBLIC_SUPABASE_URL`
- **Anonymous Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role Key**: `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

### Migration Workflow

**All migrations are in** `supabase/migrations/`

**Critical migrations to be aware of:**
- `20260123004700_fix_vehicles_data_types.sql` - Changes `year` to INTEGER, `max_load_capacity` to NUMERIC
- `20260123004800_add_conductor_fk_rutas_viajes.sql` - Adds FK from rutas_viajes.conductor → conductores.documento_identidad
- `20260123004900_add_conductor_fk_multas_conductores.sql` - Adds FK from multas_conductores.conductor → conductores.documento_identidad
- `20260123013600_update_fk_constraints_to_cascade.sql` - Updates FK constraints to use CASCADE deletes

**Before applying new migrations:**
1. Review `MIGRACIONES_README.md` for detailed instructions
2. Create database backup
3. Test migrations locally with `supabase db reset`
4. Check for data inconsistencies (see SQL queries in MIGRACIONES_README.md)
5. Apply to production with `supabase db push`

### Row-Level Security (RLS)

**CURRENT STATE:** RLS policies are PERMISSIVE for development (see `SEGURIDAD_RLS.md`)

**⚠️ BEFORE PRODUCTION:** Replace permissive policies with role-based restrictions. The current `simple_select_policy` on profiles table allows ANY authenticated user to read ALL profiles.

## Working with Domain Modules

### Standard Pattern for All Modules

Each domain (vehicles, conductores, talleres, seguros, etc.) follows the same pattern:

1. **Page**: `src/app/{module}/page.tsx` - Main UI
2. **Modal**: `src/components/Edit{Module}Modal.tsx` - Create/Edit modal
3. **Hook**: `src/hooks/use-{module}.ts` - React Query hooks
4. **Store**: `src/store/{module}-store.ts` - Zustand store
5. **Service**: `src/services/api/{module}-service.ts` - Business logic
6. **Types**: `src/types/{module}-types.ts` - TypeScript definitions

### Creating a New Module

Follow this structure:

```typescript
// 1. Define types in src/types/new-module-types.ts
export interface NewModule {
  id: string
  name: string
  // ...
}

// 2. Create service in src/services/api/new-module-service.ts
import { SupabaseRepository } from '@/lib/supabase/repository'

class NewModuleService {
  private repository: SupabaseRepository<NewModule>

  constructor() {
    this.repository = new SupabaseRepository({ tableName: 'new_modules' })
  }

  async getAll() {
    return this.repository.getAll()
  }
  // ... create, update, delete
}

// 3. Create Zustand store in src/store/new-module-store.ts
import { create } from 'zustand'

interface NewModuleStore {
  items: NewModule[]
  selectedItem: NewModule | null
  // ... actions
}

export const useNewModuleStore = create<NewModuleStore>((set) => ({
  items: [],
  selectedItem: null,
  // ... implementation
}))

// 4. Create React Query hooks in src/hooks/use-new-module.ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { newModuleService } from '@/services/api/new-module-service'

export function useNewModules() {
  return useQuery({
    queryKey: ['newModules'],
    queryFn: () => newModuleService.getAll()
  })
}

// 5. Create page in src/app/new-module/page.tsx
// 6. Create modal in src/components/EditNewModuleModal.tsx
```

## UI Components

### shadcn/ui Configuration

- **Style**: new-york
- **Base color**: neutral
- **Icon library**: lucide-react
- **Config file**: `components.json`

**Adding new shadcn components:**
```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
# etc.
```

All UI components are in `src/components/ui/` and use Tailwind CSS with CSS variables.

### Form Validation

Forms use `react-hook-form` + `zod` for validation:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  // ...
})

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})
```

## Important Development Notes

### Environment Variables
- `.env.local` contains Supabase credentials and configuration
- **NEVER commit** `.env.local` to version control
- **Required variables:**
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### Path Aliases
TypeScript path alias `@/*` resolves to `src/*`:
```typescript
import { useAuth } from '@/hooks/auth/useAuth'
import { Button } from '@/components/ui/button'
```

### Turbopack
This project uses Next.js with **Turbopack** (enabled in `package.json` scripts). Do not use webpack-specific configurations.

### React Query Configuration
- Provider configured in `src/providers/query-provider.tsx`
- Devtools enabled in development
- Default stale time: 5 minutes
- Automatic refetch on window focus

### Common Pitfalls

1. **Foreign Key References**: After migrations 20260123004800 and 20260123004900, `conductor` fields in `rutas_viajes` and `multas_conductores` MUST reference `conductores.documento_identidad` (not nombre_conductor).

2. **Type Mismatches**: After migration 20260123004700, `vehicles.year` is INTEGER and `vehicles.max_load_capacity` is NUMERIC. Update form inputs accordingly.

3. **RLS Policies**: Current policies are permissive. DO NOT deploy to production without updating RLS (see SEGURIDAD_RLS.md).

4. **Zustand Persistence**: Auth store is persisted to localStorage. Clear `auth-storage` when testing auth flows.

5. **Service vs Repository**: Business logic goes in Services. Repositories only handle data access. Do not put business logic in repositories.

## Related Documentation

- `README.md` - Basic project information
- `GLOBALREADME.md` - Detailed architecture and file relationships
- `MIGRACIONES_README.md` - Database migration guide
- `SEGURIDAD_RLS.md` - Row-Level Security configuration
- `PERMISOS_IMPLEMENTACION.md` - Permissions system implementation
- `SOLUCION_PROBLEMAS.md` - Common problems and solutions

## Git Branch
Current branch: `Supabase-LogIn`
