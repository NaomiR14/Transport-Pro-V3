import {
  Truck, Users, MapPin, Wrench, Shield, BarChart3,
  CreditCard, Bell, Globe,
} from 'lucide-react'
import type { ElementType } from 'react'

type Feature = {
  icon: ElementType
  title: string
  description: string
  color: string
}

const FEATURES: Feature[] = [
  {
    icon: Truck,
    title: 'Gestión de flota',
    description: 'Control total de tu flota: estado, documentación, vigencias y asignaciones en tiempo real.',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Conductores',
    description: 'Administra licencias, documentos y el desempeño de cada conductor con indicadores claros.',
    color: 'indigo',
  },
  {
    icon: MapPin,
    title: 'Rutas y órdenes',
    description: 'Planifica rutas, asigna conductores y haz seguimiento de cada orden de transporte.',
    color: 'violet',
  },
  {
    icon: Wrench,
    title: 'Mantenimiento',
    description: 'Agenda preventivos y correctivos. Recibe alertas antes de que tu vehículo falle en ruta.',
    color: 'amber',
  },
  {
    icon: Shield,
    title: 'Seguros y multas',
    description: 'Centraliza pólizas de seguro, vigencias y gestiona multas con trazabilidad completa.',
    color: 'emerald',
  },
  {
    icon: BarChart3,
    title: 'Reportes avanzados',
    description: 'Informes de conductores, vehículos y operación.',
    color: 'rose',
  },
  {
    icon: CreditCard,
    title: 'Flujo de caja',
    description: 'Registra ingresos y egresos por operación. Ten la salud financiera de tu flota siempre visible.',
    color: 'teal',
  },
  {
    icon: Bell,
    title: 'Notificaciones inteligentes',
    description: 'Alertas automáticas de vencimientos, mantenimientos y eventos críticos en tu operación.',
    color: 'purple',
  },
  {
    icon: Globe,
    title: 'Roles',
    description: 'Gestiona múltiples roles dentro de tu empresa y asigna permisos de visualización.',
    color: 'cyan',
  },
]

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  blue:    { bg: 'bg-blue-100',    text: 'text-blue-600',    ring: 'ring-blue-100' },
  indigo:  { bg: 'bg-indigo-100',  text: 'text-indigo-600',  ring: 'ring-indigo-100' },
  violet:  { bg: 'bg-violet-100',  text: 'text-violet-600',  ring: 'ring-violet-100' },
  amber:   { bg: 'bg-amber-100',   text: 'text-amber-600',   ring: 'ring-amber-100' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  rose:    { bg: 'bg-rose-100',    text: 'text-rose-600',    ring: 'ring-rose-100' },
  teal:    { bg: 'bg-teal-100',    text: 'text-teal-600',    ring: 'ring-teal-100' },
  purple:  { bg: 'bg-purple-100',  text: 'text-purple-600',  ring: 'ring-purple-100' },
  cyan:    { bg: 'bg-cyan-100',    text: 'text-cyan-600',    ring: 'ring-cyan-100' },
}

export default function FeaturesSection() {
  return (
    <section id="caracteristicas" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Características de productividad
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Todo lo que tu empresa de transporte necesita
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Deja de usar hojas de cálculo y correos. Transport-Pro centraliza cada aspecto de tu
            operación con módulos especializados que hablan entre sí.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const c = COLOR_MAP[f.color]
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className={`inline-flex p-3 rounded-xl ${c.bg} ring-4 ${c.ring} mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className={`h-6 w-6 ${c.text}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
