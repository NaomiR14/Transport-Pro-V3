import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface DashboardMetrics {
  totalVehicles: number
  availableVehicles: number
  inRouteVehicles: number
  maintenanceVehicles: number
  totalDrivers: number
  activeDrivers: number
  totalRoutes: number
  completedRoutes: number
  pendingAlerts: number
  totalRevenue: number
  revenueChange: number
}

export interface VehicleDistribution {
  name: string
  value: number
  percentage: number
}

export interface MonthlyUsage {
  month: string
  enRuta: number
  disponibles: number
}

export interface DriverByRegion {
  country: string
  flag: string
  drivers: number
  growth: number
}

async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = createClient()

  // Obtener vehículos
  const { data: vehicles, error: vehiclesError } = await supabase
    .from('vehicles')
    .select('vehicle_state')

  if (vehiclesError) throw vehiclesError

  const totalVehicles = vehicles?.length || 0
  const availableVehicles = vehicles?.filter(v => v.vehicle_state === 'Disponible').length || 0
  const inRouteVehicles = vehicles?.filter(v => v.vehicle_state === 'En Uso').length || 0
  const maintenanceVehicles = vehicles?.filter(v => v.vehicle_state === 'En Mantenimiento').length || 0

  // Obtener conductores
  const { data: drivers, error: driversError } = await supabase
    .from('conductores')
    .select('estado')

  if (driversError) throw driversError

  const totalDrivers = drivers?.length || 0
  const activeDrivers = drivers?.filter(d => d.estado === 'Activo').length || 0

  // Obtener rutas
  const { data: routes, error: routesError } = await supabase
    .from('rutas_viajes')
    .select('estado')

  if (routesError) throw routesError

  const totalRoutes = routes?.length || 0
  const completedRoutes = routes?.filter(r => r.estado === 'Completado').length || 0

  // Calcular alertas (vehículos que necesitan mantenimiento + multas pendientes)
  const { data: multas, error: multasError } = await supabase
    .from('multas_conductores')
    .select('estado')
    .eq('estado', 'Pendiente')

  const pendingAlerts = maintenanceVehicles + (multas?.length || 0)

  // Revenue simulado (en producción vendría de una tabla de ingresos)
  const totalRevenue = 612917
  const revenueChange = 2.6

  return {
    totalVehicles,
    availableVehicles,
    inRouteVehicles,
    maintenanceVehicles,
    totalDrivers,
    activeDrivers,
    totalRoutes,
    completedRoutes,
    pendingAlerts,
    totalRevenue,
    revenueChange,
  }
}

async function fetchVehicleDistribution(): Promise<VehicleDistribution[]> {
  const supabase = createClient()

  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('type')

  if (error) throw error

  // Agrupar por tipo
  const typeCount: Record<string, number> = {}
  vehicles?.forEach(v => {
    typeCount[v.type] = (typeCount[v.type] || 0) + 1
  })

  const total = vehicles?.length || 1

  return Object.entries(typeCount).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / total) * 100),
  }))
}

async function fetchMonthlyUsage(): Promise<MonthlyUsage[]> {
  // Datos simulados por ahora - en producción vendría de una tabla de histórico
  return [
    { month: 'Ene', enRuta: 65, disponibles: 35 },
    { month: 'Feb', enRuta: 59, disponibles: 41 },
    { month: 'Mar', enRuta: 80, disponibles: 20 },
    { month: 'Abr', enRuta: 81, disponibles: 19 },
    { month: 'May', enRuta: 56, disponibles: 44 },
    { month: 'Jun', enRuta: 55, disponibles: 45 },
    { month: 'Jul', enRuta: 70, disponibles: 30 },
  ]
}

async function fetchDriversByRegion(): Promise<DriverByRegion[]> {
  const supabase = createClient()

  const { data: drivers, error } = await supabase
    .from('conductores')
    .select('ciudad_residencia')

  if (error) throw error

  // Agrupar por ciudad
  const cityCount: Record<string, number> = {}
  drivers?.forEach(d => {
    const city = d.ciudad_residencia || 'Sin especificar'
    cityCount[city] = (cityCount[city] || 0) + 1
  })

  // Convertir a formato requerido
  const flagMap: Record<string, string> = {
    'Bogotá': '🏙️',
    'Medellín': '🌄',
    'Cali': '🌴',
    'Barranquilla': '🏖️',
    'Cartagena': '🏝️',
  }

  return Object.entries(cityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([city, count]) => ({
      country: city,
      flag: flagMap[city] || '📍',
      drivers: count,
      growth: Math.random() * 20 - 5, // Simulado
    }))
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

export function useVehicleDistribution() {
  return useQuery({
    queryKey: ['vehicle-distribution'],
    queryFn: fetchVehicleDistribution,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

export function useMonthlyUsage() {
  return useQuery({
    queryKey: ['monthly-usage'],
    queryFn: fetchMonthlyUsage,
    staleTime: 10 * 60 * 1000,
  })
}

export function useDriversByRegion() {
  return useQuery({
    queryKey: ['drivers-by-region'],
    queryFn: fetchDriversByRegion,
    staleTime: 10 * 60 * 1000,
  })
}
