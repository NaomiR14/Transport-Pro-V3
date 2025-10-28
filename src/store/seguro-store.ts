// src/store/seguro-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { SeguroVehiculo, SeguroFilters, SeguroStats, SeguroStore } from '@/types/seguros-types'

// Filtros iniciales
const initialFilters: SeguroFilters = {
    searchTerm: '',
    estado_poliza: '',
}

// Función helper para ordenar seguros
const sortSeguros = (seguros: SeguroVehiculo[]): SeguroVehiculo[] => {
    const copy = [...seguros]
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

// Función para calcular estadísticas
const calculateSeguroStats = (seguros: SeguroVehiculo[]): SeguroStats => {
    const total = seguros.length
    const vigentes = seguros.filter(s => s.estado_poliza === 'vigente').length
    const por_vencer = seguros.filter(s => s.estado_poliza === 'por_vencer').length
    const vencidas = seguros.filter(s => s.estado_poliza === 'vencida').length

    return {
        total,
        vigentes,
        por_vencer,
        vencidas,
    }
}

// FUNCIÓN PRINCIPAL PARA CALCULAR CAMPOS ADICIONALES
const calculateSeguroFields = (seguro: SeguroVehiculo): SeguroVehiculo => {
    // Calcular días restantes
    const fechaVencimiento = new Date(seguro.fecha_vencimiento)
    const hoy = new Date()
    const diffTime = fechaVencimiento.getTime() - hoy.getTime()
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return {
        ...seguro,
        dias_restantes: diasRestantes
    }
}

// Función para aplicar cálculos a todos los seguros
const applySeguroCalculations = (seguros: SeguroVehiculo[]): SeguroVehiculo[] => {
    return seguros.map(calculateSeguroFields)
}

export const useSeguroStore = create<SeguroStore>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            seguros: [],
            selectedSeguro: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones básicas (sincrónicas)
            setSeguros: (seguros: SeguroVehiculo[]) =>
                set((state) => {
                    const segurosWithCalculations = applySeguroCalculations(seguros)
                    state.seguros = sortSeguros(segurosWithCalculations)
                    state.stats = calculateSeguroStats(state.seguros)
                }),

            setSelectedSeguro: (seguro: SeguroVehiculo | null) =>
                set((state) => {
                    state.selectedSeguro = seguro ? calculateSeguroFields(seguro) : null
                }),

            setFilters: (newFilters: Partial<SeguroFilters>) =>
                set((state) => {
                    state.filters = { ...state.filters, ...newFilters }
                }),

            setStats: (stats: SeguroStats) =>
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
            addSeguro: (seguro: SeguroVehiculo) =>
                set((state) => {
                    const seguroWithCalculations = calculateSeguroFields(seguro)
                    state.seguros.push(seguroWithCalculations)
                    state.seguros = sortSeguros(state.seguros)
                    state.stats = calculateSeguroStats(state.seguros)
                }),

            updateSeguro: (updatedSeguro: SeguroVehiculo) =>
                set((state) => {
                    const index = state.seguros.findIndex(
                        s => s.id === updatedSeguro.id
                    )
                    if (index !== -1) {
                        const seguroWithCalculations = calculateSeguroFields(updatedSeguro)
                        state.seguros[index] = seguroWithCalculations
                        state.seguros = sortSeguros(state.seguros)
                        state.stats = calculateSeguroStats(state.seguros)
                    }
                    // Actualizar selectedSeguro si es el que se está editando
                    if (state.selectedSeguro?.id === updatedSeguro.id) {
                        state.selectedSeguro = calculateSeguroFields(updatedSeguro)
                    }
                }),

            removeSeguro: (seguroId: string) =>
                set((state) => {
                    state.seguros = state.seguros.filter(s => s.id !== seguroId)
                    state.stats = calculateSeguroStats(state.seguros)
                    // Limpiar selectedSeguro si es el que se eliminó
                    if (state.selectedSeguro?.id === seguroId) {
                        state.selectedSeguro = null
                    }
                }),

            clearFilters: () =>
                set((state) => {
                    state.filters = initialFilters
                }),

            // Computed properties
            getFilteredSeguros: (): SeguroVehiculo[] => {
                const { seguros, filters } = get()

                return seguros.filter((seguro) => {
                    // Filtro de búsqueda por texto
                    if (filters.searchTerm && filters.searchTerm.trim()) {
                        const searchTerm = filters.searchTerm.toLowerCase().trim();

                        // Crear array de campos de búsqueda
                        const searchableFields = [
                            seguro.id || '',
                            seguro.placa_vehiculo || '',
                            seguro.aseguradora || '',
                            seguro.poliza_seguro || '',
                        ].filter(Boolean);

                        const searchableText = searchableFields.join(' ').toLowerCase();

                        if (!searchableText.includes(searchTerm)) {
                            return false;
                        }
                    }

                    // Filtro por estado de póliza
                    if (filters.estado_poliza && seguro.estado_poliza !== filters.estado_poliza) {
                        return false;
                    }

                    return true
                })
            },

            getSeguroById: (id: string): SeguroVehiculo | undefined => {
                const { seguros } = get()
                return seguros.find(s => s.id === id)
            },
        })),
        {
            name: 'seguro-store',
            partialize: (state: SeguroStore) => ({
                filters: state.filters,
            }),
        }
    )
)