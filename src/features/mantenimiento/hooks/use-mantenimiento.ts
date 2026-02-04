// src/hooks/use-mantenimiento-vehiculos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { mantenimientoVehiculoService } from '../services/mantenimiento-service'
import { useMantenimientoVehiculoStore } from '../store/mantenimiento-store'
import {
    // MantenimientoVehiculo,
    // CreateMantenimientoVehiculoRequest,
    UpdateMantenimientoVehiculoRequest,
    MantenimientoVehiculoFilters,
    // MantenimientoVehiculoStats
} from '../types/mantenimiento.types'

// Query keys
const QUERY_KEYS = {
    mantenimientos: ['mantenimientos'] as const,
    list: (filters?: MantenimientoVehiculoFilters) => [...QUERY_KEYS.mantenimientos, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.mantenimientos, 'detail', id] as const,
    stats: () => [...QUERY_KEYS.mantenimientos, 'stats'] as const,
}

// Hook para listar mantenimientos
export function useMantenimientos(filters?: MantenimientoVehiculoFilters) {
    const { setMantenimientos, setLoading, setError } = useMantenimientoVehiculoStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => mantenimientoVehiculoService.getMantenimientos(filters),
        staleTime: 30 * 1000, // 30 segundos - reduce cache para evitar problemas entre páginas
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setMantenimientos(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setMantenimientos, setError, setLoading])

    return query
}

// Hook para crear mantenimiento
export function useCreateMantenimiento() {
    const queryClient = useQueryClient()
    const { addMantenimiento } = useMantenimientoVehiculoStore()

    return useMutation({
        mutationFn: mantenimientoVehiculoService.createMantenimiento,
        onSuccess: (newMantenimiento) => {
            addMantenimiento(newMantenimiento)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mantenimientos })
            toast.success('Mantenimiento creado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear mantenimiento')
        },
    })
}

// Hook para actualizar mantenimiento
export function useUpdateMantenimiento() {
    const queryClient = useQueryClient()
    const { updateMantenimiento } = useMantenimientoVehiculoStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMantenimientoVehiculoRequest }) =>
            mantenimientoVehiculoService.updateMantenimiento(id, data),
        onSuccess: (updatedMantenimiento) => {
            updateMantenimiento(updatedMantenimiento)
            queryClient.setQueryData(QUERY_KEYS.detail(updatedMantenimiento.id.toString()), updatedMantenimiento)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mantenimientos })
            toast.success('Mantenimiento actualizado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar mantenimiento')
        },
    })
}

// Hook para eliminar mantenimiento
export function useDeleteMantenimiento() {
    const queryClient = useQueryClient()
    const { removeMantenimiento } = useMantenimientoVehiculoStore()

    return useMutation({
        mutationFn: mantenimientoVehiculoService.deleteMantenimiento,
        onSuccess: (_, mantenimientoId) => {
            removeMantenimiento(parseInt(mantenimientoId))
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(mantenimientoId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.mantenimientos })
            toast.success('Mantenimiento eliminado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar mantenimiento')
        },
    })
}

// Hook para estadísticas
export function useMantenimientosStats() {
    return useQuery({
        queryKey: QUERY_KEYS.stats(),
        queryFn: mantenimientoVehiculoService.getStats,
        staleTime: 2 * 60 * 1000,
    })
}

// Hook combinado para filtros del store
export function useFilteredMantenimientos() {
    const { filters, getFilteredMantenimientos, stats, isLoading, error } = useMantenimientoVehiculoStore()
    const { data: mantenimientos } = useMantenimientos(filters)

    return {
        mantenimientos: getFilteredMantenimientos(),
        allMantenimientos: mantenimientos || [],
        isLoading,
        error: error || null,
        filters,
        stats
    }
}