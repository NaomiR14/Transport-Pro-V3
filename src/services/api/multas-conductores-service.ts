// src/services/multas-conductores-service.ts
import { apiClient } from '@/services/api/api-base-client'
import {
    MultaConductor,
    CreateMultaConductorRequest,
    UpdateMultaConductorRequest,
    MultaConductorFilters,
    MultaConductorStats
} from '@/types/multas-conductores-types'

// Datos de prueba para desarrollo
const multasMock: MultaConductor[] = [
    {
        id: "1",
        fecha: "2024-01-15",
        numero_viaje: 1001,
        placa_vehiculo: "ABC-123",
        conductor: "Juan Pérez López",
        infraccion: "Exceso de velocidad",
        importe_multa: 2500,
        importe_pagado: 2500,
        debe: 0,
        estado_pago: "pagado",
        observaciones: "Multa pagada en tiempo y forma - Zona escolar, exceso 20km/h"
    },
    {
        id: "2",
        fecha: "2024-01-18",
        numero_viaje: 1005,
        placa_vehiculo: "DEF-456",
        conductor: "María García Rodríguez",
        infraccion: "No respetar señalamiento",
        importe_multa: 1800,
        importe_pagado: 1000,
        debe: 800,
        estado_pago: "parcial",
        observaciones: "Pago parcial realizado, pendiente saldo - Semáforo en rojo"
    },
    {
        id: "3",
        fecha: "2024-01-20",
        numero_viaje: 1008,
        placa_vehiculo: "GHI-789",
        conductor: "Carlos López Martínez",
        infraccion: "Estacionamiento indebido",
        importe_multa: 1200,
        importe_pagado: 0,
        debe: 1200,
        estado_pago: "pendiente",
        observaciones: "Multa recién recibida, en proceso de revisión - Centro histórico"
    },
    {
        id: "4",
        fecha: "2024-01-22",
        numero_viaje: 1012,
        placa_vehiculo: "JKL-012",
        conductor: "Ana Rodríguez Sánchez",
        infraccion: "Circular sin verificación",
        importe_multa: 3500,
        importe_pagado: 0,
        debe: 3500,
        estado_pago: "vencido",
        observaciones: "Multa vencida, aplicar recargos del 20% - Verificación vehicular"
    },
    {
        id: "5",
        fecha: "2024-01-25",
        numero_viaje: 1015,
        placa_vehiculo: "MNO-345",
        conductor: "Roberto Sánchez Hernández",
        infraccion: "Sobrepeso en báscula",
        importe_multa: 5000,
        importe_pagado: 2500,
        debe: 2500,
        estado_pago: "parcial",
        observaciones: "Convenio de pago establecido - Exceso 15% peso máximo"
    },
    {
        id: "6",
        fecha: "2024-01-28",
        numero_viaje: 1018,
        placa_vehiculo: "PQR-678",
        conductor: "Laura Martínez González",
        infraccion: "Documentos vencidos",
        importe_multa: 2200,
        importe_pagado: 0,
        debe: 2200,
        estado_pago: "pendiente",
        observaciones: "Esperando renovación de documentos - Licencia vencida"
    },
    {
        id: "7",
        fecha: "2024-02-01",
        numero_viaje: 1022,
        placa_vehiculo: "STU-901",
        conductor: "Miguel Ángel Ramírez",
        infraccion: "Uso de celular al conducir",
        importe_multa: 1500,
        importe_pagado: 1500,
        debe: 0,
        estado_pago: "pagado",
        observaciones: "Multa pagada con descuento por pronto pago"
    },
    {
        id: "8",
        fecha: "2024-02-05",
        numero_viaje: 1025,
        placa_vehiculo: "VWX-234",
        conductor: "Isabel Flores Castro",
        infraccion: "No usar cinturón de seguridad",
        importe_multa: 800,
        importe_pagado: 800,
        debe: 0,
        estado_pago: "pagado",
        observaciones: "Conductor y acompañante sin cinturón"
    },
    {
        id: "9",
        fecha: "2024-02-10",
        numero_viaje: 1030,
        placa_vehiculo: "YZA-567",
        conductor: "Fernando Castro Díaz",
        infraccion: "Circular sin placas",
        importe_multa: 3000,
        importe_pagado: 1500,
        debe: 1500,
        estado_pago: "parcial",
        observaciones: "Placas en trámite, pago parcial aceptado"
    },
    {
        id: "10",
        fecha: "2024-02-15",
        numero_viaje: 1035,
        placa_vehiculo: "BCD-890",
        conductor: "Sofía Hernández Ruiz",
        infraccion: "Obstruir la vía pública",
        importe_multa: 2000,
        importe_pagado: 0,
        debe: 2000,
        estado_pago: "pendiente",
        observaciones: "Carga mal estibada bloqueando circulación"
    }
];

export class MultasConductoresService {
    private readonly endpoint = '/MultasdeConductores'
    private useMock = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'; // Solo en desarrollo


    async getMultas(filters?: MultaConductorFilters): Promise<MultaConductor[]> {
        // Para desarrollo, usar datos mock
        if (this.useMock) {
            return this.getMockMultas(filters)
        }

        const response = await apiClient.get<MultaConductor[]>(this.endpoint, filters)
        if (response.error) throw new Error(response.error.message)
        return response.data || []
    }

    private async getMockMultas(filters?: MultaConductorFilters): Promise<MultaConductor[]> {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))

        let filteredMultas = [...multasMock]

        // Aplicar filtros básicos
        if (filters?.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase()
            filteredMultas = filteredMultas.filter(multa =>
                multa.conductor.toLowerCase().includes(searchLower) ||
                multa.placa_vehiculo.toLowerCase().includes(searchLower) ||
                multa.infraccion.toLowerCase().includes(searchLower) ||
                multa.numero_viaje.toString().includes(searchLower) ||
                multa.observaciones.toLowerCase().includes(searchLower)
            )
        }

        if (filters?.infraccion) {
            filteredMultas = filteredMultas.filter(multa =>
                multa.infraccion === filters.infraccion
            )
        }

        return filteredMultas
    }

    async getMultaById(id: string): Promise<MultaConductor> {
        // Para desarrollo, usar datos mock
        if (this.useMock) {
            return this.getMockMultaById(id)
        }

        const response = await apiClient.get<MultaConductor>(`${this.endpoint}/${id}`)
        if (response.error) throw new Error(response.error.message)
        if (!response.data) throw new Error('Multa no encontrada')
        return response.data
    }

    private async getMockMultaById(id: string): Promise<MultaConductor> {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300))

        const multa = multasMock.find(m => m.id === id)
        if (!multa) {
            throw new Error('Multa no encontrada')
        }
        return multa
    }

    async createMulta(data: CreateMultaConductorRequest): Promise<MultaConductor> {
        // Calcular campos automáticos
        const debe = Math.max(0, data.importe_multa - data.importe_pagado)
        const estado_pago = this.calcularEstadoPago(data.importe_pagado, data.importe_multa)

        const multaData = {
            ...data,
            debe,
            estado_pago
        }

        // Para desarrollo, simular creación
        if (this.useMock) {
            return this.createMockMulta(multaData)
        }

        const response = await apiClient.post<MultaConductor>(this.endpoint, multaData)
        if (response.error) throw new Error(response.error.message)
        if (!response.data) throw new Error('Error al crear la multa')
        return response.data
    }

    private async createMockMulta(data: CreateMultaConductorRequest & { debe: number; estado_pago: "pagado" | "pendiente" | "parcial" | "vencido" }): Promise<MultaConductor> {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))

        const nuevaMulta: MultaConductor = {
            id: (Math.max(...multasMock.map(m => parseInt(m.id))) + 1).toString(),
            ...data
        }

        // En un caso real, aquí se agregaría al array mock
        // multasMock.unshift(nuevaMulta)

        return nuevaMulta
    }

    async updateMulta(id: string, data: UpdateMultaConductorRequest): Promise<MultaConductor> {
        // Recalcular campos automáticos
        const debe = Math.max(0, data.importe_multa - data.importe_pagado)
        const estado_pago = this.calcularEstadoPago(data.importe_pagado, data.importe_multa)

        const multaData = {
            ...data,
            debe,
            estado_pago
        }

        // Para desarrollo, simular actualización
        if (this.useMock) {
            return this.updateMockMulta(id, multaData)
        }

        const response = await apiClient.put<MultaConductor>(`${this.endpoint}/${id}`, multaData)
        if (response.error) throw new Error(response.error.message)
        if (!response.data) throw new Error('Error al actualizar la multa')
        return response.data
    }

    private async updateMockMulta(id: string, data: UpdateMultaConductorRequest & { debe: number; estado_pago: "pagado" | "pendiente" | "parcial" | "vencido" }): Promise<MultaConductor> {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 500))

        const index = multasMock.findIndex(m => m.id === id)
        if (index === -1) {
            throw new Error('Multa no encontrada')
        }

        const multaActualizada: MultaConductor = {
            ...multasMock[index],
            ...data
        }

        // En un caso real, aquí se actualizaría el array mock
        // multasMock[index] = multaActualizada

        return multaActualizada
    }

    async deleteMulta(id: string): Promise<void> {
        // Para desarrollo, simular eliminación
        if (this.useMock) {
            return this.deleteMockMulta(id)
        }

        const response = await apiClient.delete<void>(`${this.endpoint}/${id}`)
        if (response.error) throw new Error(response.error.message)
    }

    private async deleteMockMulta(id: string): Promise<void> {
        // Simular delay de API
        await new Promise(resolve => setTimeout(resolve, 300))

        const index = multasMock.findIndex(m => m.id === id)
        if (index === -1) {
            throw new Error('Multa no encontrada')
        }

        // En un caso real, aquí se eliminaría del array mock
        // multasMock.splice(index, 1)
    }

    async getStats(): Promise<MultaConductorStats> {
        // Para desarrollo, usar datos mock
        if (this.useMock) {
            return this.getMockStats()
        }

        const response = await apiClient.get<MultaConductorStats>(`${this.endpoint}/stats`)
        if (response.error) throw new Error(response.error.message)
        if (!response.data) throw new Error('Error al obtener estadísticas')
        return response.data
    }

    private getMockStats(): MultaConductorStats {
        const totalMultas = multasMock.length
        const totalPagado = multasMock.reduce((sum, multa) => sum + multa.importe_pagado, 0)
        const totalDebe = multasMock.reduce((sum, multa) => sum + multa.debe, 0)
        const multasPagadas = multasMock.filter(m => m.estado_pago === 'pagado').length
        const multasPendientes = multasMock.filter(m => m.estado_pago === 'pendiente').length
        const multasVencidas = multasMock.filter(m => m.estado_pago === 'vencido').length
        const multasParciales = multasMock.filter(m => m.estado_pago === 'parcial').length
        const porcentajeCumplimiento = totalMultas > 0 ? (multasPagadas / totalMultas) * 100 : 0

        return {
            totalMultas,
            totalPagado,
            totalDebe,
            multasPagadas,
            multasPendientes,
            multasVencidas,
            multasParciales,
            porcentajeCumplimiento
        }
    }

    private calcularEstadoPago(importePagado: number, importeMulta: number): "pagado" | "pendiente" | "parcial" | "vencido" {
        if (importePagado >= importeMulta) {
            return "pagado"
        } else if (importePagado > 0) {
            return "parcial"
        } else {
            return "pendiente"
        }
        // Nota: El estado "vencido" se determinaría por lógica de fechas en el backend
    }
}

export const multasConductoresService = new MultasConductoresService()