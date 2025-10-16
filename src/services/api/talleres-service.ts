
import { apiClient } from '@/services/api/api-base-client'
import { 
  Taller, 
  CreateTallerRequest,
  TallerFilters, 
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
    console.log("🟢 CREATE - Creando taller con datos:", data)
    console.log("🟢 CREATE - Endpoint:", this.endpoint)

    const response = await apiClient.post<Taller>(this.endpoint, data);

    console.log("🟢 CREATE - Response completa:", response)
    console.log("🟢 CREATE - Response data:", response.data)
    console.log("🟢 CREATE - Response error:", response.error)

    if (response.error) {
      console.error("🔴 CREATE - Error:", response.error.message)
      throw new Error(response.error.message);
      
    }
    if (!response.data) {
      console.error("🔴 CREATE - Error: Response data es undefined")
      throw new Error('Error al crear el taller');
    }
    console.log("🟢 CREATE - Taller creado exitosamente:", response.data)
    return response.data;
  }

  // Actualizar un taller existente
  async updateTaller(id: string, data: CreateTallerRequest): Promise<Taller> {
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
    console.log("🔴 DELETE - Eliminando taller ID:", id)
    console.log("🔴 DELETE - Endpoint:", `${this.endpoint}/${id}`)
    const response = await apiClient.delete<void>(`${this.endpoint}/${id}`);
    console.log("🔴 DELETE - Response completa:", response)
    console.log("🔴 DELETE - Response error:", response.error)

    if (response.error) {
      console.error("🔴 DELETE - Error:", response.error.message)
      throw new Error(response.error.message);
    }
    console.log("🟢 DELETE - Taller eliminado exitosamente")
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