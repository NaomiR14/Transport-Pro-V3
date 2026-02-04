import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Conductor, ConductorFilters, ConductorStats, ConductorStore } from '../types/conductor.types'

// Filtros iniciales
const initialFilters: ConductorFilters = {
    searchTerm: '',
    estado_licencia: '',
    activo: undefined,
}

// Función helper para ordenar conductores
const sortConductores = (conductores: Conductor[]): Conductor[] => {
    const copy = [...conductores]
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
const calculateConductorStats = (conductores: Conductor[]): ConductorStats => {
    const total = conductores.length
    const activos = conductores.filter(s => s.activo).length
    const licencias_vencidas = conductores.filter(s => s.estado_licencia === 'vencida').length
    const calificacion_promedio = total > 0
        ? conductores.reduce((sum, conductor) => sum + conductor.calificacion, 0) / total
        : 0

    return {
        total,
        activos,
        licencias_vencidas,
        calificacion_promedio: Number(calificacion_promedio.toFixed(1))
    }
}

// FUNCIÓN PARA CALCULAR CAMPOS ADICIONALES SOLO FRONTEND (no calculados por DB)
const calculateConductorFields = (conductor: Conductor): Conductor => {
    // Calcular días restantes para licencia (solo para UI, no afecta DB)
    const fechaVencimiento = new Date(conductor.fecha_vencimiento_licencia)
    const hoy = new Date()
    const diffTime = fechaVencimiento.getTime() - hoy.getTime()
    const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    // NOTA: estado_licencia ya viene calculado por trigger de Supabase, no lo recalculamos
    return {
        ...conductor,
        dias_restantes_licencia: diasRestantes,
        // estado_licencia: viene de DB trigger automáticamente
    }
}

// Función para aplicar cálculos a todos los conductores
const applyConductorCalculations = (conductores: Conductor[]): Conductor[] => {
    return conductores.map(calculateConductorFields)
}

export const useConductorStore = create<ConductorStore>()(
    devtools(
        immer((set, get) => ({
            // Estado inicial
            conductores: [],
            selectedConductor: null,
            filters: initialFilters,
            stats: null,
            isLoading: false,
            error: null,

            // Acciones básicas (sincrónicas)
            setConductores: (conductores: Conductor[]) =>
                set((state) => {
                    const conductoresWithCalculations = applyConductorCalculations(conductores)
                    state.conductores = sortConductores(conductoresWithCalculations)
                    state.stats = calculateConductorStats(state.conductores)
                }),

            setSelectedConductor: (conductor: Conductor | null) =>
                set((state) => {
                    state.selectedConductor = conductor ? calculateConductorFields(conductor) : null
                }),

            setFilters: (newFilters: Partial<ConductorFilters>) =>
                set((state) => {
                    state.filters = { ...state.filters, ...newFilters }
                }),

            setStats: (stats: ConductorStats) =>
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
            addConductor: (conductor: Conductor) =>
                set((state) => {
                    const conductorWithCalculations = calculateConductorFields(conductor)
                    state.conductores.push(conductorWithCalculations)
                    state.conductores = sortConductores(state.conductores)
                    state.stats = calculateConductorStats(state.conductores)
                }),

            updateConductor: (updatedConductor: Conductor) =>
                set((state) => {
                    const index = state.conductores.findIndex(
                        s => s.id === updatedConductor.id
                    )
                    if (index !== -1) {
                        const conductorWithCalculations = calculateConductorFields(updatedConductor)
                        state.conductores[index] = conductorWithCalculations
                        state.conductores = sortConductores(state.conductores)
                        state.stats = calculateConductorStats(state.conductores)
                    }
                    // Actualizar selectedConductor si es el que se está editando
                    if (state.selectedConductor?.id === updatedConductor.id) {
                        state.selectedConductor = calculateConductorFields(updatedConductor)
                    }
                }),

            removeConductor: (conductorId: string) =>
                set((state) => {
                    state.conductores = state.conductores.filter(s => s.id !== conductorId)
                    state.stats = calculateConductorStats(state.conductores)
                    // Limpiar selectedConductor si es el que se eliminó
                    if (state.selectedConductor?.id === conductorId) {
                        state.selectedConductor = null
                    }
                }),

            clearFilters: () =>
                set((state) => {
                    state.filters = initialFilters
                }),

            // Computed properties
            getFilteredConductores: (): Conductor[] => {
                const { conductores, filters } = get()

                return conductores.filter((conductor) => {
                    // Filtro de búsqueda por texto
                    if (filters.searchTerm && filters.searchTerm.trim()) {
                        const searchTerm = filters.searchTerm.toLowerCase().trim();

                        // Crear array de campos de búsqueda
                        const searchableFields = [
                            conductor.id || '',
                            conductor.documento_identidad || '',
                            conductor.nombre_conductor || '',
                            conductor.numero_licencia || '',
                            conductor.email || '',
                            conductor.telefono || '',
                        ].filter(Boolean);

                        const searchableText = searchableFields.join(' ').toLowerCase();

                        if (!searchableText.includes(searchTerm)) {
                            return false;
                        }
                    }

                    // Filtro por estado de licencia
                    if (filters.estado_licencia && conductor.estado_licencia !== filters.estado_licencia) {
                        return false;
                    }

                    // Filtro por estado activo
                    if (filters.activo !== undefined && conductor.activo !== filters.activo) {
                        return false;
                    }

                    return true
                })
            },

            getConductorById: (id: string): Conductor | undefined => {
                const { conductores } = get()
                return conductores.find(s => s.id === id)
            },
        })),
        {
            name: 'conductor-store',
            partialize: (state: ConductorStore) => ({
                filters: state.filters,
            }),
        }
    )
)