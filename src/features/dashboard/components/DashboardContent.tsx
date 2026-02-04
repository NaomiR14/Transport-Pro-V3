'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"
import { useAuth, usePermissions } from "@/features/auth"

export default function DashboardContent() {
    const { user, profile } = useAuth()
    const { canAccessModule, getRoleName } = usePermissions()

    // Si no hay usuario, mostrar landing pública
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                            <Truck className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Transport-Pro
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Sistema integral para la gestión de operaciones de transporte profesional
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Iniciar Sesión
                        </Link>
                        <Link
                            href="/registro"
                            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Registrarse
                        </Link>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <Card>
                            <CardHeader>
                                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                                <CardTitle className="text-lg">Gestión Completa</CardTitle>
                                <CardDescription>
                                    Administra vehículos, conductores, rutas y más desde un solo lugar
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                                <CardTitle className="text-lg">Reportes en Tiempo Real</CardTitle>
                                <CardDescription>
                                    Indicadores y métricas actualizadas para tomar mejores decisiones
                                </CardDescription>
                            </CardHeader>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                                <CardTitle className="text-lg">Seguro y Confiable</CardTitle>
                                <CardDescription>
                                    Control de acceso por roles y respaldo automático de datos
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        )
    }

    // Dashboard para usuarios autenticados
    const allModules = [
        {
            title: "Órdenes de Transporte",
            description: "Gestionar órdenes de transporte y seguimiento",
            icon: Package,
            href: "/ordenes",
            color: "bg-blue-500 dark:bg-blue-600",
            module: "ordenes" as const,
        },
        {
            title: "Flota de Vehículos",
            description: "Administrar vehículos y mantenimiento",
            icon: Truck,
            href: "/vehiculos",
            color: "bg-green-500 dark:bg-green-600",
            module: "vehiculos" as const,
        },
        {
            title: "Conductores",
            description: "Gestión de conductores y documentos",
            icon: Users,
            href: "/conductores",
            color: "bg-purple-500 dark:bg-purple-600",
            module: "conductores" as const,
        },
        {
            title: "Rutas de Viaje",
            description: "Gestionar rutas y registros de viaje",
            icon: FileText,
            href: "/rutas",
            color: "bg-red-500 dark:bg-red-600",
            module: "rutas" as const,
        },
        {
            title: "Multas de Conductores",
            description: "Gestionar multas e infracciones de tránsito",
            icon: AlertTriangle,
            href: "/multas",
            color: "bg-amber-500 dark:bg-amber-600",
            module: "multas" as const,
        },
        {
            title: "Flujo de Caja",
            description: "Gestionar flujo de caja mensual y análisis financiero",
            icon: TrendingUp,
            href: "/flujo-caja",
            color: "bg-emerald-500 dark:bg-emerald-600",
            module: "flujo_caja" as const,
        },
        {
            title: "Indicadores por Vehículo",
            description: "Reportes e indicadores de rendimiento por vehículo",
            icon: BarChart3,
            href: "/indicadores-vehiculo",
            color: "bg-violet-500 dark:bg-violet-600",
            module: "indicadores_vehiculo" as const,
        },
        {
            title: "Indicadores por Conductor",
            description: "Reportes e indicadores de rendimiento por conductor",
            icon: Users,
            href: "/indicadores-conductor",
            color: "bg-rose-500 dark:bg-rose-600",
            module: "indicadores_conductor" as const,
        },
        {
            title: "Liquidaciones",
            description: "Procesar liquidaciones y pagos",
            icon: DollarSign,
            href: "/liquidaciones",
            color: "bg-yellow-500 dark:bg-yellow-600",
            module: "liquidaciones" as const,
        },
        {
            title: "Talleres",
            description: "Programar y seguir mantenimientos",
            icon: Wrench,
            href: "/talleres",
            color: "bg-indigo-500 dark:bg-indigo-600",
            module: "talleres" as const,
        },
        {
            title: "Mantenimiento de Vehículos",
            description: "Registrar y seguir mantenimientos de vehículos",
            icon: Wrench,
            href: "/mantenimiento-vehiculos",
            color: "bg-teal-500 dark:bg-teal-600",
            module: "mantenimiento_vehiculos" as const,
        },
        {
            title: "Seguros de Vehículos",
            description: "Gestionar pólizas de seguro de la flota",
            icon: Shield,
            href: "/seguros",
            color: "bg-cyan-500 dark:bg-cyan-600",
            module: "seguros" as const,
        },
        {
            title: "Impuestos de Vehículos",
            description: "Gestionar impuestos y contribuciones vehiculares",
            icon: Receipt,
            href: "/impuestos-vehiculares",
            color: "bg-purple-600 dark:bg-purple-700",
            module: "impuestos_vehiculares" as const,
        },
    ]

    // Filtrar módulos según permisos del usuario
    const modules = allModules.filter(module => canAccessModule(module.module))

    // Determinar qué nombre mostrar
    const displayName = profile?.nombre && profile?.apellido
                       ? `${profile.nombre} ${profile.apellido}`
                       : (profile as any)?.full_name || 
                         user.user_metadata?.full_name || 
                         user.email?.split('@')[0] || 
                         'Usuario'

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    ¡Bienvenido, {displayName}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Accede rápidamente a todos los módulos del sistema{profile?.role ? ` | Rol: ${getRoleName()}` : ''}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {modules.map((module) => {
                    const IconComponent = module.icon
                    return (
                        <Link key={module.href} href={module.href}>
                            <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer h-full border-gray-200 dark:border-gray-700">
                                <CardHeader className="pb-3">
                                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-3 shadow-sm`}>
                                        <IconComponent className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-lg text-gray-900 dark:text-white">{module.title}</CardTitle>
                                    <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                                        {module.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    )
                })}
            </div>

            {/* Quick Stats Footer */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                                <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Acceso rápido</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {modules.length} módulos disponibles
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg">
                                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Seguridad</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Sesión activa
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg">
                                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Tu rol</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {getRoleName()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
