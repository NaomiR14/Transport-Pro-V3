import React from 'react'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Truck, CheckCircle, Wrench, AlertTriangle } from 'lucide-react'
import { ConductorStats } from '../types/conductor.types'

interface ConductorStatsProps {
  stats: ConductorStats | null
  loading?: boolean
}

export function ConductoresStats({ stats, loading = false }: ConductorStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Conductores"
        value={stats?.total || 0}
        icon={Truck}
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
        loading={loading}
      />
      
      <StatsCard
        title="Activos"
        value={stats?.activos || 0}
        icon={CheckCircle}
        iconBgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
        loading={loading}
      />
      
      <StatsCard
        title="Licencias Vencidas"
        value={stats?.licencias_vencidas || 0}
        icon={Wrench}
        iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
        iconColor="text-yellow-600 dark:text-yellow-400"
        loading={loading}
      />
      
      <StatsCard
        title="Calificación Promedio"
        value={stats?.calificacion_promedio.toFixed(1) || "0.0"}
        icon={AlertTriangle}
        iconBgColor="bg-orange-50 dark:bg-orange-900/20"
        iconColor="text-orange-600 dark:text-orange-400"
        loading={loading}
      />
    </div>
  )
}
