import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
    title: string
    subtitle?: string
    badge?: string
    icon?: LucideIcon
    iconColor?: string
    iconBg?: string
    action?: React.ReactNode
    className?: string
}

export function PageHeader({
    title,
    subtitle,
    badge,
    icon: Icon,
    iconColor = 'text-blue-600',
    iconBg = 'bg-blue-100 dark:bg-blue-900/30',
    action,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn(
            'mb-8 flex items-center justify-between gap-4',
            'bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20',
            'rounded-2xl px-6 py-5 border border-slate-200/60 dark:border-slate-800/60',
            className
        )}>
            <div className="flex items-center gap-4 min-w-0">
                {Icon && (
                    <div className={cn('p-3 rounded-2xl shadow-sm shrink-0', iconBg)}>
                        <Icon className={cn('h-6 w-6', iconColor)} />
                    </div>
                )}
                <div className="min-w-0">
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white truncate">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {action && (
                <div className="shrink-0">
                    {action}
                </div>
            )}
        </div>
    )
}
