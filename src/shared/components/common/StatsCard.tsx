import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
  iconBgColor = 'bg-blue-50 dark:bg-blue-900/20',
  iconColor = 'text-blue-600 dark:text-blue-400',
  className,
  loading = false,
}: StatsCardProps) {
  const isPositive = change && change.value > 0
  const isNegative = change && change.value < 0

  return (
    <Card className={cn('hover:shadow-lg transition-shadow duration-200 border-gray-200 dark:border-gray-700', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          {Icon && (
            <div className={cn('p-2 rounded-lg', iconBgColor)}>
              <Icon className={cn('h-5 w-5', iconColor)} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          </div>
        ) : (
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{value}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
            {change && (
              <div className="flex items-center gap-1 mt-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold',
                    isPositive && 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
                    isNegative && 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                    !isPositive && !isNegative && 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  )}
                >
                  {isPositive && '↑'}
                  {isNegative && '↓'}
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
