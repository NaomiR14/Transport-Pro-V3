import Link from 'next/link'
import { Truck, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Política de Privacidad – TransportPro',
  description: 'Cómo TransportPro recopila, usa y protege tus datos personales.',
}

export default function PrivacidadPage() {
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Política de Privacidad</h1>
          <p className="text-sm text-gray-400 mb-10">Última actualización: 6 de mayo de 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">

            <Section title="1. Responsable del tratamiento">
              <p>
                <strong>TransportPro</strong> (en adelante, "nosotros" o "la Empresa") actúa como responsable del
                tratamiento de los datos personales que usted nos proporciona al registrarse y utilizar nuestra plataforma.
                Puede contactarnos en{' '}
                {/* privacidad@transportpro.app */}
                <a
                  href="https://wa.me/message/W7UJTLTWJICNH1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  WhatsApp
                </a>
                .
              </p>
            </Section>

            <Section title="2. Datos que recopilamos">
              <p>Recopilamos distintos tipos de datos según cómo interactúe con el Servicio:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>
                  <strong>Datos de registro:</strong> nombre, apellido, correo electrónico, nombre de la empresa y número
                  de teléfono.
                </li>
                <li>
                  <strong>Datos de la operación:</strong> información que usted ingresa sobre vehículos, conductores,
                  rutas, mantenimientos, seguros y finanzas de su empresa.
                </li>
                <li>
                  <strong>Datos de pago:</strong> procesados de forma segura por Stripe. No almacenamos números de
                  tarjeta ni datos bancarios en nuestros servidores.
                </li>
                <li>
                  <strong>Datos de uso:</strong> páginas visitadas, funciones utilizadas, dirección IP, tipo de
                  navegador y sistema operativo, con fines de mejora del servicio.
                </li>
                <li>
                  <strong>Cookies y tecnologías similares:</strong> consulte nuestra{' '}
                  <Link href="/cookies" className="text-blue-600 hover:underline font-medium">
                    Política de Cookies
                  </Link>
                  .
                </li>
              </ul>
            </Section>

            <Section title="3. Finalidades y base legal del tratamiento">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse mt-2">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-2.5 px-3 border border-gray-200 font-semibold text-gray-700 rounded-tl-lg">Finalidad</th>
                      <th className="text-left py-2.5 px-3 border border-gray-200 font-semibold text-gray-700 rounded-tr-lg">Base legal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Prestación del Servicio contratado', 'Ejecución del contrato'],
                      ['Facturación y gestión de pagos', 'Ejecución del contrato / Obligación legal'],
                      ['Envío de comunicaciones del Servicio', 'Interés legítimo'],
                      ['Mejora y desarrollo del producto', 'Interés legítimo'],
                      ['Marketing y novedades (solo con consentimiento)', 'Consentimiento'],
                      ['Cumplimiento de obligaciones legales', 'Obligación legal'],
                    ].map(([fin, base], i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="py-2.5 px-3 border border-gray-200">{fin}</td>
                        <td className="py-2.5 px-3 border border-gray-200 text-gray-500">{base}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="4. Conservación de los datos">
              <p>
                Conservamos sus datos mientras mantenga una cuenta activa con nosotros. Tras la cancelación de su cuenta,
                los datos operativos se retienen durante 60 días para facilitar una posible reactivación, y posteriormente
                se eliminan de forma segura.
              </p>
              <p>
                Los datos necesarios para el cumplimiento de obligaciones legales (p. ej., registros de facturación) se
                conservan durante el plazo exigido por la legislación aplicable (generalmente 5 años).
              </p>
            </Section>

            <Section title="5. Compartición de datos con terceros">
              <p>No vendemos sus datos personales. Podemos compartirlos únicamente con:</p>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li><strong>Stripe:</strong> procesamiento seguro de pagos.</li>
                <li><strong>Supabase:</strong> infraestructura de base de datos con cifrado en reposo y en tránsito.</li>
                <li><strong>Proveedores de análisis:</strong> para mejorar la experiencia de usuario (datos anonimizados).</li>
                <li><strong>Autoridades competentes:</strong> cuando así lo exija la ley.</li>
              </ul>
              <p>
                Todos nuestros proveedores han suscrito acuerdos de procesamiento de datos que garantizan el cumplimiento
                de las normativas de privacidad aplicables.
              </p>
            </Section>

            <Section title="6. Transferencias internacionales">
              <p>
                Algunos de nuestros proveedores de infraestructura operan en los Estados Unidos. Dichas transferencias
                se realizan bajo garantías adecuadas (cláusulas contractuales estándar o certificaciones equivalentes)
                que aseguran un nivel de protección equivalente al de su país.
              </p>
            </Section>

            <Section title="7. Sus derechos">
              <p>Según la normativa aplicable, usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-sm">
                <li><strong>Acceso:</strong> obtener una copia de sus datos personales.</li>
                <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de sus datos ("derecho al olvido").</li>
                <li><strong>Portabilidad:</strong> recibir sus datos en formato estructurado y legible por máquina.</li>
                <li><strong>Oposición y limitación:</strong> oponerse o restringir ciertos tratamientos.</li>
                <li><strong>Revocación del consentimiento:</strong> en cualquier momento, sin efecto retroactivo.</li>
              </ul>
              <p>
                Para ejercer estos derechos, envíe un correo a{' '}
                {/* privacidad@transportpro.app */}
                <a
                  href="https://wa.me/message/W7UJTLTWJICNH1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  WhatsApp
                </a>{' '}
                con su nombre y descripción de la solicitud. Responderemos en un plazo máximo de 30 días.
              </p>
            </Section>

            <Section title="8. Seguridad de los datos">
              <p>
                Aplicamos medidas técnicas y organizativas apropiadas para proteger sus datos: cifrado TLS en tránsito,
                cifrado en reposo, accesos con privilegio mínimo, autenticación multifactor para el equipo interno y
                auditorías de seguridad periódicas.
              </p>
            </Section>

            <Section title="9. Menores de edad">
              <p>
                El Servicio está dirigido exclusivamente a personas mayores de 18 años o emancipadas. No recopilamos
                intencionalmente datos de menores. Si detectamos que hemos recabado datos de un menor, los eliminaremos
                de forma inmediata.
              </p>
            </Section>

            <Section title="10. Cambios en esta política">
              <p>
                Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos los cambios significativos
                por correo electrónico. La versión vigente siempre estará disponible en esta página.
              </p>
            </Section>

            <Section title="11. Contacto y autoridad de control">
              <p>
                Para cualquier consulta sobre privacidad: {' '}
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
              <p>
                Si considera que sus derechos no han sido atendidos, puede presentar una reclamación ante la autoridad
                de protección de datos de su país.
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

function LegalFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 mt-16 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <p>© {year} TransportPro. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <Link href="/terminos" className="hover:text-blue-600 transition-colors">Términos</Link>
          <Link href="/privacidad" className="hover:text-blue-600 transition-colors font-medium text-blue-600">Privacidad</Link>
          <Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}
