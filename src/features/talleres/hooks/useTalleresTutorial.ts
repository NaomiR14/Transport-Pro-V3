import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_talleres_tutorial_done'

export function useTalleresTutorial() {
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
            title: '🔧 Gestión de Talleres',
            description:
              'Directorio de talleres mecánicos autorizados para el mantenimiento de tu flota.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#talleres-stats',
          popover: {
            title: '📊 Resumen de talleres',
            description:
              'Total registrados, talleres activos disponibles para asignación e inactivos. Mantén actualizados solo los talleres con los que trabajas actualmente.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#talleres-new-btn',
          popover: {
            title: '➕ Nuevo taller',
            description:
              'Registra nombre del taller, dirección, teléfono de contacto, especialidad (mecánica general, electricidad, carrocería, etc.) y estado activo/inactivo.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#talleres-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por nombre o dirección, filtra por especialidad y por estado para encontrar rápidamente el taller adecuado para cada tipo de mantenimiento.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#talleres-table',
          popover: {
            title: '📋 Tabla de talleres',
            description:
              'Muestra nombre, dirección, teléfono, especialidad, estado y acciones de editar/eliminar. El estado determina si el taller aparece como opción en los registros de mantenimiento.',
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
