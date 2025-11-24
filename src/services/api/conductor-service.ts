import { apiClient } from '@/services/api/api-base-client';
import { Conductor, CreateConductorRequest, UpdateConductorRequest, ConductorFilters } from '@/types/conductor-types';

// Datos mock para desarrollo
const mockConductores: Conductor[] = [
    {
        id: "1",
        documento_identidad: "12345678",
        nombre_conductor: "Juan Pérez García",
        numero_licencia: "LIC-2024-001",
        direccion: "Av. Principal 123, Ciudad de México",
        telefono: "+52 55 1234-5678",
        calificacion: 4.5,
        email: "juan.perez@empresa.com",
        activo: true,
        fecha_vencimiento_licencia: "2025-06-15",
        estado_licencia: "vigente"
    },
    {
        id: "2",
        documento_identidad: "87654321",
        nombre_conductor: "María López Hernández",
        numero_licencia: "LIC-2023-045",
        direccion: "Calle Secundaria 456, Guadalajara",
        telefono: "+52 33 9876-5432",
        calificacion: 4.8,
        email: "maria.lopez@empresa.com",
        activo: true,
        fecha_vencimiento_licencia: "2024-03-20",
        estado_licencia: "por_vencer"
    },
    {
        id: "3",
        documento_identidad: "11223344",
        nombre_conductor: "Carlos Rodríguez Martínez",
        numero_licencia: "LIC-2022-078",
        direccion: "Boulevard Norte 789, Monterrey",
        telefono: "+52 81 5555-1234",
        calificacion: 3.9,
        email: "carlos.rodriguez@empresa.com",
        activo: false,
        fecha_vencimiento_licencia: "2023-12-01",
        estado_licencia: "vencida"
    },
    {
        id: "4",
        documento_identidad: "55667788",
        nombre_conductor: "Ana García Silva",
        numero_licencia: "LIC-2024-012",
        direccion: "Plaza Central 321, Puebla",
        telefono: "+52 222 3456-7890",
        calificacion: 4.2,
        email: "ana.garcia@empresa.com",
        activo: true,
        fecha_vencimiento_licencia: "2026-01-10",
        estado_licencia: "vigente"
    }
];

const USE_MOCK = process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true';

export class ConductorService {
    static async getConductores(filters?: ConductorFilters): Promise<Conductor[]> {
        // Usar mock en desarrollo
        if (USE_MOCK) {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredConductores = [...mockConductores];

            // Aplicar filtros básicos
            if (filters?.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase();
                filteredConductores = filteredConductores.filter(conductor =>
                    conductor.documento_identidad.toLowerCase().includes(searchTerm) ||
                    conductor.nombre_conductor.toLowerCase().includes(searchTerm) ||
                    conductor.numero_licencia.toLowerCase().includes(searchTerm) ||
                    conductor.email.toLowerCase().includes(searchTerm)
                );
            }

            if (filters?.estado_licencia) {
                filteredConductores = filteredConductores.filter(conductor =>
                    conductor.estado_licencia === filters.estado_licencia
                );
            }

            if (filters?.activo !== undefined) {
                filteredConductores = filteredConductores.filter(conductor =>
                    conductor.activo === filters.activo
                );
            }

            return filteredConductores;
        }

        // Usar API real en producción
        const response = await apiClient.get<Conductor[]>('/Conductores', filters);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data || [];
    }

    static async getConductorById(id: string): Promise<Conductor> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const conductor = mockConductores.find(s => s.id === id);
            if (!conductor) throw new Error('Conductor no encontrado');
            return conductor;
        }

        const response = await apiClient.get<Conductor>(`/Conductores/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async createConductor(conductorData: CreateConductorRequest): Promise<Conductor> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const newConductor: Conductor = {
                id: Date.now().toString(),
                ...conductorData,
                estado_licencia: "vigente" // Se calculará después en el store
            };
            mockConductores.push(newConductor);
            return newConductor;
        }

        const response = await apiClient.post<Conductor>('/Conductores', conductorData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async updateConductor(id: string, conductorData: UpdateConductorRequest): Promise<Conductor> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = mockConductores.findIndex(s => s.id === id);
            if (index === -1) throw new Error('Conductor no encontrado');

            const updatedConductor = {
                ...mockConductores[index],
                ...conductorData
            };
            mockConductores[index] = updatedConductor;
            return updatedConductor;
        }

        const response = await apiClient.put<Conductor>(`/Conductores/${id}`, conductorData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async deleteConductor(id: string): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const index = mockConductores.findIndex(s => s.id === id);
            if (index === -1) throw new Error('Conductor no encontrado');
            mockConductores.splice(index, 1);
            return;
        }

        const response = await apiClient.delete(`/Conductores/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions() {
        const estadosLicencia = ['vigente', 'por_vencer', 'vencida'];
        const calificaciones = [1, 2, 3, 4, 5];

        return {
            estadosLicencia,
            calificaciones,
        };
    }
}