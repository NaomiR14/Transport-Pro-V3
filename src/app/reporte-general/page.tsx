"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileBarChart2,
  Route,
  TrendingUp,
  TrendingDown,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/shared/components/common/StatsCard"
import { PageHeader } from "@/shared/components/common/PageHeader"
import {
  useReporteGeneral,
  usePlacasVehiculos,
  ReporteGeneralTable,
  ReporteGeneralChart,
  useReporteGeneralTutorial,
} from "@/features/reporte-general"

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)

const TODA_FLOTA = "__all__"

function fmt(v: number) {
  return new Intl.NumberFormat("es-PE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v)
}

function fmtCurrency(v: number) {
  return `$${fmt(v)}`
}

export default function ReporteGeneralPage() {
  const [anio, setAnio]   = useState(currentYear)
  const [placa, setPlaca] = useState<string | undefined>(undefined)

  const { data, isLoading, error } = useReporteGeneral(anio, placa)
  const { data: placas = [], isLoading: loadingPlacas } = usePlacasVehiculos()
  const { startTutorial } = useReporteGeneralTutorial()

  // ── Error state ──────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-6 container-padding">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          Reporte General
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

  const totales = data?.totales

  return (
    <div className="p-6 container-padding">
      <PageHeader
        title="Reporte General de Indicadores"
        subtitle="Análisis anual por vehículo — operacional y financiero"
        icon={FileBarChart2}
        iconColor="text-indigo-600"
        iconBg="bg-indigo-100 dark:bg-indigo-900/30"
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
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">Vehículo:</span>
              <Select value={placa ?? TODA_FLOTA} onValueChange={(v) => setPlaca(v === TODA_FLOTA ? undefined : v)} disabled={loadingPlacas}>
                <SelectTrigger className="w-36 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                  <SelectValue placeholder="Toda la flota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TODA_FLOTA}>Toda la flota</SelectItem>
                  {placas.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
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

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div id="reporte-general-kpis" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Viajes"
          value={totales ? fmt(totales.nro_viajes) : "—"}
          icon={Route}
          iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
          iconColor="text-indigo-600 dark:text-indigo-400"
          loading={isLoading}
        />
        <StatsCard
          title="Kms Recorridos"
          value={totales ? `${fmt(totales.kms_recorridos)} km` : "—"}
          icon={FileBarChart2}
          iconBgColor="bg-cyan-50 dark:bg-cyan-900/20"
          iconColor="text-cyan-600 dark:text-cyan-400"
          loading={isLoading}
        />
        <StatsCard
          title="Ingresos Totales"
          value={totales ? fmtCurrency(totales.ingresos) : "—"}
          icon={TrendingUp}
          iconBgColor="bg-emerald-50 dark:bg-emerald-900/20"
          iconColor="text-emerald-600 dark:text-emerald-400"
          loading={isLoading}
        />
        <StatsCard
          title="Gastos Totales"
          value={totales ? fmtCurrency(totales.gastos) : "—"}
          icon={TrendingDown}
          iconBgColor="bg-red-50 dark:bg-red-900/20"
          iconColor="text-red-600 dark:text-red-400"
          loading={isLoading}
        />
      </div>

      {/* ── Tabla de Indicadores ───────────────────────────────────────────── */}
      <Card id="reporte-general-tabla" className="mb-8 hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Indicadores por Mes — {anio}
            {placa && (
              <span className="ml-2 text-sm font-normal text-indigo-600 dark:text-indigo-400">
                · {placa}
              </span>
            )}
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Datos principales, indicadores de transporte e indicadores financieros
          </p>
        </CardHeader>
        <CardContent>
          <ReporteGeneralTable data={data} loading={isLoading} />
        </CardContent>
      </Card>

      {/* ── Gráfico ────────────────────────────────────────────────────────── */}
      <Card id="reporte-general-chart" className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-slate-900 dark:text-white">
            Ingresos vs Gastos y Margen Bruto — {anio}
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Evolución mensual del resultado financiero
          </p>
        </CardHeader>
        <CardContent>
          <ReporteGeneralChart data={data} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
