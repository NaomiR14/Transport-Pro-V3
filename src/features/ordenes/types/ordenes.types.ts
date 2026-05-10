// Tipos para el módulo de órdenes

interface FilterParams {
  searchTerm?: string
  [key: string]: any
}

export type EstadoOrden = 'pendiente' | 'transito' | 'entregado'

// Interfaz que representa los datos de la vista ordenes_with_details
export interface Orden {
    id: string
    numero_orden: string
    placa_vehiculo: string
    ruta_viaje_id: string
    estado: EstadoOrden
    carta_porte: string | null
    created_at: string
    updated_at: string
    // Datos del conductor (via ruta)
    conductor_documento: string | null
    nombre_conductor: string | null
    // Datos de la ruta
    origen: string | null
    destino: string | null
    fecha_salida: string | null
    fecha_llegada: string | null
    // Estado sugerido calculado por la BD
    estado_sugerido: EstadoOrden | null
}

export interface CreateOrdenRequest {
    placa_vehiculo: string
    ruta_viaje_id: string
    estado?: EstadoOrden
    carta_porte?: string | null
}

export interface UpdateOrdenRequest {
    numero_orden?: string
    placa_vehiculo?: string
    ruta_viaje_id?: string
    estado?: EstadoOrden
    carta_porte?: string | null
}

export interface OrdenFilters extends FilterParams {
    searchTerm?: string
    estado?: EstadoOrden | ''
    placa_vehiculo?: string
}

export interface OrdenStats {
    total: number
    pendientes: number
    en_transito: number
    entregadas: number
}

// Estado del store de Zustand
export interface OrdenStore {
    // Estado
    ordenes: Orden[]
    selectedOrden: Orden | null
    filters: OrdenFilters
    stats: OrdenStats | null
    isLoading: boolean
    error: string | null

    // Acciones
    setOrdenes: (ordenes: Orden[]) => void
    setSelectedOrden: (orden: Orden | null) => void
    setFilters: (filters: Partial<OrdenFilters>) => void
    setStats: (stats: OrdenStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    // Acciones de negocio
    addOrden: (orden: Orden) => void
    updateOrden: (orden: Orden) => void
    removeOrden: (ordenId: string) => void
    clearFilters: () => void

    // Computed properties
    getFilteredOrdenes: () => Orden[]
    getOrdenById: (id: string) => Orden | undefined
}
