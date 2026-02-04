'use client'

import React from 'react'
import { ChartCard } from '@/shared/components/common/ChartCard'
import { Users } from 'lucide-react'

interface RegionData {
  country: string
  flag: string
  drivers: number
  growth: number
}

interface CustomerGrowthProps {
  data: RegionData[]
  loading?: boolean
}

export function CustomerGrowth({ data, loading = false }: CustomerGrowthProps) {
  const total = data.reduce((sum, item) => sum + item.drivers, 0)

  return (
    <ChartCard
      title="Conductores por Región"
      description="Distribución y crecimiento"
      icon={Users}
      loading={loading}
    >
      <div className="space-y-6">
        {/* Total Display */}
        <div className="text-center py-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Conductores</p>
          <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{total}</p>
        </div>

        {/* Regions List */}
        <div className="space-y-4">
          {data.map((region, index) => {
            const percentage = ((region.drivers / total) * 100).toFixed(1)
            const isPositive = region.growth > 0
            const isNegative = region.growth < 0

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-2xl">{region.flag}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {region.country}
                    </p>
                    <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {region.drivers}
                  </p>
                  <span
                    className={`inline-flex items-center text-xs font-semibold ${
                      isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : isNegative
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {isPositive && '↑'}
                    {isNegative && '↓'}
                    {Math.abs(region.growth)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChartCard>
  )
}
