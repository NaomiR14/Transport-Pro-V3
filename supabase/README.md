# Supabase Migrations

## Configuración Completada ✅

Tu proyecto está vinculado con Supabase Cloud

## Comandos Principales

### Crear una nueva migration
```bash
supabase migration new nombre_de_la_migration
```
Esto creará un nuevo archivo SQL en `supabase/migrations/` con un timestamp.

### Aplicar migrations a Supabase Cloud
```bash
supabase db push
```
Esto aplicará todas las migrations pendientes a tu base de datos en la nube.

### Ver estado de migrations
```bash
supabase migration list
```

### Trabajar localmente

#### Iniciar Supabase local
```bash
supabase start
```
Esto levantará:
- Studio: http://127.0.0.1:54323
- API: http://127.0.0.1:54321
- Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres

#### Resetear base de datos local
```bash
supabase db reset
```
Esto eliminará todos los datos y reaplicará todas las migrations.

#### Detener Supabase local
```bash
supabase stop
```

### Generar tipos TypeScript
```bash
supabase gen types typescript --linked > src/types/database.types.ts
```

### Sincronizar cambios desde la nube
Si haces cambios directamente en Supabase Studio en la nube:
```bash
supabase db pull
```
Esto generará una nueva migration con los cambios remotos.

## Flujo de Trabajo Recomendado

1. **Crear migration**: `supabase migration new mi_cambio`
2. **Editar el archivo SQL** generado en `supabase/migrations/`
3. **Probar localmente**: `supabase db reset` (para aplicar todos las migrations)
4. **Aplicar a producción**: `supabase db push`
5. **Generar tipos**: `supabase gen types typescript --linked > src/types/database.types.ts`

## Estructura de Archivos

```
supabase/
├── config.toml                          # Configuración de Supabase
├── migrations/                          # Carpeta de migrations
│   ├── 20251215031337_create_profiles_table.sql
│   ├── 20260115034805_create_vehicles_table.sql
│   ├── 20260115041907_create_conductores_table.sql
│   ├── 20260115042224_create_talleres_table.sql
│   ├── 20260115042300_add_unique_constraint_to_talleres_name.sql
│   ├── 20260115042359_create_rutas_viajes_table.sql
│   ├── 20260115042605_create_mantenimientos_vehiculos_table.sql
│   ├── 20260115042731_create_multas_conductores_table.sql
│   ├── 20260115042808_create_seguros_vehiculos_table.sql
│   └── 20260115042907_create_impuestos_vehiculares_table.sql
└── seed.sql                            # (Opcional) Datos de prueba
```

## Tablas Creadas

1. **profiles** - Perfiles de usuarios con roles
2. **vehicles** - Vehículos de la flota
3. **conductores** - Conductores con gestión de licencias
4. **talleres** - Talleres de mantenimiento
5. **rutas_viajes** - Rutas y viajes con cálculos automáticos
6. **mantenimientos_vehiculos** - Registro de mantenimientos
7. **multas_conductores** - Multas de tránsito
8. **seguros_vehiculos** - Seguros y pólizas
9. **impuestos_vehiculares** - Impuestos vehiculares

## Notas Importantes

- ✅ Las migrations son versionadas y se aplican en orden cronológico
- ✅ Nunca edites migrations que ya fueron aplicadas a producción
- ✅ Usa `supabase db pull` si alguien hizo cambios directamente en la nube
- ✅ Siempre prueba localmente antes de hacer push a producción
