# Patrones de Estilo Unificados - Transport Pro V3

Este documento define los patrones de estilo consistentes aplicados en **Conductores** y **Vehículos** que deben replicarse en todas las demás páginas.

## 🎨 Paleta de Colores

### Colores de Estado (Badges)
```tsx
// Success (Verde)
bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text

// Warning (Amarillo)
bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text

// Error (Rojo)
bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text

// Neutral (Gris)
bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400
```

### Colores de Texto
```tsx
// Títulos principales
text-slate-900 dark:text-white

// Descripciones/subtítulos
text-slate-600 dark:text-slate-400

// Texto secundario
text-slate-500 dark:text-slate-400

// Texto en tablas
text-slate-700 dark:text-slate-300  // Headers
text-slate-900 dark:text-white      // Contenido
```

## 📦 Componentes y Estructuras

### 1. Container Principal
```tsx
<div className="p-6 container-padding">
```

### 2. Page Header
```tsx
<div className="mb-8 flex justify-between items-center">
    <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Título de la Página
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
            Descripción de la funcionalidad
        </p>
    </div>
    <Button 
        onClick={handleCreate} 
        className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
        <Plus className="h-5 w-5 mr-2" />
        Nuevo Elemento
    </Button>
</div>
```

### 3. Cards
```tsx
<Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
    <CardContent className="pt-6">
        {/* Contenido */}
    </CardContent>
</Card>
```

### 4. Filtros y Búsqueda
```tsx
<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
    <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <Input
                placeholder="Buscar..."
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ searchTerm: e.target.value })}
                className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
            />
        </div>

        {/* Select Filter */}
        <Select value={filters.tipo || "all"} onValueChange={...}>
            <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                <SelectValue placeholder="Filtro" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {/* ... */}
            </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {(filters.searchTerm || filters.tipo) && (
            <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
                <X className="h-4 w-4 mr-2" />
                Limpiar
            </Button>
        )}
    </div>
</div>
```

### 5. Estados de Carga
```tsx
{isLoading ? (
    <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-3 text-slate-600 dark:text-slate-400">
            Cargando datos...
        </span>
    </div>
) : /* ... */}
```

### 6. Estado Vacío
```tsx
{items.length === 0 ? (
    <div className="text-center py-16">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <Icon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            No se encontraron elementos
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            {hasFilters
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primer elemento"
            }
        </p>
        {!hasFilters && (
            <Button 
                onClick={handleCreate} 
                className="bg-gradient-to-r from-primary-blue to-primary-purple hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <Plus className="h-5 w-5 mr-2" />
                Agregar Elemento
            </Button>
        )}
    </div>
) : /* ... */}
```

### 7. Tabla
```tsx
<div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
    <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
            <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-20">
                    ID
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                    Campo
                </TableHead>
                {/* ... más headers */}
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map((item) => (
                <TableRow 
                    key={item.id} 
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                    <TableCell className="font-medium text-slate-900 dark:text-white">
                        {item.id}
                    </TableCell>
                    <TableCell className="text-slate-900 dark:text-white">
                        {item.campo}
                    </TableCell>
                    {/* ... más celdas */}
                </TableRow>
            ))}
        </TableBody>
    </Table>
</div>
```

### 8. Botones de Acción en Tabla
```tsx
<TableCell>
    <div className="flex gap-1">
        <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
            <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </Button>
        <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(item)}
            className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
            <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
        </Button>
        <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item.id)}
            disabled={isDeleting}
            className="h-8 w-8 p-0 hover:bg-error-bg dark:hover:bg-error-bg/20"
        >
            {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <X className="h-4 w-4 text-error-text dark:text-error-text" />
            )}
        </Button>
    </div>
</TableCell>
```

### 9. Badges de Estado
```tsx
const getEstadoBadge = (estado: string) => {
    const estadoConfig = {
        'activo': { color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', icon: '✅' },
        'pendiente': { color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', icon: '⏳' },
        'vencido': { color: 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text', icon: '❌' }
    }

    const config = estadoConfig[estado as keyof typeof estadoConfig] || {
        color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: '❓'
    }

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1)}
        </span>
    )
}
```

### 10. Error State
```tsx
if (error) {
    return (
        <div className="p-6 container-padding">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Título de la Página
                </h1>
            </div>
            <Card className="w-full max-w-md mx-auto border-border-light dark:border-border-dark">
                <CardContent className="pt-6">
                    <p className="text-error-text mb-4">{error}</p>
                    <Button
                        className="w-full bg-gradient-to-r from-primary-blue to-primary-purple hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
```

## 🔄 Páginas Actualizadas

✅ **Conductores** - Referencia original
✅ **Vehículos** - Actualizado con estilos unificados

## 📝 Páginas Pendientes de Actualización

Las siguientes páginas necesitan aplicar estos patrones:

- [ ] **Impuestos Vehiculares** (`/src/app/impuestos-vehiculares/page.tsx`)
- [ ] **Seguros** (`/src/app/seguros/page.tsx`)
- [ ] **Mantenimiento** (`/src/app/mantenimiento-vehiculos/page.tsx`)
- [ ] **Rutas** (`/src/app/rutas/page.tsx`)
- [ ] **Multas** (`/src/app/multas/page.tsx`)
- [ ] **Talleres** (`/src/app/talleres/page.tsx`)

## 🎯 Checklist de Actualización

Para cada página, verificar y actualizar:

1. ✅ Container principal con `container-padding`
2. ✅ Page header con gradiente en botón
3. ✅ Card con bordes y transiciones correctas
4. ✅ Input de búsqueda con estilos slate
5. ✅ Selectores con bg-white y borders correctos
6. ✅ Botón "Limpiar" con estilos de outline
7. ✅ Estado de carga con spinner y texto
8. ✅ Estado vacío con icono circular y gradientes
9. ✅ Tabla con headers bg-slate-50 y borders
10. ✅ Filas con hover slate-50 y borders
11. ✅ Botones de acción con tamaño h-8 w-8 p-0
12. ✅ Badges con success/warning/error-bg/text
13. ✅ Error state con gradiente en botón

## 🚀 Próximos Pasos

1. Aplicar estos patrones a **Impuestos** (segunda prioridad)
2. Replicar en **Seguros** y **Mantenimiento**
3. Finalizar con **Rutas**, **Multas** y **Talleres**
4. Compilar y verificar visualmente todas las páginas
