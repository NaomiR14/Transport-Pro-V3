// Common information types for shared data tables

export interface FuelType {
    id: number
    type: string
}

export interface FuelStation {
    id: number
    name: string
}

export interface VehicleBrand {
    id: number
    name: string
}

export interface VehicleModel {
    id: number
    brandId: number
    name: string
}

export interface VehicleType {
    id: number
    type: string
}

export interface MaintenanceType {
    id: number
    type: string
}

export interface MaintenancePlan {
    id: number
    name: string
}

export interface MaintenanceService {
    id: number
    planId: number
    description: string
}

export interface TrafficTicketType {
    id: number
    type: string
}

export interface CommonInfo {
    fuelTypes: FuelType[]
    fuelStations: FuelStation[]
    vehicleBrands: VehicleBrand[]
    vehicleModels: VehicleModel[]
    vehicleTypes: VehicleType[]
    maintenanceTypes: MaintenanceType[]
    maintenancePlans: MaintenancePlan[]
    maintenanceServices: MaintenanceService[]
    trafficTicketTypes: TrafficTicketType[]
}
