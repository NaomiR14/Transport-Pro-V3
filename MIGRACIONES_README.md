# MIGRACIONES PARA ALINEAR SUPABASE CON EXCEL

## 📋 Resumen

Se han creado 4 migraciones para corregir las diferencias entre el Excel y Supabase:

### 🔴 Críticas (DEBEN aplicarse)

1. **`20260123004700_fix_vehicles_data_types.sql`**
   - Corrige tipos de datos en `vehicles`
   - Cambia `year` de TEXT a INTEGER
   - Cambia `max_load_capacity` de TEXT a NUMERIC(10,2)
   - Agrega validaciones (CHECK constraints)

2. **`20260123004800_add_conductor_fk_rutas_viajes.sql`**
   - Agrega Foreign Key de conductor en `rutas_viajes`
   - Cambia `conductor` de TEXT a FK → `conductores.documento_identidad`
   - Mantiene integridad referencial

3. **`20260123004900_add_conductor_fk_multas_conductores.sql`**
   - Agrega Foreign Key de conductor en `multas_conductores`
   - Cambia `conductor` de TEXT a FK → `conductores.documento_identidad`
   - Mantiene integridad referencial

### 🟡 Opcional

4. **`20260123005000_add_estado_vehiculo_rutas_viajes.sql`**
   - Agrega campo `estado_vehiculo` en `rutas_viajes`
   - Este campo existe en Excel pero no en Supabase
   - Solo aplicar si se necesita en la aplicación

---

## ⚠️ IMPORTANTE: Antes de Aplicar

### 1. Backup de la Base de Datos
```bash
# Desde Supabase Dashboard o CLI
supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Revisar Datos Existentes

**Para vehicles:**
```sql
-- Verificar que year tiene solo números
SELECT id, license_plate, year 
FROM vehicles 
WHERE year !~ '^[0-9]+$';

-- Verificar que max_load_capacity es numérico
SELECT id, license_plate, max_load_capacity 
FROM vehicles 
WHERE max_load_capacity !~ '^[0-9]+\.?[0-9]*$';
```

**Para rutas_viajes:**
```sql
-- Verificar que todos los conductores existen
SELECT DISTINCT rv.conductor
FROM rutas_viajes rv
WHERE rv.conductor NOT IN (
    SELECT documento_identidad FROM conductores
    UNION
    SELECT nombre_conductor FROM conductores
);
```

**Para multas_conductores:**
```sql
-- Verificar que todos los conductores existen
SELECT DISTINCT mc.conductor
FROM multas_conductores mc
WHERE mc.conductor NOT IN (
    SELECT documento_identidad FROM conductores
    UNION
    SELECT nombre_conductor FROM conductores
);
```

### 3. Limpiar Datos Inconsistentes (si es necesario)

Si encuentras datos que no se pueden migrar:

```sql
-- Ejemplo: Actualizar conductores que no coinciden
UPDATE rutas_viajes 
SET conductor = 'DOCUMENTO_VALIDO'
WHERE conductor = 'NOMBRE_INCORRECTO';

-- O eliminar registros huérfanos
DELETE FROM rutas_viajes 
WHERE conductor NOT IN (SELECT documento_identidad FROM conductores);
```

---

## 🚀 Cómo Aplicar las Migraciones

### Opción 1: Supabase CLI (Recomendado)

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd /Users/Naomi/Documents/Transport-Pro-V3

# 2. Aplicar migraciones localmente primero (para probar)
supabase db reset

# 3. Si todo funciona, aplicar a producción
supabase db push
```

### Opción 2: Supabase Dashboard

1. Ir a tu proyecto en https://supabase.com/dashboard
2. Navegar a **SQL Editor**
3. Copiar y pegar el contenido de cada migración **en orden**
4. Ejecutar una por una

### Opción 3: Aplicar manualmente

```bash
# Conectar a tu base de datos
psql "postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres"

# Ejecutar cada migración
\i supabase/migrations/20260123004700_fix_vehicles_data_types.sql
\i supabase/migrations/20260123004800_add_conductor_fk_rutas_viajes.sql
\i supabase/migrations/20260123004900_add_conductor_fk_multas_conductores.sql
# \i supabase/migrations/20260123005000_add_estado_vehiculo_rutas_viajes.sql  # Opcional
```

---

## 🔍 Verificación Post-Migración

Después de aplicar las migraciones, verifica que todo funcionó correctamente:

```sql
-- 1. Verificar tipos de datos en vehicles
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'vehicles' 
AND column_name IN ('year', 'max_load_capacity');
-- Resultado esperado: year = integer, max_load_capacity = numeric

-- 2. Verificar FK en rutas_viajes
SELECT 
    constraint_name,
    table_name,
    column_name,
    foreign_table_name,
    foreign_column_name
FROM information_schema.key_column_usage
WHERE table_name = 'rutas_viajes' 
AND column_name = 'conductor';
-- Debe mostrar FK a conductores.documento_identidad

-- 3. Verificar FK en multas_conductores
SELECT 
    constraint_name,
    table_name,
    column_name,
    foreign_table_name,
    foreign_column_name
FROM information_schema.key_column_usage
WHERE table_name = 'multas_conductores' 
AND column_name = 'conductor';
-- Debe mostrar FK a conductores.documento_identidad

-- 4. Verificar que las relaciones funcionan
SELECT COUNT(*) as total_rutas FROM rutas_viajes;
SELECT COUNT(*) as total_multas FROM multas_conductores;
-- No debe haber errores
```

---

## 🐛 Problemas Comunes

### Error: "violates foreign key constraint"

**Causa:** Hay datos en rutas_viajes o multas_conductores que no coinciden con conductores existentes.

**Solución:**
```sql
-- Ver registros problemáticos
SELECT * FROM rutas_viajes 
WHERE conductor NOT IN (SELECT documento_identidad FROM conductores);

-- Corregir o eliminar antes de aplicar la migración
```

### Error: "invalid input syntax for type integer"

**Causa:** El campo `year` tiene valores no numéricos.

**Solución:**
```sql
-- Ver registros problemáticos
SELECT * FROM vehicles WHERE year !~ '^[0-9]+$';

-- Corregir manualmente
UPDATE vehicles SET year = '2020' WHERE id = 'problematic-uuid';
```

---

## 📝 Revertir Migraciones (Rollback)

Si necesitas revertir las migraciones:

### Revertir 20260123005000 (opcional)
```sql
ALTER TABLE rutas_viajes DROP COLUMN IF EXISTS estado_vehiculo;
DROP FUNCTION IF EXISTS sync_estado_vehiculo_rutas() CASCADE;
```

### Revertir 20260123004900 (multas FK)
```sql
ALTER TABLE multas_conductores DROP CONSTRAINT IF EXISTS fk_conductor_multas;
ALTER TABLE multas_conductores 
    ALTER COLUMN conductor TYPE TEXT USING conductor::TEXT;
```

### Revertir 20260123004800 (rutas FK)
```sql
ALTER TABLE rutas_viajes DROP CONSTRAINT IF EXISTS fk_conductor_rutas;
ALTER TABLE rutas_viajes 
    ALTER COLUMN conductor TYPE TEXT USING conductor::TEXT;
```

### Revertir 20260123004700 (vehicles tipos)
```sql
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS check_year_range;
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS check_max_load_positive;
ALTER TABLE vehicles 
    ALTER COLUMN year TYPE TEXT USING year::TEXT,
    ALTER COLUMN max_load_capacity TYPE TEXT USING max_load_capacity::TEXT;
```

---

## ✅ Checklist de Aplicación

- [ ] Backup de la base de datos creado
- [ ] Datos existentes revisados y limpiados
- [ ] Migración 1 aplicada (fix_vehicles_data_types)
- [ ] Migración 2 aplicada (add_conductor_fk_rutas_viajes)
- [ ] Migración 3 aplicada (add_conductor_fk_multas_conductores)
- [ ] Migración 4 aplicada (OPCIONAL - add_estado_vehiculo_rutas_viajes)
- [ ] Verificaciones post-migración ejecutadas
- [ ] Pruebas en la aplicación realizadas
- [ ] Actualizar código de la aplicación si es necesario

---

## 📞 Soporte

Si encuentras problemas durante la migración:

1. Revisa los logs de error en Supabase Dashboard
2. Verifica que los datos sean consistentes
3. Consulta la documentación de PostgreSQL sobre constraints y FKs

---

## 🎯 Próximos Pasos

Una vez aplicadas las migraciones:

1. **Actualizar código de la aplicación:**
   - Las referencias a `conductor` ahora deben usar `documento_identidad`
   - Los tipos de `year` y `max_load_capacity` cambiarán en los tipos TypeScript

2. **Actualizar validaciones del frontend:**
   - Asegurarse de que los formularios envíen números para year
   - Validar que max_load_capacity sea numérico

3. **Actualizar tests:**
   - Adaptar tests a las nuevas FKs y tipos de datos

---

## 📊 Impacto en el Código

### TypeScript Types (ejemplo)

```typescript
// Antes
interface Vehicle {
  year: string;
  max_load_capacity: string;
}

// Después
interface Vehicle {
  year: number;
  max_load_capacity: number;
}

// Antes
interface RutaViaje {
  conductor: string; // nombre o documento
}

// Después
interface RutaViaje {
  conductor: string; // solo documento_identidad (FK)
}
```

### Consultas SQL

```typescript
// Antes - conductor podía ser nombre
const { data } = await supabase
  .from('rutas_viajes')
  .select('*')
  .eq('conductor', 'Juan Pérez');

// Después - conductor debe ser documento_identidad
const { data } = await supabase
  .from('rutas_viajes')
  .select('*, conductores!fk_conductor_rutas(*)')
  .eq('conductor', '12345678');
```
