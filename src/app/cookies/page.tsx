import Link from 'next/link'
import { Truck, ArrowLeft, Cookie } from 'lucide-react'

export const metadata = {
  title: 'Política de Cookies – TransportPro',
  description: 'Información sobre el uso de cookies en la plataforma TransportPro.',
}

type CookieRow = {
  nombre: string
  tipo: string
  duracion: string
  proposito: string
}

const cookiesEsenciales: CookieRow[] = [
  { nombre: 'sb-access-token',  tipo: 'Esencial',  duracion: 'Sesión',   proposito: 'Token de autenticación de sesión de usuario (Supabase).' },
  { nombre: 'sb-refresh-token', tipo: 'Esencial',  duracion: '1 año',    proposito: 'Token de renovación de sesión de usuario (Supabase).' },
  { nombre: '__stripe_mid',     tipo: 'Esencial',  duracion: '1 año',    proposito: 'Prevención de fraude en pagos (Stripe).' },
  { nombre: '__stripe_sid',     tipo: 'Esencial',  duracion: 'Sesión',   proposito: 'Identificador de sesión de pago (Stripe).' },
]

const cookiesAnalisis: CookieRow[] = [
  { nombre: '_tp_session_id',   tipo: 'Analítica', duracion: '30 días',  proposito: 'Identificador de sesión para análisis de uso interno.' },
  { nombre: '_tp_last_visit',   tipo: 'Analítica', duracion: '6 meses',  proposito: 'Fecha de la última visita para medir retención.' },
]

const cookiesMarketing: CookieRow[] = [
  { nombre: '_tp_utm_source',   tipo: 'Marketing', duracion: '90 días',  proposito: 'Origen de la campaña publicitaria (UTM).' },
  { nombre: '_tp_utm_medium',   tipo: 'Marketing', duracion: '90 días',  proposito: 'Canal de la campaña publicitaria (UTM).' },
]

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-1.5 rounded-lg bg-blue-600">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Transport<span className="text-blue-600">Pro</span></span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
          {/* Intro */}
          <div className="flex items-start gap-4 mb-8">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <Cookie className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Política de Cookies</h1>
              <p className="text-sm text-gray-400">Última actualización: 6 de mayo de 2026</p>
            </div>
          </div>

          <div className="space-y-8 text-gray-700 leading-relaxed">

            <Section title="¿Qué son las cookies?">
              <p>
                Las cookies son pequeños archivos de texto que los sitios web colocan en su dispositivo al visitarlos.
                Se utilizan ampliamente para hacer que los sitios web funcionen correctamente, mejorar la eficiencia,
                proporcionar información a los propietarios del sitio y personalizar la experiencia del usuario.
              </p>
            </Section>

            <Section title="¿Cómo usamos las cookies?">
              <p>TransportPro utiliza cookies de las siguientes categorías:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                {[
                  { label: 'Esenciales', desc: 'Necesarias para el funcionamiento básico del Servicio. No pueden desactivarse.', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                  { label: 'Analíticas', desc: 'Nos ayudan a entender cómo se usa la plataforma para mejorarla.', color: 'bg-violet-50 border-violet-200 text-violet-800' },
                  { label: 'Marketing', desc: 'Usadas para medir la efectividad de nuestras campañas publicitarias.', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                ].map((cat) => (
                  <div key={cat.label} className={`rounded-2xl border p-4 ${cat.color}`}>
                    <p className="font-bold text-sm mb-1">{cat.label}</p>
                    <p className="text-xs leading-relaxed opacity-80">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Cookies esenciales">
              <p>
                Son imprescindibles para que pueda navegar por la plataforma y usar sus funcionalidades.
                Sin estas cookies el Servicio no puede funcionar correctamente.
              </p>
              <CookieTable rows={cookiesEsenciales} />
            </Section>

            <Section title="Cookies analíticas">
              <p>
                Nos permiten medir el tráfico, entender cómo los usuarios interactúan con la plataforma y mejorar
                la experiencia. Los datos son agregados y no permiten identificar a personas concretas.
              </p>
              <CookieTable rows={cookiesAnalisis} />
            </Section>

            <Section title="Cookies de marketing">
              <p>
                Se utilizan para rastrear la efectividad de campañas publicitarias y canales de adquisición.
                Solo se activan si usted otorga su consentimiento.
              </p>
              <CookieTable rows={cookiesMarketing} />
            </Section>

            <Section title="Cookies de terceros">
              <p>
                Algunos de nuestros socios tecnológicos pueden establecer cookies en su dispositivo a través de
                nuestra plataforma:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>
                  <strong>Stripe:</strong> procesamiento de pagos y prevención de fraude.
                  <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 font-medium">
                    Ver política de Stripe →
                  </a>
                </li>
                <li>
                  <strong>Supabase:</strong> autenticación y gestión de sesiones.
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 font-medium">
                    Ver política de Supabase →
                  </a>
                </li>
              </ul>
            </Section>

            <Section title="¿Cómo gestionar y desactivar las cookies?">
              <p>
                Puede controlar y/o eliminar las cookies según sus preferencias. Puede eliminar todas las cookies
                que ya están en su dispositivo y configurar la mayoría de los navegadores para que no las acepten.
              </p>
              <p>
                Tenga en cuenta que si desactiva las cookies esenciales, algunas partes del Servicio puede que no
                funcionen correctamente.
              </p>
              <p>Instrucciones para los navegadores más habituales:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                {[
                  { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                  { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias' },
                  { name: 'Safari', url: 'https://support.apple.com/es-es/guide/safari/sfri11471/mac' },
                  { name: 'Microsoft Edge', url: 'https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
                ].map((b) => (
                  <li key={b.name}>
                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      {b.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Actualizaciones de esta política">
              <p>
                Podemos actualizar esta Política de Cookies para reflejar cambios en las cookies que usamos o por
                razones operativas, legales o reglamentarias. Le notificaremos cualquier cambio significativo
                mediante un aviso visible en la plataforma.
              </p>
            </Section>

            <Section title="Contacto">
              <p>
                Si tiene preguntas sobre nuestra Política de Cookies, escríbanos a:{' '}
                {/* privacidad@transportpro.app */}
                <a
                  href="https://wa.me/message/W7UJTLTWJICNH1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  WhatsApp
                </a>
              </p>
            </Section>
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-sm">{children}</div>
    </section>
  )
}

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50">
            {['Nombre', 'Tipo', 'Duración', 'Propósito'].map((h) => (
              <th key={h} className="text-left py-2.5 px-3 border border-gray-200 font-semibold text-gray-700">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.nombre} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
              <td className="py-2.5 px-3 border border-gray-200 font-mono text-gray-600">{row.nombre}</td>
              <td className="py-2.5 px-3 border border-gray-200">{row.tipo}</td>
              <td className="py-2.5 px-3 border border-gray-200 text-gray-500">{row.duracion}</td>
              <td className="py-2.5 px-3 border border-gray-200 text-gray-500">{row.proposito}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function LegalFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 mt-16 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <p>© {year} TransportPro. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <Link href="/terminos" className="hover:text-blue-600 transition-colors">Términos</Link>
          <Link href="/privacidad" className="hover:text-blue-600 transition-colors">Privacidad</Link>
          <Link href="/cookies" className="hover:text-blue-600 transition-colors font-medium text-blue-600">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}
