import React from 'react'
import { StatsCard } from '@/shared/components/common/StatsCard'
import { DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { MultaConductorStats } from '../types/multas.types'

interface MultasStatsProps {
  stats: MultaConductorStats | undefined
  loading?: boolean
}

export function MultasStats({ stats, loading = false }: MultasStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatsCard
        title="Total Multas"
        value={stats?.totalMultas || 0}
        icon={AlertTriangle}
        iconBgColor="bg-amber-50 dark:bg-amber-900/20"
        iconColor="text-amber-600 dark:text-amber-400"
        loading={loading}
      />
      
      <StatsCard
        title="Pagadas"
        value={stats?.multasPagadas || 0}
        icon={CheckCircle}
        iconBgColor="bg-green-50 dark:bg-green-900/20"
        iconColor="text-green-600 dark:text-green-400"
        loading={loading}
      />
      
      <StatsCard
        title="Pendientes"
        value={stats?.multasPendientes || 0}
        icon={Clock}
        iconBgColor="bg-yellow-50 dark:bg-yellow-900/20"
        iconColor="text-yellow-600 dark:text-yellow-400"
        loading={loading}
      />
      
      <StatsCard
        title="Vencidas"
        value={stats?.multasVencidas || 0}
        icon={AlertTriangle}
        iconBgColor="bg-red-50 dark:bg-red-900/20"
        iconColor="text-red-600 dark:text-red-400"
        loading={loading}
      />
      
      <StatsCard
        title="Total Debe"
        value={`$${(stats?.totalDebe || 0).toLocaleString()}`}
        icon={DollarSign}
        iconBgColor="bg-red-50 dark:bg-red-900/20"
        iconColor="text-red-600 dark:text-red-400"
        loading={loading}
      />
    </div>
  )
}

// {/* Cards de Estadísticas */}
//                     <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
//                         <Card>
//                             <CardHeader className="pb-3">
//                                 <CardTitle className="text-sm font-medium">Total Multas</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="text-2xl font-bold">{totalMultas}</div>
//                             </CardContent>
//                         </Card>
//                         <Card>
//                             <CardHeader className="pb-3">
//                                 <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="text-2xl font-bold text-green-600">{multasPagadas}</div>
//                             </CardContent>
//                         </Card>
//                         <Card>
//                             <CardHeader className="pb-3">
//                                 <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="text-2xl font-bold text-yellow-600">{multasPendientes}</div>
//                             </CardContent>
//                         </Card>
//                         <Card>
//                             <CardHeader className="pb-3">
//                                 <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="text-2xl font-bold text-red-600">{multasVencidas}</div>
//                             </CardContent>
//                         </Card>
//                         <Card>
//                             <CardHeader className="pb-3">
//                                 <CardTitle className="text-sm font-medium">Total Debe</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <div className="text-2xl font-bold text-red-600">${totalDebe.toLocaleString()}</div>
//                             </CardContent>
//                         </Card>
//                     </div>
