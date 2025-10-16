import { FilterParams } from "./api-base-client-types"

export interface Taller {
    id: string
    name: string
    address: string
    phoneNumber: string
    email: string
    contactPerson: string
    openHours: string
    notes: string
    rate: number
}

export interface CreateTallerRequest {
    name: string
    address: string
    phoneNumber: string
    email: string
    contactPerson: string
    openHours: string
    notes: string
    rate: number
}


export interface TallerFilters extends FilterParams {
    searchTerm?: string
    calificacionMinima?: number
    
}

export interface TallerStats {
    total: number
    calificacionPromedio: number
}

// Estado del store de Zustand
export interface TallerStore {
    // Estado
    talleres: Taller[]
    selectedTaller: Taller | null
    filters: TallerFilters
    stats: TallerStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setTalleres: (talleres: Taller[]) => void
    setSelectedTaller: (taller: Taller | null) => void
    setFilters: (filters: Partial<TallerFilters>) => void
    setStats: (stats: TallerStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    
     // Acciones de negocio
    addTaller: (taller: Taller) => void
    updateTaller: (taller: Taller) => void
    removeTaller: (tallerId: string) => void
    clearFilters: () => void
    
    // Computed properties
    getFilteredTalleres: () => Taller[]
    getTallerById: (id: string) => Taller | undefined
}