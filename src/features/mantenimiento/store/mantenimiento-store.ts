// src/store/mantenimiento-vehiculos-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
    MantenimientoVehiculo,
    MantenimientoVehiculoFilters,
    MantenimientoVehiculoStats
} from '../types/mantenimiento.types'

const initialFilters: MantenimientoVehiculoFilters = {
    searchTerm: '',
    tipo: 'all',
    estado: 'all'
}

const calculateStats = (mantenimientos: MantenimientoVehiculo[]): MantenimientoVehiculoStats => {
    const total = mantenimientos.length
    const completados = mantenimientos.filter(m => m.estado === 'Completado').length
    const enProceso = mantenimientos.filter(m => m.estado === 'En Proceso').length
    const pendientePago = mantenimientos.filter(m => m.estado === 'Pendiente Pago').length
    const costoPendiente = mantenimientos
        .filter(m => !m.fechaPago)
        .reduce((sum, m) => sum + m.costoTotal, 0)

    return {
        total,
        completados,
        enProceso,
        pendientePago,
        costoPendiente
    }
}

interface MantenimientoVehiculoStoreActions {
    setMantenimientos: (mantenimientos: MantenimientoVehiculo[]) => void
    setSelectedMantenimiento: (mantenimiento: MantenimientoVehiculo | null) => void
    setFilters: (newFilters: Partial<MantenimientoVehiculoFilters>) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    addMantenimiento: (mantenimiento: MantenimientoVehiculo) => void
    updateMantenimiento: (updatedMantenimiento: MantenimientoVehiculo) => void
    removeMantenimiento: (mantenimientoId: number) => void
    clearFilters: () => void
    getFilteredMantenimientos: () => MantenimientoVehiculo[]
    getMantenimientoById: (id: number) => MantenimientoVehiculo | undefined
}

interface MantenimientoVehiculoStoreState {
    mantenimientos: MantenimientoVehiculo[]
    selectedMantenimiento: MantenimientoVehiculo | null
    filters: MantenimientoVehiculoFilters
    stats: MantenimientoVehiculoStats | null
    isLoading: boolean
    error: string | null
}

export const useMantenimientoVehiculoStore = create<MantenimientoVehiculoStoreState & MantenimientoVehiculoStoreActions>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            mantenimientos: [],
            selectedMantenimiento: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones
            setMantenimientos: (mantenimientos: MantenimientoVehiculo[]) =>
                set((state) => {
                    state.mantenimientos = mantenimientos
                    state.stats = calculateStats(mantenimientos)
                }),

            setSelectedMantenimiento: (mantenimiento: MantenimientoVehiculo | null) =>
                set((state) => {
                    state.selectedMantenimiento = mantenimiento
                }),

            setFilters: (newFilters: Partial<MantenimientoVehiculoFilters>) =>
                set((state) => {
                    state.filters = { ...state.filters, ...newFilters }
                }),

            setLoading: (loading: boolean) =>
                set((state) => {
                    state.isLoading = loading
                }),

            setError: (error: string | null) =>
                set((state) => {
                    state.error = error
                }),

            addMantenimiento: (mantenimiento: MantenimientoVehiculo) =>
                set((state) => {
                    state.mantenimientos.unshift(mantenimiento)
                    state.stats = calculateStats(state.mantenimientos)
                }),

            updateMantenimiento: (updatedMantenimiento: MantenimientoVehiculo) =>
                set((state) => {
                    const index = state.mantenimientos.findIndex(m => m.id === updatedMantenimiento.id)
                    if (index !== -1) {
                        state.mantenimientos[index] = updatedMantenimiento
                        state.stats = calculateStats(state.mantenimientos)
                    }
                }),

            removeMantenimiento: (mantenimientoId: number) =>
                set((state) => {
                    state.mantenimientos = state.mantenimientos.filter(m => m.id !== mantenimientoId)
                    state.stats = calculateStats(state.mantenimientos)
                }),

            clearFilters: () =>
                set((state) => {
                    state.filters = initialFilters
                }),

            getFilteredMantenimientos: (): MantenimientoVehiculo[] => {
                const { mantenimientos, filters } = get()

                return mantenimientos.filter((mantenimiento) => {
                    // Filtro por término de búsqueda
                    if (filters.searchTerm) {
                        const searchTerm = filters.searchTerm.toLowerCase()
                        const searchableText = [
                            mantenimiento.placaVehiculo,
                            mantenimiento.taller,
                            mantenimiento.paqueteMantenimiento,
                            mantenimiento.causas,
                            mantenimiento.observaciones
                        ].join(' ').toLowerCase()

                        if (!searchableText.includes(searchTerm)) {
                            return false
                        }
                    }

                    // Filtro por tipo
                    if (filters.tipo && filters.tipo !== 'all' && mantenimiento.tipo !== filters.tipo) {
                        return false
                    }

                    // Filtro por estado
                    if (filters.estado && filters.estado !== 'all' && mantenimiento.estado !== filters.estado) {
                        return false
                    }

                    return true
                })
            },

            getMantenimientoById: (id: number): MantenimientoVehiculo | undefined => {
                const { mantenimientos } = get()
                return mantenimientos.find(m => m.id === id)
            },
        })),
        {
            name: 'mantenimiento-vehiculos-store',
        }
    )
)