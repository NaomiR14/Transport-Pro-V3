# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Next.js dev server with Turbopack (http://localhost:3000)
npm run build        # Production build with Turbopack
npm run start        # Start production server
npm run lint         # ESLint check
npm run test         # Vitest in watch mode
npm run test:run     # Vitest single run (CI)
npm run test:ui      # Vitest with browser UI
```

Test files must match `src/**/*.test.ts` or `src/**/*.test.tsx`.

## Architecture

### Feature modules (`src/features/`)

Each feature is fully self-contained following this structure:

```
src/features/[feature]/
├── types/         # TypeScript interfaces & Zod schemas
├── components/    # React components (table, form modal, filters, stats)
├── hooks/         # React Query hooks (useFeature, useCreateX, useUpdateX, useDeleteX)
├── services/      # Business logic + Supabase calls
├── store/         # Zustand store for local UI state (filters, selections)
└── index.ts       # Barrel export — only import features through this
```

Features: `auth`, `vehiculos`, `conductores`, `ordenes`, `rutas`, `multas`, `seguros`, `talleres`, `mantenimiento`, `impuestos`, `flujo-caja`, `dashboard`, `reporte-general`, `reporte-conductores`, `shared`.

### Data layer

All database access goes through `SupabaseRepository<T>` (`src/lib/supabase/repository.ts`), which wraps the Supabase browser client. Services instantiate it with `{ tableName: 'table_name' }` and call `.getAll()`, `.getById()`, `.create()`, `.update()`, `.delete()`, `.search()`.

Services that write data must inject `empresa_id` (multi-tenancy) by calling `getEmpresaId()` from `src/lib/supabase/get-empresa-id.ts` before inserting.

Some read queries use Supabase Views (`*_calculated_view`) or RPCs (`reporte_general_rpc`, `reporte_conductores_rpc`) defined in `supabase/migrations/`.

### Auth & permissions

- `AuthInitializer` (mounted in `src/app/layout.tsx`) bootstraps the Zustand auth store on app load.
- `useAuthStore` (`src/features/auth/store/auth-store.ts`) persists `user` + `profile` to `localStorage` under key `auth-storage`.
- Server-side: `src/lib/supabase/middleware.ts` protects all routes except `/login`, `/auth/*`, and `/registro-empresa`.
- Client-side: `ProtectedLayout` (`src/components/layout/ProtectedLayout.tsx`) handles redirects and renders the shell (header + sidebar) for authenticated users.
- Permissions are role-based via `usePermissions()` (`src/features/auth/hooks/usePermissions.ts`). Roles: `admin`, `director`, `gerente`, `coordinador`, `supervisor`, `recursos_humanos`, `administrativo`, `contador`, `comercial`, `atencion_cliente`, `conductor`. Use `checkPermission(module, action)` or wrap UI sections in `<RequirePermission module="..." action="...">`.

### State management layers

1. **Server state** — React Query hooks in each feature's `hooks/` folder; invalidate queries after mutations.
2. **Global auth** — Zustand store in `auth-store.ts`.
3. **Feature UI state** — Zustand store in each feature's `store/` folder (filters, selected rows, modal open state).
4. **Form state** — React Hook Form + Zod schemas defined in `types/`.

### API client

`apiClient` (singleton exported from `src/lib/api-base-client.ts`) targets `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:5000/api`). It has built-in retry (3×, exponential backoff), 30 s timeout, and does not retry 4xx errors (except 408/429). Most data access uses Supabase directly instead; this client is for the C# backend endpoints proxied by `next.config.ts`.

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_API_URL` | C# backend base URL |

### Database migrations

Migrations live in `supabase/migrations/` with timestamp-prefixed filenames. Apply locally with `supabase db push` or `supabase migration up`. Types in `src/types/database.types.ts` are generated from the schema — regenerate with `supabase gen types typescript --local > src/types/database.types.ts` after schema changes.

### Path aliases

`@/*` maps to `src/*` (configured in `tsconfig.json` and `vitest.config.ts`).
