import { useQuery } from '@tanstack/react-query'
import { ReporteGeneralService } from '../services/reporte-general-service'

const QUERY_KEYS = {
  reporte:  ['reporteGeneral'] as const,
  anual:    (anio: number, placa?: string) =>
    [...QUERY_KEYS.reporte, 'anual', anio, placa ?? 'all'] as const,
  placas:   () => [...QUERY_KEYS.reporte, 'placas'] as const,
}

/**
 * Hook para obtener el reporte general anual.
 * @param anio  Año a consultar.
 * @param placa Placa del vehículo. undefined = toda la flota.
 */
export function useReporteGeneral(anio: number, placa?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.anual(anio, placa),
    queryFn:  () => ReporteGeneralService.getReporteAnual(anio, placa),
    staleTime: 60 * 1000, // 1 minuto
  })
}

/**
 * Hook para obtener la lista de placas de la flota (para el selector).
 */
export function usePlacasVehiculos() {
  return useQuery({
    queryKey: QUERY_KEYS.placas(),
    queryFn:  () => ReporteGeneralService.getPlacas(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
