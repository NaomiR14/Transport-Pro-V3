import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Orden, OrdenFilters, OrdenStats, OrdenStore } from '../types/ordenes.types'

const initialFilters: OrdenFilters = {
    searchTerm: '',
    estado: '',
    placa_vehiculo: '',
}

const sortOrdenes = (ordenes: Orden[]): Orden[] =>
    [...ordenes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

const calculateOrdenStats = (ordenes: Orden[]): OrdenStats => {
    const stats = { total: ordenes.length, pendientes: 0, en_transito: 0, entregadas: 0 }
    for (const o of ordenes) {
        if (o.estado === 'pendiente') stats.pendientes++
        else if (o.estado === 'transito') stats.en_transito++
        else if (o.estado === 'entregado') stats.entregadas++
    }
    return stats
}

export const useOrdenStore = create<OrdenStore>()(
    devtools(
        immer((set, get) => ({
            ordenes: [],
            selectedOrden: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

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

            getFilteredOrdenes: (): Orden[] => {
                const { ordenes, filters } = get()
                return ordenes.filter((orden) => {
                    if (filters.searchTerm?.trim()) {
                        const term = filters.searchTerm.toLowerCase().trim()
                        const text = [
                            orden.numero_orden, orden.placa_vehiculo, orden.nombre_conductor,
                            orden.origen, orden.destino, orden.carta_porte,
                        ].filter(Boolean).join(' ').toLowerCase()
                        if (!text.includes(term)) return false
                    }
                    if (filters.estado && orden.estado !== filters.estado) return false
                    if (filters.placa_vehiculo && orden.placa_vehiculo !== filters.placa_vehiculo) return false
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
