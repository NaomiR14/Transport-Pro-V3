//import { apiClient } from '@/services/api/api-base-client';
import {
    MantenimientoVehiculo,
    CreateMantenimientoVehiculoRequest,
    UpdateMantenimientoVehiculoRequest,
    MantenimientoVehiculoFilters,
    MantenimientoVehiculoStats,
    mockMantenimientos
} from '@/types/mantenimiento-vehiculos-types'

const USE_MOCK = process.env.NODE_ENV === 'development';

export class MantenimientoVehiculoService {
    private readonly endpoint = '/Mantenimientodevehículos'
    private mantenimientos: MantenimientoVehiculo[] = [...mockMantenimientos]
    private nextId = 6

    async getMantenimientos(filters?: MantenimientoVehiculoFilters): Promise<MantenimientoVehiculo[]> {
        // Usar mock en desarrollo
        if (USE_MOCK) {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));

            let filtered = [...mockMantenimientos]

            if (filters?.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase()
                filtered = filtered.filter(m =>
                    m.placaVehiculo.toLowerCase().includes(searchTerm) ||
                    m.taller.toLowerCase().includes(searchTerm) ||
                    m.paqueteMantenimiento.toLowerCase().includes(searchTerm) ||
                    m.causas.toLowerCase().includes(searchTerm)
                )
            }

            if (filters?.tipo && filters.tipo !== 'all') {
                filtered = filtered.filter(m => m.tipo === filters.tipo)
            }

            if (filters?.estado && filters.estado !== 'all') {
                filtered = filtered.filter(m => m.estado === filters.estado)
            }

            return filtered
        }

        return []
    }

    async getMantenimientoById(id: string): Promise<MantenimientoVehiculo> {
        await new Promise(resolve => setTimeout(resolve, 300))

        const mantenimiento = this.mantenimientos.find(m => m.id === parseInt(id))
        if (!mantenimiento) {
            throw new Error('Mantenimiento no encontrado')
        }
        return mantenimiento
    }

    async createMantenimiento(data: CreateMantenimientoVehiculoRequest): Promise<MantenimientoVehiculo> {
        await new Promise(resolve => setTimeout(resolve, 500))

        const { fechaPago, ...rest } = data

        const newMantenimiento: MantenimientoVehiculo = {
            id: this.nextId++,
            fechaSalida: null,
            fechaPago: fechaPago ?? null,
            estado: "En Proceso", // Estado por defecto
            ...rest
        }

        this.mantenimientos.push(newMantenimiento)
        return newMantenimiento
    }

    async updateMantenimiento(id: string, data: UpdateMantenimientoVehiculoRequest): Promise<MantenimientoVehiculo> {
        await new Promise(resolve => setTimeout(resolve, 500))

        const index = this.mantenimientos.findIndex(m => m.id === parseInt(id))
        if (index === -1) {
            throw new Error('Mantenimiento no encontrado')
        }

        const updatedMantenimiento: MantenimientoVehiculo = {
            ...this.mantenimientos[index],
            ...data,
            id: parseInt(id)
        }

        this.mantenimientos[index] = updatedMantenimiento
        return updatedMantenimiento
    }

    async deleteMantenimiento(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300))

        const index = this.mantenimientos.findIndex(m => m.id === parseInt(id))
        if (index === -1) {
            throw new Error('Mantenimiento no encontrado')
        }

        this.mantenimientos.splice(index, 1)
    }

    async getStats(): Promise<MantenimientoVehiculoStats> {
        await new Promise(resolve => setTimeout(resolve, 400))

        const total = this.mantenimientos.length
        const completados = this.mantenimientos.filter(m => m.estado === 'Completado').length
        const enProceso = this.mantenimientos.filter(m => m.estado === 'En Proceso').length
        const pendientePago = this.mantenimientos.filter(m => m.estado === 'Pendiente Pago').length
        const costoPendiente = this.mantenimientos
            .filter(m => !m.fechaPago)
            .reduce((sum, m) => sum + m.costoTotal, 0)

        return {
            total,
            completados,
            enProceso,
            pendientePago,
            costoPendiente
        }
    }
}

export const mantenimientoVehiculoService = new MantenimientoVehiculoService()