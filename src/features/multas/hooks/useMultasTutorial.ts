import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_multas_tutorial_done'

export function useMultasTutorial() {
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
            title: '⚠️ Multas de Conductores',
            description:
              'Registra y da seguimiento a infracciones de tránsito, montos y estado de pago.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#multas-stats',
          popover: {
            title: '📊 Panel de infracciones',
            description:
              'Total de multas registradas, cuántas están pendientes de pago, cuántas fueron pagadas y el monto total acumulado. El monto pendiente indica la deuda activa.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#multas-new-btn',
          popover: {
            title: '➕ Nueva multa',
            description:
              'Registra el conductor infractor, fecha, tipo de infracción, monto y estado de pago (pendiente/pagado).',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#multas-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por conductor o descripción, filtra por estado de pago y por rango de fechas para auditorías periódicas.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#multas-table',
          popover: {
            title: '📋 Tabla de multas',
            description:
              'Muestra conductor, fecha de infracción, tipo, monto (en moneda local), estado de pago resaltado por color y acciones. Las multas pendientes aparecen en amarillo.',
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
