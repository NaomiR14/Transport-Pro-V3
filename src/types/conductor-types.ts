import { FilterParams } from "./api-base-client-types"

export interface Conductor {
    id: string
    documento_identidad: string
    nombre_conductor: string
    numero_licencia: string
    direccion: string
    telefono: string
    calificacion: number
    email: string
    activo: boolean
    fecha_vencimiento_licencia: string
    estado_licencia: "vigente" | "por_vencer" | "vencida"
    // Campos calculados
    dias_restantes_licencia?: number
}

export interface CreateConductorRequest {
    documento_identidad: string
    nombre_conductor: string
    numero_licencia: string
    direccion: string
    telefono: string
    calificacion: number
    email: string
    activo: boolean
    fecha_vencimiento_licencia: string
}

export interface UpdateConductorRequest extends Partial<CreateConductorRequest> {
    documento_identidad: string
    nombre_conductor: string
    numero_licencia: string
    direccion: string
    telefono: string
    calificacion: number
    email: string
    activo: boolean
    fecha_vencimiento_licencia: string
    estado_licencia: "vigente" | "por_vencer" | "vencida"
    // Campos calculados
    dias_restantes_licencia?: number
}

export interface ConductorFilters extends FilterParams {
    searchTerm?: string
    estado_licencia?: string
    activo?: boolean
}

export interface ConductorStats {
    total: number
    activos: number
    licencias_vencidas: number
    calificacion_promedio: number
}

// Estado del store de Zustand
export interface ConductorStore {
    // Estado
    conductores: Conductor[]
    selectedConductor: Conductor | null
    filters: ConductorFilters
    stats: ConductorStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setConductores: (conductores: Conductor[]) => void
    setSelectedConductor: (conductor: Conductor | null) => void
    setFilters: (filters: Partial<ConductorFilters>) => void
    setStats: (stats: ConductorStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Acciones de negocio
    addConductor: (conductor: Conductor) => void
    updateConductor: (conductor: Conductor) => void
    removeConductor: (conductorId: string) => void
    clearFilters: () => void

    // Computed properties
    getFilteredConductores: () => Conductor[]
    getConductorById: (id: string) => Conductor | undefined
}