// FilterParams type definition
interface FilterParams {
  searchTerm?: string
  [key: string]: any
}

export interface Vehicle {
    id: string
    type: string
    brand: string
    model: string
    licensePlate: string
    serialNumber: string
    color: string
    year: number
    maxLoadCapacity: number
    // vehicleState ELIMINADO - solo se usa estadoCalculado
    maintenanceData: {
        maintenanceCycle?: number
        initialKm?: number
        prevMaintenanceKm?: number
        currentKm?: number
        remainingMaintenanceKm?: number
        maintenanceStatus?: string
    }
    // Campos calculados desde la vista vehicles_with_calculated_stats
    calculatedData?: {
        cicloMantenimiento: number
        kmInicial: number
        ultimoKmPreventivo: number
        ultimoKmOdometro: number
        estadoSeguro: string
        fechaVencimientoSeguro: string | null
        kmsRestantesMantenimiento: number
        porcentajeCicloUsado: number
        estadoCalculado: string
        alertaMantenimiento: string
        tieneMantenimientoActivo: boolean
        tieneSeguroVencido: boolean
    }
}

// Para crear un nuevo vehículo (no incluye vehicleState, se asigna "activo" por defecto)
export interface CreateVehicleRequest {
    type: string
    brand: string
    model: string
    licensePlate: string
    serialNumber: string
    color: string
    year: number
    maxLoadCapacity: number
    maintenanceData: {
        maintenanceCycle: number  // Requerido
        initialKm: number         // Requerido
    }
}

// Para actualizar un vehículo existente (sin vehicleState, será calculado)
export interface UpdateVehicleRequest {
    type: string
    brand: string
    model: string
    licensePlate: string
    serialNumber: string
    color: string
    year: number
    maxLoadCapacity: number
    // vehicleState se elimina - será siempre calculado desde la vista
    maintenanceData: {
        maintenanceCycle: number
        initialKm: number
    }
}

export interface VehicleFilters extends FilterParams {
    searchTerm?: string
    estadoCalculado?: string  // Cambio de vehicleState a estadoCalculado
    maintenanceStatus?: boolean
    type?: string
    brand?: string
    yearMin?: number
    yearMax?: number
}

export interface VehicleStats {
    total: number
    available: number
    inMaintenance: number
    requierenMantenimiento: number
}

// Estado del store de Zustand
export interface VehicleStore {
    // Estado
    vehicles: Vehicle[]
    selectedVehicle: Vehicle | null
    filters: VehicleFilters
    stats: VehicleStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setVehicles: (vehicles: Vehicle[]) => void
    setSelectedVehicle: (vehicle: Vehicle | null) => void
    setFilters: (filters: Partial<VehicleFilters>) => void
    setStats: (stats: VehicleStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Acciones de negocio
    addVehicle: (vehicle: Vehicle) => void
    updateVehicle: (vehicle: Vehicle) => void
    removeVehicle: (vehicleId: string) => void
    clearFilters: () => void

    // Computed properties
    getFilteredVehicles: () => Vehicle[]
    getVehicleById: (id: string) => Vehicle | undefined
    recalculateMaintenance: () => void

}