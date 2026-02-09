import React from 'react'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Wrench, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { MantenimientoVehiculoStats as MantenimientoStatsType } from '../types/mantenimiento.types'

interface MantenimientoStatsProps {
  stats: MantenimientoStatsType | undefined | null
  loading?: boolean
}

export function MantenimientoStats({ stats, loading = false }: MantenimientoStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Mantenimientos"
        value={stats?.total || 0}
        icon={Wrench}
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
        loading={loading}
      />
      
      <StatsCard
        title="Completados"
        value={stats?.completados || 0}
        icon={CheckCircle}
        iconBgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
        loading={loading}
      />
      
      <StatsCard
        title="En Proceso"
        value={stats?.enProceso || 0}
        icon={Clock}
        iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
        iconColor="text-yellow-600 dark:text-yellow-400"
        loading={loading}
      />
      
      <StatsCard
        title="Costo Pendiente"
        value={`$${(stats?.costoPendiente || 0).toFixed(2)}`}
        icon={DollarSign}
        iconBgColor="bg-purple-50 dark:bg-purple-900/20"
        iconColor="text-purple-600 dark:text-purple-400"
        loading={loading}
      />
    </div>
  )
}
