// Public exports for vehiculos feature

// Types
export type {
  Vehicle,
  CreateVehicleRequest,
  VehicleFilters,
  VehicleStats,
  VehicleStore
} from './types/vehiculo.types'

// Store
export { useVehicleStore, calculateStats } from './store/vehiculo-store'

// Service
export { vehicleService, VehicleService } from './services/vehiculo-service'

// Hooks
export {
  useVehicles,
  useVehicle,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  useVehiclesStats,
  useSearchVehicles,
  useFilteredVehicles,
  useVehicleFilterOptions
} from './hooks/use-vehiculos'

// Components
export { VehiculoStats } from './components/VehiculoStats'
export { VehiculoFilters } from './components/VehiculoFilters'
export { default as VehiculoFormModal } from './components/VehiculoFormModal'
// export { VehiculosTable } from './components/VehiculosTable'
// export { VehiculoForm } from './components/VehiculoForm'
