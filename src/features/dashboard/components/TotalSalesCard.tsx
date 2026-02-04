import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TrendingUp, DollarSign } from 'lucide-react'

interface TotalSalesCardProps {
  value: string | number
  change?: number
  period?: string
  loading?: boolean
}

export function TotalSalesCard({ value, change, period = 'vs mes anterior', loading = false }: TotalSalesCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-700 opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-100">Ingresos Totales</span>
            <div className="p-2 rounded-lg bg-white/20">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-12 w-32 bg-white/20 animate-pulse rounded" />
          ) : (
            <>
              <h3 className="text-4xl font-bold text-white mb-2">${value}</h3>
              {change !== undefined && (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      isPositive
                        ? 'bg-green-500/20 text-green-100'
                        : isNegative
                        ? 'bg-red-500/20 text-red-100'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {isPositive && <TrendingUp className="h-3 w-3" />}
                    {isPositive ? '+' : ''}{change}%
                  </span>
                  <span className="text-xs text-blue-100">{period}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-white/10" />
    </Card>
  )
}
