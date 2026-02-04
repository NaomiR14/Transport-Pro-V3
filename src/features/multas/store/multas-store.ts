// src/store/multas-conductores-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
    MultaConductor,
    MultaConductorFilters,
    MultaConductorStats,
    MultaConductorStore
} from '../types/multas.types'

const initialFilters: MultaConductorFilters = {
    searchTerm: '',
    infraccion: ''
}

const calculateStats = (multas: MultaConductor[]): MultaConductorStats => {
    const totalMultas = multas.length
    const totalPagado = multas.reduce((sum, multa) => sum + multa.importe_pagado, 0)
    const totalDebe = multas.reduce((sum, multa) => sum + multa.debe, 0)
    const multasPagadas = multas.filter(m => m.estado_pago === 'pagado').length
    const multasPendientes = multas.filter(m => m.estado_pago === 'pendiente').length
    const multasVencidas = multas.filter(m => m.estado_pago === 'vencido').length
    const multasParciales = multas.filter(m => m.estado_pago === 'parcial').length
    const porcentajeCumplimiento = totalMultas > 0 ? (multasPagadas / totalMultas) * 100 : 0

    return {
        totalMultas,
        totalPagado,
        totalDebe,
        multasPagadas,
        multasPendientes,
        multasVencidas,
        multasParciales,
        porcentajeCumplimiento
    }
}

export const useMultasConductoresStore = create<MultaConductorStore>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            multas: [],
            selectedMulta: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones
            setMultas: (multas: MultaConductor[]) =>
                set((state) => {
                    state.multas = multas
                    state.stats = calculateStats(multas)
                }),

            setSelectedMulta: (multa: MultaConductor | null) =>
                set((state) => {
                    state.selectedMulta = multa
                }),

            setFilters: (newFilters: Partial<MultaConductorFilters>) =>
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

            addMulta: (multa: MultaConductor) =>
                set((state) => {
                    state.multas.unshift(multa)
                    state.stats = calculateStats(state.multas)
                }),

            updateMulta: (updatedMulta: MultaConductor) =>
                set((state) => {
                    const index = state.multas.findIndex(m => m.id === updatedMulta.id)
                    if (index !== -1) {
                        state.multas[index] = updatedMulta
                        state.stats = calculateStats(state.multas)
                    }
                }),

            removeMulta: (id: string) =>
                set((state) => {
                    state.multas = state.multas.filter(m => m.id !== id)
                    state.stats = calculateStats(state.multas)
                }),

            getFilteredMultas: (): MultaConductor[] => {
                const { multas, filters } = get()
                return multas.filter((multa) => {
                    // Filtro por término de búsqueda
                    if (filters.searchTerm) {
                        const searchTerm = filters.searchTerm.toLowerCase()
                        const searchableText = [
                            multa.numero_viaje.toString(),
                            multa.placa_vehiculo,
                            multa.conductor,
                            multa.infraccion,
                            multa.observaciones
                        ].join(' ').toLowerCase()

                        if (!searchableText.includes(searchTerm)) {
                            return false
                        }
                    }

                    // Filtro por infracción
                    if (filters.infraccion && multa.infraccion !== filters.infraccion) {
                        return false
                    }

                    return true
                })
            },

            getMultaById: (id: string): MultaConductor | undefined => {
                const { multas } = get()
                return multas.find(m => m.id === id)
            },
        })),
        {
            name: 'multas-conductores-store',
        }
    )
)