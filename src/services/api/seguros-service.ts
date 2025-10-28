import { apiClient } from '@/services/api/api-base-client';
import { SeguroVehiculo, CreateSeguroRequest, UpdateSeguroRequest, SeguroFilters } from '@/types/seguros-types';

export class SeguroService {
    static async getSeguros(filters?: SeguroFilters): Promise<SeguroVehiculo[]> {
        const response = await apiClient.get<SeguroVehiculo[]>('/Seguros', filters);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data || [];
    }

    static async getSeguroById(id: string): Promise<SeguroVehiculo> {
        const response = await apiClient.get<SeguroVehiculo>(`/Seguros/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async createSeguro(seguroData: CreateSeguroRequest): Promise<SeguroVehiculo> {
        const response = await apiClient.post<SeguroVehiculo>('/Seguros', seguroData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async updateSeguro(seguroData: UpdateSeguroRequest): Promise<SeguroVehiculo> {
        const response = await apiClient.put<SeguroVehiculo>(`/Seguros/${seguroData.id}`, seguroData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async deleteSeguro(id: string): Promise<void> {
        const response = await apiClient.delete(`/Seguros/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions(seguros: SeguroVehiculo[]) {
        const estados = [...new Set(seguros.map(s => s.estado_poliza))].filter(Boolean);
        const aseguradoras = [...new Set(seguros.map(s => s.aseguradora))].filter(Boolean);

        return {
            estados,
            aseguradoras,
        };
    }
}