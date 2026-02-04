// FilterParams type definition
interface FilterParams {
  searchTerm?: string
  [key: string]: any
}

export interface RutaViaje {
    id: string
    fecha_salida: string
    fecha_llegada: string
    placa_vehiculo: string
    estado_vehiculo: "activo" | "inactivo" | "mantenimiento" | null
    conductor: string
    origen: string
    destino: string
    kms_inicial: number
    kms_final: number
    kms_recorridos: number
    peso_carga_kg: number
    costo_por_kg: number
    ingreso_total: number
    estacion_combustible: string
    tipo_combustible: string
    precio_por_galon: number
    total_combustible: number
    gasto_peajes: number
    gasto_comidas: number
    otros_gastos: number
    gasto_total: number
    volumen_combustible_gal: number
    recorrido_por_galon: number
    ingreso_por_km: number
    observaciones: string
}

export interface CreateRutaViajeRequest {
    fecha_salida: string
    fecha_llegada: string
    placa_vehiculo: string
    conductor: string
    origen: string
    destino: string
    kms_inicial: number
    kms_final: number
    peso_carga_kg: number
    costo_por_kg: number
    estacion_combustible: string
    tipo_combustible: string
    precio_por_galon: number
    volumen_combustible_gal: number
    total_combustible: number
    gasto_peajes: number
    gasto_comidas: number
    otros_gastos: number
    observaciones: string
}

export interface UpdateRutaViajeRequest extends Partial<CreateRutaViajeRequest> {
    fecha_salida: string
    fecha_llegada: string
    placa_vehiculo: string
    conductor: string
    origen: string
    destino: string
    kms_inicial: number
    kms_final: number
    peso_carga_kg: number
    costo_por_kg: number
    estacion_combustible: string
    tipo_combustible: string
    precio_por_galon: number
    volumen_combustible_gal: number
    total_combustible: number
    gasto_peajes: number
    gasto_comidas: number
    otros_gastos: number
    observaciones: string
}

export interface RutaViajeFilters extends FilterParams {
    searchTerm?: string
    placa_vehiculo?: string
    conductor?: string
    fecha_desde?: string
    fecha_hasta?: string
}

export interface RutaViajeStats {
    total: number
    total_ingresos: number
    total_gastos: number
    ganancia_neta: number
    kms_totales: number
}

// Estado del store de Zustand
export interface RutaViajeStore {
    // Estado
    rutas: RutaViaje[]
    selectedRuta: RutaViaje | null
    filters: RutaViajeFilters
    stats: RutaViajeStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setRutas: (rutas: RutaViaje[]) => void
    setSelectedRuta: (ruta: RutaViaje | null) => void
    setFilters: (filters: Partial<RutaViajeFilters>) => void
    setStats: (stats: RutaViajeStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    
    // Acciones de negocio
    addRuta: (ruta: RutaViaje) => void
    updateRuta: (ruta: RutaViaje) => void
    removeRuta: (rutaId: string) => void
    clearFilters: () => void
    
    // Computed properties
    getFilteredRutas: () => RutaViaje[]
    getRutaById: (id: string) => RutaViaje | undefined
}