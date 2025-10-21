import { FilterParams } from "./api-base-client-types"

export interface Vehicle {
    id: string
    type: string
    brand: string
    model: string
    licensePlate: string
    serialNumber: string
    color: string
    year: string
    maxLoadCapacity: string
    vehicleState: string
    // Campos opcionales que podrían no venir de la API
    maintenanceCycle?: number;
    initialKm?: number;
    prevMaintenanceKm?: number;
    currentKm?: number;
    remainingMaintenanceKm?: number;
    maintenanceStatus?: string;
}

export interface CreateVehicleRequest {
    type: string
    brand: string
    model: string
    licensePlate: string
    serialNumber: string
    color: string
    year: string
    maxLoadCapacity: string
    vehicleState: string
    // Campos opcionales que no vienen de la API
    maintenanceCycle?: number;
    initialKm?: number;
    prevMaintenanceKm?: number;
    currentKm?: number;
    remainingMaintenanceKm?: number;
    maintenanceStatus?: string;
}

export interface VehicleFilters extends FilterParams {
    searchTerm?: string
    vehicleState?: string
    maintenanceStatus?: boolean

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