import Link from 'next/link'
import { Truck } from 'lucide-react'

const PRODUCT_LINKS = [
  { label: 'Características', href: '#caracteristicas' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Precios', href: '#precios' },
  { label: 'Iniciar sesión', href: '/login' },
  { label: 'Registrarse', href: '/registro-empresa' },
]

const MODULE_NAMES = [
  'Flota y vehículos',
  'Conductores',
  'Rutas y órdenes',
  'Mantenimiento',
  'Seguros y multas',
  'Reportes y análisis',
]

const LEGAL_LINKS = [
  { label: 'Términos de servicio', href: '/terminos' },
  { label: 'Política de privacidad', href: '/privacidad' },
  { label: 'Política de cookies', href: '/cookies' },
]

export default function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-blue-600">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Transport<span className="text-blue-400">Pro</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              El sistema integral de gestión de flotas diseñado para empresas de transporte en
              crecimiento.
            </p>
            {/* ventas@transportpro.app */}
            <a
              href="https://wa.me/message/W7UJTLTWJICNH1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              WhatsApp
            </a>
          </div>

          {/* Producto */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Producto</h4>
            <ul className="space-y-2.5 text-sm">
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-blue-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Módulos */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Módulos</h4>
            <ul className="space-y-2.5 text-sm">
              {MODULE_NAMES.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-blue-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {year} Transport-Pro. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Todos los sistemas operativos
          </div>
        </div>
      </div>
    </footer>
  )
}
