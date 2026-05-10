import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_ordenes_tutorial_done'

export function useOrdenesTutorial() {
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
            title: '📦 Gestión de Órdenes',
            description:
              'Aquí administras todas las órdenes de transporte: crea, edita, filtra y da seguimiento al estado de cada entrega.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#ordenes-stats',
          popover: {
            title: '📊 Métricas de órdenes',
            description:
              'Un resumen en tiempo real: total de órdenes, cuántas están pendientes, en tránsito y ya entregadas.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#ordenes-new-btn',
          popover: {
            title: '➕ Nueva orden',
            description:
              'Haz clic aquí para crear una nueva orden de transporte. Podrás asignar vehículo, conductor, origen y destino.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#ordenes-filters',
          popover: {
            title: '🔍 Filtros de búsqueda',
            description:
              'Busca por número de orden, filtra por estado (pendiente, en tránsito, entregado) o por vehículo asignado.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#ordenes-table',
          popover: {
            title: '📋 Tabla de órdenes',
            description:
              'Lista de todas las órdenes. Desde aquí puedes editar cualquier registro o eliminarlo. Haz clic en una fila para ver el detalle.',
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
