'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Truck, Users, FileText, Wrench, Package, Shield,
    Receipt, AlertTriangle, TrendingUp, ArrowRight, HelpCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth, usePermissions } from "@/features/auth"
import { useDashboardTutorial } from "../hooks/useDashboardTutorial"

export default function DashboardContent() {
    const { user, profile } = useAuth()
    const { canAccessModule, getRoleName } = usePermissions()
    const { startTutorial } = useDashboardTutorial()

    const allModules = [
        { title: "Órdenes de Transporte", description: "Gestionar órdenes de transporte y seguimiento", icon: Package, href: "/ordenes", gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/25", module: "ordenes" as const },
        { title: "Flota de Vehículos", description: "Administrar vehículos y mantenimiento", icon: Truck, href: "/vehiculos", gradient: "from-green-500 to-green-600", shadow: "shadow-green-500/25", module: "vehiculos" as const },
        { title: "Conductores", description: "Gestión de conductores y documentos", icon: Users, href: "/conductores", gradient: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/25", module: "conductores" as const },
        { title: "Rutas de Viaje", description: "Gestionar rutas y registros de viaje", icon: FileText, href: "/rutas", gradient: "from-red-500 to-red-600", shadow: "shadow-red-500/25", module: "rutas" as const },
        { title: "Multas de Conductores", description: "Gestionar multas e infracciones de tránsito", icon: AlertTriangle, href: "/multas", gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/25", module: "multas" as const },
        { title: "Flujo de Caja", description: "Gestionar flujo de caja mensual y análisis financiero", icon: TrendingUp, href: "/flujo-caja", gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/25", module: "flujo_caja" as const },
        { title: "Reporte Conductores", description: "Indicadores de rendimiento por conductor", icon: Users, href: "/indicadores-conductor", gradient: "from-rose-500 to-rose-600", shadow: "shadow-rose-500/25", module: "indicadores_conductor" as const },
        { title: "Talleres", description: "Programar y seguir mantenimientos", icon: Wrench, href: "/talleres", gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-500/25", module: "talleres" as const },
        { title: "Mantenimiento de Vehículos", description: "Registrar y seguir mantenimientos de vehículos", icon: Wrench, href: "/mantenimiento-vehiculos", gradient: "from-teal-500 to-teal-600", shadow: "shadow-teal-500/25", module: "mantenimiento_vehiculos" as const },
        { title: "Seguros de Vehículos", description: "Gestionar pólizas de seguro de la flota", icon: Shield, href: "/seguros", gradient: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-500/25", module: "seguros" as const },
        { title: "Impuestos de Vehículos", description: "Gestionar impuestos y contribuciones vehiculares", icon: Receipt, href: "/impuestos-vehiculares", gradient: "from-purple-600 to-purple-700", shadow: "shadow-purple-600/25", module: "impuestos_vehiculares" as const },
    ]

    const modules = allModules.filter(m => canAccessModule(m.module))

    const displayName = profile?.nombre && profile?.apellido
        ? `${profile.nombre} ${profile.apellido}`
        : (profile as any)?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'

    return (
        <div className="p-6">
            {/* Page Header */}
            <div id="dashboard-welcome" className="mb-8 bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-900 dark:to-blue-950/20 rounded-2xl px-6 py-5 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            ¡Bienvenido, {displayName}!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                            Accede rápidamente a todos los módulos del sistema{profile?.role ? ` · ${getRoleName()}` : ''}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={startTutorial}
                        className="shrink-0 gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                    >
                        <HelpCircle className="h-4 w-4" />
                        Ver tutorial
                    </Button>
                </div>
            </div>

            <div id="dashboard-modules" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {modules.map((module) => {
                    const IconComponent = module.icon
                    return (
                        <Link key={module.href} href={module.href}>
                            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer h-full border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.gradient} flex items-center justify-center mb-3 shadow-lg ${module.shadow}`}>
                                        <IconComponent className="h-7 w-7 text-white" />
                                    </div>
                                    <CardTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center justify-between">
                                        {module.title}
                                        <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                        {module.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {/* Quick Stats */}
            <div id="dashboard-quick-stats" className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-xl shadow-sm">
                                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Acceso rápido</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {modules.length} módulos
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-800 rounded-xl shadow-sm">
                                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">Seguridad</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    Sesión activa
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-xl shadow-sm">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Tu rol</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">{getRoleName()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
