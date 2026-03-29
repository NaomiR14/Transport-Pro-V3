import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FlujoCajaService } from '../services/flujo-caja-service'
import { UpsertEgresoVarioRequest } from '../types/flujo-caja.types'

const QUERY_KEYS = {
  flujoCaja: ['flujoCaja'] as const,
  anual: (anio: number) => [...QUERY_KEYS.flujoCaja, 'anual', anio] as const,
  egresosVarios: (anio: number) => [...QUERY_KEYS.flujoCaja, 'egresos', anio] as const,
}

/**
 * Hook para obtener flujo de caja anual completo
 */
export function useFlujoCajaAnual(anio: number) {
  return useQuery({
    queryKey: QUERY_KEYS.anual(anio),
    queryFn: () => FlujoCajaService.getFlujoCajaAnual(anio),
    staleTime: 60 * 1000, // 1 minuto
  })
}

/**
 * Hook para obtener egresos varios de un año
 */
export function useEgresosVarios(anio: number) {
  return useQuery({
    queryKey: QUERY_KEYS.egresosVarios(anio),
    queryFn: () => FlujoCajaService.getEgresosVarios(anio),
    staleTime: 60 * 1000,
  })
}

/**
 * Hook para crear/actualizar un egreso vario
 */
export function useUpsertEgresoVario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertEgresoVarioRequest) =>
      FlujoCajaService.upsertEgresoVario(data),
    onSuccess: (_, variables) => {
      // Invalidar ambas queries para refrescar tabla principal y egresos
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.anual(variables.anio) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.egresosVarios(variables.anio) })
      toast.success('Egreso guardado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al guardar egreso')
    },
  })
}
