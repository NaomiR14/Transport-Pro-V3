import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'
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
    stats: () => [...QUERY_KEYS.ordenes, 'stats'] as const,
    search: (term: string) => [...QUERY_KEYS.ordenes, 'search', term] as const,
}

// Hook para listar órdenes con sincronización automática del store
export function useOrdenes(filters?: OrdenFilters) {
    const { setOrdenes, setLoading, setError } = useOrdenStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => OrdenService.getOrdenes(filters),
        staleTime: 30 * 1000,
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setOrdenes(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setOrdenes, setError, setLoading])

    return query
}

// Hook para una orden específica
export function useOrden(id: string | null) {
    const { setSelectedOrden, setLoading, setError } = useOrdenStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.detail(id!),
        queryFn: () => OrdenService.getOrdenById(id!),
        enabled: !!id,
        staleTime: 30 * 1000,
    })

    useEffect(() => {
        if (query.data) {
            setSelectedOrden(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setSelectedOrden, setError, setLoading])

    return query
}

// Hook para crear orden
export function useCreateOrden() {
    const queryClient = useQueryClient()
    const { addOrden } = useOrdenStore()

    return useMutation({
        mutationFn: (data: CreateOrdenRequest) => OrdenService.createOrden(data),
        onSuccess: (newOrden) => {
            addOrden(newOrden)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes })
            toast.success('Orden creada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear orden')
        },
    })
}

// Hook para actualizar orden
export function useUpdateOrden() {
    const queryClient = useQueryClient()
    const { updateOrden } = useOrdenStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOrdenRequest }) =>
            OrdenService.updateOrden(id, data),
        onSuccess: (updatedOrden) => {
            updateOrden(updatedOrden)
            queryClient.setQueryData(QUERY_KEYS.detail(updatedOrden.id), updatedOrden)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes })
            toast.success('Orden actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar orden')
        },
    })
}

// Hook para eliminar orden
export function useDeleteOrden() {
    const queryClient = useQueryClient()
    const { removeOrden } = useOrdenStore()

    return useMutation({
        mutationFn: (id: string) => OrdenService.deleteOrden(id),
        onSuccess: (_, ordenId) => {
            removeOrden(ordenId)
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(ordenId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ordenes })
            toast.success('Orden eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar orden')
        },
    })
}

// Hook para estadísticas
export function useOrdenesStats() {
    const { stats } = useOrdenStore()
    return {
        data: stats || { total: 0, pendientes: 0, en_transito: 0, entregadas: 0 }
    }
}

// Hook para órdenes filtradas
export function useFilteredOrdenes() {
    const { filters, getFilteredOrdenes, isLoading, error } = useOrdenStore()
    const { data: allOrdenes } = useOrdenes(filters)

    return {
        ordenes: getFilteredOrdenes(),
        allOrdenes: allOrdenes || [],
        isLoading,
        error,
        filters,
    }
}

// Hook para opciones de filtro
export function useOrdenFilterOptions() {
    const { ordenes } = useOrdenStore()
    const { data: allOrdenes } = useOrdenes()

    const ordenesToUse = allOrdenes || ordenes

    const placas = [...new Set(ordenesToUse.map(o => o.placa_vehiculo))].filter(Boolean)

    return {
        placas,
    }
}
