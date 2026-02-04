// Public exports for dashboard feature

// Components
export { TotalSalesCard } from './components/TotalSalesCard'
export { ProductStatistics } from './components/ProductStatistics'
export { CustomerHabbitsChart } from './components/CustomerHabbitsChart'
export { CustomerGrowth } from './components/CustomerGrowth'
export { DashboardMetrics } from './components/DashboardMetrics'
export { default as DashboardContent } from './components/DashboardContent'

// Hooks
export { 
  useDashboardMetrics,
  useVehicleDistribution,
  useMonthlyUsage,
  useDriversByRegion 
} from './hooks/useDashboardMetrics'

// Types
export type {
  DashboardMetrics as DashboardMetricsType,
  VehicleDistribution,
  MonthlyUsage,
  DriverByRegion
} from './hooks/useDashboardMetrics'
