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
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSidebar } from "./sidebar-context"
import { useAuth } from "@/components/auth/auth-context"

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const { isOpen, toggleSidebar } = useSidebar()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user } = useAuth() // Obtener user del contexto

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      color: "text-blue-600",
    },
    {
      title: "Órdenes de Transporte",
      href: "/ordenes",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "Flota de Vehículos",
      href: "/vehiculos",
      icon: Truck,
      color: "text-green-600",
    },
    {
      title: "Conductores",
      href: "/conductores",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Rutas de Viaje",
      href: "/rutas",
      icon: FileText,
      color: "text-cyan-600",
    },
    {
      title: "Multas de Conductores",
      href: "/multas",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Flujo de Caja",
      href: "/flujo-caja",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      title: "Indicadores por Vehículo",
      href: "/indicadores-vehiculo",
      icon: BarChart3,
      color: "text-indigo-600",
    },
    {
      title: "Indicadores por Conductor",
      href: "/indicadores-conductor",
      icon: Users,
      color: "text-pink-600",
    },
    {
      title: "Liquidaciones",
      href: "/liquidaciones",
      icon: DollarSign,
      color: "text-yellow-600",
    },
    {
      title: "Mantenimiento",
      href: "/mantenimiento",
      icon: Wrench,
      color: "text-gray-600",
    },
    {
      title: "Mantenimiento de Vehículos",
      href: "/mantenimiento-vehiculos",
      icon: Wrench,
      color: "text-gray-600",
    },
    {
      title: "Seguros de Vehículos",
      href: "/seguros",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      title: "Impuestos de Vehículos",
      href: "/impuestos-vehiculares",
      icon: Receipt,
      color: "text-red-600",
    },
  ]

  // Si no hay usuario, no mostrar sidebar
  if (!user) {
    return null
  }

  return (
    <>
      {/* Mobile menu button - solo mostrar si hay usuario */}
      {user && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar - solo mostrar si hay usuario */}
      {user && (
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out shadow-lg flex flex-col",
            // Desktop behavior
            "hidden md:flex",
            isOpen ? "md:w-64" : "md:w-20",
            // Mobile behavior
            isMobileOpen ? "flex w-64" : "hidden",
            className,
          )}
        >
          {/* Header con logo y toggle button */}
          <div
            className={cn(
              "flex items-center h-16 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 px-4",
              isOpen ? "justify-between" : "justify-center"
            )}
          >
            {isOpen ? (
              <>
                <div className="flex items-center">
                  <Truck className="h-7 w-7 text-blue-600 flex-shrink-0" />
                  <span className="ml-3 text-xl font-bold text-slate-900 dark:text-white">
                    SGT
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleSidebar}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={toggleSidebar}
              >
                <Truck className="h-6 w-6 text-blue-600" />
              </Button>
            )}
          </div>

          {/* Navigation items */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                        isOpen ? "px-4 py-3" : "px-3 py-3 justify-center",
                        isActive
                          ? "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100 shadow-sm"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 hover:shadow-md",
                      )}
                      onClick={() => setIsMobileOpen(false)}
                      title={!isOpen ? item.title : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors duration-200 min-w-[20px]",
                          isOpen ? "mr-3" : "mr-0",
                          isActive 
                            ? "text-blue-600 dark:text-blue-400" 
                            : item.color + " dark:text-slate-400"
                        )}
                      />
                      
                      {isOpen && (
                        <span className="truncate transition-all duration-300 font-medium">
                          {item.title}
                        </span>
                      )}
                      
                      {!isOpen && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                          {item.title}
                          <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-slate-900 border-t-transparent border-b-transparent"></div>
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div
            className={cn(
              "p-4 border-t border-slate-200 dark:border-slate-800 transition-all duration-300",
              !isOpen && "px-3"
            )}
          >
            {isOpen ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Sistema de Gestión de Transporte
                <div className="text-[10px] mt-1 text-slate-400">v1.0</div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">v1</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content margin adjustment - solo si hay usuario */}
      {user && (
        <div className={cn(
          "transition-all duration-300",
          isOpen ? "md:ml-64" : "md:ml-20"
        )} />
      )}
    </>
  )
}