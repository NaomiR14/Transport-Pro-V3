"use client"

import { ReporteConductorRow } from '../types/reporte-conductores.types'
import { cn } from '@/lib/utils'

interface ReporteConductoresTableProps {
  data: ReporteConductorRow[] | undefined
  loading: boolean
}

type ColFormat = 'integer' | 'decimal1' | 'decimal2' | 'currency' | 'currency2'

interface ColumnConfig {
  key: keyof ReporteConductorRow
  label: string
  format: ColFormat
  headerClass?: string
  cellClass?: string
}

const COLUMNS: ColumnConfig[] = [
  { key: 'nro_viajes',       label: 'Nro Viajes',     format: 'integer' },
  { key: 'kms_recorridos',   label: 'Kms Recorridos', format: 'integer' },
  { key: 'km_por_viaje',     label: 'Km/Viaje',       format: 'decimal1' },
  { key: 'carga_kg',         label: 'Carga (Kg)',     format: 'integer' },
  { key: 'carga_por_km',     label: 'Carga/Km',       format: 'decimal2' },
  { key: 'carga_por_viaje',  label: 'Carga/Viaje',    format: 'decimal1' },
  { key: 'ingresos',         label: 'Ingresos ($)',   format: 'currency', cellClass: 'text-emerald-700 dark:text-emerald-400 font-semibold' },
  { key: 'ingreso_por_km',   label: 'Ingreso/Km',     format: 'currency2' },
  { key: 'ingreso_por_viaje',label: 'Ingreso/Viaje',  format: 'currency' },
  { key: 'nro_multas',       label: 'Nro Multas',     format: 'integer', cellClass: 'text-red-600 dark:text-red-400' },
  { key: 'gastos_multas',    label: 'Gastos Multas ($)', format: 'currency', cellClass: 'text-red-600 dark:text-red-400 font-semibold' },
]

function formatValue(value: number, format: ColFormat): string {
  if (value === 0) {
    if (format === 'currency' || format === 'currency2') return '$0'
    return '0'
  }
  switch (format) {
    case 'integer':   return value.toLocaleString('es-PE', { maximumFractionDigits: 0 })
    case 'decimal1':  return value.toFixed(1)
    case 'decimal2':  return value.toFixed(2)
    case 'currency':
      return new Intl.NumberFormat('es-PE', {
        style: 'currency', currency: 'USD',
        minimumFractionDigits: 0, maximumFractionDigits: 0,
      }).format(value)
    case 'currency2': return `$${value.toFixed(2)}`
    default:          return String(value)
  }
}

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-1.5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
      ))}
    </div>
  )
}

export function ReporteConductoresTable({ data, loading }: ReporteConductoresTableProps) {
  if (loading) return <TableSkeleton />
  if (!data) return null

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No hay datos para el período seleccionado
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-800/50">
            <th className="text-left py-3 px-3 font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400 sticky left-0 bg-slate-50 dark:bg-slate-800 min-w-[200px] z-10">
              Conductor
            </th>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'text-right py-3 px-2 font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400 min-w-[95px] whitespace-nowrap',
                  col.headerClass,
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.documento_identidad}
              className="border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
            >
              <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200 sticky left-0 bg-white dark:bg-slate-900 z-10">
                {row.nombre_conductor}
              </td>
              {COLUMNS.map((col) => {
                const value = row[col.key] as number
                return (
                  <td
                    key={col.key}
                    className={cn(
                      'text-right py-2.5 px-2 tabular-nums text-slate-700 dark:text-slate-300',
                      col.cellClass,
                    )}
                  >
                    {formatValue(value, col.format)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
