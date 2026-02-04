# DIAGRAMA DE BASE DE DATOS - CONTROL DE FLOTA VEHICULAR

## Resumen de Tablas

### 1. **Flota** (Tabla Principal - Vehículos)
**Clave Primaria:** `Placa Vehiculo`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | Número secuencial |
| Tipo | VARCHAR | Tipo de vehículo (Auto, Camión, Autobús) |
| Marca | VARCHAR | Marca del vehículo |
| Modelo | VARCHAR | Modelo del vehículo |
| **Placa Vehiculo** | VARCHAR | **PK** - Identificador único |
| Nro serie | VARCHAR | Número de serie |
| Color | VARCHAR | Color |
| Año | INT | Año de fabricación |
| Carga Máxima (Kg) | DECIMAL | Capacidad de carga |
| Estado Vehiculo | VARCHAR | Disponible/En uso/Mantenimiento |
| Ciclo para Mnnto Prevent. (Km) | INT | Kilometraje para mantenimiento |
| Kms Odómetro Inicial | INT | Kilometraje inicial |
| Kms Odómetro Mnnto. Preventivo | INT | Km del último mantenimiento |
| Kms Odómetro Actual | INT | Kilometraje actual |
| Falta para el próximo Mnnto Prev. (Km) | INT | Calculado |
| Estado Mantenimiento Preventivo | VARCHAR | Al día/Próximo/Vencido |

---

### 2. **Conductores** (Tabla Principal)
**Clave Primaria:** `Doc Identidad` o `Nro`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | Número secuencial |
| **Doc Identidad** | VARCHAR | **PK** - DNI/Cédula |
| Conductor | VARCHAR | Nombre completo |
| Nro Licencia | VARCHAR | Número de licencia |
| Dirección | VARCHAR | Dirección |
| Teléfono/Celular | VARCHAR | Contacto |
| Calificación | VARCHAR | Estrellas (★ a ★★★★★) |

---

### 3. **Talleres** (Tabla Principal)
**Clave Primaria:** `Nro` o `Nombre del Taller`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | Número secuencial |
| **Nombre del Taller** | VARCHAR | **PK** - Nombre único |
| Dirección | VARCHAR | Dirección |
| Teléfono/Celular | VARCHAR | Contacto |
| Correo | VARCHAR | Email |
| Contacto Principal | VARCHAR | Persona de contacto |

---

### 4. **Seguros** (Tabla Dependiente)
**Clave Primaria:** `Nro`
**Clave Foránea:** `Placa Vehiculo` → `Flota.Placa Vehiculo`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | **PK** - Número secuencial |
| **Placa Vehiculo** | VARCHAR | **FK** → Flota |
| Aseguradora | VARCHAR | Nombre aseguradora |
| Poliza seguro | VARCHAR | Número de póliza |
| Fecha de inicio | DATE | Inicio vigencia |
| Fecha de Vencimiento | DATE | Fin vigencia |
| Importe Pagado ($) | DECIMAL | Monto pagado |
| Fecha de Pago | DATE | Fecha de pago |
| Estado Poliza | VARCHAR | Vigente/Vencida |

---

### 5. **Impuestos** (Tabla Dependiente)
**Clave Primaria:** `Nro`
**Clave Foránea:** `Placa Vehiculo` → `Flota.Placa Vehiculo`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | **PK** - Número secuencial |
| **Placa Vehiculo** | VARCHAR | **FK** → Flota |
| Tipo Impuesto | VARCHAR | Tipo de impuesto |
| Año Impuesto | INT | Año fiscal |
| Impuesto ($) | DECIMAL | Monto |
| Fecha de pago | DATE | Fecha de pago |

---

### 6. **Rutas** (Tabla Transaccional)
**Clave Primaria:** `Nro`
**Claves Foráneas:** 
- `Placa Vehiculo` → `Flota.Placa Vehiculo`
- `Conductor` → `Conductores.Conductor`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | **PK** - Número de viaje |
| Fecha de Salida | DATETIME | Fecha/hora salida |
| Fecha de Llegada | DATETIME | Fecha/hora llegada |
| **Placa Vehiculo** | VARCHAR | **FK** → Flota |
| Estado Vehículo | VARCHAR | Estado del vehículo |
| **Conductor** | VARCHAR | **FK** → Conductores |
| Origen | VARCHAR | Ciudad/lugar origen |
| Destino | VARCHAR | Ciudad/lugar destino |
| Kms Inicial (Odómetro) | INT | Km inicial |
| Kms Final (Odómetro) | INT | Km final |
| Kms Recorridos | INT | Calculado |
| Peso de carga (Kg) | DECIMAL | Peso transportado |
| Costo por Kg de carga ($/Kg) | DECIMAL | Tarifa |
| Ingreso Total ($) | DECIMAL | Ingresos |
| Estación de Combustible | VARCHAR | Gasolinera |
| Tipo de Combustible | VARCHAR | Gasolina/Diesel/GNV |
| Precio x Galón ($/gal) | DECIMAL | Precio unitario |
| Total Combustible ($) | DECIMAL | Gasto combustible |
| Gasto peajes ($) | DECIMAL | Peajes |
| Gasto comidas ($) | DECIMAL | Comidas |
| Otros Gastos ($) | DECIMAL | Otros |
| Gasto Total ($) | DECIMAL | Total gastos |
| Volumen de Combustible (gal) | DECIMAL | Galones |
| Recorrido por und. de comb. (Km/gal) | DECIMAL | Eficiencia |
| Ingreso por Kms de recorrido ($/Km) | DECIMAL | Rentabilidad |
| Observaciones | TEXT | Notas |

---

### 7. **Multas** (Tabla Transaccional)
**Clave Primaria:** `Nro`
**Claves Foráneas:** 
- `Placa Vehículo` → `Flota.Placa Vehiculo`
- `Conductor` → `Conductores.Conductor`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | **PK** - Número secuencial |
| Fecha | DATE | Fecha de infracción |
| Nro Viaje | INT | Referencia a viaje (opcional) |
| **Placa Vehículo** | VARCHAR | **FK** → Flota |
| **Conductor** | VARCHAR | **FK** → Conductores |
| Infracción | VARCHAR | Tipo de infracción |
| Importe multa ($) | DECIMAL | Monto multa |
| Importe pagado ($) | DECIMAL | Monto pagado |
| Debe ($) | DECIMAL | Saldo pendiente |
| Estado Pago | VARCHAR | Pagado/Pendiente |
| Observaciones | TEXT | Notas |

---

### 8. **Mantenimiento** (Tabla Transaccional)
**Clave Primaria:** `Nro`
**Claves Foráneas:** 
- `Placa Vehiculo` → `Flota.Placa Vehiculo`
- `Taller` → `Talleres.Nombre del Taller`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Nro | INT | **PK** - Número secuencial |
| **Placa Vehiculo** | VARCHAR | **FK** → Flota |
| **Taller** | VARCHAR | **FK** → Talleres |
| Fecha Entrada | DATE | Fecha ingreso taller |
| Fecha Salida | DATE | Fecha salida taller |
| Tipo | VARCHAR | Preventivo/Correctivo |
| Kilometraje del Odómetro | INT | Km al momento |
| Paquete de Mantenimiento | VARCHAR | Paquete (01, 02, 03, 04) |
| Causas del Mantenimiento | TEXT | Descripción |
| Costo Total ($) | DECIMAL | Costo |
| Fecha de Pago | DATE | Fecha de pago |
| Observaciones | TEXT | Notas |

---

## Diagrama de Relaciones (ERD)

```
┌─────────────────────┐
│      FLOTA          │
│  (Vehículos)        │
├─────────────────────┤
│ PK: Placa Vehiculo  │
│ - Tipo              │
│ - Marca             │
│ - Modelo            │
│ - Nro serie         │
│ - Color             │
│ - Año               │
│ - Estado            │
│ - Kms...            │
└──────────┬──────────┘
           │
           │ (1:N)
           │
    ┌──────┴──────┬──────────────┬──────────────┬──────────────┐
    │             │              │              │              │
    ▼             ▼              ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐
│ SEGUROS │  │IMPUESTOS │  │  RUTAS  │  │ MULTAS  │  │MANTENIMIENTO │
├─────────┤  ├──────────┤  ├─────────┤  ├─────────┤  ├──────────────┤
│PK: Nro  │  │PK: Nro   │  │PK: Nro  │  │PK: Nro  │  │PK: Nro       │
│FK: Placa│  │FK: Placa │  │FK: Placa│  │FK: Placa│  │FK: Placa     │
│-Asegur. │  │-Tipo     │  │FK: Cond.│  │FK: Cond.│  │FK: Taller    │
│-Poliza  │  │-Año      │  │-Origen  │  │-Infrac. │  │-Tipo         │
│-Fechas  │  │-Importe  │  │-Destino │  │-Importe │  │-Kilometraje  │
└─────────┘  └──────────┘  │-Gastos  │  │-Estado  │  │-Costo        │
                            │-Ingresos│  └────┬────┘  └──────┬───────┘
                            └────┬────┘       │              │
                                 │            │              │
                                 │(N:1)       │(N:1)         │(N:1)
                                 │            │              │
                            ┌────▼────────────▼──┐      ┌────▼─────────┐
                            │   CONDUCTORES      │      │   TALLERES   │
                            ├────────────────────┤      ├──────────────┤
                            │PK: Doc Identidad   │      │PK: Nombre    │
                            │- Conductor (Nombre)│      │- Dirección   │
                            │- Nro Licencia      │      │- Teléfono    │
                            │- Dirección         │      │- Correo      │
                            │- Teléfono          │      │- Contacto    │
                            │- Calificación      │      └──────────────┘
                            └────────────────────┘
```

---

## Cardinalidad de Relaciones

1. **Flota → Seguros** (1:N)
   - Un vehículo puede tener múltiples pólizas de seguro a lo largo del tiempo

2. **Flota → Impuestos** (1:N)
   - Un vehículo puede tener múltiples registros de impuestos (por año)

3. **Flota → Rutas** (1:N)
   - Un vehículo puede realizar múltiples viajes

4. **Conductores → Rutas** (1:N)
   - Un conductor puede realizar múltiples viajes

5. **Flota → Multas** (1:N)
   - Un vehículo puede tener múltiples multas

6. **Conductores → Multas** (1:N)
   - Un conductor puede tener múltiples multas

7. **Flota → Mantenimiento** (1:N)
   - Un vehículo puede tener múltiples registros de mantenimiento

8. **Talleres → Mantenimiento** (1:N)
   - Un taller puede atender múltiples mantenimientos

---

## Notas Importantes para Implementación en Supabase

### Claves Primarias Recomendadas:
- **Flota**: `placa_vehiculo` (TEXT, UNIQUE)
- **Conductores**: `doc_identidad` (TEXT, UNIQUE) o `id` (UUID)
- **Talleres**: `id` (UUID) o `nombre_taller` (TEXT, UNIQUE)
- **Seguros, Impuestos, Rutas, Multas, Mantenimiento**: `id` (UUID o SERIAL)

### Tipos de Datos Sugeridos:
- Fechas: `DATE` o `TIMESTAMP`
- Montos: `NUMERIC(10,2)` o `DECIMAL(10,2)`
- Texto corto: `VARCHAR(255)` o `TEXT`
- Números enteros: `INTEGER`
- IDs: `UUID` (preferido) o `SERIAL`

### Índices Recomendados:
- Índices en todas las claves foráneas
- Índice en `Flota.estado_vehiculo`
- Índice en `Rutas.fecha_salida`
- Índice en `Mantenimiento.fecha_entrada`

### Campos Calculados:
Estos campos se pueden implementar como:
- Columnas generadas (GENERATED ALWAYS AS)
- Triggers
- Funciones en la aplicación

Campos calculados identificados:
- `Flota.Falta para el próximo Mnnto Prev. (Km)`
- `Rutas.Kms Recorridos`
- `Rutas.Gasto Total ($)`
- `Rutas.Recorrido por und. de comb. (Km/gal)`
- `Rutas.Ingreso por Kms de recorrido ($/Km)`
- `Multas.Debe ($)`

