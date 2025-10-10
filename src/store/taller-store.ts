// src/store/taller-store.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Taller, TallerFilters, TallerStats } from '@/types/taller-types'

// CORRECCIÓN 1: Asegurar que initialFilters tenga firma de índice
const initialFilters: TallerFilters = {
  searchTerm: '',
  activo: undefined,
  especialidad: undefined,
  calificacionMinima: undefined,
} as TallerFilters; // ← Añadir casting para compatibilidad

const calculateStats = (talleres: Taller[]): TallerStats => {
  const total = talleres.length
  const activos = talleres.filter(t => t.activo).length
  const inactivos = total - activos
  const calificacionPromedio = total > 0 
    ? talleres.reduce((sum, t) => sum + (t.calificacion ?? 0), 0) / total 
    : 0
  const especialidadesUnicas = new Set(talleres.flatMap(t => t.especialidades || [])) // ← Añadir fallback para array
  const totalEspecialidades = especialidadesUnicas.size

  return {
    total,
    activos,
    inactivos,
    calificacionPromedio,
    totalEspecialidades,
  }
}

interface TallerStoreActions {
  setTalleres: (talleres: Taller[]) => void
  setSelectedTaller: (taller: Taller | null) => void
  setFilters: (newFilters: Partial<TallerFilters>) => void
  setStats: (stats: TallerStats | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addTaller: (taller: Taller) => void
  updateTaller: (updatedTaller: Taller) => void
  removeTaller: (tallerId: string) => void  // ← CORRECCIÓN 2: Solo string, no number
  clearFilters: () => void
  getFilteredTalleres: () => Taller[]
  getTallerById: (id: string) => Taller | undefined  // ← CORRECCIÓN 3: Solo string
}

interface TallerStoreState {
  talleres: Taller[]
  selectedTaller: Taller | null
  filters: TallerFilters
  stats: TallerStats | null
  isLoading: boolean
  error: string | null
}

export const useTallerStore = create<TallerStoreState & TallerStoreActions>()(
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
          state.talleres = talleres
          state.stats = calculateStats(talleres)
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
              taller.numero_taller || '',
              taller.name || '',
              taller.contactPerson || '',
              taller.phoneNumber || '',
              taller.email || '',
              ...(taller.especialidades ?? [])
            ].filter(Boolean); // ← Eliminar strings vacíos
            
            const searchableText = searchableFields.join(' ').toLowerCase();
            
            if (!searchableText.includes(searchTerm)) {
              return false;
            }
          }
        
          // Filtro por estado activo (mejorado)
          if (filters.activo !== undefined && filters.activo !== null) {
            if (taller.activo !== filters.activo) {
              return false;
            }
          }
        
          // Filtro por especialidad (mejorado)
          if (filters.especialidad && filters.especialidad.trim()) {
            const especialidadBuscada = filters.especialidad.toLowerCase().trim();
            const tieneEspecialidad = taller.especialidades?.some(
              esp => esp.toLowerCase().trim() === especialidadBuscada
            );
            
            if (!tieneEspecialidad) {
              return false;
            }
          }
        
          // Filtro por calificación mínima (mejorado)
          if (filters.calificacionMinima !== undefined && filters.calificacionMinima !== null) {
            const calificacionTaller = taller.calificacion ?? 0;
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
      partialize: (state: TallerStoreState) => ({ 
        filters: state.filters,
        // No persistir talleres ya que vienen del servidor
      }),
    }
  )
)