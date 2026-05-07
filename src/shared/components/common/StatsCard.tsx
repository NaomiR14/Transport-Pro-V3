import React from 'react'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: number
    label?: string
  }
  icon?: LucideIcon
  iconBgColor?: string
  iconColor?: string
  className?: string
  loading?: boolean
}

export function StatsCard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconBgColor = 'bg-blue-100 dark:bg-blue-900/30',
  iconColor = 'text-blue-600 dark:text-blue-400',
  className,
  loading = false,
}: StatsCardProps) {
  const isPositive = change && change.value > 0
  const isNegative = change && change.value < 0

  return (
    <Card className={cn(
      'hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-gray-200 dark:border-gray-700',
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </CardTitle>
        {Icon && (
          <CardAction>
            <div className={cn('p-3 rounded-xl shadow-sm', iconBgColor)}>
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="min-w-0">
        {loading ? (
          <div className="space-y-2">
            <div className="h-9 w-28 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          </div>
        ) : (
          <div className="min-w-0 overflow-hidden">
            <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white truncate">{value}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
            {change && (
              <div className="flex items-center gap-1.5 mt-2">
                <span className={cn(
                  'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold',
                  isPositive && 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
                  isNegative && 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                  !isPositive && !isNegative && 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}>
                  {isPositive && <TrendingUp className="h-3 w-3" />}
                  {isNegative && <TrendingDown className="h-3 w-3" />}
                  {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
                  {isPositive ? '+' : ''}{change.value}%
                </span>
                {change.label && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">{change.label}</span>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
