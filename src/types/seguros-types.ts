import { FilterParams } from "./api-base-client-types"

export interface SeguroVehiculo {
    id: string
    placa_vehiculo: string
    aseguradora: string
    poliza_seguro: string
    fecha_inicio: string
    fecha_vencimiento: string
    importe_pagado: number
    fecha_pago: string
    estado_poliza: "vigente" | "vencida" | "por_vencer" | "cancelada"
    // Campos calculados
    dias_restantes?: number
}

export interface CreateSeguroRequest {
    placa_vehiculo: string
    aseguradora: string
    poliza_seguro: string
    fecha_inicio: string
    fecha_vencimiento: string
    importe_pagado: number
    fecha_pago: string
}

export interface UpdateSeguroRequest extends Partial<CreateSeguroRequest> {
    id: string
}

export interface SeguroFilters extends FilterParams {
    searchTerm?: string
    estado_poliza?: string
}

export interface SeguroStats {
    total: number
    vigentes: number
    por_vencer: number
    vencidas: number
}

// Estado del store de Zustand
export interface SeguroStore {
    // Estado
    seguros: SeguroVehiculo[]
    selectedSeguro: SeguroVehiculo | null
    filters: SeguroFilters
    stats: SeguroStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setSeguros: (seguros: SeguroVehiculo[]) => void
    setSelectedSeguro: (seguro: SeguroVehiculo | null) => void
    setFilters: (filters: Partial<SeguroFilters>) => void
    setStats: (stats: SeguroStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Acciones de negocio
    addSeguro: (seguro: SeguroVehiculo) => void
    updateSeguro: (seguro: SeguroVehiculo) => void
    removeSeguro: (seguroId: string) => void
    clearFilters: () => void

    // Computed properties
    getFilteredSeguros: () => SeguroVehiculo[]
    getSeguroById: (id: string) => SeguroVehiculo | undefined
}