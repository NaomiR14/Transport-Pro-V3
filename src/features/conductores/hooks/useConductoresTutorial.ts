import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_conductores_tutorial_done'

export function useConductoresTutorial() {
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
            title: '👨‍✈️ Gestión de Conductores',
            description:
              'Registra y controla toda la información del personal de conducción.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#conductores-stats',
          popover: {
            title: '📊 Métricas del equipo',
            description:
              'Total de conductores, cuántos están activos, cantidad con licencias próximas a vencer y conductores inactivos. Las alertas de licencia ayudan a anticipar renovaciones.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#conductores-new-btn',
          popover: {
            title: '➕ Nuevo conductor',
            description:
              'Registra documento de identidad, nombre, número de licencia, categoría, fecha de vencimiento y estado activo/inactivo.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#conductores-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por nombre o documento, filtra por estado de licencia (vigente, por vencer, vencida) y por estado activo.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#conductores-table',
          popover: {
            title: '📋 Tabla de conductores',
            description:
              'Muestra documento, nombre completo, categoría de licencia, fecha de vencimiento (resaltada en rojo si vence pronto), estado y acciones.',
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
