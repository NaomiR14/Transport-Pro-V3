// src/store/ruta-viaje-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { RutaViaje, RutaViajeFilters, RutaViajeStats, RutaViajeStore } from '@/types/ruta-viaje-types'

// Filtros iniciales
const initialFilters: RutaViajeFilters = {
    searchTerm: '',
    placa_vehiculo: '',
    conductor: '',
    fecha_desde: '',
    fecha_hasta: '',
}

// Función helper para ordenar rutas por fecha (más recientes primero)
const sortRutas = (rutas: RutaViaje[]): RutaViaje[] => {
    const copy = [...rutas]
    return copy.sort((a, b) => {
        const fechaA = new Date(a.fecha_salida).getTime()
        const fechaB = new Date(b.fecha_salida).getTime()
        return fechaB - fechaA // Orden descendente (más reciente primero)
    })
}

// Función para calcular estadísticas
const calculateRutaStats = (rutas: RutaViaje[]): RutaViajeStats => {
    const total = rutas.length
    const total_ingresos = rutas.reduce((sum, ruta) => sum + ruta.ingreso_total, 0)
    const total_gastos = rutas.reduce((sum, ruta) => sum + ruta.gasto_total, 0)
    const ganancia_neta = total_ingresos - total_gastos
    const kms_totales = rutas.reduce((sum, ruta) => sum + ruta.kms_recorridos, 0)

    return {
        total,
        total_ingresos,
        total_gastos,
        ganancia_neta,
        kms_totales,
    }
}

export const useRutaViajeStore = create<RutaViajeStore>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            rutas: [],
            selectedRuta: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones básicas (sincrónicas)
            setRutas: (rutas: RutaViaje[]) =>
                set((state) => {
                    state.rutas = sortRutas(rutas)
                    state.stats = calculateRutaStats(state.rutas)
                }),

            setSelectedRuta: (ruta: RutaViaje | null) =>
                set((state) => {
                    state.selectedRuta = ruta
                }),

            setFilters: (newFilters: Partial<RutaViajeFilters>) =>
                set((state) => {
                    state.filters = { ...state.filters, ...newFilters }
                }),

            setStats: (stats: RutaViajeStats) =>
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

            // Acciones de negocio (sincrónicas)
            addRuta: (ruta: RutaViaje) =>
                set((state) => {
                    state.rutas.push(ruta)
                    state.rutas = sortRutas(state.rutas)
                    state.stats = calculateRutaStats(state.rutas)
                }),

            updateRuta: (updatedRuta: RutaViaje) =>
                set((state) => {
                    const index = state.rutas.findIndex(
                        s => s.id === updatedRuta.id
                    )
                    if (index !== -1) {
                        state.rutas[index] = updatedRuta
                        state.rutas = sortRutas(state.rutas)
                        state.stats = calculateRutaStats(state.rutas)
                    }
                    // Actualizar selectedRuta si es el que se está editando
                    if (state.selectedRuta?.id === updatedRuta.id) {
                        state.selectedRuta = updatedRuta
                    }
                }),

            removeRuta: (rutaId: string) =>
                set((state) => {
                    state.rutas = state.rutas.filter(s => s.id !== rutaId)
                    state.stats = calculateRutaStats(state.rutas)
                    // Limpiar selectedRuta si es el que se eliminó
                    if (state.selectedRuta?.id === rutaId) {
                        state.selectedRuta = null
                    }
                }),

            clearFilters: () =>
                set((state) => {
                    state.filters = initialFilters
                }),

            // Computed properties
            getFilteredRutas: (): RutaViaje[] => {
                const { rutas, filters } = get()

                return rutas.filter((ruta) => {
                    // Filtro de búsqueda por texto
                    if (filters.searchTerm && filters.searchTerm.trim()) {
                        const searchTerm = filters.searchTerm.toLowerCase().trim();

                        // Crear array de campos de búsqueda
                        const searchableFields = [
                            ruta.id || '',
                            ruta.placa_vehiculo || '',
                            ruta.conductor || '',
                            ruta.origen || '',
                            ruta.destino || '',
                            ruta.estacion_combustible || '',
                        ].filter(Boolean);

                        const searchableText = searchableFields.join(' ').toLowerCase();

                        if (!searchableText.includes(searchTerm)) {
                            return false;
                        }
                    }

                    // Filtro por placa de vehículo
                    if (filters.placa_vehiculo && ruta.placa_vehiculo !== filters.placa_vehiculo) {
                        return false;
                    }

                    // Filtro por conductor
                    if (filters.conductor && ruta.conductor !== filters.conductor) {
                        return false;
                    }

                    // Filtro por fecha desde
                    if (filters.fecha_desde && ruta.fecha_salida < filters.fecha_desde) {
                        return false;
                    }

                    // Filtro por fecha hasta
                    if (filters.fecha_hasta && ruta.fecha_salida > filters.fecha_hasta) {
                        return false;
                    }

                    return true
                })
            },

            getRutaById: (id: string): RutaViaje | undefined => {
                const { rutas } = get()
                return rutas.find(s => s.id === id)
            },
        })),
        {
            name: 'ruta-viaje-store',
            partialize: (state: RutaViajeStore) => ({
                filters: state.filters,
            }),
        }
    )
)