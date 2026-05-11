"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Truck,
  Users,
  FileText,
  Wrench,
  Package,
  Shield,
  Receipt,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  FileBarChart2,
  Home,
  Menu,
  X,
  ChevronLeft,
  Crown,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSidebar } from "./sidebar-context"
import { useAuth, usePermissions } from "@/features/auth"
import { useEstadoSuscripcion } from "@/features/pagos"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const { isOpen, toggleSidebar } = useSidebar()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { user } = useAuth()
  const { canAccessModule, role } = usePermissions()
  const router = useRouter()

  const isAdmin = role === 'admin'
  const { data: suscripcion } = useEstadoSuscripcion({ enabled: isAdmin })
  const planActivo = isAdmin && (suscripcion?.plan_activo ?? false)
  const planCancelado = planActivo && (suscripcion?.plan_cancelado ?? false)

  const allNavItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      color: "text-blue-600",
      module: "dashboard" as const,
    },
    {
      title: "Órdenes de Transporte",
      href: "/ordenes",
      icon: Package,
      color: "text-orange-600",
      module: "ordenes" as const,
    },
    {
      title: "Flota de Vehículos",
      href: "/vehiculos",
      icon: Truck,
      color: "text-green-600",
      module: "vehiculos" as const,
    },
    {
      title: "Conductores",
      href: "/conductores",
      icon: Users,
      color: "text-purple-600",
      module: "conductores" as const,
    },
    {
      title: "Rutas de Viaje",
      href: "/rutas",
      icon: FileText,
      color: "text-cyan-600",
      module: "rutas" as const,
    },
    {
      title: "Multas de Conductores",
      href: "/multas",
      icon: AlertTriangle,
      color: "text-red-600",
      module: "multas" as const,
    },
    {
      title: "Flujo de Caja",
      href: "/flujo-caja",
      icon: TrendingUp,
      color: "text-emerald-600",
      module: "flujo_caja" as const,
    },
    {
      title: "Reporte General",
      href: "/reporte-general",
      icon: FileBarChart2,
      color: "text-indigo-600",
      module: "reporte_general" as const,
    },
    {
      title: "Reporte Conductores",
      href: "/indicadores-conductor",
      icon: Users,
      color: "text-pink-600",
      module: "indicadores_conductor" as const,
    },
    {
      title: "Talleres",
      href: "/talleres",
      icon: Wrench,
      color: "text-gray-600",
      module: "talleres" as const,
    },
    {
      title: "Mantenimiento de Vehículos",
      href: "/mantenimiento-vehiculos",
      icon: Wrench,
      color: "text-gray-600",
      module: "mantenimiento_vehiculos" as const,
    },
    {
      title: "Seguros de Vehículos",
      href: "/seguros",
      icon: Shield,
      color: "text-blue-600",
      module: "seguros" as const,
    },
    {
      title: "Impuestos de Vehículos",
      href: "/impuestos-vehiculares",
      icon: Receipt,
      color: "text-red-600",
      module: "impuestos_vehiculares" as const,
    },
  ]

  // Filtrar navItems según permisos del usuario
  const navItems = allNavItems.filter(item => canAccessModule(item.module))

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
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-600 shadow-sm shadow-blue-500/30 flex-shrink-0">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
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
                className="h-10 w-10 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={toggleSidebar}
              >
                <div className="p-1.5 rounded-lg bg-blue-600">
                  <Truck className="h-4 w-4 text-white" />
                </div>
              </Button>
            )}
          </div>

          {/* Navigation items */}
          <nav id="sidebar-nav" className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                        isOpen ? "px-4 py-3" : "px-3 py-3 justify-center",
                        isActive
                          ? "bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100 shadow-sm border-l-2 border-blue-600 dark:border-blue-400"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
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
                        <span className="truncate transition-all duration-300 font-semibold">
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

          {/* Admin sin plan: banner Upgrade Pro */}
          {isAdmin && !planActivo && isOpen && (
            <div className="px-3 pb-4">
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 overflow-hidden shadow-lg border border-gray-700">
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-white font-bold text-center mb-1 text-sm">
                    Upgrade Pro
                  </h3>
                  <p className="text-gray-400 text-xs text-center mb-4 leading-relaxed">
                    Descubre los beneficios de una cuenta profesional
                  </p>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border-0 group"
                    size="sm"
                    onClick={() => router.push('/planes')}
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-2 group-hover:rotate-12 transition-transform" />
                    Ver planes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Admin sin plan: icono colapsado */}
          {isAdmin && !planActivo && !isOpen && (
            <div className="px-3 pb-4">
              <Button
                variant="ghost"
                size="icon"
                className="w-full h-10 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 border border-gray-700 group relative"
                onClick={() => router.push('/planes')}
              >
                <Crown className="h-5 w-5 text-yellow-400" />
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                  Ver planes
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-slate-900 border-t-transparent border-b-transparent"></div>
                </div>
              </Button>
            </div>
          )}

          {/* Footer — indicador de suscripción */}
          <div
            className={cn(
              "p-4 border-t border-slate-200 dark:border-slate-800 transition-all duration-300",
              !isOpen && "px-3"
            )}
          >
            {isAdmin ? (
              isOpen ? (
                <div
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
                    planActivo && !planCancelado
                      ? "bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border border-violet-200/60 dark:border-violet-700/40 hover:shadow-sm"
                      : planCancelado
                      ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200/60 dark:border-orange-700/40 hover:shadow-sm"
                      : "bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 hover:shadow-sm"
                  )}
                  onClick={() => router.push(planActivo ? '/configuracion/suscripcion' : '/planes')}
                >
                  <Crown className={cn(
                    "h-4 w-4 shrink-0",
                    planActivo && !planCancelado ? "text-violet-500" : planCancelado ? "text-orange-500" : "text-amber-500"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      "text-xs font-bold truncate",
                      planActivo && !planCancelado ? "text-violet-700 dark:text-violet-300" : planCancelado ? "text-orange-700 dark:text-orange-300" : "text-amber-700 dark:text-amber-300"
                    )}>
                      {planActivo
                        ? `Plan ${suscripcion?.plan === 'basico' ? 'Básico' : suscripcion?.plan === 'profesional' ? 'Profesional' : 'Enterprise'}`
                        : 'Sin suscripción'}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {planCancelado
                        ? `Cancela ${suscripcion?.plan_fecha_fin ? format(new Date(suscripcion.plan_fecha_fin), "d MMM", { locale: es }) : ''}`
                        : planActivo ? 'Activo' : 'Ver planes disponibles'}
                    </p>
                  </div>
                  <span className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    planActivo && !planCancelado ? "bg-green-500 shadow-sm shadow-green-500/50" : planCancelado ? "bg-orange-400" : "bg-amber-400"
                  )} />
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group",
                      planActivo && !planCancelado
                        ? "bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50"
                        : planCancelado
                        ? "bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                        : "bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50"
                    )}
                    onClick={() => router.push(planActivo ? '/configuracion/suscripcion' : '/planes')}
                  >
                    <Crown className={cn(
                      "h-4 w-4",
                      planActivo && !planCancelado ? "text-violet-500" : planCancelado ? "text-orange-500" : "text-amber-500"
                    )} />
                    <span className={cn(
                      "absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white dark:border-slate-900",
                      planActivo && !planCancelado ? "bg-green-500" : planCancelado ? "bg-orange-400" : "bg-amber-400"
                    )} />
                    <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-slate-700">
                      {planActivo
                        ? `Plan ${suscripcion?.plan === 'basico' ? 'Básico' : suscripcion?.plan === 'profesional' ? 'Profesional' : 'Enterprise'}${planCancelado ? ' · Cancelado' : ''}`
                        : 'Sin suscripción'}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-0 border-r-4 border-r-slate-900 border-t-transparent border-b-transparent" />
                    </div>
                  </button>
                </div>
              )
            ) : (
              isOpen ? (
                <div className="text-center">
                  <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-medium px-3 py-1 rounded-full">
                    SGT
                    <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">v1</span>
                  </span>
                </div>
              ) : (
                <div className="flex justify-center">
                  <span className="bg-blue-600 text-white text-[10px] font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-sm">v1</span>
                </div>
              )
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