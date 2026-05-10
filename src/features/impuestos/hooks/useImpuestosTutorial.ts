import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_impuestos_tutorial_done'

export function useImpuestosTutorial() {
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
            title: '🧾 Impuestos Vehiculares',
            description:
              'Controla los impuestos y contribuciones de la flota: SOAT, rodaje, revisión técnica y otros tributos.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#impuestos-stats',
          popover: {
            title: '📊 Estado tributario',
            description:
              'Total de impuestos registrados, pagados al día, pendientes de pago y vencidos. El monto total muestra la carga tributaria acumulada de la flota.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#impuestos-new-btn',
          popover: {
            title: '➕ Nuevo impuesto',
            description:
              'Selecciona el vehículo, tipo de impuesto (SOAT, rodaje, revisión técnica, etc.), período, monto, fecha de vencimiento y estado de pago.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#impuestos-filters',
          popover: {
            title: '🔍 Filtros',
            description:
              'Busca por vehículo o tipo de impuesto, filtra por período y por estado de pago para identificar obligaciones pendientes.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#impuestos-table',
          popover: {
            title: '📋 Tabla de impuestos',
            description:
              'Muestra vehículo (placa), tipo de impuesto, período aplicable, monto, fecha de vencimiento (resaltada si está próxima o vencida), estado de pago y acciones.',
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
