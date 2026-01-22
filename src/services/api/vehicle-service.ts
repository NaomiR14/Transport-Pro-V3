// src/services/vehicle-service.ts
import { SupabaseRepository } from '@/lib/supabase/repository';
import { 
    Vehicle, 
    CreateVehicleRequest, 
    VehicleFilters, 
} from '@/types/vehicles-types';

export class VehicleService {
  private repository: SupabaseRepository<any>;

  constructor() {
    this.repository = new SupabaseRepository<VehicleDB>({
      tableName: 'vehicles',
    });
  }

  // Mapear de snake_case (DB) a camelCase (Frontend)
  private mapFromDB(dbVehicle: any): Vehicle {
    return {
      id: dbVehicle.id,
      type: dbVehicle.type,
      brand: dbVehicle.brand,
      model: dbVehicle.model,
      licensePlate: dbVehicle.license_plate,
      serialNumber: dbVehicle.serial_number,
      color: dbVehicle.color,
      year: dbVehicle.year,
      maxLoadCapacity: dbVehicle.max_load_capacity,
      vehicleState: dbVehicle.vehicle_state,
      maintenanceData: dbVehicle.maintenance_data || {},
    };
  }

  // Mapear de camelCase (Frontend) a snake_case (DB)
  private mapToDB(vehicle: CreateVehicleRequest): any {
    return {
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      license_plate: vehicle.licensePlate,
      serial_number: vehicle.serialNumber,
      color: vehicle.color,
      year: vehicle.year,
      max_load_capacity: vehicle.maxLoadCapacity,
      vehicle_state: vehicle.vehicleState,
      maintenance_data: vehicle.maintenanceData || {},
    };
  }

  // Obtener todos los vehículos con filtros opcionales
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    try {
      let vehicles: any[];

      if (filters?.searchTerm) {
        // Buscar por término en múltiples columnas
        vehicles = await this.repository.search(filters.searchTerm, [
          'license_plate',
          'serial_number',
          'brand',
          'model',
          'type',
        ]);
      } else {
        // Obtener todos con filtros opcionales
        const dbFilters: Record<string, unknown> = {};
        if (filters?.vehicleState) {
          dbFilters.vehicle_state = filters.vehicleState;
        }
        vehicles = await this.repository.getAll(dbFilters);
      }

      return vehicles.map(v => this.mapFromDB(v));
    } catch (error) {
      throw error;
    }
  }

  // Obtener un vehículo específico por ID
  async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const dbVehicle = await this.repository.getById(id);
      return this.mapFromDB(dbVehicle);
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo vehículo
  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    try {
      const dbData = this.mapToDB(data);
      const dbVehicle = await this.repository.create(dbData);
      return this.mapFromDB(dbVehicle);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un vehículo existente
  async updateVehicle(id: string, data: CreateVehicleRequest): Promise<Vehicle> {
    try {
      const dbData = this.mapToDB(data);
      const dbVehicle = await this.repository.update(id, dbData);
      return this.mapFromDB(dbVehicle);
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un vehículo
  async deleteVehicle(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
  
  // Buscar vehículos por término
  async search(term: string): Promise<Vehicle[]> {
    try {
      const vehicles = await this.repository.search(term, [
        'license_plate',
        'serial_number',
        'brand',
        'model',
        'type',
        'color',
      ]);
      return vehicles.map(v => this.mapFromDB(v));
    } catch (error) {
      throw error;
    }
  }
}

// Instancia singleton para usar en toda la aplicación
export const vehicleService = new VehicleService();
