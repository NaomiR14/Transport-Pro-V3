import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_seguros_tutorial_done'

export function useSegurosTutorial() {
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
            title: '🛡️ Seguros de Vehículos',
            description:
              'Gestiona las pólizas de seguro de toda la flota, sus vencimientos y costos.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#seguros-stats',
          popover: {
            title: '📊 Estado de pólizas',
            description:
              'Total de seguros registrados, pólizas activas y vigentes, por vencer en los próximos 30 días (alerta temprana) y vencidas que requieren renovación urgente. El costo total anual suma todas las primas activas.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#seguros-new-btn',
          popover: {
            title: '➕ Nuevo seguro',
            description:
              'Selecciona el vehículo, aseguradora, número de póliza, tipo de cobertura, prima anual, fecha de inicio y fecha de vencimiento.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#seguros-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por vehículo o aseguradora, filtra por tipo de cobertura y por estado (activo, por vencer, vencido) para gestionar renovaciones a tiempo.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#seguros-table',
          popover: {
            title: '📋 Tabla de pólizas',
            description:
              'Muestra vehículo (placa), aseguradora, número de póliza, tipo de cobertura, prima anual, fecha de vencimiento (resaltada en naranja si vence pronto o rojo si venció) y estado.',
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
