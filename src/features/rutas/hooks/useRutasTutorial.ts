import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_rutas_tutorial_done'

export function useRutasTutorial() {
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
            title: '🗺️ Rutas de Viaje',
            description:
              'Registra cada viaje de la flota con origen, destino, conductor, fechas, ingresos y gastos.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#rutas-stats',
          popover: {
            title: '📊 Métricas de rutas',
            description:
              'Total de rutas registradas, rutas completadas, en progreso y pendientes. Los ingresos y gastos totales se suman de todas las rutas del período.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#rutas-new-btn',
          popover: {
            title: '➕ Nueva ruta',
            description:
              'Define origen, destino, conductor, vehículo, fechas de salida y llegada, ingresos del viaje y gastos operativos.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#rutas-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por texto libre, filtra por vehículo específico o por conductor para ver el historial de cada uno.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#rutas-table',
          popover: {
            title: '📋 Tabla de rutas',
            description:
              'Muestra origen → destino, conductor asignado, vehículo, fechas, ingresos, gastos y la utilidad por viaje (ingresos − gastos). Las rutas en progreso se resaltan.',
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
