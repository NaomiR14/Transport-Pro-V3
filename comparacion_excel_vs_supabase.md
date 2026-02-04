# COMPARACIÓN: EXCEL vs SUPABASE

## RESUMEN EJECUTIVO

✅ **Estado General**: Las tablas de Supabase **están bien diseñadas** y cubren todos los aspectos del Excel, con mejoras significativas.

### Diferencias Principales:

1. ✅ **Campos adicionales útiles** en Supabase (email, activo, estado, etc.)
2. ✅ **Columnas calculadas** implementadas correctamente con GENERATED ALWAYS AS
3. ✅ **Triggers automáticos** para actualizar estados
4. ✅ **RLS (Row Level Security)** implementado
5. ⚠️  **Algunas diferencias de nomenclatura** entre Excel y Supabase
6. ⚠️  **Relación FK de Conductor** en tablas transaccionales no está implementada

---

## COMPARACIÓN DETALLADA POR TABLA

### 1. FLOTA / VEHICLES

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | - | ❌ Faltante | Supabase usa UUID como PK |
| Tipo | type | ✅ OK | |
| Marca | brand | ✅ OK | |
| Modelo | model | ✅ OK | |
| Placa Vehiculo | license_plate | ✅ OK | PK en Excel, UNIQUE en Supabase |
| Nro serie | serial_number | ✅ OK | UNIQUE en Supabase |
| Color | color | ✅ OK | |
| Año | year | ✅ OK | TEXT en Supabase (debería ser INT) |
| Carga Máxima (Kg) | max_load_capacity | ✅ OK | TEXT en Supabase (debería ser NUMERIC) |
| Estado Vehiculo | vehicle_state | ✅ OK | CHECK constraint mejorado |
| Ciclo para Mnnto Prevent. (Km) | maintenance_data.maintenanceCycle | ✅ OK | En JSONB |
| Kms Odómetro Inicial | maintenance_data.initialKm | ✅ OK | En JSONB |
| Kms Odómetro Mnnto. Preventivo | maintenance_data.prevMaintenanceKm | ✅ OK | En JSONB |
| Kms Odómetro Actual | maintenance_data.currentKm | ✅ OK | En JSONB |
| Falta para el próximo Mnnto Prev. (Km) | maintenance_data.remainingMaintenanceKm | ✅ OK | En JSONB (calculado) |
| Estado Mantenimiento Preventivo | maintenance_data.maintenanceStatus | ✅ OK | En JSONB |
| - | id | ➕ Extra | UUID PK (mejor práctica) |
| - | created_at, updated_at | ➕ Extra | Auditoría |

**Recomendaciones:**
- ⚠️ Cambiar `year` de TEXT a INTEGER
- ⚠️ Cambiar `max_load_capacity` de TEXT a NUMERIC(10,2)

---

### 2. CONDUCTORES

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | - | ❌ Faltante | Supabase usa UUID |
| Doc Identidad | documento_identidad | ✅ OK | UNIQUE |
| Conductor | nombre_conductor | ✅ OK | |
| Nro Licencia | numero_licencia | ✅ OK | UNIQUE |
| Dirección | direccion | ✅ OK | |
| Teléfono/Celular | telefono | ✅ OK | |
| Calificación | calificacion | ✅ OK | NUMERIC(3,2) con CHECK (0-5) |
| - | id | ➕ Extra | UUID PK |
| - | email | ➕ Extra | Campo útil |
| - | activo | ➕ Extra | Boolean para soft delete |
| - | fecha_vencimiento_licencia | ➕ Extra | Control de licencia |
| - | estado_licencia | ➕ Extra | Con trigger automático |
| - | created_at, updated_at | ➕ Extra | Auditoría |

**Recomendaciones:**
- ✅ Excelente - Tiene mejoras sobre el Excel
- ✅ Trigger automático para actualizar estado de licencia

---

### 3. TALLERES

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | - | ❌ Faltante | Supabase usa UUID |
| Nombre del Taller | name | ✅ OK | UNIQUE |
| Dirección | address | ✅ OK | |
| Teléfono/Celular | phone_number | ✅ OK | |
| Correo | email | ✅ OK | |
| Contacto Principal | contact_person | ✅ OK | |
| - | id | ➕ Extra | UUID PK |
| - | open_hours | ➕ Extra | Horario de atención |
| - | notes | ➕ Extra | Notas adicionales |
| - | rate | ➕ Extra | Calificación del taller |
| - | created_at, updated_at | ➕ Extra | Auditoría |

**Recomendaciones:**
- ✅ Excelente - Tiene mejoras sobre el Excel

---

### 4. SEGUROS / SEGUROS_VEHICULOS

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | - | ❌ Faltante | Supabase usa UUID |
| Placa Vehiculo | placa_vehiculo | ✅ OK | FK a vehicles.license_plate |
| Aseguradora | aseguradora | ✅ OK | |
| Poliza seguro | poliza_seguro | ✅ OK | UNIQUE en Supabase |
| Fecha de inicio | fecha_inicio | ✅ OK | |
| Fecha de Vencimiento | fecha_vencimiento | ✅ OK | |
| Importe Pagado ($) | importe_pagado | ✅ OK | NUMERIC(10,2) |
| Fecha de Pago | fecha_pago | ✅ OK | |
| Estado Poliza | estado_poliza | ✅ OK | Con trigger automático |
| - | id | ➕ Extra | UUID PK |
| - | created_at, updated_at | ➕ Extra | Auditoría |

**Recomendaciones:**
- ✅ Excelente - Trigger automático para estado de póliza
- ✅ CHECK constraint en fechas

---

### 5. IMPUESTOS / IMPUESTOS_VEHICULARES

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | - | ❌ Faltante | Supabase usa UUID |
| Placa Vehiculo | placa_vehiculo | ✅ OK | FK a vehicles.license_plate |
| Tipo Impuesto | tipo_impuesto | ✅ OK | |
| Año Impuesto | anio_impuesto | ✅ OK | INTEGER |
| Impuesto ($) | impuesto_monto | ✅ OK | NUMERIC(10,2) |
| Fecha de pago | fecha_pago | ✅ OK | |
| - | id | ➕ Extra | UUID PK |
| - | estado_pago | ➕ Extra | Con trigger automático |
| - | created_at, updated_at | ➕ Extra | Auditoría |
| - | UNIQUE constraint | ➕ Extra | (placa, tipo, año) |

**Recomendaciones:**
- ✅ Excelente - Constraint UNIQUE para evitar duplicados

---

### 6. RUTAS / RUTAS_VIAJES

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | - | ❌ Faltante | Supabase usa UUID |
| Fecha de Salida | fecha_salida | ✅ OK | TIMESTAMP WITH TIME ZONE |
| Fecha de Llegada | fecha_llegada | ✅ OK | TIMESTAMP WITH TIME ZONE |
| Placa Vehiculo | placa_vehiculo | ✅ OK | FK a vehicles.license_plate |
| Estado Vehículo | - | ❌ Faltante | No está en Supabase |
| Conductor | conductor | ⚠️ PROBLEMA | TEXT sin FK a conductores |
| Origen | origen | ✅ OK | |
| Destino | destino | ✅ OK | |
| Kms Inicial (Odómetro) | kms_inicial | ✅ OK | NUMERIC(10,2) |
| Kms Final (Odómetro) | kms_final | ✅ OK | NUMERIC(10,2) |
| Kms Recorridos | kms_recorridos | ✅ OK | GENERATED ALWAYS AS |
| Peso de carga (Kg) | peso_carga_kg | ✅ OK | NUMERIC(10,2) |
| Costo por Kg de carga ($/Kg) | costo_por_kg | ✅ OK | NUMERIC(10,2) |
| Ingreso Total ($) | ingreso_total | ✅ OK | GENERATED ALWAYS AS |
| Estación de Combustible | estacion_combustible | ✅ OK | |
| Tipo de Combustible | tipo_combustible | ✅ OK | |
| Precio x Galón ($/gal) | precio_por_galon | ✅ OK | NUMERIC(10,2) |
| Total Combustible ($) | total_combustible | ✅ OK | GENERATED ALWAYS AS |
| Gasto peajes ($) | gasto_peajes | ✅ OK | NUMERIC(10,2) |
| Gasto comidas ($) | gasto_comidas | ✅ OK | NUMERIC(10,2) |
| Otros Gastos ($) | otros_gastos | ✅ OK | NUMERIC(10,2) |
| Gasto Total ($) | gasto_total | ✅ OK | GENERATED ALWAYS AS |
| Volumen de Combustible (gal) | volumen_combustible_gal | ✅ OK | NUMERIC(10,2) |
| Recorrido por und. de comb. (Km/gal) | recorrido_por_galon | ✅ OK | GENERATED ALWAYS AS |
| Ingreso por Kms de recorrido ($/Km) | ingreso_por_km | ✅ OK | GENERATED ALWAYS AS |
| Observaciones | observaciones | ✅ OK | TEXT |
| - | id | ➕ Extra | UUID PK |
| - | created_at, updated_at | ➕ Extra | Auditoría |

**Recomendaciones:**
- ⚠️ **IMPORTANTE**: Agregar FK de conductor a tabla conductores
- ⚠️ Agregar campo estado_vehiculo si se necesita

---

### 7. MULTAS / MULTAS_CONDUCTORES

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | - | ❌ Faltante | Supabase usa UUID |
| Fecha | fecha | ✅ OK | DATE |
| Nro Viaje | numero_viaje | ✅ OK | INTEGER |
| Placa Vehículo | placa_vehiculo | ✅ OK | FK a vehicles.license_plate |
| Conductor | conductor | ⚠️ PROBLEMA | TEXT sin FK a conductores |
| Infracción | infraccion | ✅ OK | TEXT |
| Importe multa ($) | importe_multa | ✅ OK | NUMERIC(10,2) |
| Importe pagado ($) | importe_pagado | ✅ OK | NUMERIC(10,2) |
| Debe ($) | debe | ✅ OK | GENERATED ALWAYS AS |
| Estado Pago | estado_pago | ✅ OK | Con trigger automático |
| Observaciones | observaciones | ✅ OK | TEXT |
| - | id | ➕ Extra | UUID PK |
| - | created_at, updated_at | ➕ Extra | Auditoría |

**Recomendaciones:**
- ⚠️ **IMPORTANTE**: Agregar FK de conductor a tabla conductores
- ✅ Trigger automático para estado de pago

---

### 8. MANTENIMIENTO / MANTENIMIENTOS_VEHICULOS

| Campo Excel | Campo Supabase | Estado | Notas |
|-------------|----------------|--------|-------|
| Nro | id | ✅ OK | SERIAL en Supabase |
| Placa Vehiculo | placa_vehiculo | ✅ OK | FK a vehicles.license_plate |
| Taller | taller | ✅ OK | FK a talleres.name |
| Fecha Entrada | fecha_entrada | ✅ OK | DATE |
| Fecha Salida | fecha_salida | ✅ OK | DATE |
| Tipo | tipo | ✅ OK | CHECK constraint |
| Kilometraje del Odómetro | kilometraje | ✅ OK | NUMERIC(10,2) |
| Paquete de Mantenimiento | paquete_mantenimiento | ✅ OK | TEXT |
| Causas del Mantenimiento | causas | ✅ OK | TEXT |
| Costo Total ($) | costo_total | ✅ OK | NUMERIC(10,2) |
| Fecha de Pago | fecha_pago | ✅ OK | DATE |
| Observaciones | observaciones | ✅ OK | TEXT |
| - | estado | ➕ Extra | Con trigger automático |
| - | created_at, updated_at | ➕ Extra | Auditoría |

**Recomendaciones:**
- ✅ Excelente - Trigger automático para estado
- ✅ FKs bien implementadas

---

## PROBLEMAS CRÍTICOS A RESOLVER

### 🔴 PRIORIDAD ALTA

1. **Falta FK de Conductor en rutas_viajes y multas_conductores**
   - Actualmente `conductor` es TEXT
   - Debería ser FK a `conductores.documento_identidad` o `conductores.nombre_conductor`
   - Esto rompe la integridad referencial

2. **Tipos de datos inconsistentes en vehicles**
   - `year` debería ser INTEGER, no TEXT
   - `max_load_capacity` debería ser NUMERIC(10,2), no TEXT

### 🟡 PRIORIDAD MEDIA

3. **Campo faltante en rutas_viajes**
   - `estado_vehiculo` existe en Excel pero no en Supabase
   - Decidir si se necesita o no

4. **Campo Nro secuencial**
   - Excel usa campo Nro como secuencial visible
   - Supabase usa UUID (mejor para seguridad)
   - Si se necesita número secuencial para UI, agregar columna separada

---

## VENTAJAS DE LA IMPLEMENTACIÓN SUPABASE

✅ **Mejoras implementadas:**
1. UUIDs como PKs (mejor seguridad)
2. Columnas calculadas con GENERATED ALWAYS AS
3. Triggers automáticos para estados
4. CHECK constraints para validación
5. RLS para seguridad a nivel de fila
6. Índices optimizados
7. Campos de auditoría (created_at, updated_at)
8. Campos adicionales útiles (email, activo, estado, etc.)

---

## ACCIONES RECOMENDADAS

### Inmediatas:
1. ✅ Crear migración para agregar FK de conductor en rutas_viajes
2. ✅ Crear migración para agregar FK de conductor en multas_conductores
3. ✅ Crear migración para cambiar tipos de datos en vehicles

### Opcional:
4. Agregar campo estado_vehiculo a rutas_viajes si se necesita
5. Agregar campo nro secuencial visible si la UI lo requiere

---

## CONCLUSIÓN

La estructura de Supabase está **muy bien diseñada** y es superior al Excel en muchos aspectos. Solo necesita pequeños ajustes para:
- Mantener la integridad referencial completa (FKs de conductor)
- Corregir tipos de datos inconsistentes

