import React from 'react'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Package, Clock, Truck, CheckCircle } from 'lucide-react'
import { OrdenStats } from '../types/ordenes.types'

interface OrdenesStatsProps {
  stats: OrdenStats | null
  loading?: boolean
}

export function OrdenesStats({ stats, loading = false }: OrdenesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Órdenes"
        value={stats?.total || 0}
        icon={Package}
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
        loading={loading}
      />

      <StatsCard
        title="Pendientes"
        value={stats?.pendientes || 0}
        icon={Clock}
        iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
        iconColor="text-yellow-600 dark:text-yellow-400"
        loading={loading}
      />

      <StatsCard
        title="En Tránsito"
        value={stats?.en_transito || 0}
        icon={Truck}
        iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
        iconColor="text-indigo-600 dark:text-indigo-400"
        loading={loading}
      />

      <StatsCard
        title="Entregadas"
        value={stats?.entregadas || 0}
        icon={CheckCircle}
        iconBgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
        loading={loading}
      />
    </div>
  )
}
