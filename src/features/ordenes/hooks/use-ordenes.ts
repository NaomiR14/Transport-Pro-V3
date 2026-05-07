import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { OrdenService } from '../services/ordenes-service'
import { useOrdenStore } from '../store/ordenes-store'
import {
    Orden,
    CreateOrdenRequest,
    UpdateOrdenRequest,
    OrdenFilters,
} from '../types/ordenes.types'

// Re-export store
export { useOrdenStore } from '../store/ordenes-store'

// Query keys
const QUERY_KEYS = {
    ordenes: ['ordenes'] as const,
    list: (filters?: OrdenFilters) => [...QUERY_KEYS.ordenes, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.ordenes, 'detail', id] as const,
}

export function useOrdenes(filters?: OrdenFilters) {
    return useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => OrdenService.getOrdenes(filters),
    })
}

export function useOrden(id: string | null) {
    return useQuery({
        queryKey: QUERY_KEYS.detail(id!),
        queryFn: () => OrdenService.getOrdenById(id!),
        enabled: !!id,
    })
}

export function useCreateOrden() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateOrdenRequest) => OrdenService.createOrden(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes })
            toast.success('Orden creada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear orden')
        },
    })
}

export function useUpdateOrden() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOrdenRequest }) =>
            OrdenService.updateOrden(id, data),
        onSuccess: (updatedOrden) => {
            queryClient.setQueryData(QUERY_KEYS.detail(updatedOrden.id), updatedOrden)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes })
            toast.success('Orden actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar orden')
        },
    })
}

export function useDeleteOrden() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => OrdenService.deleteOrden(id),
        onSuccess: (_, ordenId) => {
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(ordenId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes })
            toast.success('Orden eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar orden')
        },
    })
}

// Deriva las stats directamente de los datos de React Query
export function useOrdenesStats() {
    const { data } = useOrdenes()
    const stats = useMemo(() => {
        const ordenes = data || []
        return {
            total: ordenes.length,
            pendientes: ordenes.filter((o: Orden) => o.estado === 'pendiente').length,
            en_transito: ordenes.filter((o: Orden) => o.estado === 'transito').length,
            entregadas: ordenes.filter((o: Orden) => o.estado === 'entregado').length,
        }
    }, [data])
    return { data: stats }
}

// Aplica los filtros del store sobre los datos de React Query (sin sync store←query)
export function useFilteredOrdenes() {
    const { filters } = useOrdenStore()
    const { data, isLoading, error } = useOrdenes()

    const ordenes = useMemo(() => {
        const all = data || []
        return all.filter((orden: Orden) => {
            if (filters.searchTerm?.trim()) {
                const term = filters.searchTerm.toLowerCase().trim()
                const text = [
                    orden.numero_orden,
                    orden.placa_vehiculo,
                    orden.nombre_conductor,
                    orden.origen,
                    orden.destino,
                    orden.carta_porte,
                ].filter(Boolean).join(' ').toLowerCase()
                if (!text.includes(term)) return false
            }
            if (filters.estado && orden.estado !== filters.estado) return false
            if (filters.placa_vehiculo && orden.placa_vehiculo !== filters.placa_vehiculo) return false
            return true
        })
    }, [data, filters])

    return {
        ordenes,
        isLoading,
        error: error?.message ?? null,
        filters,
    }
}

// Deriva las placas disponibles del mismo cache de useOrdenes()
// React Query deduplica la request con useFilteredOrdenes cuando se usan juntos
export function useOrdenFilterOptions() {
    const { data } = useOrdenes()
    const placas = useMemo(
        () => [...new Set((data || []).map((o: Orden) => o.placa_vehiculo))].filter(Boolean),
        [data]
    )
    return { placas }
}
