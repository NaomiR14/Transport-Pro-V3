# 🐛 DEBUG: Problema al Crear Vehículos

## Fecha: 2026-01-23

---

## 🔴 PROBLEMA

Al intentar crear un nuevo vehículo, el formulario se queda "atorado" mostrando "Guardando..." indefinidamente.

### Logs observados:
```
[EditVehicleModal] Submit iniciado, formData: {...}
[EditVehicleModal] Validación exitosa, preparando datos...
[EditVehicleModal] Datos preparados: {...}
[EditVehicleModal] Creando nuevo vehículo...
[EditVehicleModal] Submit iniciado, formData: {...}  // ⚠️ DUPLICADO
[EditVehicleModal] Validación exitosa, preparando datos...
[EditVehicleModal] Datos preparados: {...}
[EditVehicleModal] Creando nuevo vehículo...
```

**Síntomas:**
1. El formulario se envía DOS veces (logs duplicados)
2. Nunca recibe respuesta (ni error ni success)
3. El botón queda en estado "Guardando..." permanentemente

---

## 🛠️ SOLUCIONES IMPLEMENTADAS

### 1. Prevención de Doble Submit

**Archivo:** `src/components/EditVehicleModal.tsx`

**Cambio:**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ✅ NUEVO: Prevenir doble submit
    if (createVehicleMutation.isPending || updateVehicleMutation.isPending) {
        console.log('[EditVehicleModal] Ya hay una operación en curso, ignorando submit');
        return;
    }
    
    // ... resto del código
}
```

**Propósito:**
- Previene que el formulario se envíe mientras ya hay una operación en curso
- Evita llamadas duplicadas a la API

---

### 2. Logging Detallado

#### A. En el servicio de vehículos

**Archivo:** `src/services/api/vehicle-service.ts`

```typescript
async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
  try {
    console.log('[VehicleService] createVehicle - INPUT:', data);
    const dbData = this.mapToDB(data);
    console.log('[VehicleService] createVehicle - DB DATA:', dbData);
    const dbVehicle = await this.repository.create(dbData);
    console.log('[VehicleService] createVehicle - DB RESPONSE:', dbVehicle);
    const result = this.mapFromDB(dbVehicle);
    console.log('[VehicleService] createVehicle - RESULT:', result);
    return result;
  } catch (error) {
    console.error('[VehicleService] createVehicle - ERROR:', error);
    throw error;
  }
}
```

#### B. En el repository

**Archivo:** `src/lib/supabase/repository.ts`

```typescript
async create(data: Partial<T>): Promise<T> {
  try {
    console.log(`[SupabaseRepository] CREATE ${this.tableName} - INPUT:`, data);
    
    const { data: newData, error } = await this.client
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error(`[SupabaseRepository] CREATE ${this.tableName} - ERROR:`, {
        error, code: error.code, message: error.message, 
        details: error.details, hint: error.hint
      });
      throw new Error(`Error al crear registro en ${this.tableName}: ${error.message}`);
    }

    console.log(`[SupabaseRepository] CREATE ${this.tableName} - SUCCESS:`, newData);
    return newData as T;
  } catch (error) {
    console.error(`[SupabaseRepository] CREATE ${this.tableName} - EXCEPTION:`, error);
    throw error;
  }
}
```

**Propósito:**
- Rastrear exactamente dónde se detiene la ejecución
- Ver los datos que se están enviando
- Capturar errores detallados de Supabase

---

## 🔍 CÓMO DIAGNOSTICAR EL PROBLEMA

### 1. Recargar la aplicación
```bash
# Ctrl+C en la terminal donde corre npm run dev
npm run dev
```

### 2. Abrir DevTools
- Presiona F12
- Ve a la pestaña "Console"

### 3. Intentar crear un vehículo
Llena el formulario y presiona "Crear Vehículo"

### 4. Analizar los logs en orden

Deberías ver esta secuencia:

```
[EditVehicleModal] Submit iniciado, formData: {...}
[EditVehicleModal] Validación exitosa, preparando datos...
[EditVehicleModal] Datos preparados: {...}
[EditVehicleModal] Creando nuevo vehículo...
[VehicleService] createVehicle - INPUT: {...}
[VehicleService] createVehicle - DB DATA: {...}
[SupabaseRepository] CREATE vehicles - INPUT: {...}
```

**Ahora, busca dónde se detiene:**

#### Caso A: Se detiene después de "CREATE vehicles - INPUT"
**Problema:** Error en Supabase (BD)

**Qué buscar:**
- `[SupabaseRepository] CREATE vehicles - ERROR:`
- Revisa el error específico (code, message, hint)

**Posibles causas:**
- Constraint violation (ej: placa duplicada)
- Tipo de dato incorrecto (ej: year no es número)
- Permiso denegado (RLS blocking)

#### Caso B: Se detiene antes de "[VehicleService] createVehicle - INPUT"
**Problema:** No está llegando al servicio

**Qué buscar:**
- Errores en el hook `useCreateVehicle`
- Network errors

#### Caso C: Ves logs duplicados sin respuesta
**Problema:** El formulario se está enviando dos veces

**Verificar:**
- ¿Aparece el log "Ya hay una operación en curso"?
- Si NO aparece, el fix no se aplicó correctamente

---

## 🎯 POSIBLES CAUSAS Y SOLUCIONES

### Causa 1: Tipos de datos incorrectos

**Verificar en logs:**
```
[VehicleService] createVehicle - DB DATA: {
  year: "2024",           // ❌ debería ser number
  max_load_capacity: "1000"  // ❌ debería ser number
}
```

**Solución:**
Ya está implementada en `EditVehicleModal.tsx`:
```typescript
year: Number(formData.year!),
maxLoadCapacity: Number(formData.maxLoadCapacity!),
```

**Verificar que esté funcionando:**
El log debe mostrar:
```
year: 2024,              // ✅ número
max_load_capacity: 1000  // ✅ número
```

---

### Causa 2: Placa duplicada

**Error esperado:**
```
[SupabaseRepository] CREATE vehicles - ERROR: {
  code: "23505",
  message: "duplicate key value violates unique constraint \"vehicles_license_plate_key\""
}
```

**Solución:**
Cambiar la placa del vehículo a una que no exista.

---

### Causa 3: RLS bloqueando inserción

**Error esperado:**
```
[SupabaseRepository] CREATE vehicles - ERROR: {
  code: "42501",
  message: "new row violates row-level security policy"
}
```

**Solución:**
Verificar políticas RLS en Supabase:
```sql
-- En Supabase SQL Editor
SELECT * FROM pg_policies WHERE tablename = 'vehicles';
```

Debe existir una política que permita INSERT para usuarios autenticados.

---

### Causa 4: Campos requeridos faltantes

**Error esperado:**
```
[SupabaseRepository] CREATE vehicles - ERROR: {
  code: "23502",
  message: "null value in column \"field_name\" violates not-null constraint"
}
```

**Solución:**
Verificar que todos los campos requeridos estén en `dbData`.

---

## ✅ VERIFICACIÓN POST-FIX

Después de aplicar los cambios:

1. **Recargar la aplicación:**
   ```bash
   npm run dev
   ```

2. **Intentar crear un vehículo:**
   - Llenar todos los campos
   - Presionar "Crear Vehículo"
   - Observar la consola

3. **Verificar logs exitosos:**
   ```
   [EditVehicleModal] Submit iniciado
   [EditVehicleModal] Validación exitosa
   [EditVehicleModal] Creando nuevo vehículo...
   [VehicleService] createVehicle - INPUT: {...}
   [VehicleService] createVehicle - DB DATA: {...}
   [SupabaseRepository] CREATE vehicles - INPUT: {...}
   [SupabaseRepository] CREATE vehicles - SUCCESS: {...}
   [VehicleService] createVehicle - DB RESPONSE: {...}
   [VehicleService] createVehicle - RESULT: {...}
   🟢 CREATE HOOK - Vehículo creado: {...}
   [EditVehicleModal] Vehículo creado: {...}
   ```

4. **Verificar UI:**
   - El modal debe cerrarse
   - Debe aparecer un toast: "Vehículo creado exitosamente"
   - El vehículo debe aparecer en la lista

---

## 📞 SI EL PROBLEMA PERSISTE

1. **Captura los logs completos:**
   - Abre Console (F12)
   - Intenta crear vehículo
   - Click derecho en Console → "Save as..."
   - Comparte el archivo

2. **Verifica la red:**
   - Abre DevTools → Network
   - Intenta crear vehículo
   - Busca llamada a Supabase
   - Click en ella → Preview/Response
   - Comparte el error

3. **Verifica la base de datos:**
   ```sql
   -- En Supabase SQL Editor
   SELECT * FROM vehicles ORDER BY created_at DESC LIMIT 5;
   ```
   - ¿Se está creando el vehículo aunque el UI no responde?

---

## 🔄 UPDATE Y DELETE TAMBIÉN TIENEN LOGGING

Ahora el logging también funciona para UPDATE y DELETE:

### Logs esperados para UPDATE:
```
[EditVehicleModal] Submit iniciado
[EditVehicleModal] Validación exitosa
[EditVehicleModal] Actualizando vehículo...
🟡 UPDATE HOOK - Iniciando actualización: {id, data}
[VehicleService] updateVehicle - ID: ...
[VehicleService] updateVehicle - INPUT: {...}
[VehicleService] updateVehicle - DB DATA: {...}
[SupabaseRepository] UPDATE vehicles - ID: ...
[SupabaseRepository] UPDATE vehicles - INPUT: {...}
[SupabaseRepository] UPDATE vehicles - SUCCESS: {...}
[VehicleService] updateVehicle - DB RESPONSE: {...}
[VehicleService] updateVehicle - RESULT: {...}
🟢 UPDATE HOOK - Vehículo actualizado: {...}
[EditVehicleModal] Vehículo actualizado: {...}
```

### Logs esperados para DELETE:
```
🟡 DELETE HOOK - Iniciando eliminación, ID: ...
[VehicleService] deleteVehicle - ID: ...
[SupabaseRepository] DELETE vehicles - ID: ...
[SupabaseRepository] DELETE vehicles - SUCCESS
[VehicleService] deleteVehicle - SUCCESS
🟢 DELETE HOOK - Vehículo eliminado, ID: ...
```

---

## 🚀 SIGUIENTE PASO

1. Recarga la aplicación: `npm run dev`
2. Abre Console (F12)
3. Intenta la operación que está fallando (DELETE o UPDATE)
4. Comparte los logs que aparecen en console, específicamente:
   - El último log antes de que se detenga
   - Cualquier ERROR en rojo
