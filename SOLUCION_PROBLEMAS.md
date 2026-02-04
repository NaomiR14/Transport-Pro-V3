# SOLUCIÓN A PROBLEMAS REPORTADOS

## Fecha: 2026-01-23

---

## 🔴 PROBLEMA 1: Error al eliminar vehículos

### Error:
```
Error al eliminar registro de vehicles: update or delete on table "vehicles" 
violates foreign key constraint "fk_vehicle" on table "rutas_viajes"
```

### Causa:
Las Foreign Keys están configuradas con `ON DELETE RESTRICT`, lo que impide eliminar registros que tienen relaciones.

### Solución:
✅ **Creada migración:** `20260123013600_update_fk_constraints_to_cascade.sql`

Esta migración cambia todas las FKs de `ON DELETE RESTRICT` a `ON DELETE CASCADE`, permitiendo:
- Eliminar vehículos (eliminará automáticamente rutas, multas, seguros, impuestos, mantenimientos relacionados)
- Eliminar conductores (eliminará automáticamente rutas y multas relacionadas)
- Eliminar talleres (eliminará automáticamente mantenimientos relacionados)

**Aplicar migración:**
```bash
supabase db push
```

**Tablas afectadas:**
- `rutas_viajes` (FKs: vehículo, conductor)
- `multas_conductores` (FKs: vehículo, conductor)
- `mantenimientos_vehiculos` (FKs: vehículo, taller)
- `seguros_vehiculos` (FK: vehículo)
- `impuestos_vehiculares` (FK: vehículo)

---

## 🔴 PROBLEMA 2: Dropdowns vacíos en formulario de vehículos

### Síntoma:
Los dropdowns de Tipo, Marca y Modelo aparecen vacíos al crear/editar vehículos.

### Posibles causas:

#### Causa 1: RLS (Row Level Security) bloqueando acceso
**Verificar:**
```sql
-- En Supabase SQL Editor
SELECT * FROM vehicle_types;
SELECT * FROM vehicle_brands;
SELECT * FROM vehicle_models;
```

Si no devuelven datos, el problema es RLS.

**Solución temporal (para desarrollo):**
```sql
-- Desactivar RLS temporalmente para ver si ese es el problema
ALTER TABLE vehicle_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_models DISABLE ROW LEVEL SECURITY;
```

Si esto funciona, entonces el problema es que las políticas RLS requieren autenticación.

#### Causa 2: Las tablas están vacías
**Verificar:**
```sql
SELECT COUNT(*) FROM vehicle_types;  -- Debe ser 3
SELECT COUNT(*) FROM vehicle_brands; -- Debe ser 9
SELECT COUNT(*) FROM vehicle_models; -- Debe ser 31
```

Si devuelven 0, las migraciones no se aplicaron correctamente.

**Solución:**
```bash
# Aplicar todas las migraciones
supabase db push
```

#### Causa 3: Error en el servicio CommonInfoService
**Verificar en consola del navegador:**
- Abrir DevTools (F12)
- Ir a Console
- Crear/editar un vehículo
- Buscar logs: `[EditVehicleModal] CommonInfo cargado:`

**Si ves el log con arrays vacíos:**
```javascript
[EditVehicleModal] CommonInfo cargado: {
  types: 0,
  brands: 0,
  models: 0
}
```

El problema está en el backend/servicio.

**Si ves error en consola:**
El problema está en la comunicación con Supabase.

---

## 🛠️ SOLUCIÓN IMPLEMENTADA

### Cambios en EditVehicleModal.tsx:
✅ Mejorado manejo de errores
✅ Agregado logging detallado
✅ Protección contra datos nulos/undefined

**Ahora el modal:**
1. Intenta cargar datos de common_info
2. Si falla, muestra error en consola con detalles
3. Establece arrays vacíos para evitar crash
4. Muestra datos detallados en consola para debugging

---

## 🔍 PASOS PARA DIAGNOSTICAR

### 1. Aplicar la migración CASCADE
```bash
cd /Users/Naomi/Documents/Transport-Pro-V3
supabase db push
```

### 2. Verificar datos en Supabase
1. Ir a https://supabase.com/dashboard
2. Seleccionar tu proyecto
3. Ir a "Table Editor"
4. Verificar estas tablas tengan datos:
   - `vehicle_types` (3 registros)
   - `vehicle_brands` (9 registros)
   - `vehicle_models` (31 registros)
   - `fuel_types` (5 registros)
   - `fuel_stations` (8 registros)

### 3. Verificar RLS Policies
1. En Supabase Dashboard → Authentication → Policies
2. Verificar que exista política "Public can view" para:
   - `vehicle_types`
   - `vehicle_brands`
   - `vehicle_models`

### 4. Probar en navegador
1. Abrir aplicación: `npm run dev`
2. Abrir DevTools (F12) → Console
3. Ir a Vehículos → Crear nuevo
4. Revisar console logs:
   ```
   [EditVehicleModal] Cargando CommonInfo...
   [EditVehicleModal] CommonInfo cargado: { types: 3, brands: 9, models: 31, ... }
   ```

---

## 🎯 SOLUCIONES RÁPIDAS

### Si dropdowns siguen vacíos después de migración:

**Opción A: Reinsert datos manualmente**
```sql
-- En Supabase SQL Editor
TRUNCATE vehicle_types, vehicle_brands, vehicle_models RESTART IDENTITY CASCADE;

-- Copiar el contenido de INSERT desde:
-- supabase/migrations/20260121014309_create_common_info_tables.sql
-- Líneas 125-128 (vehicle_types)
-- Líneas 79-88 (vehicle_brands)
-- Líneas 91-122 (vehicle_models)
```

**Opción B: Verificar conexión de Supabase**
```typescript
// Agregar en EditVehicleModal antes de cargar datos
const testConnection = async () => {
    const { data, error } = await supabase
        .from('vehicle_types')
        .select('*')
    console.log('Test connection:', { data, error })
}
testConnection()
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de aplicar las soluciones, verifica:

- [ ] Migración CASCADE aplicada exitosamente
- [ ] Tablas common_info tienen datos (SQL queries)
- [ ] Políticas RLS configuradas correctamente
- [ ] Console logs muestran datos cargados
- [ ] Dropdowns muestran opciones
- [ ] Se puede crear vehículo con todos los campos
- [ ] Se puede editar vehículo existente
- [ ] Se puede eliminar vehículo (ahora funciona con CASCADE)

---

## 📞 SI LOS PROBLEMAS PERSISTEN

1. **Captura el error exacto de consola**
   - Screenshot o copy/paste del error completo

2. **Verifica el estado de las tablas**
   ```sql
   SELECT 
       schemaname,
       tablename,
       rowsecurity
   FROM pg_tables 
   WHERE tablename LIKE 'vehicle%' OR tablename LIKE 'fuel%';
   ```

3. **Verifica las políticas RLS**
   ```sql
   SELECT 
       schemaname,
       tablename,
       policyname,
       permissive,
       cmd
   FROM pg_policies
   WHERE tablename LIKE 'vehicle%';
   ```

4. **Revisa logs de Supabase**
   - Dashboard → Logs → selecciona timerange
   - Busca errores relacionados con las tablas

---

## 🚀 SIGUIENTE PASO RECOMENDADO

1. Aplica la migración CASCADE:
   ```bash
   supabase db push
   ```

2. Abre la aplicación y crea un vehículo

3. Si los dropdowns siguen vacíos, revisa Console (F12) y comparte el error exacto

4. Si funciona, intenta eliminar un vehículo para confirmar que CASCADE funciona
