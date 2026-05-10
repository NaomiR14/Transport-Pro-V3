"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TrendingUp, Percent, BarChart3, TrendingDown, HelpCircle } from "lucide-react"
import {
  useFlujoCajaAnual,
  FlujoCajaTable,
  FlujoCajaChart,
  EgresosVariosTable,
  useFlujoCajaTutorial,
} from "@/features/flujo-caja"
import { StatsCard } from "@/shared/components/common/StatsCard"
import { PageHeader } from "@/shared/components/common/PageHeader"

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

export default function FlujoCajaPage() {
  const [anio, setAnio] = useState(currentYear)
  const { data, isLoading, error } = useFlujoCajaAnual(anio)
  const { startTutorial } = useFlujoCajaTutorial()

  if (error) {
    return (
      <div className="p-6 container-padding">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Flujo de Caja
          </h1>
        </div>
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-red-500 mb-4">{error.message}</p>
            <button
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 container-padding">
      <PageHeader
        title="Flujo de Caja Mensual"
        subtitle="Resumen de ingresos, egresos, utilidad y margen de la flota por mes"
        icon={TrendingUp}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        action={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Año:</span>
              <Select value={String(anio)} onValueChange={(value) => setAnio(Number(value))}>
                <SelectTrigger className="w-28 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={startTutorial}
              className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <HelpCircle className="h-4 w-4" />
              Ver tutorial
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div id="flujo-caja-kpis" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Ingresos Totales"
          value={data ? `$${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data.totales.ingresos)}` : '—'}
          icon={TrendingUp}
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
          loading={isLoading}
        />
        <StatsCard
          title="Egresos Totales"
          value={data ? `$${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data.totales.egresos)}` : '—'}
          icon={TrendingDown}
          iconBgColor="bg-red-50 dark:bg-red-900/20"
          iconColor="text-red-600 dark:text-red-400"
          loading={isLoading}
        />
        <StatsCard
          title="Utilidad"
          value={data ? `$${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(data.totales.utilidad)}` : '—'}
          icon={BarChart3}
          iconBgColor={data && data.totales.utilidad < 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}
          iconColor={data && data.totales.utilidad < 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}
          loading={isLoading}
        />
        <StatsCard
          title="Margen"
          value={data ? `${data.totales.margen.toFixed(1)}%` : '—'}
          icon={Percent}
          iconBgColor={data && data.totales.margen < 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}
          iconColor={data && data.totales.margen < 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}
          loading={isLoading}
        />
      </div>

      {/* Tabla Principal de Flujo de Caja */}
      <Card id="flujo-caja-tabla" className="mb-8 hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Flujo de Caja — {anio}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FlujoCajaTable data={data} loading={isLoading} />
        </CardContent>
      </Card>

      {/* Gráfico de Ingresos y Margen */}
      <Card id="flujo-caja-chart" className="mb-8 hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Ingresos y Margen Mensual — {anio}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FlujoCajaChart data={data} loading={isLoading} />
        </CardContent>
      </Card>

      {/* Tabla de Egresos Varios */}
      <Card id="flujo-caja-egresos" className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Egresos Varios — {anio}
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Registra los gastos de personal y otros egresos por mes
          </p>
        </CardHeader>
        <CardContent>
          <EgresosVariosTable anio={anio} />
        </CardContent>
      </Card>
    </div>
  )
}
