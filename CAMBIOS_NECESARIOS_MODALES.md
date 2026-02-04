# CAMBIOS NECESARIOS EN LOS MODALES DESPUÉS DE LAS MIGRACIONES

## Resumen

Después de aplicar las migraciones de la base de datos, los siguientes componentes necesitan actualizaciones para funcionar correctamente:

---

## 🔴 CAMBIOS CRÍTICOS

### 1. EditVehicleModal.tsx

#### Problema:
- Los campos `year` y `maxLoadCapacity` se envían como **strings** pero ahora la BD espera **números**

#### Solución:
En las líneas **85-86** y **210-211**, cambiar:

**Antes:**
```typescript
year: vehicle.year.toString(),
maxLoadCapacity: vehicle.maxLoadCapacity.toString(),
```

**Después:**
```typescript
year: vehicle.year, // Ya es number
maxLoadCapacity: vehicle.maxLoadCapacity, // Ya es number
```

Y en **líneas 210-211** (preparación de apiData):

**Antes:**
```typescript
year: formData.year!,
maxLoadCapacity: formData.maxLoadCapacity!,
```

**Después:**
```typescript
year: Number(formData.year!),
maxLoadCapacity: Number(formData.maxLoadCapacity!),
```

---

### 2. EditRutaViajeModal.tsx

#### Problema:
- El campo `conductor` usa **nombre del conductor** (string) pero la BD ahora espera **documento_identidad**

#### Cambios necesarios:

**A. Cargar conductores correctamente (línea 124-128)**

**Antes:**
```typescript
useEffect(() => {
    // Simular carga de vehículos y conductores
    setVehiculos(["ABC-123-A", "XYZ-789-B", "DEF-456-C", "GHI-101-D"])
    setConductores(["Juan Pérez García", "María López Hernández", "Carlos Rodríguez Martínez", "Ana García Silva"])
}, [])
```

**Después:**
```typescript
useEffect(() => {
    const loadData = async () => {
        try {
            // Cargar vehículos reales
            const vehiclesResponse = await fetch('/api/vehicles')
            const vehiclesData = await vehiclesResponse.json()
            setVehiculos(vehiclesData.map((v: any) => v.license_plate))
            
            // Cargar conductores reales
            const conductoresResponse = await fetch('/api/conductores')
            const conductoresData = await conductoresResponse.json()
            // Guardar tanto documento como nombre para el select
            const conductoresConDocs = conductoresData.map((c: any) => ({
                documento: c.documento_identidad,
                nombre: c.nombre_conductor
            }))
            setConductores(conductoresConDocs)
        } catch (error) {
            console.error('Error loading data:', error)
        }
    }
    
    if (isOpen) {
        loadData()
    }
}, [isOpen])
```

**B. Actualizar el tipo de estado (línea 40)**

**Antes:**
```typescript
const [conductores, setConductores] = useState<string[]>([])
```

**Después:**
```typescript
const [conductores, setConductores] = useState<{documento: string, nombre: string}[]>([])
```

**C. Actualizar el Select de conductores (líneas 346-364)**

**Antes:**
```typescript
<Select
    value={formData.conductor || ""}
    onValueChange={(value) => handleInputChange("conductor", value)}
    disabled={updateRutaMutation.isPending}
>
    <SelectTrigger className={errors.conductor ? "border-red-500" : ""}>
        <SelectValue placeholder="Seleccionar conductor" />
    </SelectTrigger>
    <SelectContent>
        {conductores.map((conductor) => (
            <SelectItem key={conductor} value={conductor}>
                {conductor}
            </SelectItem>
        ))}
    </SelectContent>
</Select>
```

**Después:**
```typescript
<Select
    value={formData.conductor || ""}
    onValueChange={(value) => handleInputChange("conductor", value)}
    disabled={updateRutaMutation.isPending}
>
    <SelectTrigger className={errors.conductor ? "border-red-500" : ""}>
        <SelectValue placeholder="Seleccionar conductor" />
    </SelectTrigger>
    <SelectContent>
        {conductores.map((conductor) => (
            <SelectItem key={conductor.documento} value={conductor.documento}>
                {conductor.nombre} ({conductor.documento})
            </SelectItem>
        ))}
    </SelectContent>
</Select>
```

---

### 3. EditMultasConductoresModal.tsx

#### Problema:
- Similar a `EditRutaViajeModal`, el campo `conductor` debe usar `documento_identidad`

#### Cambios necesarios:

**A. Cargar conductores (agregar después de línea 52)**

```typescript
const [conductores, setConductores] = useState<{documento: string, nombre: string}[]>([])

useEffect(() => {
    const loadConductores = async () => {
        try {
            const response = await fetch('/api/conductores')
            const data = await response.json()
            setConductores(data.map((c: any) => ({
                documento: c.documento_identidad,
                nombre: c.nombre_conductor
            })))
        } catch (error) {
            console.error('Error loading conductores:', error)
        }
    }
    
    if (isOpen) {
        loadConductores()
    }
}, [isOpen])
```

**B. Reemplazar el Input de conductor con Select (líneas 269-278)**

**Antes:**
```typescript
<div className="space-y-2">
    <Label htmlFor="conductor">Conductor *</Label>
    <Input
        id="conductor"
        value={formData.conductor}
        onChange={(e) => handleInputChange("conductor", e.target.value)}
        className={errors.conductor ? "border-red-500" : ""}
    />
    {errors.conductor && <p className="text-sm text-red-500">{errors.conductor}</p>}
</div>
```

**Después:**
```typescript
<div className="space-y-2">
    <Label htmlFor="conductor">Conductor *</Label>
    <Select
        value={formData.conductor}
        onValueChange={(value) => handleInputChange("conductor", value)}
        disabled={isLoading}
    >
        <SelectTrigger className={errors.conductor ? "border-red-500" : ""}>
            <SelectValue placeholder="Seleccionar conductor" />
        </SelectTrigger>
        <SelectContent>
            {conductores.map((conductor) => (
                <SelectItem key={conductor.documento} value={conductor.documento}>
                    {conductor.nombre} ({conductor.documento})
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
    {errors.conductor && <p className="text-sm text-red-500">{errors.conductor}</p>}
</div>
```

---

## 📝 CAMBIOS EN TYPES (TypeScript)

### 1. src/types/vehicles-types.ts

Actualizar la interfaz `Vehicle` para que `year` y `maxLoadCapacity` sean números:

```typescript
export interface Vehicle {
    id: string
    type: string
    brand: string
    model: string
    licensePlate: string
    serialNumber: string
    color: string
    year: number  // Cambiar de string a number
    maxLoadCapacity: number  // Cambiar de string a number
    vehicleState: string
    maintenanceData: MaintenanceData
    createdAt: string
    updatedAt: string
}

export interface CreateVehicleRequest {
    type: string
    brand: string
    model: string
    licensePlate: string
    serialNumber: string
    color: string
    year: number  // Cambiar de string a number
    maxLoadCapacity: number  // Cambiar de string a number
    vehicleState: string
    maintenanceData: {
        maintenanceCycle: number
        initialKm: number
    }
}
```

---

## 🟡 CAMBIOS OPCIONALES PERO RECOMENDADOS

### 1. Validación de documentos de conductor

Agregar validación para asegurar que el documento existe:

```typescript
const validateConductorExists = async (documento: string): Promise<boolean> => {
    try {
        const response = await fetch(`/api/conductores/${documento}`)
        return response.ok
    } catch {
        return false
    }
}
```

### 2. Mostrar nombre del conductor en vistas de edición

Cuando editas una ruta o multa existente, debes cargar el nombre del conductor basado en su documento:

```typescript
useEffect(() => {
    const loadConductorName = async () => {
        if (formData.conductor) {
            try {
                const response = await fetch(`/api/conductores/${formData.conductor}`)
                const conductor = await response.json()
                // Mostrar nombre en algún lugar del UI
            } catch (error) {
                console.error('Error loading conductor:', error)
            }
        }
    }
    loadConductorName()
}, [formData.conductor])
```

---

## 🚀 PASOS PARA APLICAR LOS CAMBIOS

1. **Actualizar types:**
   ```bash
   # Editar src/types/vehicles-types.ts
   ```

2. **Actualizar EditVehicleModal.tsx:**
   - Cambiar líneas 85-86
   - Cambiar líneas 210-211

3. **Actualizar EditRutaViajeModal.tsx:**
   - Cambiar línea 40 (tipo de conductores)
   - Cambiar líneas 124-128 (cargar conductores)
   - Cambiar líneas 346-364 (Select de conductores)

4. **Actualizar EditMultasConductoresModal.tsx:**
   - Agregar estado para conductores
   - Agregar useEffect para cargar conductores
   - Cambiar líneas 269-278 (Input a Select)

5. **Probar cada modal:**
   - Crear nuevo vehículo
   - Editar vehículo existente
   - Crear nueva ruta
   - Editar ruta existente
   - Crear nueva multa
   - Editar multa existente

---

## 🐛 PROBLEMAS COMUNES Y SOLUCIONES

### Problema: "conductor is not defined" en SELECT
**Solución:** El conductor ya no existe como nombre, ahora es documento_identidad. Actualiza las consultas JOIN.

### Problema: "year must be a number"
**Solución:** Asegúrate de convertir year a número antes de enviar: `Number(formData.year)`

### Problema: "No se muestran los conductores en el Select"
**Solución:** Verifica que el endpoint `/api/conductores` esté funcionando y devolviendo `documento_identidad`.

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Types actualizados (vehicles-types.ts)
- [ ] EditVehicleModal.tsx actualizado
- [ ] EditRutaViajeModal.tsx actualizado
- [ ] EditMultasConductoresModal.tsx actualizado
- [ ] API endpoints funcionando (/api/conductores)
- [ ] Pruebas de crear vehículo
- [ ] Pruebas de editar vehículo
- [ ] Pruebas de crear ruta
- [ ] Pruebas de editar ruta
- [ ] Pruebas de crear multa
- [ ] Pruebas de editar multa

---

## 📞 Si encuentras errores

Los errores más comunes serán:

1. **"column conductor of type text" en INSERT/UPDATE**
   - La migración no se aplicó correctamente
   - Verifica que las FKs se hayan creado

2. **"invalid input syntax for type integer"**
   - Estás enviando string donde se espera number
   - Convierte con `Number()` antes de enviar

3. **"null value in column conductor violates not-null constraint"**
   - No se está seleccionando un conductor
   - Verifica que el Select tenga valores

