"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Truck,
  Users,
  MapPin,
  Wrench,
  Shield,
  AlertTriangle,
  FileText,
  Building2,
  LayoutDashboard,
  Settings,
  LogOut,
  Sparkles,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { label: 'Inicio', href: '/', icon: LayoutDashboard },
  { label: 'Métricas', href: '/dashboard', icon: BarChart3 },
  { label: 'Vehículos', href: '/vehiculos', icon: Truck },
  { label: 'Conductores', href: '/conductores', icon: Users },
  { label: 'Rutas', href: '/rutas', icon: MapPin },
  { label: 'Mantenimiento', href: '/mantenimiento-vehiculos', icon: Wrench },
  { label: 'Seguros', href: '/seguros', icon: Shield },
  { label: 'Multas', href: '/multas', icon: AlertTriangle },
  { label: 'Impuestos', href: '/impuestos-vehiculares', icon: FileText },
  { label: 'Talleres', href: '/talleres', icon: Building2 },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-600">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900 dark:text-white">Transport</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pro Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        <Separator className="my-4" />

        {/* Settings */}
        <div className="space-y-1">
          <Link
            href="/admin/roles"
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              pathname === '/admin/roles'
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span>Configuración</span>
          </Link>
        </div>
      </nav>

      {/* Upgrade Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-semibold text-sm">Upgrade Pro</h3>
          </div>
          <p className="text-xs text-blue-100 mb-3">
            Descubre los beneficios de una cuenta profesional
          </p>
          <Button 
            size="sm" 
            className="w-full bg-white text-blue-600 hover:bg-blue-50"
          >
            Upgrade $30
          </Button>
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/perfil"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Usuario</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Ver perfil</p>
          </div>
          <LogOut className="h-4 w-4 text-gray-400" />
        </Link>
      </div>
    </aside>
  )
}
