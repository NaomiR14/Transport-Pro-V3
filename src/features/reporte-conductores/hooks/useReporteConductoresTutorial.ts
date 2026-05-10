import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_reporte_conductores_tutorial_done'

export function useReporteConductoresTutorial() {
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
            title: '👨‍✈️ Reporte de Conductores',
            description:
              'Indicadores de rendimiento individual por conductor: viajes, kilómetros, carga transportada, ingresos generados y multas.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#reporte-conductores-kpis',
          popover: {
            title: '📊 KPIs del período',
            description:
              'Conductores Activos (con al menos un viaje), Total Viajes sumado de todos, Kms Recorridos acumulados e Ingresos Totales generados por la flota de conductores en el período seleccionado.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#reporte-conductores-tabla',
          popover: {
            title: '📋 Tabla por conductor',
            description:
              'Cada fila es un conductor. Columnas: nombre, N° viajes, kms recorridos, toneladas de carga transportada, ingresos generados, N° multas y monto de multas. Permite comparar el desempeño entre conductores e identificar los más rentables o con más infracciones.',
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
