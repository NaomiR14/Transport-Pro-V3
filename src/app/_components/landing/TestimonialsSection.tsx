import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Carlos Mendoza',
    role: 'Gerente de Operaciones',
    company: 'Logística Norte S.A.',
    quote: 'Redujimos los tiempos de gestión administrativa en un 60% desde que usamos Transport-Pro. El módulo de mantenimiento nos evitó dos fallas graves en ruta.',
    stars: 5,
  },
  {
    name: 'Ana Rodríguez',
    role: 'Directora General',
    company: 'Transportes Rápido',
    quote: 'Teníamos todo en Excel y era un caos. Con Transport-Pro en dos días ya teníamos toda la flota registrada y los reportes funcionando. Increíble.',
    stars: 5,
  },
  {
    name: 'Miguel Torres',
    role: 'Jefe de Flota',
    company: 'Cargo Express',
    quote: 'Las alertas de vencimiento de seguros y revisiones técnicas nos han salvado de multas costosas. El retorno de inversión fue inmediato.',
    stars: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Testimonios
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Empresas que ya confían en Transport-Pro
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
