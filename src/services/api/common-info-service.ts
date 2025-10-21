import { apiClient } from '@/services/api/api-base-client';
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
    private readonly endpoint = '/CommonInfo';

    async getCommonInfo(): Promise<CommonInfo> {
        const response = await apiClient.get<CommonInfo>(this.endpoint);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    async getFuelTypes(): Promise<FuelType[]> {
        const data = await this.getCommonInfo();
        return data.fuelTypes;
    }

    async getFuelStations(): Promise<FuelStation[]> {
        const data = await this.getCommonInfo();
        return data.fuelStations;
    }

    async getVehicleBrands(): Promise<VehicleBrand[]> {
        const data = await this.getCommonInfo();
        return data.vehicleBrands;
    }

    async getVehicleModels(): Promise<VehicleModel[]> {
        const data = await this.getCommonInfo();
        return data.vehicleModels;
    }

    async getVehicleTypes(): Promise<VehicleType[]> {
        const data = await this.getCommonInfo();
        return data.vehicleTypes;
    }

    async getMaintenanceTypes(): Promise<MaintenanceType[]> {
        const data = await this.getCommonInfo();
        return data.maintenanceTypes;
    }

    async getMaintenancePlans(): Promise<MaintenancePlan[]> {
        const data = await this.getCommonInfo();
        return data.maintenancePlans;
    }

    async getMaintenanceServices(): Promise<MaintenanceService[]> {
        const data = await this.getCommonInfo();
        return data.maintenanceServices;
    }

    async getTrafficTicketTypes(): Promise<TrafficTicketType[]> {
        const data = await this.getCommonInfo();
        return data.trafficTicketTypes;
    }
}