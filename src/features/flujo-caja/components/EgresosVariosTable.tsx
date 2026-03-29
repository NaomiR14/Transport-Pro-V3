"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { NumericInput } from '@/components/ui/numeric-input'
import { Save } from 'lucide-react'
import { useEgresosVarios, useUpsertEgresoVario } from '../hooks/use-flujo-caja'
import { MESES_NOMBRES, EgresoVario } from '../types/flujo-caja.types'

interface EgresosVariosTableProps {
  anio: number
}

interface MesData {
  gastos_personal: string
  otros_egresos: string
  dirty: boolean
}

export function EgresosVariosTable({ anio }: EgresosVariosTableProps) {
  const { data: egresosDB, isLoading } = useEgresosVarios(anio)
  const upsertMutation = useUpsertEgresoVario()

  // Estado local para edición - 12 meses
  const [mesesData, setMesesData] = useState<MesData[]>(
    Array.from({ length: 12 }, () => ({
      gastos_personal: '0',
      otros_egresos: '0',
      dirty: false,
    }))
  )

  // Sincronizar datos de BD al estado local
  useEffect(() => {
    if (!egresosDB) return

    setMesesData((prev) =>
      prev.map((item, index) => {
        const mesNum = index + 1
        const dbRecord = egresosDB.find((e: EgresoVario) => e.mes === mesNum)
        if (dbRecord) {
          return {
            gastos_personal: String(dbRecord.gastos_personal || 0),
            otros_egresos: String(dbRecord.otros_egresos || 0),
            dirty: false,
          }
        }
        return { ...item, dirty: false }
      })
    )
  }, [egresosDB])

  const handleChange = (mesIndex: number, field: 'gastos_personal' | 'otros_egresos', value: string) => {
    // Solo permitir números y punto decimal
    if (value !== '' && !/^\d*\.?\d*$/.test(value)) return

    // Eliminar ceros iniciales: "060" → "60", pero conservar "0" y "0.5"
    let normalized = value
    if (normalized.length > 1 && normalized.startsWith('0') && !normalized.startsWith('0.')) {
      normalized = normalized.replace(/^0+/, '') || '0'
    }

    setMesesData((prev) =>
      prev.map((item, i) =>
        i === mesIndex ? { ...item, [field]: normalized, dirty: true } : item
      )
    )
  }

  const handleSave = (mesIndex: number) => {
    const mes = mesIndex + 1
    const data = mesesData[mesIndex]

    upsertMutation.mutate(
      {
        anio,
        mes,
        gastos_personal: parseFloat(data.gastos_personal) || 0,
        otros_egresos: parseFloat(data.otros_egresos) || 0,
      },
      {
        onSuccess: () => {
          setMesesData((prev) =>
            prev.map((item, i) =>
              i === mesIndex ? { ...item, dirty: false } : item
            )
          )
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-300 dark:border-slate-600">
            <th className="text-left py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 w-36">
              Mes
            </th>
            <th className="text-right py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 w-44">
              Gastos Personal ($)
            </th>
            <th className="text-right py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 w-44">
              Otros Egresos ($)
            </th>
            <th className="py-3 px-3 w-20" />
          </tr>
        </thead>
        <tbody>
          {MESES_NOMBRES.map((mesNombre, index) => (
            <tr
              key={mesNombre}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                {mesNombre}
              </td>
              <td className="py-2 px-3">
                <NumericInput
                  type="text"
                  inputMode="decimal"
                  value={mesesData[index].gastos_personal}
                  onChange={(e) => handleChange(index, 'gastos_personal', e.target.value)}
                  className="text-right w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 h-8"
                  placeholder="0"
                />
              </td>
              <td className="py-2 px-3">
                <NumericInput
                  type="text"
                  inputMode="decimal"
                  value={mesesData[index].otros_egresos}
                  onChange={(e) => handleChange(index, 'otros_egresos', e.target.value)}
                  className="text-right w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 h-8"
                  placeholder="0"
                />
              </td>
              <td className="py-2 px-3">
                <Button
                  size="sm"
                  variant={mesesData[index].dirty ? 'default' : 'outline'}
                  onClick={() => handleSave(index)}
                  disabled={!mesesData[index].dirty || upsertMutation.isPending}
                  className={
                    mesesData[index].dirty
                      ? 'bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white h-8 w-8 p-0'
                      : 'h-8 w-8 p-0'
                  }
                >
                  <Save className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
