import React from 'react'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Building, Star, Wrench, TrendingUp } from 'lucide-react'
import { TallerStats as TallerStatsType } from '../types/talleres.types'

interface TallerStatsProps {
  stats: TallerStatsType | undefined
  loading?: boolean
}

export function TallerStats({ stats, loading = false }: TallerStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <StatsCard
        title="Total Talleres"
        value={stats?.total || 0}
        icon={Building}
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
        loading={loading}
      />
      
      <StatsCard
        title="Calificación Promedio"
        value={stats?.calificacionPromedio ? stats.calificacionPromedio.toFixed(1) : '0.0'}
        icon={Star}
        iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
        iconColor="text-yellow-600 dark:text-yellow-400"
        loading={loading}
      />
    </div>
  )
}
