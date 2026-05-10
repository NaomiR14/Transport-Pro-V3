import Link from 'next/link'
import { Truck, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Términos de Servicio – TransportPro',
  description: 'Términos y condiciones de uso de la plataforma TransportPro.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Términos de Servicio</h1>
          <p className="text-sm text-gray-400 mb-10">Última actualización: 6 de mayo de 2026</p>

          <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

            <Section title="1. Aceptación de los términos">
              <p>
                Al acceder y utilizar la plataforma <strong>TransportPro</strong> (en adelante, "el Servicio"), usted acepta
                quedar vinculado por los presentes Términos de Servicio, nuestra Política de Privacidad y nuestra Política de
                Cookies. Si no está de acuerdo con alguno de estos términos, no debe utilizar el Servicio.
              </p>
              <p>
                Estos términos aplican a todas las personas físicas o jurídicas que accedan o utilicen el Servicio,
                incluyendo administradores, conductores y demás usuarios que su empresa registre.
              </p>
            </Section>

            <Section title="2. Descripción del Servicio">
              <p>
                TransportPro es una plataforma de software como servicio (SaaS) orientada a la gestión integral de
                operaciones de transporte. El Servicio incluye, entre otros módulos: gestión de flota vehicular, control de
                conductores, planificación de rutas, seguimiento de mantenimientos, administración de seguros y multas,
                flujo de caja y generación de reportes.
              </p>
              <p>
                Nos reservamos el derecho de modificar, suspender o descontinuar cualquier función del Servicio en cualquier
                momento, notificando a los usuarios con al menos 30 días de anticipación salvo en casos de fuerza mayor o
                problemas de seguridad.
              </p>
            </Section>

            <Section title="3. Registro y cuenta de usuario">
              <p>
                Para acceder al Servicio debe crear una cuenta proporcionando información veraz, exacta y completa.
                Usted es responsable de mantener la confidencialidad de sus credenciales y de todas las actividades que
                ocurran bajo su cuenta.
              </p>
              <p>
                Debe notificarnos de inmediato ante cualquier uso no autorizado de su cuenta. TransportPro no será
                responsable de los daños derivados del incumplimiento de esta obligación.
              </p>
              <p>
                Cada empresa cliente puede registrar múltiples usuarios con distintos roles y niveles de acceso según el
                plan contratado.
              </p>
            </Section>

            <Section title="4. Planes, pagos y facturación">
              <p>
                El Servicio se ofrece bajo distintos planes de suscripción mensual. Los precios vigentes están publicados en
                la sección de Precios de nuestro sitio web. Todos los precios se expresan en dólares estadounidenses (USD)
                e incluyen los impuestos aplicables en su jurisdicción.
              </p>
              <p>
                El cobro se realiza mensualmente de forma anticipada. En caso de no pago, el acceso al Servicio podrá
                suspenderse después de 7 días de gracia, sin eliminación de datos durante los 60 días posteriores.
              </p>
              <p>
                Puede cancelar su suscripción en cualquier momento desde el portal de facturación. La cancelación es
                efectiva al final del período de facturación en curso y no genera reembolso proporcional.
              </p>
            </Section>

            <Section title="5. Uso aceptable">
              <p>Usted se compromete a no utilizar el Servicio para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Actividades ilegales o que vulneren derechos de terceros.</li>
                <li>Introducir virus, malware o cualquier código dañino.</li>
                <li>Intentar acceder de forma no autorizada a sistemas o datos de otros clientes.</li>
                <li>Realizar ingeniería inversa, descompilar o desensamblar el software.</li>
                <li>Revender o sublicenciar el Servicio sin autorización expresa por escrito.</li>
              </ul>
            </Section>

            <Section title="6. Propiedad intelectual">
              <p>
                TransportPro y todos sus componentes —incluyendo código fuente, diseño, marcas, logotipos y
                documentación— son propiedad exclusiva de TransportPro o sus licenciantes y están protegidos por las leyes
                de propiedad intelectual aplicables.
              </p>
              <p>
                Usted conserva todos los derechos sobre los datos que ingrese al sistema. Le otorgamos una licencia
                limitada, no exclusiva e intransferible para acceder y utilizar el Servicio según los términos aquí
                establecidos.
              </p>
            </Section>

            <Section title="7. Privacidad y protección de datos">
              <p>
                El tratamiento de datos personales se rige por nuestra{' '}
                <Link href="/privacidad" className="text-blue-600 hover:underline font-medium">
                  Política de Privacidad
                </Link>
                , la cual forma parte integral de estos Términos. Al usar el Servicio, usted acepta dicha política.
              </p>
            </Section>

            <Section title="8. Limitación de responsabilidad">
              <p>
                En la máxima medida permitida por la ley, TransportPro no será responsable de daños indirectos,
                incidentales, especiales, consecuentes o punitivos, incluyendo pérdida de beneficios, datos o goodwill,
                aunque se hubiera advertido de la posibilidad de dichos daños.
              </p>
              <p>
                Nuestra responsabilidad total ante usted por cualquier reclamación derivada del uso del Servicio no
                excederá el importe pagado por usted en los tres meses anteriores al evento que dio origen a la reclamación.
              </p>
            </Section>

            <Section title="9. Disponibilidad y SLA">
              <p>
                Nos comprometemos a una disponibilidad del 99,9% mensual en los planes Profesional y Enterprise. Las
                interrupciones programadas por mantenimiento serán notificadas con 48 horas de antelación y realizadas
                fuera del horario pico.
              </p>
            </Section>

            <Section title="10. Modificaciones de los términos">
              <p>
                Podemos actualizar estos Términos en cualquier momento. Le notificaremos por correo electrónico y mediante
                un aviso en la plataforma con al menos 15 días de antelación. El uso continuado del Servicio tras la
                entrada en vigor de los cambios implica su aceptación.
              </p>
            </Section>

            <Section title="11. Ley aplicable y jurisdicción">
              <p>
                Estos Términos se rigen por las leyes de la República de México. Cualquier disputa que no pueda resolverse
                amistosamente será sometida a la jurisdicción exclusiva de los tribunales competentes de Ciudad de México.
              </p>
            </Section>

            <Section title="12. Contacto">
              <p>
                Para cualquier consulta sobre estos Términos, contáctenos en:{' '}
                {/* legal@transportpro.app */}
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

function LegalFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gray-200 mt-16 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <p>© {year} TransportPro. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <Link href="/terminos" className="hover:text-blue-600 transition-colors font-medium text-blue-600">Términos</Link>
          <Link href="/privacidad" className="hover:text-blue-600 transition-colors">Privacidad</Link>
          <Link href="/cookies" className="hover:text-blue-600 transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}
