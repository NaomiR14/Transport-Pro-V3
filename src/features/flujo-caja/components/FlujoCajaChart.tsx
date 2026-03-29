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
import { FlujoCajaAnual, MESES_CORTOS } from '../types/flujo-caja.types'

interface FlujoCajaChartProps {
  data: FlujoCajaAnual | undefined
  loading: boolean
}

function formatCurrencyShort(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
  return `$${value}`
}

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
  dataKey: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm" style={{ color: entry.color }}>
          {entry.name}:{' '}
          {entry.dataKey === 'margen'
            ? `${entry.value.toFixed(1)}%`
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

export function FlujoCajaChart({ data, loading }: FlujoCajaChartProps) {
  if (loading) {
    return (
      <div className="h-[350px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
    )
  }

  if (!data) return null

  const chartData = data.meses.map((mes) => ({
    name: MESES_CORTOS[mes.mes - 1],
    ingresos: mes.ingresos,
    margen: mes.margen,
  }))

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            className="text-slate-600 dark:text-slate-400"
          />
          <YAxis
            yAxisId="left"
            tickFormatter={formatCurrencyShort}
            tick={{ fontSize: 12 }}
            className="text-slate-600 dark:text-slate-400"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 12 }}
            className="text-slate-600 dark:text-slate-400"
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '13px' }}
          />
          <Bar
            yAxisId="left"
            dataKey="ingresos"
            name="Ingresos ($)"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="margen"
            name="Margen (%)"
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
