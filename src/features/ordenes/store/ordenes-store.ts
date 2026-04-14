import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Orden, OrdenFilters, OrdenStats, OrdenStore } from '../types/ordenes.types'

// Filtros iniciales
const initialFilters: OrdenFilters = {
    searchTerm: '',
    estado: '',
    placa_vehiculo: '',
}

// Función helper para ordenar órdenes por fecha de creación (más recientes primero)
const sortOrdenes = (ordenes: Orden[]): Orden[] => {
    const copy = [...ordenes]
    return copy.sort((a, b) => {
        const fechaA = new Date(a.created_at).getTime()
        const fechaB = new Date(b.created_at).getTime()
        return fechaB - fechaA
    })
}

// Función para calcular estadísticas
const calculateOrdenStats = (ordenes: Orden[]): OrdenStats => {
    return {
        total: ordenes.length,
        pendientes: ordenes.filter(o => o.estado === 'pendiente').length,
        en_transito: ordenes.filter(o => o.estado === 'transito').length,
        entregadas: ordenes.filter(o => o.estado === 'entregado').length,
    }
}

export const useOrdenStore = create<OrdenStore>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            ordenes: [],
            selectedOrden: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones básicas
            setOrdenes: (ordenes: Orden[]) =>
                set((state) => {
                    state.ordenes = sortOrdenes(ordenes)
                    state.stats = calculateOrdenStats(state.ordenes)
                }),

            setSelectedOrden: (orden: Orden | null) =>
                set((state) => {
                    state.selectedOrden = orden
                }),

            setFilters: (newFilters: Partial<OrdenFilters>) =>
                set((state) => {
                    state.filters = { ...state.filters, ...newFilters }
                }),

            setStats: (stats: OrdenStats) =>
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
            addOrden: (orden: Orden) =>
                set((state) => {
                    state.ordenes.push(orden)
                    state.ordenes = sortOrdenes(state.ordenes)
                    state.stats = calculateOrdenStats(state.ordenes)
                }),

            updateOrden: (updatedOrden: Orden) =>
                set((state) => {
                    const index = state.ordenes.findIndex(o => o.id === updatedOrden.id)
                    if (index !== -1) {
                        state.ordenes[index] = updatedOrden
                        state.ordenes = sortOrdenes(state.ordenes)
                        state.stats = calculateOrdenStats(state.ordenes)
                    }
                    if (state.selectedOrden?.id === updatedOrden.id) {
                        state.selectedOrden = updatedOrden
                    }
                }),

            removeOrden: (ordenId: string) =>
                set((state) => {
                    state.ordenes = state.ordenes.filter(o => o.id !== ordenId)
                    state.stats = calculateOrdenStats(state.ordenes)
                    if (state.selectedOrden?.id === ordenId) {
                        state.selectedOrden = null
                    }
                }),

            clearFilters: () =>
                set((state) => {
                    state.filters = initialFilters
                }),

            // Computed properties
            getFilteredOrdenes: (): Orden[] => {
                const { ordenes, filters } = get()

                return ordenes.filter((orden) => {
                    // Filtro de búsqueda por texto
                    if (filters.searchTerm && filters.searchTerm.trim()) {
                        const term = filters.searchTerm.toLowerCase().trim()
                        const searchableFields = [
                            orden.numero_orden || '',
                            orden.placa_vehiculo || '',
                            orden.nombre_conductor || '',
                            orden.origen || '',
                            orden.destino || '',
                            orden.carta_porte || '',
                        ].filter(Boolean)

                        const searchableText = searchableFields.join(' ').toLowerCase()
                        if (!searchableText.includes(term)) {
                            return false
                        }
                    }

                    // Filtro por estado
                    if (filters.estado && orden.estado !== filters.estado) {
                        return false
                    }

                    // Filtro por vehículo
                    if (filters.placa_vehiculo && orden.placa_vehiculo !== filters.placa_vehiculo) {
                        return false
                    }

                    return true
                })
            },

            getOrdenById: (id: string): Orden | undefined => {
                const { ordenes } = get()
                return ordenes.find(o => o.id === id)
            },
        })),
        {
            name: 'orden-store',
            partialize: (state: OrdenStore) => ({
                filters: state.filters,
            }),
        }
    )
)
