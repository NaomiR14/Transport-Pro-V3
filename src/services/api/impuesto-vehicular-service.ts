import { apiClient } from '@/services/api/api-base-client';
import { ImpuestoVehicular, CreateImpuestoRequest, UpdateImpuestoRequest, ImpuestoFilters } from '@/types/impuesto-vehicular-types';

// Datos mock para desarrollo
const mockImpuestos: ImpuestoVehicular[] = [
    {
        id: "1",
        placa_vehiculo: "ABC-123-A",
        tipo_impuesto: "Tenencia",
        anio_impuesto: 2024,
        impuesto_monto: 8500,
        fecha_pago: "2024-01-15",
        estado_pago: "pagado"
    },
    {
        id: "2",
        placa_vehiculo: "XYZ-789-B",
        tipo_impuesto: "Verificación",
        anio_impuesto: 2024,
        impuesto_monto: 1200,
        fecha_pago: "2024-03-20",
        estado_pago: "pendiente"
    },
    {
        id: "3",
        placa_vehiculo: "DEF-456-C",
        tipo_impuesto: "Tenencia",
        anio_impuesto: 2023,
        impuesto_monto: 7800,
        fecha_pago: "2023-12-30",
        estado_pago: "vencido"
    },
    {
        id: "4",
        placa_vehiculo: "ABC-123-A",
        tipo_impuesto: "Verificación",
        anio_impuesto: 2023,
        impuesto_monto: 1100,
        fecha_pago: "2023-06-15",
        estado_pago: "pagado"
    }
];

const USE_MOCK = process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true';;

export class ImpuestoVehicularService {
    static async getImpuestos(filters?: ImpuestoFilters): Promise<ImpuestoVehicular[]> {
        // Usar mock en desarrollo
        if (USE_MOCK) {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredImpuestos = [...mockImpuestos];

            // Aplicar filtros básicos
            if (filters?.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase();
                filteredImpuestos = filteredImpuestos.filter(impuesto =>
                    impuesto.placa_vehiculo.toLowerCase().includes(searchTerm) ||
                    impuesto.tipo_impuesto.toLowerCase().includes(searchTerm)
                );
            }

            if (filters?.placa_vehiculo) {
                filteredImpuestos = filteredImpuestos.filter(impuesto =>
                    impuesto.placa_vehiculo === filters.placa_vehiculo
                );
            }

            if (filters?.estado_pago) {
                filteredImpuestos = filteredImpuestos.filter(impuesto =>
                    impuesto.estado_pago === filters.estado_pago
                );
            }

            return filteredImpuestos;
        }

        // Usar API real en producción
        const response = await apiClient.get<ImpuestoVehicular[]>('/Impuestosvehiculos', filters);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data || [];
    }

    static async getImpuestoById(id: string): Promise<ImpuestoVehicular> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const impuesto = mockImpuestos.find(s => s.id === id);
            if (!impuesto) throw new Error('Impuesto no encontrado');
            return impuesto;
        }

        const response = await apiClient.get<ImpuestoVehicular>(`/Impuestosvehiculos/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async createImpuesto(impuestoData: CreateImpuestoRequest): Promise<ImpuestoVehicular> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newImpuesto: ImpuestoVehicular = {
                id: Date.now().toString(),
                ...impuestoData,
                estado_pago: "pendiente" // Por defecto pendiente hasta que se pague
            };
            mockImpuestos.push(newImpuesto);
            return newImpuesto;
        }

        const response = await apiClient.post<ImpuestoVehicular>('/Impuestosvehiculos', impuestoData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async updateImpuesto(id: string, impuestoData: UpdateImpuestoRequest): Promise<ImpuestoVehicular> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = mockImpuestos.findIndex(s => s.id === id);
            if (index === -1) throw new Error('Impuesto no encontrado');

            const updatedImpuesto = {
                ...mockImpuestos[index],
                ...impuestoData
            };
            mockImpuestos[index] = updatedImpuesto;
            return updatedImpuesto;
        }

        const response = await apiClient.put<ImpuestoVehicular>(`/Impuestosvehiculos/${id}`, impuestoData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async deleteImpuesto(id: string): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const index = mockImpuestos.findIndex(s => s.id === id);
            if (index === -1) throw new Error('Impuesto no encontrado');
            mockImpuestos.splice(index, 1);
            return;
        }

        const response = await apiClient.delete(`/Impuestosvehiculos/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions(impuestos: ImpuestoVehicular[]) {
        const estados = ['pagado', 'pendiente', 'vencido'];
        const tiposImpuesto = [...new Set(impuestos.map(s => s.tipo_impuesto))].filter(Boolean);
        const placas = [...new Set(impuestos.map(s => s.placa_vehiculo))].filter(Boolean);
        const anios = [...new Set(impuestos.map(s => s.anio_impuesto))].sort((a, b) => b - a);

        return {
            estados,
            tiposImpuesto,
            placas,
            anios,
        };
    }
}