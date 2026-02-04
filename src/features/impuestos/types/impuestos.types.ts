// FilterParams type definition
interface FilterParams {
  searchTerm?: string
  [key: string]: any
}

export interface ImpuestoVehicular {
    id: string
    placa_vehiculo: string
    tipo_impuesto: string
    anio_impuesto: number
    impuesto_monto: number
    fecha_pago: string
    estado_pago: "pagado" | "pendiente" | "vencido"
}

export interface CreateImpuestoRequest {
    placa_vehiculo: string
    tipo_impuesto: string
    anio_impuesto: number
    impuesto_monto: number
    fecha_pago: string
    estado_pago?: "pagado" | "pendiente" | "vencido"
}

export interface UpdateImpuestoRequest extends Partial<CreateImpuestoRequest> {
    estado_pago?: "pagado" | "pendiente" | "vencido"
}

export interface ImpuestoFilters extends FilterParams {
    searchTerm?: string
    placa_vehiculo?: string
    estado_pago?: string
}

export interface ImpuestoStats {
    total: number
    pagados: number
    pendientes: number
    vencidos: number
    total_pagado: number
}

// Estado del store de Zustand
export interface ImpuestoStore {
    // Estado
    impuestos: ImpuestoVehicular[]
    selectedImpuesto: ImpuestoVehicular | null
    filters: ImpuestoFilters
    stats: ImpuestoStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setImpuestos: (impuestos: ImpuestoVehicular[]) => void
    setSelectedImpuesto: (impuesto: ImpuestoVehicular | null) => void
    setFilters: (filters: Partial<ImpuestoFilters>) => void
    setStats: (stats: ImpuestoStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    
    // Acciones de negocio
    addImpuesto: (impuesto: ImpuestoVehicular) => void
    updateImpuesto: (impuesto: ImpuestoVehicular) => void
    removeImpuesto: (impuestoId: string) => void
    clearFilters: () => void
    
    // Computed properties
    getFilteredImpuestos: () => ImpuestoVehicular[]
    getImpuestoById: (id: string) => ImpuestoVehicular | undefined
}