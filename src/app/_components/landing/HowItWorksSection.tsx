import { Package, Truck, TrendingUp, BarChart3, Clock, Zap, Shield } from 'lucide-react'
import type { ElementType } from 'react'

const STEPS: { step: string; icon: ElementType; title: string; description: string }[] = [
  {
    step: '01',
    icon: Package,
    title: 'Crea tu empresa',
    description: 'Regístrate en minutos e ingresa los datos de tu empresa.',
  },
  {
    step: '02',
    icon: Truck,
    title: 'Agrega tu flota',
    description: 'Importa o agrega manualmente tus vehículos y conductores. El sistema detecta vencimientos automáticamente.',
  },
  {
    step: '03',
    icon: TrendingUp,
    title: 'Gestiona tu operación',
    description: 'Crea órdenes, asigna conductores, registra mantenimientos y controla el flujo de caja en tiempo real.',
  },
  {
    step: '04',
    icon: BarChart3,
    title: 'Analiza y optimiza',
    description: 'Reportes detallados por conductor, vehículo y período. Toma decisiones con datos, no con suposiciones.',
  },
]


export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Cómo funciona
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Empieza a operar en menos de 10 minutos
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Transport-Pro está diseñado para que cualquier persona de tu equipo pueda usarlo.
          </p>
        </div>

        <div className="relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={s.step} className="relative flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                      <Icon className="h-12 w-12 text-white" />
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center text-xs font-extrabold text-blue-600 shadow-sm">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
