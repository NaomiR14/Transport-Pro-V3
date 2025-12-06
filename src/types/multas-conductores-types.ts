import { FilterParams } from "./api-base-client-types"

// Interfaces base
export interface MultaConductor {
    id: string
    fecha: string
    numero_viaje: number
    placa_vehiculo: string
    conductor: string
    infraccion: string
    importe_multa: number
    importe_pagado: number
    debe: number
    estado_pago: "pagado" | "pendiente" | "parcial" | "vencido"
    observaciones: string
}

export interface CreateMultaConductorRequest {
    fecha: string
    numero_viaje: number
    placa_vehiculo: string
    conductor: string
    infraccion: string
    importe_multa: number
    importe_pagado: number
    observaciones: string
}

export interface UpdateMultaConductorRequest extends CreateMultaConductorRequest { 
    fecha: string
    numero_viaje: number
    placa_vehiculo: string
    conductor: string
    infraccion: string
    importe_multa: number
    importe_pagado: number
    debe: number
    estado_pago: "pagado" | "pendiente" | "parcial" | "vencido"
    observaciones: string
}   

// Filtros
export interface MultaConductorFilters extends FilterParams {
    searchTerm?: string
    infraccion?: string
}

// Estadísticas
export interface MultaConductorStats {
    totalMultas: number
    totalPagado: number
    totalDebe: number
    multasPagadas: number
    multasPendientes: number
    multasVencidas: number
    multasParciales: number
    porcentajeCumplimiento: number
}

// Store
export interface MultaConductorStore {
    // Estado
    multas: MultaConductor[]
    selectedMulta: MultaConductor | null
    filters: MultaConductorFilters
    stats: MultaConductorStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setMultas: (multas: MultaConductor[]) => void
    setSelectedMulta: (multa: MultaConductor | null) => void
    setFilters: (filters: Partial<MultaConductorFilters>) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    addMulta: (multa: MultaConductor) => void
    updateMulta: (multa: MultaConductor) => void
    removeMulta: (id: string) => void
    getFilteredMultas: () => MultaConductor[]
    getMultaById: (id: string) => MultaConductor | undefined
}