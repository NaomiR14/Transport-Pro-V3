import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_vehiculos_tutorial_done'

export function useVehiculosTutorial() {
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
            title: '🚛 Flota de Vehículos',
            description:
              'Gestiona todos los vehículos, su estado operativo y límites del plan.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#vehiculos-stats',
          popover: {
            title: '📊 Indicadores de flota',
            description:
              'Total de vehículos registrados, cuántos están disponibles, en ruta o en mantenimiento. El color cambia según el estado operativo.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#vehiculos-new-btn',
          popover: {
            title: '➕ Nuevo vehículo',
            description:
              'Registra placa, tipo, marca, modelo, año y estado. El sistema bloquea el botón si alcanzaste el límite de vehículos de tu plan.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#vehiculos-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por placa o marca, filtra por tipo de vehículo (camión, furgoneta, etc.) y por estado (disponible, en ruta, mantenimiento).',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#vehiculos-table',
          popover: {
            title: '📋 Tabla de vehículos',
            description:
              'Muestra placa, tipo, marca, año, estado calculado automáticamente según mantenimientos y rutas activas, y las acciones de editar/eliminar.',
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
