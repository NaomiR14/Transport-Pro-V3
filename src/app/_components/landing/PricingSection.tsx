import Link from 'next/link'
import { CheckCircle2, Star } from 'lucide-react'
import { PLANES } from '@/features/pagos'

export default function PricingSection() {
  return (
    <section id="precios" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Planes y precios
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Elige el plan que mejor se acomode a tu empresa
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Pagos procesados con Stripe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANES.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 flex flex-col transition-all ${
                plan.destacado
                  ? 'bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-2xl shadow-blue-300 scale-105'
                  : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-900 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-900" /> MÁS POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-1 ${plan.destacado ? 'text-white' : 'text-gray-900'}`}>
                  {plan.nombre}
                </h3>
                <p className={`text-sm ${plan.destacado ? 'text-blue-200' : 'text-gray-500'}`}>
                  {plan.descripcion}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-5xl font-extrabold ${plan.destacado ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.precio}
                </span>
                <span className={`text-sm ml-1 ${plan.destacado ? 'text-blue-200' : 'text-gray-400'}`}>
                  /mes USD
                </span>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.caracteristicas.map((c) => (
                  <li key={c} className="flex items-center gap-3">
                    <CheckCircle2 className={`h-4 w-4 flex-shrink-0 ${plan.destacado ? 'text-blue-200' : 'text-blue-600'}`} />
                    <span className={`text-sm ${plan.destacado ? 'text-blue-100' : 'text-gray-600'}`}>{c}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/registro-empresa"
                className={`block text-center py-3.5 px-6 rounded-2xl font-bold text-sm transition-all ${
                  plan.destacado
                    ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-md'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                }`}
              >
                Comenzar
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-10">
          ¿Necesitas algo diferente?{' '}
          {/* href="mailto:ventas@transportpro.app" */}
          <a
            href="https://wa.me/message/W7UJTLTWJICNH1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium"
          >
            Escríbenos por WhatsApp
          </a>{' '}
          para una cotización a medida.
        </p>
      </div>
    </section>
  )
}
