import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_reporte_general_tutorial_done'

export function useReporteGeneralTutorial() {
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
            title: '📊 Reporte General de Indicadores',
            description:
              'Análisis anual de operaciones y finanzas por vehículo o toda la flota.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#reporte-general-kpis',
          popover: {
            title: '🔢 KPIs consolidados',
            description:
              'Total Viajes (cantidad de rutas completadas), Kms Recorridos (distancia total de todas las rutas), Ingresos Totales y Gastos Totales del período seleccionado. Cambia el filtro de año o vehículo para ver diferentes períodos.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#reporte-general-tabla',
          popover: {
            title: '📋 Tabla de indicadores por mes',
            description:
              'Columnas principales (mes, viajes, kms, carga toneladas), indicadores de transporte (eficiencia km/viaje) e indicadores financieros (ingresos, gastos, utilidad, margen %). Cada fila representa un mes del año seleccionado.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#reporte-general-chart',
          popover: {
            title: '📈 Gráfico Ingresos vs Gastos',
            description:
              'Barras por mes con ingresos (verde) y gastos (rojo), más una línea de margen bruto %. Permite detectar tendencias y meses con pérdidas de un vistazo.',
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
