
import { apiClient } from '@/services/api/api-base-client'
import { 
  Taller, 
  CreateTallerRequest, 
  UpdateTallerRequest, 
  TallerFilters,
  TallerStats 
} from '@/types/taller-types';

export class TalleresService {
  private readonly endpoint = '/Workshops';

  // Obtener todos los talleres con filtros opcionales
  async getTalleres(filters?: TallerFilters): Promise<Taller[]> {
    const response = await apiClient.get<Taller[]>(this.endpoint, filters);
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data || [];
  }

  // Obtener un taller específico por ID
  async getTaller(id: string): Promise<Taller> {
    const response = await apiClient.get<Taller>(`${this.endpoint}/${id}`);
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Taller no encontrado');
    }
    return response.data;
  }

  // Crear un nuevo taller
  async createTaller(data: CreateTallerRequest): Promise<Taller> {
    const response = await apiClient.post<Taller>(this.endpoint, data);
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Error al crear el taller');
    }
    return response.data;
  }

  // Actualizar un taller existente
  async updateTaller(id: string, data: UpdateTallerRequest): Promise<Taller> {
    const response = await apiClient.put<Taller>(`${this.endpoint}/${id}`, data);
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Error al actualizar el taller');
    }
    return response.data;
  }

  // Eliminar un taller
  async deleteTaller(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`${this.endpoint}/${id}`);
    if (response.error) {
      throw new Error(response.error.message);
    }
  }

  // Cambiar estado de un taller
  async toggleStatus(id: string, activo: boolean): Promise<Taller> {
    const response = await apiClient.patch<Taller>(
      `${this.endpoint}/${id}/status`, 
      { activo }
    );
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Error al cambiar el estado del taller');
    }
    return response.data;
  }

  // Obtener estadísticas de talleres
  async getStats(): Promise<TallerStats> {
    const response = await apiClient.get<TallerStats>(`${this.endpoint}/stats`);
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Error al obtener estadísticas');
    }
    return response.data;
  }

  // Buscar talleres por término
  async search(term: string): Promise<Taller[]> {
    const response = await apiClient.get<Taller[]>(
      `${this.endpoint}/search`, 
      { q: term }
    );
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data || [];
  }
}

// Instancia singleton para usar en toda la aplicación
export const talleresService = new TalleresService();