// FilterParams type definition
interface FilterParams {
  searchTerm?: string
  [key: string]: any
}

// Interfaces base
export interface MantenimientoVehiculo {
    id: number
    placaVehiculo: string
    taller: string
    fechaEntrada: string
    fechaSalida: string | null
    tipo: string
    kilometraje: number
    paqueteMantenimiento: string
    causas: string
    costoTotal: number
    fechaPago: string | null
    observaciones: string
    estado: string
}

export interface CreateMantenimientoVehiculoRequest {
    placaVehiculo: string
    taller: string
    fechaEntrada: string
    tipo: string
    kilometraje: number
    paqueteMantenimiento: string
    causas: string
    costoTotal: number
    fechaPago: string | null
    observaciones: string
}

export interface UpdateMantenimientoVehiculoRequest extends CreateMantenimientoVehiculoRequest {
    placaVehiculo: string
    taller: string
    fechaEntrada: string
    tipo: string
    kilometraje: number
    paqueteMantenimiento: string
    causas: string
    costoTotal: number
    fechaPago: string | null
    observaciones: string
}

// Filtros
export interface MantenimientoVehiculoFilters extends FilterParams {
    searchTerm?: string
    tipo?: string
    estado?: string
}

// Estadísticas
export interface MantenimientoVehiculoStats {
    total: number
    completados: number
    enProceso: number
    pendientePago: number
    costoPendiente: number
}

// Store
export interface MantenimientoVehiculoStore {
    mantenimientos: MantenimientoVehiculo[]
    selectedMantenimiento: MantenimientoVehiculo | null
    filters: MantenimientoVehiculoFilters
    stats: MantenimientoVehiculoStats | null
    isLoading: boolean
    error: string | null

    setMantenimientos: (mantenimientos: MantenimientoVehiculo[]) => void
    setSelectedMantenimiento: (mantenimiento: MantenimientoVehiculo | null) => void
    setFilters: (filters: Partial<MantenimientoVehiculoFilters>) => void
    setStats: (stats: MantenimientoVehiculoStats) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void

    addMantenimiento: (mantenimiento: MantenimientoVehiculo) => void
    updateMantenimiento: (mantenimiento: MantenimientoVehiculo) => void
    removeMantenimiento: (mantenimientoId: number) => void
    clearFilters: () => void

    getFilteredMantenimientos: () => MantenimientoVehiculo[]
    getMantenimientoById: (id: number) => MantenimientoVehiculo | undefined
}

// Datos de prueba
export const mockMantenimientos: MantenimientoVehiculo[] = [
    {
        id: 1,
        placaVehiculo: "ABC-123",
        taller: "Taller Central",
        fechaEntrada: "2024-01-10",
        fechaSalida: "2024-01-12",
        tipo: "Preventivo",
        kilometraje: 15000,
        paqueteMantenimiento: "Mantenimiento 15K",
        causas: "Mantenimiento programado cada 15,000 km",
        costoTotal: 350.00,
        fechaPago: "2024-01-12",
        observaciones: "Cambio de aceite y filtros",
        estado: "Completado"
    },
    {
        id: 2,
        placaVehiculo: "DEF-456",
        taller: "AutoServicio Norte",
        fechaEntrada: "2024-01-15",
        fechaSalida: null,
        tipo: "Correctivo",
        kilometraje: 45000,
        paqueteMantenimiento: "Reparación Frenos",
        causas: "Frenos haciendo ruido y pérdida de eficiencia",
        costoTotal: 280.00,
        fechaPago: null,
        observaciones: "Cambio de pastillas y discos delanteros",
        estado: "En Proceso"
    },
    {
        id: 3,
        placaVehiculo: "GHI-789",
        taller: "Mecánica Express",
        fechaEntrada: "2024-01-18",
        fechaSalida: "2024-01-20",
        tipo: "Preventivo",
        kilometraje: 30000,
        paqueteMantenimiento: "Mantenimiento 30K",
        causas: "Mantenimiento mayor programado",
        costoTotal: 650.00,
        fechaPago: null,
        observaciones: "Incluye cambio de líquidos y filtros",
        estado: "Pendiente Pago"
    },
    {
        id: 4,
        placaVehiculo: "JKL-012",
        taller: "Taller Sur",
        fechaEntrada: "2024-01-22",
        fechaSalida: "2024-01-23",
        tipo: "Correctivo",
        kilometraje: 52000,
        paqueteMantenimiento: "Reparación Eléctrica",
        causas: "Problemas con el sistema de carga de batería",
        costoTotal: 180.00,
        fechaPago: "2024-01-23",
        observaciones: "Cambio de alternador",
        estado: "Completado"
    },
    {
        id: 5,
        placaVehiculo: "MNO-345",
        taller: "AutoServicio Norte",
        fechaEntrada: "2024-01-25",
        fechaSalida: null,
        tipo: "Preventivo",
        kilometraje: 60000,
        paqueteMantenimiento: "Mantenimiento 60K",
        causas: "Mantenimiento mayor programado",
        costoTotal: 1100.00,
        fechaPago: null,
        observaciones: "Mantenimiento mayor: cambio de correa de distribución",
        estado: "En Proceso"
    }
];