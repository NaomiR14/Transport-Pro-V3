// src/services/vehicle-service.ts
import { apiClient } from '@/services/api/api-base-client';
import { 
    Vehicle, 
    CreateVehicleRequest, 
    VehicleFilters, 
} from '@/types/vehicles-types';

export class VehicleService {
  private readonly endpoint = '/Vehicles';

  // Obtener todos los vehículos con filtros opcionales
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>(this.endpoint, filters);
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.data || [];
  }

  // Obtener un vehículo específico por ID
  async getVehicleById(id: string): Promise<Vehicle> {
    const response = await apiClient.get<Vehicle>(`${this.endpoint}/${id}`);
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Vehículo no encontrado');
    }
    return response.data;
  }

  // Crear un nuevo vehículo
  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    const response = await apiClient.post<Vehicle>(this.endpoint, data);
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Error al crear el vehículo');
    }
    return response.data;
  }

  // Actualizar un vehículo existente
  async updateVehicle(id: string, data: CreateVehicleRequest): Promise<Vehicle> {
    const response = await apiClient.put<Vehicle>(`${this.endpoint}/${id}`, data);
    if (response.error) {
      throw new Error(response.error.message);
    }
    if (!response.data) {
      throw new Error('Error al actualizar el vehículo');
    }
    return response.data;
  }

  // Eliminar un vehículo
  async deleteVehicle(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`${this.endpoint}/${id}`);
    if (response.error) {
      throw new Error(response.error.message);
    }
  }
  
  // Buscar vehículos por término
  async search(term: string): Promise<Vehicle[]> {
    const response = await apiClient.get<Vehicle[]>(
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
export const vehicleService = new VehicleService();