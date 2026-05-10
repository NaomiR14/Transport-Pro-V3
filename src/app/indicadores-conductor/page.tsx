"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Users, Route, FileBarChart2, TrendingUp, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/shared/components/common/StatsCard"
import { PageHeader } from "@/shared/components/common/PageHeader"
import {
  useReporteConductores,
  ReporteConductoresTable,
  MESES_NOMBRES,
  useReporteConductoresTutorial,
} from "@/features/reporte-conductores"

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

const TODO_EL_ANIO = "__all__"

export default function ReporteConductoresPage() {
  const [anio, setAnio] = useState(currentYear)
  const [mes, setMes] = useState<number | undefined>(undefined)

  const { data, isLoading, error } = useReporteConductores(anio, mes)
  const { startTutorial } = useReporteConductoresTutorial()

  if (error) {
    return (
      <div className="p-6 container-padding">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Reporte de Conductores
        </h1>
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-red-500 mb-4">{(error as Error).message}</p>
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

  // Calcular totales para los KPI cards
  const totals = data?.reduce(
    (acc, row) => ({
      conductores: acc.conductores + 1,
      viajes: acc.viajes + row.nro_viajes,
      kms: acc.kms + row.kms_recorridos,
      ingresos: acc.ingresos + row.ingresos,
    }),
    { conductores: 0, viajes: 0, kms: 0, ingresos: 0 },
  )

  const mesLabel = mes ? MESES_NOMBRES[mes - 1] : 'Todo el año'

  function fmt(v: number) {
    return new Intl.NumberFormat("es-PE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(v)
  }

  return (
    <div className="p-6 container-padding">
      <PageHeader
        title="Reporte de Conductores"
        subtitle="Indicadores de rendimiento por conductor — viajes, carga, ingresos y multas"
        icon={Users}
        iconColor="text-pink-600"
        iconBg="bg-pink-100 dark:bg-pink-900/30"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Año:</span>
              <Select value={String(anio)} onValueChange={(v) => setAnio(Number(v))}>
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
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Mes:</span>
              <Select value={mes ? String(mes) : TODO_EL_ANIO} onValueChange={(v) => setMes(v === TODO_EL_ANIO ? undefined : Number(v))}>
                <SelectTrigger className="w-36 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Todo el año" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODO_EL_ANIO}>Todo el año</SelectItem>
                  {MESES_NOMBRES.map((nombre, idx) => (
                    <SelectItem key={idx + 1} value={String(idx + 1)}>{nombre}</SelectItem>
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
      <div id="reporte-conductores-kpis" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Conductores Activos"
          value={totals ? fmt(totals.conductores) : "—"}
          icon={Users}
          iconBgColor="bg-pink-50 dark:bg-pink-900/20"
          iconColor="text-pink-600 dark:text-pink-400"
          loading={isLoading}
        />
        <StatsCard
          title="Total Viajes"
          value={totals ? fmt(totals.viajes) : "—"}
          icon={Route}
          iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
          iconColor="text-indigo-600 dark:text-indigo-400"
          loading={isLoading}
        />
        <StatsCard
          title="Kms Recorridos"
          value={totals ? `${fmt(totals.kms)} km` : "—"}
          icon={FileBarChart2}
          iconBgColor="bg-cyan-50 dark:bg-cyan-900/20"
          iconColor="text-cyan-600 dark:text-cyan-400"
          loading={isLoading}
        />
        <StatsCard
          title="Ingresos Totales"
          value={totals ? `$${fmt(totals.ingresos)}` : "—"}
          icon={TrendingUp}
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
          loading={isLoading}
        />
      </div>

      {/* Tabla */}
      <Card id="reporte-conductores-tabla" className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Indicadores por Conductor — {anio}
            <span className="ml-2 text-sm font-normal text-pink-600 dark:text-pink-400">
              · {mesLabel}
            </span>
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Viajes, kilómetros, carga, ingresos y multas por conductor
          </p>
        </CardHeader>
        <CardContent>
          <ReporteConductoresTable data={data} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
