import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_flujo_caja_tutorial_done'

export function useFlujoCajaTutorial() {
  const driverRef = useRef<ReturnType<typeof import('driver.js')['driver']> | null>(null)

  const startTutorial = useCallback(async () => {
    const { driver } = await import('driver.js')

    driverRef.current = driver({
      showProgress: true,
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: 'Siguiente →',
      prevBtnText: '← Anterior',
      doneBtnText: '¡Entendido!',
      progressText: '{{current}} de {{total}}',
      steps: [
        {
          popover: {
            title: '💰 Flujo de Caja Mensual',
            description:
              'Analiza la salud financiera de la flota mes a mes: ingresos, egresos, utilidad neta y margen.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#flujo-caja-kpis',
          popover: {
            title: '📊 KPIs anuales',
            description:
              'Ingresos Totales (suma de ingresos de todas las rutas del año), Egresos Totales (gastos de rutas + egresos varios), Utilidad (ingresos − egresos) y Margen % (utilidad / ingresos × 100). El color cambia a rojo si la utilidad es negativa.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#flujo-caja-tabla',
          popover: {
            title: '📋 Tabla mensual',
            description:
              'Cada fila es un mes. Columnas: # rutas realizadas, ingresos del mes, egresos operativos (rutas) + egresos varios, utilidad neta y margen %. La fila TOTAL suma el año completo.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#flujo-caja-chart',
          popover: {
            title: '📈 Gráfico de barras',
            description:
              'Visualiza ingresos y egresos por mes. La línea superpuesta muestra la evolución del margen %. Útil para detectar meses de bajo rendimiento.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#flujo-caja-egresos',
          popover: {
            title: '📝 Egresos Varios',
            description:
              'Registra gastos que no son de rutas (sueldos administrativos, seguros de oficina, etc.) por mes. Estos se suman automáticamente a los egresos del mes en la tabla principal.',
            side: 'top',
            align: 'start',
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem(TUTORIAL_KEY, 'true')
      },
    })

    driverRef.current.drive()
  }, [])

  useEffect(() => {
    const alreadySeen = localStorage.getItem(TUTORIAL_KEY)
    if (!alreadySeen) {
      const timeout = setTimeout(startTutorial, 800)
      return () => clearTimeout(timeout)
    }
  }, [startTutorial])

  const resetAndStart = useCallback(() => {
    localStorage.removeItem(TUTORIAL_KEY)
    startTutorial()
  }, [startTutorial])

  return { startTutorial: resetAndStart }
}
