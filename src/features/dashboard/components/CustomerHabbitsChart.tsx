'use client'

import React from 'react'
import { ChartCard } from '@/shared/components/common/ChartCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { BarChart3 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MonthlyData {
  month: string
  enRuta: number
  disponibles: number
}

interface CustomerHabbitsChartProps {
  data: MonthlyData[]
  loading?: boolean
  selectedYear?: string
  onYearChange?: (year: string) => void
}

export function CustomerHabbitsChart({
  data,
  loading = false,
  selectedYear = '2024',
  onYearChange,
}: CustomerHabbitsChartProps) {
  return (
    <ChartCard
      title="Uso de Vehículos"
      description="Vehículos en ruta vs disponibles por mes"
      icon={BarChart3}
      loading={loading}
      action={
        onYearChange && (
          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        )
      }
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickLine={false}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload) return null
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white mb-2">
                      {payload[0]?.payload.month}
                    </p>
                    {payload.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              }}
            />
            <Legend
              content={({ payload }) => (
                <div className="flex justify-center gap-6 mt-4">
                  {payload?.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            />
            <Bar
              dataKey="enRuta"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="En Ruta"
            />
            <Bar
              dataKey="disponibles"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
              name="Disponibles"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  )
}
