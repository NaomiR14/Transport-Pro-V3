import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_mantenimiento_tutorial_done'

export function useMantenimientoTutorial() {
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
            title: '🔩 Mantenimiento de Vehículos',
            description:
              'Registra mantenimientos preventivos y correctivos, costos y el taller asignado a cada intervención.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#mantenimiento-stats',
          popover: {
            title: '📊 Estado de la flota',
            description:
              'Total de registros de mantenimiento, cuántos están pendientes de realizar, en progreso actualmente, completados y el costo total acumulado de mantenimientos. El costo total ayuda a analizar el gasto de mantenimiento por período.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#mantenimiento-new-btn',
          popover: {
            title: '➕ Nuevo mantenimiento',
            description:
              'Selecciona el vehículo, tipo (preventivo/correctivo), taller asignado, descripción del trabajo, costo estimado, fecha programada y estado.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#mantenimiento-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por vehículo o descripción, filtra por tipo de mantenimiento, por estado (pendiente, en progreso, completado) y por rango de fechas.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#mantenimiento-table',
          popover: {
            title: '📋 Tabla de mantenimientos',
            description:
              'Muestra vehículo (placa), tipo de mantenimiento, taller donde se realiza, fecha programada, costo (resaltado si supera el promedio), estado con código de color y acciones.',
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
