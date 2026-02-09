// src/hooks/use-impuestos-vehiculares.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { ImpuestoVehicularService } from '../services/impuestos-service'
import { useImpuestoStore } from '../store/impuestos-store'
import {
    ImpuestoVehicular,
    CreateImpuestoRequest,
    UpdateImpuestoRequest,
    ImpuestoFilters,
} from '../types/impuestos.types'

// Query keys
const QUERY_KEYS = {
    impuestos: ['impuestos'] as const,
    list: (filters?: ImpuestoFilters) => [...QUERY_KEYS.impuestos, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.impuestos, 'detail', id] as const,
    stats: () => [...QUERY_KEYS.impuestos, 'stats'] as const,
    search: (term: string) => [...QUERY_KEYS.impuestos, 'search', term] as const,
}

// Hook para listar impuestos con sincronización automática del store
export function useImpuestos(filters?: ImpuestoFilters) {
    const { setImpuestos, setLoading, setError } = useImpuestoStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => ImpuestoVehicularService.getImpuestos(filters),
        staleTime: 30 * 1000, // 30 segundos - reduce cache para evitar problemas entre páginas
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setImpuestos(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setImpuestos, setError, setLoading])

    return query
}

// Hook para un impuesto específico
export function useImpuesto(id: string | null) {
    const { setSelectedImpuesto, setLoading, setError } = useImpuestoStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.detail(id!),
        queryFn: () => ImpuestoVehicularService.getImpuestoById(id!),
        enabled: !!id,
        staleTime: 30 * 1000,
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setSelectedImpuesto(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setSelectedImpuesto, setError, setLoading])

    return query
}

// Hook para crear impuesto
export function useCreateImpuesto() {
    const queryClient = useQueryClient()
    const { addImpuesto } = useImpuestoStore()

    return useMutation({
        mutationFn: (data: CreateImpuestoRequest) => ImpuestoVehicularService.createImpuesto(data),
        onSuccess: (newImpuesto) => {
            console.log("🟢 CREATE HOOK - Impuesto creado:", newImpuesto)
            addImpuesto(newImpuesto)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.impuestos })
            toast.success('Impuesto creado exitosamente')
        },
        onError: (error: Error) => {
            console.error("🔴 CREATE HOOK - Error:", error)
            toast.error(error.message || 'Error al crear impuesto')
        },
    })
}

// Hook para actualizar impuesto
export function useUpdateImpuesto() {
    const queryClient = useQueryClient()
    const { updateImpuesto } = useImpuestoStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateImpuestoRequest }) =>
            ImpuestoVehicularService.updateImpuesto(id, data ),
        onSuccess: (updatedImpuesto) => {
            updateImpuesto(updatedImpuesto)
            queryClient.setQueryData(QUERY_KEYS.detail(updatedImpuesto.id), updatedImpuesto)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.impuestos })
            toast.success('Impuesto actualizado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar impuesto')
        },
    })
}

// Hook para eliminar impuesto
export function useDeleteImpuesto() {
    const queryClient = useQueryClient()
    const { removeImpuesto } = useImpuestoStore()

    return useMutation({
        mutationFn: (id: string) => ImpuestoVehicularService.deleteImpuesto(id),
        onSuccess: (_, impuestoId) => {
            removeImpuesto(impuestoId)
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(impuestoId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.impuestos })
            toast.success('Impuesto eliminado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar impuesto')
        },
    })
}

// Hook para estadísticas calculadas localmente
export function useImpuestosStats() {
    const { stats } = useImpuestoStore()
    return {
        data: stats || { total: 0, pagados: 0, pendientes: 0, vencidos: 0, total_pagado: 0 }
    }
}

// Hook para búsqueda
export function useSearchImpuestos(searchTerm: string) {
    return useQuery({
        queryKey: QUERY_KEYS.search(searchTerm),
        queryFn: () => ImpuestoVehicularService.getImpuestos({ searchTerm }),
        enabled: searchTerm.length >= 2,
        staleTime: 30 * 1000,
    })
}

// Hook combinado para filtros del store
export function useFilteredImpuestos() {
    const { filters, getFilteredImpuestos, isLoading, error } = useImpuestoStore()
    const { data: allImpuestos } = useImpuestos(filters)

    return {
        impuestos: getFilteredImpuestos(),
        allImpuestos: allImpuestos || [],
        isLoading,
        error: error,
        filters,
    }
}

// Re-export store for components
export { useImpuestoStore } from '../store/impuestos-store'

// Hook para obtener opciones de filtros
export function useImpuestoFilterOptions() {
    const { impuestos } = useImpuestoStore()
    return {
        tipos: [...new Set(impuestos.map(i => i.tipo_impuesto))],
        years: [...new Set(impuestos.map(i => i.anio_impuesto))],
        estados: ['pagado', 'pendiente', 'vencido']
    }
}

// Hook simple alternativo (para componentes que no necesitan React Query)
export const useImpuestosSimple = () => {
    const [impuestos, setImpuestos] = useState<ImpuestoVehicular[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchImpuestos();
    }, []);

    const fetchImpuestos = async () => {
        try {
            setLoading(true);
            const impuestosData = await ImpuestoVehicularService.getImpuestos();
            setImpuestos(impuestosData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los impuestos');
        } finally {
            setLoading(false);
        }
    };

    const createImpuesto = async (impuestoData: CreateImpuestoRequest): Promise<boolean> => {
        try {
            const newImpuesto = await ImpuestoVehicularService.createImpuesto(impuestoData);
            if (newImpuesto) {
                setImpuestos(prev => [...prev, newImpuesto]);
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el impuesto');
            return false;
        }
    };

    const updateImpuesto = async (id: string, impuestoData: UpdateImpuestoRequest): Promise<boolean> => {
        try {
            const updatedImpuesto = await ImpuestoVehicularService.updateImpuesto(id, impuestoData );
            if (updatedImpuesto) {
                setImpuestos(prev =>
                    prev.map(impuesto => impuesto.id === id ? updatedImpuesto : impuesto)
                );
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el impuesto');
            return false;
        }
    };

    const deleteImpuesto = async (id: string): Promise<boolean> => {
        try {
            await ImpuestoVehicularService.deleteImpuesto(id);
            setImpuestos(prev => prev.filter(impuesto => impuesto.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el impuesto');
            return false;
        }
    };

    return {
        impuestos,
        loading,
        error,
        fetchImpuestos,
        createImpuesto,
        updateImpuesto,
        deleteImpuesto,
    };
};
