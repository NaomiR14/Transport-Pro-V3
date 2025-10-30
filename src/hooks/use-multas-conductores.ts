// src/hooks/use-multas-conductores.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { multasConductoresService } from '@/services/api/multas-conductores-service'
import { useMultasConductoresStore } from '@/store/multas-conductores-store'
import {
    MultaConductor,
    CreateMultaConductorRequest,
    UpdateMultaConductorRequest,
    MultaConductorFilters
} from '@/types/multas-conductores-types'

// Query keys
const QUERY_KEYS = {
    multas: ['multas-conductores'] as const,
    list: (filters?: MultaConductorFilters) => [...QUERY_KEYS.multas, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.multas, 'detail', id] as const,
    stats: () => [...QUERY_KEYS.multas, 'stats'] as const,
}

// Hook para listar multas
export function useMultasConductores(filters?: MultaConductorFilters) {
    const { setMultas, setLoading, setError } = useMultasConductoresStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => multasConductoresService.getMultas(filters),
        staleTime: 5 * 60 * 1000,
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setMultas(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setMultas, setError, setLoading])

    return query
}

// Hook para crear multa
export function useCreateMultaConductor() {
    const queryClient = useQueryClient()
    const { addMulta } = useMultasConductoresStore()

    return useMutation({
        mutationFn: multasConductoresService.createMulta,
        onSuccess: (newMulta) => {
            addMulta(newMulta)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.multas })
            toast.success('Multa creada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear multa')
        },
    })
}

// Hook para actualizar multa
export function useUpdateMultaConductor() {
    const queryClient = useQueryClient()
    const { updateMulta } = useMultasConductoresStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMultaConductorRequest }) =>
            multasConductoresService.updateMulta(id, data),
        onSuccess: (updatedMulta) => {
            updateMulta(updatedMulta)
            queryClient.setQueryData(QUERY_KEYS.detail(updatedMulta.id), updatedMulta)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.multas })
            toast.success('Multa actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar multa')
        },
    })
}

// Hook para eliminar multa
export function useDeleteMultaConductor() {
    const queryClient = useQueryClient()
    const { removeMulta } = useMultasConductoresStore()

    return useMutation({
        mutationFn: multasConductoresService.deleteMulta,
        onSuccess: (_, multaId) => {
            removeMulta(multaId)
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(multaId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.multas })
            toast.success('Multa eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar multa')
        },
    })
}

// Hook para estadísticas
export function useMultasConductoresStats() {
    return useQuery({
        queryKey: QUERY_KEYS.stats(),
        queryFn: multasConductoresService.getStats,
        staleTime: 2 * 60 * 1000,
    })
}

// Hook combinado para filtros del store
export function useFilteredMultasConductores() {
    const { filters, getFilteredMultas } = useMultasConductoresStore()
    const { data: multas, isLoading, error } = useMultasConductores(filters)

    return {
        multas: getFilteredMultas(),
        allMultas: multas || [],
        isLoading,
        error: error?.message || null,
        filters,
    }
}