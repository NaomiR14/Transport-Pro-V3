"use client"

import { ReporteGeneralAnual, ReporteGeneralRow, MESES_CORTOS } from '../types/reporte-general.types'
import { cn } from '@/lib/utils'

interface ReporteGeneralTableProps {
  data: ReporteGeneralAnual | undefined
  loading: boolean
}

// ── Tipos de formato ──────────────────────────────────────────────────────────
type RowFormat = 'integer' | 'currency' | 'currency2' | 'decimal1' | 'percent'
type RowVariant = 'normal' | 'sub' | 'section' | 'positive' | 'negative' | 'utilidad' | 'margen' | 'total-maint'

interface DataRowConfig {
  type: 'data'
  key: keyof ReporteGeneralRow
  label: string
  unit: string
  format: RowFormat
  variant: RowVariant
}

interface SectionRowConfig {
  type: 'section'
  label: string
}

type RowConfig = DataRowConfig | SectionRowConfig

// ── Configuración de filas ────────────────────────────────────────────────────
const ROW_CONFIG: RowConfig[] = [
  // ─ Datos Principales
  { type: 'section', label: 'Datos Principales' },
  { type: 'data', key: 'nro_viajes',          label: 'Nro de Viajes',             unit: 'und',     format: 'integer',  variant: 'normal'     },
  { type: 'data', key: 'kms_recorridos',       label: 'Kms Recorridos',            unit: 'Km',      format: 'integer',  variant: 'normal'     },
  { type: 'data', key: 'ingresos',             label: 'Ingresos',                  unit: '$',       format: 'currency', variant: 'positive'   },
  { type: 'data', key: 'gastos',               label: 'Gastos',                    unit: '$',       format: 'currency', variant: 'negative'   },
  { type: 'data', key: 'combustible_gal',      label: 'Combustible',               unit: 'gal',     format: 'decimal1', variant: 'normal'     },
  { type: 'data', key: 'carga_kg',             label: 'Carga Transportada',        unit: 'Kg',      format: 'integer',  variant: 'normal'     },
  { type: 'data', key: 'total_mantenimientos', label: 'Total Mantenimientos',      unit: 'und',     format: 'integer',  variant: 'total-maint'},
  { type: 'data', key: 'mant_preventivos',     label: '  Preventivos',             unit: 'und',     format: 'integer',  variant: 'sub'        },
  { type: 'data', key: 'mant_correctivos',     label: '  Correctivos',             unit: 'und',     format: 'integer',  variant: 'sub'        },

  // ─ Indicadores de Transporte
  { type: 'section', label: 'Indicadores de Transporte' },
  { type: 'data', key: 'km_por_galon',    label: 'Kms por gal de combustible', unit: 'Km/gal',   format: 'decimal1', variant: 'normal' },
  { type: 'data', key: 'km_por_viaje',    label: 'Kms por viaje',              unit: 'Km/viaje', format: 'decimal1', variant: 'normal' },
  { type: 'data', key: 'km_por_mant',     label: 'Kms por nro de mantenim.',   unit: 'Km/mnto',  format: 'decimal1', variant: 'normal' },
  { type: 'data', key: 'carga_por_viaje', label: 'Carga media por viaje',      unit: 'Kg/viaje', format: 'decimal1', variant: 'normal' },

  // ─ Indicadores Financieros
  { type: 'section', label: 'Indicadores Financieros' },
  { type: 'data', key: 'ingreso_por_viaje', label: 'Ingreso medio por viaje', unit: '$/viaje', format: 'currency',  variant: 'normal'  },
  { type: 'data', key: 'gasto_por_viaje',   label: 'Gasto medio por viaje',   unit: '$/viaje', format: 'currency',  variant: 'normal'  },
  { type: 'data', key: 'ingreso_por_km',    label: 'Ingresos por Km',         unit: '$/Km',    format: 'currency2', variant: 'normal'  },
  { type: 'data', key: 'gasto_por_km',      label: 'Gastos por Km',           unit: '$/Km',    format: 'currency2', variant: 'normal'  },
  { type: 'data', key: 'utilidad_por_viaje',label: 'Utilidad media por viaje',unit: '$/viaje', format: 'currency',  variant: 'utilidad'},
  { type: 'data', key: 'utilidad_por_km',   label: 'Utilidad media por Km',   unit: '$/Km',    format: 'currency2', variant: 'utilidad'},
  { type: 'data', key: 'margen_bruto',      label: 'Margen Bruto',            unit: '%',       format: 'percent',   variant: 'margen'  },
] as const

// ── Helpers de formato ────────────────────────────────────────────────────────
function fmtCurrency(v: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency', currency: 'USD',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(v)
}

function formatValue(v: number, format: RowFormat): string {
  if (v === 0) {
    if (format === 'integer' || format === 'currency') return format === 'currency' ? '$0' : '0'
    return '—'
  }
  switch (format) {
    case 'integer':   return v.toLocaleString('es-PE', { maximumFractionDigits: 0 })
    case 'currency':  return fmtCurrency(v)
    case 'currency2': return `$${v.toFixed(2)}`
    case 'decimal1':  return v.toFixed(1)
    case 'percent':   return `${v.toFixed(1)}%`
    default:          return String(v)
  }
}

// ── Estilos por variante ──────────────────────────────────────────────────────
const VARIANT_LABEL_CLASS: Record<RowVariant, string> = {
  normal:      'text-slate-700 dark:text-slate-300',
  sub:         'text-slate-500 dark:text-slate-400 pl-6',
  section:     '',
  positive:    'font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30',
  negative:    'font-semibold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
  'total-maint':'font-semibold text-slate-700 dark:text-slate-200',
  utilidad:    'font-semibold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  margen:      'font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
}

const VARIANT_CELL_CLASS: Record<RowVariant, string> = {
  normal:       'text-slate-700 dark:text-slate-300',
  sub:          'text-slate-500 dark:text-slate-400 font-normal',
  section:      '',
  positive:     'text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20',
  negative:     'text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20',
  'total-maint':'text-slate-700 dark:text-slate-200',
  utilidad:     'text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20',
  margen:       'text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20',
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-1.5">
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-8 rounded',
            i % 9 === 0 ? 'bg-slate-300 dark:bg-slate-600' : 'bg-slate-100 dark:bg-slate-800',
          )}
        />
      ))}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────────────────
export function ReporteGeneralTable({ data, loading }: ReporteGeneralTableProps) {
  if (loading) return <TableSkeleton />
  if (!data) return null

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-xs border-collapse">
        {/* Cabecera */}
        <thead>
          <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-800/50">
            <th className="text-left py-3 px-3 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 sticky left-0 bg-slate-50 dark:bg-slate-800 min-w-[200px] z-10">
              Indicador
            </th>
            <th className="text-center py-3 px-2 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 min-w-[52px] whitespace-nowrap">
              Unid.
            </th>
            {MESES_CORTOS.map((mes) => (
              <th
                key={mes}
                className="text-right py-3 px-2 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 min-w-[75px] whitespace-nowrap"
              >
                {mes}
              </th>
            ))}
            <th className="text-right py-3 px-3 font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 min-w-[90px] bg-slate-100 dark:bg-slate-700/60 whitespace-nowrap">
              Total
            </th>
          </tr>
        </thead>

        {/* Cuerpo */}
        <tbody>
          {ROW_CONFIG.map((config, idx) => {
            // Fila de sección
            if (config.type === 'section') {
              return (
                <tr key={`section-${idx}`} className="border-t-2 border-slate-300 dark:border-slate-600">
                  <td
                    colSpan={15}
                    className="py-2 px-3 font-bold text-sm text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 sticky left-0"
                  >
                    {config.label}
                  </td>
                </tr>
              )
            }

            // Fila de datos
            const { key, label, unit, format, variant } = config
            const labelClass = VARIANT_LABEL_CLASS[variant]
            const cellClass  = VARIANT_CELL_CLASS[variant]
            const isUtilidadNeg = (variant === 'utilidad') &&
              data.totales[key] !== undefined && (data.totales[key] as number) < 0

            return (
              <tr
                key={key}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors"
              >
                {/* Label (sticky) */}
                <td
                  className={cn(
                    'py-2 px-3 sticky left-0 z-10 bg-white dark:bg-slate-900',
                    labelClass,
                  )}
                >
                  {label}
                </td>
                {/* Unidad */}
                <td className="text-center py-2 px-2 text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {unit}
                </td>
                {/* Meses */}
                {data.meses.map((mes) => {
                  const v = mes[key] as number
                  const isNeg = (variant === 'utilidad' || variant === 'margen') && v < 0
                  return (
                    <td
                      key={mes.mes}
                      className={cn(
                        'text-right py-2 px-2 tabular-nums',
                        cellClass,
                        isNeg && '!text-red-600 dark:!text-red-400',
                      )}
                    >
                      {formatValue(v, format)}
                    </td>
                  )
                })}
                {/* Total */}
                <td
                  className={cn(
                    'text-right py-2 px-3 font-bold tabular-nums bg-slate-50 dark:bg-slate-800/60',
                    cellClass,
                    isUtilidadNeg && '!text-red-600 dark:!text-red-400',
                  )}
                >
                  {formatValue(data.totales[key] as number, format)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
