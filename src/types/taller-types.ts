import { FilterParams } from "./api-base-client-types"

export interface Taller {
    id: string
    name: string
    address: string
    phoneNumber: string
    email: string
    contactPerson: string
    // Campos opcionales que podrían no venir de la API
    numero_taller?: string
    telefono_contacto?: string
    especialidades?: string[]
    activo?: boolean
    calificacion?: number
    horario_atencion?: string
    sitio_web?: string
    notas?: string
}

export interface CreateTallerRequest {
    id: string
    name: string
    address: string
    phoneNumber: string
    email: string
    contactPerson: string
    // Campos opcionales 
    numero_taller?: string
    telefono_contacto: string
    especialidades: string[]
    activo: boolean
    calificacion: number
    horario_atencion: string
    sitio_web?: string
    notas?: string
}

export interface UpdateTallerRequest extends Partial<CreateTallerRequest> {
    taller_id?: string
}

// Tipo para campos editables en formularios
export type EditableTallerFields =
    | 'numero_taller'
    | 'nombre_taller' 
    | 'direccion'
    | 'telefono'
    | 'correo'
    | 'contacto_principal'
    | 'telefono_contacto'
    | 'especialidades'
    | 'activo'
    | 'calificacion'
    | 'horario_atencion'
    | 'sitio_web'
    | 'notas';

export interface TallerFilters extends FilterParams {
    searchTerm?: string
    activo?: boolean
    especialidad?: string
    calificacionMinima?: number
    
}

export interface TallerStats {
    total: number
    activos: number
    inactivos: number
    calificacionPromedio: number
    totalEspecialidades: number
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