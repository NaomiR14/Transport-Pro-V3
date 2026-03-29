"use client"

import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { ReporteGeneralAnual, MESES_CORTOS } from '../types/reporte-general.types'

interface ReporteGeneralChartProps {
  data: ReporteGeneralAnual | undefined
  loading: boolean
}

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`
  return `$${value}`
}

interface TooltipEntry {
  name: string
  value: number
  color: string
  dataKey: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-700 dark:text-slate-200 mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}:{' '}
          {entry.dataKey === 'margen_bruto'
            ? `${Number(entry.value).toFixed(1)}%`
            : new Intl.NumberFormat('es-PE', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              }).format(entry.value)
          }
        </p>
      ))}
    </div>
  )
}

export function ReporteGeneralChart({ data, loading }: ReporteGeneralChartProps) {
  if (loading) {
    return <div className="h-[320px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
  }
  if (!data) return null

  const chartData = data.meses.map((m) => ({
    name:        MESES_CORTOS[m.mes - 1],
    ingresos:    m.ingresos,
    gastos:      m.gastos,
    margen_bruto: m.margen_bruto,
  }))

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 24, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            className="text-slate-600 dark:text-slate-400"
          />
          {/* Eje izquierdo: valores monetarios */}
          <YAxis
            yAxisId="left"
            tickFormatter={formatCurrencyShort}
            tick={{ fontSize: 11 }}
            className="text-slate-600 dark:text-slate-400"
          />
          {/* Eje derecho: porcentaje de margen */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v: number) => `${v.toFixed(0)}%`}
            tick={{ fontSize: 11 }}
            className="text-slate-600 dark:text-slate-400"
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '13px' }} />

          <Bar
            yAxisId="left"
            dataKey="ingresos"
            name="Ingresos ($)"
            fill="#10b981"
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
          />
          <Bar
            yAxisId="left"
            dataKey="gastos"
            name="Gastos ($)"
            fill="#ef4444"
            radius={[3, 3, 0, 0]}
            maxBarSize={40}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="margen_bruto"
            name="Margen Bruto (%)"
            stroke="#f59e0b"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#f59e0b' }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
