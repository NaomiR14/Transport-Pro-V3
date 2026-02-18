// src/features/vehiculos/services/vehiculo-service.ts
import { SupabaseRepository } from '@/lib/supabase/repository';
import { createClient } from '@/lib/supabase/client';
import { 
    Vehicle, 
    CreateVehicleRequest,
    UpdateVehicleRequest,
    VehicleFilters,
    VehicleStats
} from '../types/vehiculo.types';

export class VehicleService {
  private repository: SupabaseRepository<any>;
  private viewRepository: SupabaseRepository<any>;

  constructor() {
    this.repository = new SupabaseRepository<any>({
      tableName: 'vehicles',
    });
    // Vista con campos calculados
    this.viewRepository = new SupabaseRepository<any>({
      tableName: 'vehicles_with_calculated_stats',
    });
  }

  // Mapear de snake_case (DB) a camelCase (Frontend) - desde la VISTA
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
      // vehicleState ELIMINADO - no existe en la vista
      maintenanceData: dbVehicle.maintenance_data || {},
      // Campos calculados desde la vista
      calculatedData: {
        cicloMantenimiento: Number(dbVehicle.ciclo_mantenimiento) || 5000,
        kmInicial: Number(dbVehicle.km_inicial) || 0,
        ultimoKmPreventivo: Number(dbVehicle.ultimo_km_preventivo) || 0,
        ultimoKmOdometro: Number(dbVehicle.ultimo_km_odometro) || 0,
        estadoSeguro: dbVehicle.estado_seguro || 'sin_seguro',
        fechaVencimientoSeguro: dbVehicle.fecha_vencimiento_seguro || null,
        kmsRestantesMantenimiento: Number(dbVehicle.kms_restantes_mantenimiento) || 0,
        porcentajeCicloUsado: Number(dbVehicle.porcentaje_ciclo_usado) || 0,
        estadoCalculado: dbVehicle.estado_calculado || 'Disponible',
        alertaMantenimiento: dbVehicle.alerta_mantenimiento || 'Al día',
        tieneMantenimientoActivo: dbVehicle.tiene_mantenimiento_activo || false,
        tieneSeguroVencido: dbVehicle.tiene_seguro_vencido || false,
      },
    };
  }

  // Mapear de camelCase (Frontend) a snake_case (DB) para crear
  private mapCreateToDB(vehicle: CreateVehicleRequest): any {
    return {
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      license_plate: vehicle.licensePlate,
      serial_number: vehicle.serialNumber,
      color: vehicle.color,
      year: vehicle.year,
      max_load_capacity: vehicle.maxLoadCapacity,
      // vehicle_state ELIMINADO de la tabla
      maintenance_data: {
        maintenanceCycle: vehicle.maintenanceData.maintenanceCycle,
        initialKm: vehicle.maintenanceData.initialKm,
        prevMaintenanceKm: 0,
        currentKm: vehicle.maintenanceData.initialKm,
        remainingMaintenanceKm: vehicle.maintenanceData.maintenanceCycle,
        maintenanceStatus: 'ok'
      },
    };
  }

  // Mapear de camelCase (Frontend) a snake_case (DB) para actualizar
  private mapUpdateToDB(vehicle: UpdateVehicleRequest): any {
    return {
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      license_plate: vehicle.licensePlate,
      serial_number: vehicle.serialNumber,
      color: vehicle.color,
      year: vehicle.year,
      max_load_capacity: vehicle.maxLoadCapacity,
      // vehicle_state ELIMINADO de la tabla
      maintenance_data: {
        maintenanceCycle: vehicle.maintenanceData.maintenanceCycle,
        initialKm: vehicle.maintenanceData.initialKm,
      },
    };
  }

  // Obtener todos los vehículos con campos calculados desde la vista
  async getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
    try {
      let vehicles: any[];

      if (filters?.searchTerm) {
        // Buscar por término en múltiples columnas - usa la VISTA
        vehicles = await this.viewRepository.search(filters.searchTerm, [
          'license_plate',
          'serial_number',
          'brand',
          'model',
          'type',
        ]);
      } else {
        // Obtener todos con filtros opcionales - usa la VISTA
        const dbFilters: Record<string, unknown> = {};
        if (filters?.vehicleState) {
          dbFilters.vehicle_state = filters.vehicleState;
        }
        vehicles = await this.viewRepository.getAll(dbFilters);
      }

      return vehicles.map(v => this.mapFromDB(v));
    } catch (error) {
      throw error;
    }
  }

  // Obtener un vehículo específico por ID con campos calculados
  async getVehicleById(id: string): Promise<Vehicle> {
    try {
      const dbVehicle = await this.viewRepository.getById(id);
      return this.mapFromDB(dbVehicle);
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo vehículo
  async createVehicle(data: CreateVehicleRequest): Promise<Vehicle> {
    try {
      console.log('[VehicleService] createVehicle - INPUT:', data);
      const dbData = this.mapCreateToDB(data);
      console.log('[VehicleService] createVehicle - DB DATA:', dbData);
      const dbVehicle = await this.repository.create(dbData);
      console.log('[VehicleService] createVehicle - DB RESPONSE:', dbVehicle);
      // Obtener desde la vista para tener campos calculados
      const vehicleWithCalculated = await this.viewRepository.getById(dbVehicle.id);
      const result = this.mapFromDB(vehicleWithCalculated);
      console.log('[VehicleService] createVehicle - RESULT:', result);
      return result;
    } catch (error) {
      console.error('[VehicleService] createVehicle - ERROR:', error);
      throw error;
    }
  }

  // Actualizar un vehículo existente
  async updateVehicle(id: string, data: UpdateVehicleRequest): Promise<Vehicle> {
    try {
      console.log('[VehicleService] updateVehicle - ID:', id);
      console.log('[VehicleService] updateVehicle - INPUT:', data);
      const dbData = this.mapUpdateToDB(data);
      console.log('[VehicleService] updateVehicle - DB DATA:', dbData);
      const dbVehicle = await this.repository.update(id, dbData);
      console.log('[VehicleService] updateVehicle - DB RESPONSE:', dbVehicle);
      // Obtener desde la vista para tener campos calculados
      const vehicleWithCalculated = await this.viewRepository.getById(id);
      const result = this.mapFromDB(vehicleWithCalculated);
      console.log('[VehicleService] updateVehicle - RESULT:', result);
      return result;
    } catch (error) {
      console.error('[VehicleService] updateVehicle - ERROR:', error);
      throw error;
    }
  }

  // Eliminar un vehículo
  async deleteVehicle(id: string): Promise<void> {
    try {
      console.log('[VehicleService] deleteVehicle - ID:', id);
      await this.repository.delete(id);
      console.log('[VehicleService] deleteVehicle - SUCCESS');
    } catch (error) {
      console.error('[VehicleService] deleteVehicle - ERROR:', error);
      throw error;
    }
  }

  // Obtener estadísticas de vehículos usando campos calculados
  async getStats(): Promise<VehicleStats> {
    try {
      const vehiclesDB = await this.viewRepository.getAll();
      const vehicles = vehiclesDB.map(v => this.mapFromDB(v));

      const total = vehicles.length;
      // Usar estado_calculado de la vista
      const available = vehicles.filter(v => 
        v.calculatedData?.estadoCalculado === 'Disponible'
      ).length;
      const inMaintenance = vehicles.filter(v => 
        v.calculatedData?.tieneMantenimientoActivo === true
      ).length;
      const requierenMantenimiento = vehicles.filter(v => 
        v.calculatedData?.alertaMantenimiento === 'Mantener' ||
        v.calculatedData?.alertaMantenimiento === 'Falta poco'
      ).length;

      return { total, available, inMaintenance, requierenMantenimiento };
    } catch (error) {
      throw error;
    }
  }
  
  // Buscar vehículos por término - usa la VISTA
  async search(term: string): Promise<Vehicle[]> {
    try {
      const vehicles = await this.viewRepository.search(term, [
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
