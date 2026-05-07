import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          ¿Listo para tomar el control de tu flota?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Únete a cientos de empresas que ya optimizaron su operación.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/registro-empresa"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 font-bold text-lg rounded-2xl hover:bg-blue-50 transition-all shadow-lg"
          >
            Comenzar
            <ArrowRight className="h-5 w-5" />
          </Link>
          {/* href="mailto:ventas@transportpro.app" */}
          <a
            href="https://wa.me/message/W7UJTLTWJICNH1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 transition-all"
          >
            Hablar con ventas
          </a>
        </div>
      </div>
    </section>
  )
}
