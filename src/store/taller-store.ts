// src/store/taller-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Taller, TallerFilters, TallerStats, TallerStore } from '@/types/taller-types'

// CORRECCIÓN 1: Asegurar que initialFilters tenga firma de índice
const initialFilters: TallerFilters = {
  searchTerm: '',
  calificacionMinima: undefined,
} //as TallerFilters; // ← Añadir casting para compatibilidad

// Función helper para ordenar talleres (CREAR COPIA antes de ordenar)
const sortTalleres = (talleres: Taller[]): Taller[] => {
  const copy = [...talleres] // ← CREAR COPIA para evitar modificar array original
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

export const calculateStats = (talleres: Taller[]): TallerStats => {
  const total = talleres.length
  const calificacionPromedio = total > 0
    ? talleres.reduce((sum, t) => sum + (t.rate ?? 0), 0) / total
    : 0

  console.log('Cálculo de estadísticas desde el store zustand:', { total, calificacionPromedio });

  return {
    total,
    calificacionPromedio,
  }
}

export const useTallerStore = create<TallerStore>()(
  devtools(
    immer((set, get) => ({
      // Estado inicial
      talleres: [],
      selectedTaller: null,
      filters: initialFilters,
      stats: null,
      isLoading: false,
      error: null,

      // Acciones básicas
      setTalleres: (talleres: Taller[]) =>
        set((state) => {
          state.talleres = sortTalleres(talleres)
          state.stats = calculateStats(state.talleres)
        }),

      setSelectedTaller: (taller: Taller | null) =>
        set((state) => {
          state.selectedTaller = taller
        }),

      setFilters: (newFilters: Partial<TallerFilters>) =>
        set((state) => {
          state.filters = { ...state.filters, ...newFilters }
        }),

      setStats: (stats: TallerStats | null) =>
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
      addTaller: (taller: Taller) =>
        set((state) => {
          state.talleres.push(taller)
          state.stats = calculateStats(state.talleres)
        }),

      updateTaller: (updatedTaller: Taller) =>
        set((state) => {
          const index = state.talleres.findIndex(
            t => t.id === updatedTaller.id
          )
          if (index !== -1) {
            state.talleres[index] = updatedTaller
            /// ORDENAR POR ID después de actualizar usando la función helper
            state.talleres = sortTalleres(state.talleres)
            state.stats = calculateStats(state.talleres)
          }
          // Actualizar selectedTaller si es el que se está editando
          if (state.selectedTaller?.id === updatedTaller.id) {
            state.selectedTaller = updatedTaller
          }
        }),

      removeTaller: (tallerId: string) =>  // ← CORRECCIÓN 4: Solo string
        set((state) => {
          state.talleres = state.talleres.filter(t => t.id !== tallerId)
          state.stats = calculateStats(state.talleres)
          // Limpiar selectedTaller si es el que se eliminó
          if (state.selectedTaller?.id === tallerId) {
            state.selectedTaller = null
          }
        }),

      clearFilters: () =>
        set((state) => {
          state.filters = initialFilters
        }),

      // Computed properties
      getFilteredTalleres: (): Taller[] => {
        const { talleres, filters } = get()

        return talleres.filter((taller) => {
          // Filtro de búsqueda por texto
          if (filters.searchTerm && filters.searchTerm.trim()) {
            const searchTerm = filters.searchTerm.toLowerCase().trim();

            // Crear array de campos de búsqueda con valores por defecto
            const searchableFields = [
              taller.id || '',
              taller.name || '',
              taller.address || '',
              taller.contactPerson || '',
              taller.phoneNumber || '',
              taller.email || '',
            ].filter(Boolean); // ← Eliminar strings vacíos

            const searchableText = searchableFields.join(' ').toLowerCase();

            if (!searchableText.includes(searchTerm)) {
              return false;
            }
          }

          // Filtro por calificación mínima (mejorado)
          if (filters.calificacionMinima !== undefined && filters.calificacionMinima !== null) {
            const calificacionTaller = taller.rate ?? 0;
            if (calificacionTaller < filters.calificacionMinima) {
              return false;
            }
          }

          return true
        })
      },

      getTallerById: (id: string): Taller | undefined => {  // ← CORRECCIÓN 5: Solo string
        const { talleres } = get()
        return talleres.find(t => t.id === id)
      },
    })),
    {
      name: 'taller-store',
      // Opcional: persistir solo ciertos campos
      partialize: (state: TallerStore) => ({
        filters: state.filters,
        // No persistir talleres ya que vienen del servidor
      }),
    }
  )
)