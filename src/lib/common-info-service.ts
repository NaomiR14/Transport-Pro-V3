import { SupabaseRepository } from '@/lib/supabase/repository';
import {
    FuelType,
    FuelStation,
    VehicleBrand,
    VehicleModel,
    VehicleType,
    MaintenanceType,
    MaintenancePlan,
    MaintenanceService,
    TrafficTicketType,
    CommonInfo
} from '@/types/common-info-types';

export class CommonInfoService {
    private fuelTypesRepo: SupabaseRepository<FuelType>;
    private fuelStationsRepo: SupabaseRepository<FuelStation>;
    private vehicleBrandsRepo: SupabaseRepository<VehicleBrand>;
    private vehicleModelsRepo: SupabaseRepository<any>;
    private vehicleTypesRepo: SupabaseRepository<VehicleType>;
    private maintenanceTypesRepo: SupabaseRepository<MaintenanceType>;
    private maintenancePlansRepo: SupabaseRepository<MaintenancePlan>;
    private maintenanceServicesRepo: SupabaseRepository<any>;
    private trafficTicketTypesRepo: SupabaseRepository<TrafficTicketType>;

    // Cache para evitar llamadas repetidas
    private cache: Partial<CommonInfo> = {};
    private cacheTimestamp: number = 0;
    private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

    constructor() {
        this.fuelTypesRepo = new SupabaseRepository({ tableName: 'fuel_types' });
        this.fuelStationsRepo = new SupabaseRepository({ tableName: 'fuel_stations' });
        this.vehicleBrandsRepo = new SupabaseRepository({ tableName: 'vehicle_brands' });
        this.vehicleModelsRepo = new SupabaseRepository({ tableName: 'vehicle_models' });
        this.vehicleTypesRepo = new SupabaseRepository({ tableName: 'vehicle_types' });
        this.maintenanceTypesRepo = new SupabaseRepository({ tableName: 'maintenance_types' });
        this.maintenancePlansRepo = new SupabaseRepository({ tableName: 'maintenance_plans' });
        this.maintenanceServicesRepo = new SupabaseRepository({ tableName: 'maintenance_services' });
        this.trafficTicketTypesRepo = new SupabaseRepository({ tableName: 'traffic_ticket_types' });
    }

    private isCacheValid(): boolean {
        return Date.now() - this.cacheTimestamp < this.CACHE_DURATION;
    }

    async getCommonInfo(): Promise<CommonInfo> {
        if (this.isCacheValid() && Object.keys(this.cache).length > 0) {
            return this.cache as CommonInfo;
        }

        const [fuelTypes, fuelStations, vehicleBrands, vehicleModelsDB, vehicleTypes, maintenanceTypes, maintenancePlans, maintenanceServicesDB, trafficTicketTypes] = await Promise.all([
            this.fuelTypesRepo.getAll(),
            this.fuelStationsRepo.getAll(),
            this.vehicleBrandsRepo.getAll(),
            this.vehicleModelsRepo.getAll(),
            this.vehicleTypesRepo.getAll(),
            this.maintenanceTypesRepo.getAll(),
            this.maintenancePlansRepo.getAll(),
            this.maintenanceServicesRepo.getAll(),
            this.trafficTicketTypesRepo.getAll(),
        ]);

        // Mapear vehicle_models de snake_case a camelCase
        const vehicleModels: VehicleModel[] = vehicleModelsDB.map(model => ({
            id: model.id,
            brandId: model.brand_id,
            name: model.name,
        }));

        // Mapear maintenance_services de snake_case a camelCase
        const maintenanceServices: MaintenanceService[] = maintenanceServicesDB.map(service => ({
            id: service.id,
            planId: service.plan_id,
            description: service.description,
        }));

        this.cache = {
            fuelTypes,
            fuelStations,
            vehicleBrands,
            vehicleModels,
            vehicleTypes,
            maintenanceTypes,
            maintenancePlans,
            maintenanceServices,
            trafficTicketTypes,
        };
        this.cacheTimestamp = Date.now();

        return this.cache as CommonInfo;
    }

    async getFuelTypes(): Promise<FuelType[]> {
        if (this.cache.fuelTypes && this.isCacheValid()) {
            return this.cache.fuelTypes;
        }
        return this.fuelTypesRepo.getAll();
    }

    async getFuelStations(): Promise<FuelStation[]> {
        if (this.cache.fuelStations && this.isCacheValid()) {
            return this.cache.fuelStations;
        }
        return this.fuelStationsRepo.getAll();
    }

    async getVehicleBrands(): Promise<VehicleBrand[]> {
        if (this.cache.vehicleBrands && this.isCacheValid()) {
            return this.cache.vehicleBrands;
        }
        return this.vehicleBrandsRepo.getAll();
    }

    async getVehicleModels(): Promise<VehicleModel[]> {
        if (this.cache.vehicleModels && this.isCacheValid()) {
            return this.cache.vehicleModels;
        }
        const modelsDB = await this.vehicleModelsRepo.getAll();
        return modelsDB.map(model => ({
            id: model.id,
            brandId: model.brand_id,
            name: model.name,
        }));
    }

    async getVehicleTypes(): Promise<VehicleType[]> {
        if (this.cache.vehicleTypes && this.isCacheValid()) {
            return this.cache.vehicleTypes;
        }
        return this.vehicleTypesRepo.getAll();
    }

    async getMaintenanceTypes(): Promise<MaintenanceType[]> {
        if (this.cache.maintenanceTypes && this.isCacheValid()) {
            return this.cache.maintenanceTypes;
        }
        return this.maintenanceTypesRepo.getAll();
    }

    async getMaintenancePlans(): Promise<MaintenancePlan[]> {
        if (this.cache.maintenancePlans && this.isCacheValid()) {
            return this.cache.maintenancePlans;
        }
        return this.maintenancePlansRepo.getAll();
    }

    async getMaintenanceServices(): Promise<MaintenanceService[]> {
        if (this.cache.maintenanceServices && this.isCacheValid()) {
            return this.cache.maintenanceServices;
        }
        const servicesDB = await this.maintenanceServicesRepo.getAll();
        return servicesDB.map(service => ({
            id: service.id,
            planId: service.plan_id,
            description: service.description,
        }));
    }

    async getTrafficTicketTypes(): Promise<TrafficTicketType[]> {
        if (this.cache.trafficTicketTypes && this.isCacheValid()) {
            return this.cache.trafficTicketTypes;
        }
        return this.trafficTicketTypesRepo.getAll();
    }
}

// Instancia singleton para compartir caché entre componentes
export const commonInfoService = new CommonInfoService();
