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

export default function Dashboard() {
  const modules = [
    {
      title: "Órdenes de Transporte",
      description: "Gestionar órdenes de transporte y seguimiento",
      icon: Package,
      href: "/ordenes",
      color: "bg-blue-500",
    },
    {
      title: "Flota de Vehículos",
      description: "Administrar vehículos y mantenimiento",
      icon: Truck,
      href: "/vehiculos",
      color: "bg-green-500",
    },
    {
      title: "Conductores",
      description: "Gestión de conductores y documentos",
      icon: Users,
      href: "/conductores",
      color: "bg-purple-500",
    },
    {
      title: "Rutas de Viaje",
      description: "Gestionar rutas y registros de viaje",
      icon: FileText,
      href: "/rutas",
      color: "bg-red-500",
    },
    {
      title: "Multas de Conductores",
      description: "Gestionar multas e infracciones de tránsito",
      icon: AlertTriangle,
      href: "/multas",
      color: "bg-amber-500",
    },
    {
      title: "Flujo de Caja",
      description: "Gestionar flujo de caja mensual y análisis financiero",
      icon: TrendingUp,
      href: "/flujo-caja",
      color: "bg-emerald-500",
    },
    {
      title: "Indicadores por Vehículo",
      description: "Reportes e indicadores de rendimiento por vehículo",
      icon: BarChart3,
      href: "/indicadores-vehiculo",
      color: "bg-violet-500",
    },
    {
      title: "Indicadores por Conductor",
      description: "Reportes e indicadores de rendimiento por conductor",
      icon: Users,
      href: "/indicadores-conductor",
      color: "bg-rose-500",
    },
    {
      title: "Liquidaciones",
      description: "Procesar liquidaciones y pagos",
      icon: DollarSign,
      href: "/liquidaciones",
      color: "bg-yellow-500",
    },
    {
      title: "Talleres",
      description: "Programar y seguir mantenimientos",
      icon: Wrench,
      href: "/talleres",
      color: "bg-indigo-500",
    },
    {
      title: "Mantenimiento de Vehículos",
      description: "Registrar y seguir mantenimientos de vehículos",
      icon: Wrench,
      href: "/mantenimiento-vehiculos",
      color: "bg-teal-500",
    },
    {
      title: "Seguros de Vehículos",
      description: "Gestionar pólizas de seguro de la flota",
      icon: Shield,
      href: "/seguros",
      color: "bg-cyan-500",
    },
    {
      title: "Impuestos de Vehículos",
      description: "Gestionar impuestos y contribuciones vehiculares",
      icon: Receipt,
      href: "/impuestos",
      color: "bg-purple-600",
    },
  ]

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-2">Panel de Control</h2>
        <p className="text-gray-600 dark:text-slate-400">Accede rápidamente a todos los módulos del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => {
          const IconComponent = module.icon
          return (
            <Link key={module.href} href={module.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-3`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Órdenes Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">24</div>
            <p className="text-sm text-gray-600">En tránsito</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehículos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">18</div>
            <p className="text-sm text-gray-600">De 25 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Mantenimientos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">3</div>
            <p className="text-sm text-gray-600">Programados esta semana</p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
