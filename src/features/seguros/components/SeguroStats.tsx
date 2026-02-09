import React from 'react'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Shield, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { SeguroStats as SeguroStatsType } from '../types/seguros.types'

interface SeguroStatsProps {
  stats: SeguroStatsType | undefined
  loading?: boolean
}

export function SeguroStats({ stats, loading = false }: SeguroStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Pólizas"
        value={stats?.total || 0}
        icon={Shield}
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
        loading={loading}
      />
      
      <StatsCard
        title="Vigentes"
        value={stats?.vigentes || 0}
        icon={CheckCircle}
        iconBgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
        loading={loading}
      />
      
      <StatsCard
        title="Por Vencer"
        value={stats?.por_vencer || 0}
        icon={AlertTriangle}
        iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
        iconColor="text-yellow-600 dark:text-yellow-400"
        loading={loading}
      />
      
      <StatsCard
        title="Vencidas"
        value={stats?.vencidas || 0}
        icon={XCircle}
        iconBgColor="bg-red-50 dark:bg-red-900/20"
        iconColor="text-red-600 dark:text-red-400"
        loading={loading}
      />
    </div>
  )
}
