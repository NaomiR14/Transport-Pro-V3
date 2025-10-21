// src/store/vehicle-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Vehicle, VehicleFilters, VehicleStats, VehicleStore } from '@/types/vehicles-types'

const initialFilters: VehicleFilters = {
    searchTerm: '',
    vehicleState: undefined,
    maintenanceStatus: undefined,
}

// Función helper para ordenar vehículos
const sortVehicles = (vehicles: Vehicle[]): Vehicle[] => {
    const copy = [...vehicles]
    return copy.sort((a, b) => {
        const idA = a.id?.toString() || '0'
        const idB = b.id?.toString() || '0'

        // Ordenar numéricamente si son números
        const numA = parseInt(idA)
        const numB = parseInt(idB)

        if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB
        }

        // Si no, ordenar alfabéticamente
        return idA.localeCompare(idB)
    })
}

export const calculateStats = (vehicles: Vehicle[]): VehicleStats => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.vehicleState === 'Disponible').length
    const inMaintenance = vehicles.filter(v => v.maintenanceStatus === 'en_mantenimiento').length
    const requierenMantenimiento = vehicles.filter(v =>
        v.maintenanceStatus === 'requiere_mantenimiento').length

    return {
        total,
        available,
        inMaintenance,
        requierenMantenimiento,
    }
}

// FUNCIÓN PRINCIPAL PARA CALCULAR CAMPOS DE MANTENIMIENTO
const calculateMaintenanceFields = (vehicle: Vehicle): Vehicle => {
    const maintenanceCycle = vehicle.maintenanceCycle || 5000 // Valor por defecto de 5000 km
    const currentKm = vehicle.currentKm || 0
    const prevMaintenanceKm = vehicle.prevMaintenanceKm || vehicle.initialKm || 0

    // Cálculo de remainingMaintenanceKm
    // (km del último mantenimiento + ciclo) - km actual
    const nextMaintenanceKm = prevMaintenanceKm + maintenanceCycle
    const remainingMaintenanceKm = Math.max(0, nextMaintenanceKm - currentKm)

    // Cálculo de maintenanceStatus
    let maintenanceStatus = 'Al día'
    if (remainingMaintenanceKm <= 0) {
        maintenanceStatus = 'Vencido'
    } else if (remainingMaintenanceKm <= 500) {
        maintenanceStatus = 'Urgente'
    } else if (remainingMaintenanceKm <= 1000) {
        maintenanceStatus = 'Próximo'
    }

    return {
        ...vehicle,
        remainingMaintenanceKm,
        maintenanceStatus,
        // Asegurar que los campos calculados estén presentes
        maintenanceCycle,
        initialKm: vehicle.initialKm || 0,
        prevMaintenanceKm,
        currentKm,
    }
}

// Función para aplicar cálculos a todos los vehículos
const applyMaintenanceCalculations = (vehicles: Vehicle[]): Vehicle[] => {
    return vehicles.map(calculateMaintenanceFields)
}

export const useVehicleStore = create<VehicleStore>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            vehicles: [],
            selectedVehicle: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones básicas
            setVehicles: (vehicles: Vehicle[]) =>
                set((state) => {
                    const vehiclesWithCalculations = applyMaintenanceCalculations(vehicles)
                    state.vehicles = sortVehicles(vehiclesWithCalculations)
                    state.stats = calculateStats(state.vehicles)
                }),

            setSelectedVehicle: (vehicle: Vehicle | null) =>
                set((state) => {
                    state.selectedVehicle = vehicle ? calculateMaintenanceFields(vehicle) : null
                }),

            setFilters: (newFilters: Partial<VehicleFilters>) =>
                set((state) => {
                    state.filters = { ...state.filters, ...newFilters }
                }),

            setStats: (stats: VehicleStats) =>
                set((state) => {
                    state.stats = stats
                }),

            setLoading: (loading: boolean) =>
                set((state) => {
                    state.isLoading = loading
                }),

            setError: (error: string | null) =>
                set((state) => {
                    state.error = error
                }),

            // Acciones de negocio
            addVehicle: (vehicle: Vehicle) =>
                set((state) => {
                    const vehicleWithCalculations = calculateMaintenanceFields(vehicle)
                    state.vehicles.push(vehicleWithCalculations)
                    state.vehicles = sortVehicles(state.vehicles)
                    state.stats = calculateStats(state.vehicles)
                }),

            updateVehicle: (updatedVehicle: Vehicle) =>
                set((state) => {
                    const index = state.vehicles.findIndex(
                        v => v.id === updatedVehicle.id
                    )
                    if (index !== -1) {
                        const vehicleWithCalculations = calculateMaintenanceFields(updatedVehicle)
                        state.vehicles[index] = vehicleWithCalculations
                        state.vehicles = sortVehicles(state.vehicles)
                        state.stats = calculateStats(state.vehicles)
                    }
                    // Actualizar selectedVehicle si es el que se está editando
                    if (state.selectedVehicle?.id === updatedVehicle.id) {
                        state.selectedVehicle = calculateMaintenanceFields(updatedVehicle)
                    }
                }),

            removeVehicle: (vehicleId: string) =>
                set((state) => {
                    state.vehicles = state.vehicles.filter(v => v.id !== vehicleId)
                    state.stats = calculateStats(state.vehicles)
                    // Limpiar selectedVehicle si es el que se eliminó
                    if (state.selectedVehicle?.id === vehicleId) {
                        state.selectedVehicle = null
                    }
                }),

            clearFilters: () =>
                set((state) => {
                    state.filters = initialFilters
                }),

            // Computed properties
            getFilteredVehicles: (): Vehicle[] => {
                const { vehicles, filters } = get()

                return vehicles.filter((vehicle) => {
                    // Filtro de búsqueda por texto
                    if (filters.searchTerm && filters.searchTerm.trim()) {
                        const searchTerm = filters.searchTerm.toLowerCase().trim();
                        const searchableFields = [
                            vehicle.type || '',
                            vehicle.brand || '',
                            vehicle.model || '',
                            vehicle.licensePlate || '',
                            vehicle.serialNumber || '',
                            vehicle.color || '',
                            vehicle.vehicleState || '',
                        ].filter(Boolean);

                        const searchableText = searchableFields.join(' ').toLowerCase();

                        if (!searchableText.includes(searchTerm)) {
                            return false
                        }
                    }

                    // Filtro por tipo
                    if (filters.type && vehicle.type !== filters.type) {
                        return false;
                    }

                    // Filtro por marca
                    if (filters.brand && vehicle.brand !== filters.brand) {
                        return false;
                    }

                    // Filtro por estado
                    if (filters.vehicleState && vehicle.vehicleState !== filters.vehicleState) {
                        return false;
                    }

                    // Filtro por año mínimo
                    if (filters.yearMin !== undefined && vehicle.year < filters.yearMin) {
                        return false;
                    }

                    // Filtro por año máximo
                    if (filters.yearMax !== undefined && vehicle.year > filters.yearMax) {
                        return false;
                    }

                    return true
                })
            },

            getVehicleById: (id: string): Vehicle | undefined => {
                const { vehicles } = get()
                return vehicles.find(v => v.id === id)
            },

            // Método para recalculcar mantenimiento (útil cuando cambian datos externos)
            recalculateMaintenance: () =>
                set((state) => {
                    state.vehicles = applyMaintenanceCalculations(state.vehicles)
                    state.vehicles = sortVehicles(state.vehicles)
                    // Recalcular selectedVehicle si existe
                    if (state.selectedVehicle) {
                        state.selectedVehicle = calculateMaintenanceFields(state.selectedVehicle)
                    }
                }),
        })),

        {
            name: 'vehicle-store',
            partialize: (state: VehicleStore) => ({
                filters: state.filters,
            }),
        }
    )
)