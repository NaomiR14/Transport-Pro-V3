import Link from 'next/link'
import { ArrowRight, ChevronDown, Play } from 'lucide-react'

const STATS = [
  { value: '+500', label: 'Empresas activas' },
  { value: '+12K', label: 'Vehículos gestionados' },
  { value: '99.9%', label: 'Uptime garantizado' },
  { value: '24/7', label: 'Soporte disponible' },
]

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTYwIDBIMHY2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjAzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-40" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 w-full">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">
              Plataforma #1 para gestión de flotas en Latinoamérica
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Gestiona tu flota con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              total control
            </span>
          </h1>

          <p className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Transport-Pro unifica la operación completa de tu empresa de transporte: vehículos,
            conductores, rutas, mantenimiento, seguros y finanzas en un solo lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/registro-empresa"
              className="group flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl transition-all shadow-lg hover:shadow-blue-500/30 hover:shadow-xl"
            >
              Comenzar
              <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#como-funciona"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-lg rounded-2xl border border-white/20 transition-all"
            >
              <Play className="h-5 w-5 text-blue-300" />
              Ver cómo funciona
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-blue-200/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#caracteristicas"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
      >
        <span className="text-xs font-medium uppercase tracking-widest">Explorar</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  )
}
