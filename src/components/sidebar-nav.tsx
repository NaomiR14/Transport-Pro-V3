"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Truck,
  Users,
  FileText,
  DollarSign,
  Wrench,
  Package,
  Shield,
  Receipt,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Home,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSidebar } from "./sidebar-context"

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const { isOpen } = useSidebar()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      title: "Órdenes de Transporte",
      href: "/ordenes",
      icon: Package,
    },
    {
      title: "Flota de Vehículos",
      href: "/vehiculos",
      icon: Truck,
    },
    {
      title: "Conductores",
      href: "/conductores",
      icon: Users,
    },

    {
      title: "Rutas de Viaje",
      href: "/rutas",
      icon: FileText,
    },
    {
      title: "Multas de Conductores",
      href: "/multas",
      icon: AlertTriangle,
    },
    {
      title: "Flujo de Caja",
      href: "/flujo-caja",
      icon: TrendingUp,
    },
    {
      title: "Indicadores por Vehículo",
      href: "/indicadores-vehiculo",
      icon: BarChart3,
    },
    {
      title: "Indicadores por Conductor",
      href: "/indicadores-conductor",
      icon: Users,
    },
    {
      title: "Liquidaciones",
      href: "/liquidaciones",
      icon: DollarSign,
    },
    {
      title: "Mantenimiento",
      href: "/mantenimiento",
      icon: Wrench,
    },
    {
      title: "Mantenimiento de Vehículos",
      href: "/mantenimiento-vehiculos",
      icon: Wrench,
    },
    {
      title: "Seguros de Vehículos",
      href: "/seguros",
      icon: Shield,
    },
    {
      title: "Impuestos de Vehículos",
      href: "/impuestos",
      icon: Receipt,
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out",
          // Desktop behavior
          "hidden md:block",
          isOpen ? "md:w-64" : "md:w-16",
          // Mobile behavior
          "md:translate-x-0",
          isMobileOpen ? "block w-64" : "hidden",
          className,
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn(
              "flex items-center h-16 border-b border-slate-200 dark:border-slate-800 transition-all duration-300",
              isOpen ? "px-6" : "px-4 justify-center",
            )}
          >
            <Truck className="h-6 w-6 text-blue-600 flex-shrink-0" />
            {isOpen && <span className="ml-2 text-lg font-semibold transition-opacity duration-300">SGT</span>}
          </div>
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md text-sm font-medium transition-colors group relative",
                        isOpen ? "px-3 py-2" : "px-2 py-2 justify-center",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                      )}
                      onClick={() => setIsMobileOpen(false)}
                      title={!isOpen ? item.title : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          isOpen ? "mr-3" : "mr-0",
                          isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400",
                        )}
                      />
                      {isOpen && <span className="transition-opacity duration-300">{item.title}</span>}
                      {!isOpen && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <div
            className={cn(
              "p-4 border-t border-slate-200 dark:border-slate-800 transition-all duration-300",
              !isOpen && "px-2",
            )}
          >
            {isOpen && (
              <div className="text-xs text-slate-500 dark:text-slate-400">Sistema de Gestión de Transporte v1.0</div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
