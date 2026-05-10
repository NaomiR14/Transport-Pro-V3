import { useQuery } from '@tanstack/react-query'
import { ReporteConductoresService } from '../services/reporte-conductores-service'

const QUERY_KEYS = {
  reporte: ['reporteConductores'] as const,
  list: (anio: number, mes?: number) =>
    [...QUERY_KEYS.reporte, 'list', anio, mes ?? 'all'] as const,
}

/**
 * Hook para obtener el reporte de conductores.
 * @param anio Año a consultar.
 * @param mes  Mes (1-12). undefined = todo el año.
 */
export function useReporteConductores(anio: number, mes?: number) {
  return useQuery({
    queryKey: QUERY_KEYS.list(anio, mes),
    queryFn: () => ReporteConductoresService.getReporte(anio, mes),
    staleTime: 60 * 1000,
  })
}
