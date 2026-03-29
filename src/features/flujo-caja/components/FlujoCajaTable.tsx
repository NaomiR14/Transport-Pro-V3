"use client"

import { FlujoCajaAnual, FlujoCajaRow, MESES_NOMBRES } from '../types/flujo-caja.types'
import { cn } from '@/lib/utils'

interface FlujoCajaTableProps {
  data: FlujoCajaAnual | undefined
  loading: boolean
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number): string {
  if (value === 0) return '—'
  return `${value.toFixed(1)}%`
}

// Configuración de filas con sus estilos
const ROW_CONFIG = [
  { key: 'ingresos', label: 'Ingresos ($)', type: 'currency' as const, className: 'bg-emerald-50 dark:bg-emerald-950/30 font-semibold text-emerald-700 dark:text-emerald-400' },
  { key: 'egresos', label: 'Egresos ($)', type: 'currency' as const, className: 'bg-red-50 dark:bg-red-950/30 font-semibold text-red-700 dark:text-red-400' },
  { key: 'gastos_personal', label: '  Personal', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'seguros', label: '  Seguros', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'impuestos', label: '  Impuestos', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'multas', label: '  Multas', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'mantenimiento', label: '  Mantenimiento', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'combustible', label: '  Combustible', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'peajes', label: '  Peaje', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'comidas', label: '  Comidas', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'otros_egresos', label: '  Otros Egresos', type: 'currency' as const, className: 'text-slate-600 dark:text-slate-400 pl-6' },
  { key: 'utilidad', label: 'Utilidad ($)', type: 'currency' as const, className: 'bg-blue-50 dark:bg-blue-950/30 font-semibold text-blue-700 dark:text-blue-400' },
  { key: 'margen', label: 'Margen (%)', type: 'percent' as const, className: 'bg-amber-50 dark:bg-amber-950/30 font-semibold text-amber-700 dark:text-amber-400' },
] as const

type RowKey = typeof ROW_CONFIG[number]['key']

function getCellValue(row: FlujoCajaRow, key: RowKey): number {
  return row[key] as number
}

export function FlujoCajaTable({ data, loading }: FlujoCajaTableProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 13 }).map((_, i) => (
          <div key={i} className="h-8 bg-slate-200 dark:bg-slate-700 rounded" />
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-300 dark:border-slate-600">
            <th className="text-left py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 sticky left-0 bg-white dark:bg-slate-900 min-w-[160px] z-10">
              Concepto
            </th>
            {MESES_NOMBRES.map((mes) => (
              <th key={mes} className="text-right py-3 px-2 font-semibold text-slate-700 dark:text-slate-300 min-w-[100px]">
                {mes}
              </th>
            ))}
            <th className="text-right py-3 px-3 font-bold text-slate-900 dark:text-white min-w-[110px] bg-slate-50 dark:bg-slate-800">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {ROW_CONFIG.map((config, rowIndex) => (
            <tr
              key={config.key}
              className={cn(
                'border-b border-slate-200 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50',
                rowIndex === 1 && 'border-b-2', // Separador después de Egresos
                rowIndex === 10 && 'border-b-2', // Separador antes de Utilidad
              )}
            >
              <td className={cn(
                'py-2 px-3 sticky left-0 z-10',
                config.className,
                // Para las sub-categorías, ajustar el padding
                config.key !== 'ingresos' && config.key !== 'egresos' && config.key !== 'utilidad' && config.key !== 'margen'
                  ? 'bg-white dark:bg-slate-900'
                  : ''
              )}>
                {config.label}
              </td>
              {data.meses.map((mes) => {
                const value = getCellValue(mes, config.key)
                return (
                  <td
                    key={mes.mes}
                    className={cn(
                      'text-right py-2 px-2 tabular-nums',
                      config.className,
                      // Sub-categorías sin background especial en celdas de datos
                      config.key !== 'ingresos' && config.key !== 'egresos' && config.key !== 'utilidad' && config.key !== 'margen'
                        ? 'bg-transparent text-slate-700 dark:text-slate-300 font-normal'
                        : '',
                      // Utilidad negativa en rojo
                      config.key === 'utilidad' && value < 0 && '!text-red-600 dark:!text-red-400',
                      // Margen negativo en rojo
                      config.key === 'margen' && value < 0 && '!text-red-600 dark:!text-red-400',
                    )}
                  >
                    {config.type === 'percent'
                      ? formatPercent(value)
                      : value === 0 ? '$0' : formatCurrency(value)
                    }
                  </td>
                )
              })}
              {/* Columna Total */}
              <td className={cn(
                'text-right py-2 px-3 font-bold tabular-nums bg-slate-50 dark:bg-slate-800',
                config.key === 'ingresos' && 'text-emerald-700 dark:text-emerald-400',
                config.key === 'egresos' && 'text-red-700 dark:text-red-400',
                config.key === 'utilidad' && (data.totales.utilidad >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-600 dark:text-red-400'),
                config.key === 'margen' && (data.totales.margen >= 0 ? 'text-amber-700 dark:text-amber-400' : 'text-red-600 dark:text-red-400'),
                config.key !== 'ingresos' && config.key !== 'egresos' && config.key !== 'utilidad' && config.key !== 'margen'
                  && 'text-slate-700 dark:text-slate-300 font-semibold',
              )}>
                {config.type === 'percent'
                  ? formatPercent(data.totales[config.key] as number)
                  : formatCurrency(data.totales[config.key] as number)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
