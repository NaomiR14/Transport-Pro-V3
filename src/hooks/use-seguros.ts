// src/hooks/use-seguros.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { SeguroService } from '@/services/api/seguros-service'
import { useSeguroStore } from '@/store/seguro-store'
import {
    SeguroVehiculo,
    CreateSeguroRequest,
    UpdateSeguroRequest,
    SeguroFilters,
} from '@/types/seguros-types'

// Query keys
const QUERY_KEYS = {
    seguros: ['seguros'] as const,
    list: (filters?: SeguroFilters) => [...QUERY_KEYS.seguros, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.seguros, 'detail', id] as const,
    stats: () => [...QUERY_KEYS.seguros, 'stats'] as const,
    search: (term: string) => [...QUERY_KEYS.seguros, 'search', term] as const,
}

// Hook para listar seguros con sincronización automática del store
export function useSeguros(filters?: SeguroFilters) {
    const { setSeguros, setLoading, setError } = useSeguroStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => SeguroService.getSeguros(filters),
        staleTime: 5 * 60 * 1000, // 5 minutos
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setSeguros(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setSeguros, setError, setLoading])

    return query
}

// Hook para un seguro específico
export function useSeguro(id: string | null) {
    const { setSelectedSeguro, setLoading, setError } = useSeguroStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.detail(id!),
        queryFn: () => SeguroService.getSeguroById(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setSelectedSeguro(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setSelectedSeguro, setError, setLoading])

    return query
}

// Hook para crear seguro
export function useCreateSeguro() {
    const queryClient = useQueryClient()
    const { addSeguro } = useSeguroStore()

    return useMutation({
        mutationFn: (data: CreateSeguroRequest) => SeguroService.createSeguro(data),
        onSuccess: (newSeguro) => {
            console.log("🟢 CREATE HOOK - Seguro creado:", newSeguro)
            addSeguro(newSeguro)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seguros })
            toast.success('Seguro creado exitosamente')
        },
        onError: (error: Error) => {
            console.error("🔴 CREATE HOOK - Error:", error)
            toast.error(error.message || 'Error al crear seguro')
        },
    })
}

// Hook para actualizar seguro
export function useUpdateSeguro() {
    const queryClient = useQueryClient()
    const { updateSeguro } = useSeguroStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateSeguroRequest }) =>
            SeguroService.updateSeguro( id, data  ),
        onSuccess: (updatedSeguro) => {
            updateSeguro(updatedSeguro)
            queryClient.setQueryData(QUERY_KEYS.detail(updatedSeguro.id), updatedSeguro)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seguros })
            toast.success('Seguro actualizado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar seguro')
        },
    })
}

// Hook para eliminar seguro
export function useDeleteSeguro() {
    const queryClient = useQueryClient()
    const { removeSeguro } = useSeguroStore()

    return useMutation({
        mutationFn: (id: string) => SeguroService.deleteSeguro(id),
        onSuccess: (_, seguroId) => {
            removeSeguro(seguroId)
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(seguroId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.seguros })
            toast.success('Seguro eliminado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar seguro')
        },
    })
}

// Hook para estadísticas calculadas localmente
export function useSegurosStats() {
    const { stats } = useSeguroStore()
    return {
        data: stats || { total: 0, vigentes: 0, por_vencer: 0, vencidas: 0 }
    }
}

// Hook para búsqueda
export function useSearchSeguros(searchTerm: string) {
    return useQuery({
        queryKey: QUERY_KEYS.search(searchTerm),
        queryFn: () => SeguroService.getSeguros({ searchTerm }),
        enabled: searchTerm.length >= 2,
        staleTime: 30 * 1000,
    })
}

// Hook combinado para filtros del store
export function useFilteredSeguros() {
    const { filters, getFilteredSeguros, isLoading, error } = useSeguroStore()
    const { data: allSeguros } = useSeguros(filters)

    return {
        seguros: getFilteredSeguros(),
        allSeguros: allSeguros || [],
        isLoading,
        error: error,
        filters,
    }
}

// Hook simple alternativo (para componentes que no necesitan React Query)
export const useSegurosSimple = () => {
    const [seguros, setSeguros] = useState<SeguroVehiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSeguros();
    }, []);

    const fetchSeguros = async () => {
        try {
            setLoading(true);
            const segurosData = await SeguroService.getSeguros();
            setSeguros(segurosData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los seguros');
        } finally {
            setLoading(false);
        }
    };

    const createSeguro = async (seguroData: CreateSeguroRequest): Promise<boolean> => {
        try {
            const newSeguro = await SeguroService.createSeguro(seguroData);
            if (newSeguro) {
                setSeguros(prev => [...prev, newSeguro]);
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el seguro');
            return false;
        }
    };

    const updateSeguro = async (id: string, seguroData: UpdateSeguroRequest): Promise<boolean> => {
        try {
            const updatedSeguro = await SeguroService.updateSeguro( id, seguroData );
            if (updatedSeguro) {
                setSeguros(prev =>
                    prev.map(seguro => seguro.id === id ? updatedSeguro : seguro)
                );
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el seguro');
            return false;
        }
    };

    const deleteSeguro = async (id: string): Promise<boolean> => {
        try {
            await SeguroService.deleteSeguro(id);
            setSeguros(prev => prev.filter(seguro => seguro.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el seguro');
            return false;
        }
    };

    return {
        seguros,
        loading,
        error,
        fetchSeguros,
        createSeguro,
        updateSeguro,
        deleteSeguro,
    };
};

// Hook para opciones de filtro
export function useSeguroFilterOptions() {
    const { seguros } = useSeguroStore()
    const { data: allSeguros } = useSeguros()

    const segurosToUse = allSeguros || seguros

    const estados = ['vigente', 'vencida', 'por_vencer', 'cancelada'];
    const aseguradoras = [...new Set(segurosToUse.map(s => s.aseguradora))].filter(Boolean);

    return {
        estados,
        aseguradoras,
    };
}