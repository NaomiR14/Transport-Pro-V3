// FilterParams type definition
interface FilterParams {
  searchTerm?: string
  [key: string]: any
}


export interface MantenimientoVehiculo {
    id: number
    placaVehiculo: string
    taller: string
    fechaEntrada: string
    fechaSalida: string | null
    tipo: string
    kilometraje: number
    paqueteMantenimiento: string
    causas: string
    costoTotal: number
    fechaPago: string | null
    observaciones: string
    estado: string
}

export interface CreateMantenimientoVehiculoRequest {
    placaVehiculo: string
    taller: string
    fechaEntrada: string
    fechaSalida: string
    tipo: string
    kilometraje: number
    paqueteMantenimiento: string
    causas: string
    costoTotal: number
    fechaPago: string | null
    observaciones: string
}

export interface UpdateMantenimientoVehiculoRequest extends CreateMantenimientoVehiculoRequest {
    placaVehiculo: string
    taller: string
    fechaEntrada: string
    fechaSalida: string
    tipo: string
    kilometraje: number
    paqueteMantenimiento: string
    causas: string
    costoTotal: number
    fechaPago: string | null
    observaciones: string
}

// Filtros
export interface MantenimientoVehiculoFilters extends FilterParams {
    searchTerm?: string
    tipo?: string
    estado?: string
}

// Estadísticas
export interface MantenimientoVehiculoStats {
    total: number
    completados: number
    enProceso: number
    pendientePago: number
    costoPendiente: number
}

// Store
export interface MantenimientoVehiculoStore {
    mantenimientos: MantenimientoVehiculo[]
    selectedMantenimiento: MantenimientoVehiculo | null
    filters: MantenimientoVehiculoFilters
    stats: MantenimientoVehiculoStats | null
    isLoading: boolean
    error: string | null

    setMantenimientos: (mantenimientos: MantenimientoVehiculo[]) => void
    setSelectedMantenimiento: (mantenimiento: MantenimientoVehiculo | null) => void
    setFilters: (filters: Partial<MantenimientoVehiculoFilters>) => void
    setStats: (stats: MantenimientoVehiculoStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    addMantenimiento: (mantenimiento: MantenimientoVehiculo) => void
    updateMantenimiento: (mantenimiento: MantenimientoVehiculo) => void
    removeMantenimiento: (mantenimientoId: number) => void
    clearFilters: () => void

    getFilteredMantenimientos: () => MantenimientoVehiculo[]
    getMantenimientoById: (id: number) => MantenimientoVehiculo | undefined
}