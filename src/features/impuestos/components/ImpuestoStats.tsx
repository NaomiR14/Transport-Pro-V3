import React from 'react'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { Receipt, CheckCircle, Clock, DollarSign } from 'lucide-react'
import { ImpuestoStats as ImpuestoStatsType } from '../types/impuestos.types'

interface ImpuestoStatsProps {
  stats: ImpuestoStatsType | undefined
  loading?: boolean
}

export function ImpuestoStats({ stats, loading = false }: ImpuestoStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Impuestos"
        value={stats?.total || 0}
        icon={Receipt}
        iconBgColor="bg-blue-50 dark:bg-blue-900/20"
        iconColor="text-blue-600 dark:text-blue-400"
        loading={loading}
      />
      
      <StatsCard
        title="Pagados"
        value={stats?.pagados || 0}
        icon={CheckCircle}
        iconBgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
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
        title="Total Pagado"
        value={formatCurrency(stats?.total_pagado || 0)}
        icon={DollarSign}
        iconBgColor="bg-purple-50 dark:bg-purple-900/20"
        iconColor="text-purple-600 dark:text-purple-400"
        loading={loading}
      />
    </div>
  )
}
