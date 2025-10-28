// src/store/impuesto-vehicular-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { ImpuestoVehicular, ImpuestoFilters, ImpuestoStats, ImpuestoStore } from '@/types/impuesto-vehicular-types'

// Filtros iniciales
const initialFilters: ImpuestoFilters = {
    searchTerm: '',
    placa_vehiculo: '',
    estado_pago: '',
}

// Función helper para ordenar impuestos
const sortImpuestos = (impuestos: ImpuestoVehicular[]): ImpuestoVehicular[] => {
    const copy = [...impuestos]
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
const calculateImpuestoStats = (impuestos: ImpuestoVehicular[]): ImpuestoStats => {
    const total = impuestos.length
    const pagados = impuestos.filter(s => s.estado_pago === 'pagado').length
    const pendientes = impuestos.filter(s => s.estado_pago === 'pendiente').length
    const vencidos = impuestos.filter(s => s.estado_pago === 'vencido').length
    const total_pagado = impuestos
        .filter(s => s.estado_pago === 'pagado')
        .reduce((sum, impuesto) => sum + impuesto.impuesto_monto, 0)

    return {
        total,
        pagados,
        pendientes,
        vencidos,
        total_pagado,
    }
}

export const useImpuestoStore = create<ImpuestoStore>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            impuestos: [],
            selectedImpuesto: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones básicas (sincrónicas)
            setImpuestos: (impuestos: ImpuestoVehicular[]) =>
                set((state) => {
                    state.impuestos = sortImpuestos(impuestos)
                    state.stats = calculateImpuestoStats(state.impuestos)
                }),

            setSelectedImpuesto: (impuesto: ImpuestoVehicular | null) =>
                set((state) => {
                    state.selectedImpuesto = impuesto
                }),

            setFilters: (newFilters: Partial<ImpuestoFilters>) =>
                set((state) => {
                    state.filters = { ...state.filters, ...newFilters }
                }),

            setStats: (stats: ImpuestoStats) =>
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
            addImpuesto: (impuesto: ImpuestoVehicular) =>
                set((state) => {
                    state.impuestos.push(impuesto)
                    state.impuestos = sortImpuestos(state.impuestos)
                    state.stats = calculateImpuestoStats(state.impuestos)
                }),

            updateImpuesto: (updatedImpuesto: ImpuestoVehicular) =>
                set((state) => {
                    const index = state.impuestos.findIndex(
                        s => s.id === updatedImpuesto.id
                    )
                    if (index !== -1) {
                        state.impuestos[index] = updatedImpuesto
                        state.impuestos = sortImpuestos(state.impuestos)
                        state.stats = calculateImpuestoStats(state.impuestos)
                    }
                    // Actualizar selectedImpuesto si es el que se está editando
                    if (state.selectedImpuesto?.id === updatedImpuesto.id) {
                        state.selectedImpuesto = updatedImpuesto
                    }
                }),

            removeImpuesto: (impuestoId: string) =>
                set((state) => {
                    state.impuestos = state.impuestos.filter(s => s.id !== impuestoId)
                    state.stats = calculateImpuestoStats(state.impuestos)
                    // Limpiar selectedImpuesto si es el que se eliminó
                    if (state.selectedImpuesto?.id === impuestoId) {
                        state.selectedImpuesto = null
                    }
                }),

            clearFilters: () =>
                set((state) => {
                    state.filters = initialFilters
                }),

            // Computed properties
            getFilteredImpuestos: (): ImpuestoVehicular[] => {
                const { impuestos, filters } = get()

                return impuestos.filter((impuesto) => {
                    // Filtro de búsqueda por texto
                    if (filters.searchTerm && filters.searchTerm.trim()) {
                        const searchTerm = filters.searchTerm.toLowerCase().trim();

                        // Crear array de campos de búsqueda
                        const searchableFields = [
                            impuesto.id || '',
                            impuesto.placa_vehiculo || '',
                            impuesto.tipo_impuesto || '',
                            impuesto.anio_impuesto.toString() || '',
                        ].filter(Boolean);

                        const searchableText = searchableFields.join(' ').toLowerCase();

                        if (!searchableText.includes(searchTerm)) {
                            return false;
                        }
                    }

                    // Filtro por placa de vehículo
                    if (filters.placa_vehiculo && impuesto.placa_vehiculo !== filters.placa_vehiculo) {
                        return false;
                    }

                    // Filtro por estado de pago
                    if (filters.estado_pago && impuesto.estado_pago !== filters.estado_pago) {
                        return false;
                    }

                    return true
                })
            },

            getImpuestoById: (id: string): ImpuestoVehicular | undefined => {
                const { impuestos } = get()
                return impuestos.find(s => s.id === id)
            },
        })),
        {
            name: 'impuesto-store',
            partialize: (state: ImpuestoStore) => ({
                filters: state.filters,
            }),
        }
    )
)