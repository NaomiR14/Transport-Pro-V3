import { useCallback, useEffect, useRef } from 'react'

const TUTORIAL_KEY = 'sgt_dashboard_tutorial_done'

export function useDashboardTutorial() {
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
      popoverClass: 'sgt-tutorial-popover',
      steps: [
        {
          popover: {
            title: '👋 Bienvenido al SGT',
            description:
              'Este breve recorrido te mostrará las secciones principales del sistema. Puedes saltar el tutorial en cualquier momento.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#dashboard-welcome',
          popover: {
            title: '🏠 Panel de inicio',
            description:
              'Aquí ves tu nombre y rol en el sistema. Cada vez que inicies sesión llegarás a esta vista.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#sidebar-nav',
          popover: {
            title: '📂 Navegación principal',
            description:
              'Desde aquí accedes a todos los módulos: vehículos, conductores, órdenes, rutas y más. Puedes colapsar el menú con la flecha superior.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#dashboard-modules',
          popover: {
            title: '🧩 Módulos del sistema',
            description:
              'Cada tarjeta es un módulo. Solo ves los módulos que tu rol tiene habilitados. Haz clic en cualquiera para acceder.',
            side: 'top',
            align: 'start',
          },
        },
        {
          element: '#dashboard-quick-stats',
          popover: {
            title: '📊 Estadísticas rápidas',
            description:
              'Un vistazo rápido a la cantidad de módulos disponibles, el estado de tu sesión y tu rol actual.',
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
      // Small delay so the DOM renders before driver.js calculates positions
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
