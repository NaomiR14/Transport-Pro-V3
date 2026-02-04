import React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'secondary'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  icon?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  success: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  warning: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
  danger: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  secondary: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
}

export function Badge({ children, variant = 'default', className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold',
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

// Variantes específicas para casos comunes
export function SuccessBadge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return <Badge variant="success" icon={icon}>{children}</Badge>
}

export function DangerBadge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return <Badge variant="danger" icon={icon}>{children}</Badge>
}

export function WarningBadge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return <Badge variant="warning" icon={icon}>{children}</Badge>
}

export function InfoBadge({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return <Badge variant="info" icon={icon}>{children}</Badge>
}
