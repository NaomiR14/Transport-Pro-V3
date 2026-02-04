'use client'

import { StatsCard } from '@/shared/components/common/StatsCard'
import { TotalSalesCard } from './TotalSalesCard'
import { ProductStatistics } from './ProductStatistics'
import { CustomerHabbitsChart } from './CustomerHabbitsChart'
import { CustomerGrowth } from './CustomerGrowth'
import { 
  useDashboardMetrics, 
  useVehicleDistribution,
  useMonthlyUsage,
  useDriversByRegion 
} from '../hooks/useDashboardMetrics'
import { Truck, Users, TrendingUp, AlertTriangle } from 'lucide-react'

export function DashboardMetrics() {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()
  const { data: vehicleDistribution, isLoading: distributionLoading } = useVehicleDistribution()
  const { data: monthlyUsage, isLoading: usageLoading } = useMonthlyUsage()
  const { data: driversByRegion, isLoading: driversLoading } = useDriversByRegion()

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Resumen general de métricas y estadísticas</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Vehículos Totales"
          value={metrics?.totalVehicles || 0}
          icon={Truck}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          loading={metricsLoading}
        />
        <StatsCard
          title="Vehículos Disponibles"
          value={metrics?.availableVehicles || 0}
          subtitle={`${metrics?.inRouteVehicles || 0} en ruta`}
          icon={Truck}
          iconColor="text-green-600"
          iconBgColor="bg-green-50 dark:bg-green-900/20"
          loading={metricsLoading}
        />
        <StatsCard
          title="Conductores Activos"
          value={metrics?.activeDrivers || 0}
          subtitle={`${metrics?.totalDrivers || 0} totales`}
          icon={Users}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-50 dark:bg-purple-900/20"
          loading={metricsLoading}
        />
        <StatsCard
          title="Alertas Pendientes"
          value={metrics?.pendingAlerts || 0}
          subtitle="Requieren atención"
          icon={AlertTriangle}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-50 dark:bg-amber-900/20"
          loading={metricsLoading}
        />
      </div>

      {/* Revenue Card + Vehicle Distribution */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-1">
          <TotalSalesCard
            value={metrics?.totalRevenue.toLocaleString() || '0'}
            change={metrics?.revenueChange}
            loading={metricsLoading}
          />
        </div>
        <div className="lg:col-span-2">
          <ProductStatistics 
            data={vehicleDistribution || []} 
            loading={distributionLoading}
          />
        </div>
      </div>

      {/* Monthly Usage Chart + Driver Growth */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <CustomerHabbitsChart 
          data={monthlyUsage || []} 
          loading={usageLoading}
        />
        <CustomerGrowth 
          data={driversByRegion || []} 
          loading={driversLoading}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Rutas Completadas"
          value={metrics?.completedRoutes || 0}
          subtitle={`${metrics?.totalRoutes || 0} totales`}
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
          loading={metricsLoading}
        />
        <StatsCard
          title="Mantenimientos Activos"
          value={metrics?.maintenanceVehicles || 0}
          subtitle="Vehículos en taller"
          icon={Truck}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-50 dark:bg-orange-900/20"
          loading={metricsLoading}
        />
        <StatsCard
          title="Tasa de Disponibilidad"
          value={`${metrics?.availableVehicles && metrics?.totalVehicles 
            ? Math.round((metrics.availableVehicles / metrics.totalVehicles) * 100) 
            : 0}%`}
          subtitle="Flota disponible"
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-50 dark:bg-blue-900/20"
          loading={metricsLoading}
        />
      </div>
    </div>
  )
}
