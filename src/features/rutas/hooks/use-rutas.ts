// src/hooks/use-rutas-viaje.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { RutaViajeService } from '../services/rutas-service'
import { useRutaViajeStore } from '../store/rutas-store'
import {
    RutaViaje,
    CreateRutaViajeRequest,
    UpdateRutaViajeRequest,
    RutaViajeFilters,
} from '../types/rutas.types'

// Query keys
const QUERY_KEYS = {
    rutas: ['rutas'] as const,
    list: (filters?: RutaViajeFilters) => [...QUERY_KEYS.rutas, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.rutas, 'detail', id] as const,
    stats: () => [...QUERY_KEYS.rutas, 'stats'] as const,
    search: (term: string) => [...QUERY_KEYS.rutas, 'search', term] as const,
    commonInfo: () => [...QUERY_KEYS.rutas, 'common-info'] as const,
}

// Hook para listar rutas con sincronización automática del store
export function useRutas(filters?: RutaViajeFilters) {
    const { setRutas, setLoading, setError } = useRutaViajeStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => RutaViajeService.getRutas(filters),
        staleTime: 30 * 1000, // 30 segundos - reduce cache para evitar problemas entre páginas
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setRutas(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setRutas, setError, setLoading])

    return query
}

// Hook para una ruta específica
export function useRuta(id: string | null) {
    const { setSelectedRuta, setLoading, setError } = useRutaViajeStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.detail(id!),
        queryFn: () => RutaViajeService.getRutaById(id!),
        enabled: !!id,
        staleTime: 30 * 1000,
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setSelectedRuta(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setSelectedRuta, setError, setLoading])

    return query
}

// Hook para crear ruta
export function useCreateRuta() {
    const queryClient = useQueryClient()
    const { addRuta } = useRutaViajeStore()

    return useMutation({
        mutationFn: (data: CreateRutaViajeRequest) => RutaViajeService.createRuta(data),
        onSuccess: (newRuta) => {
            console.log("🟢 CREATE HOOK - Ruta creada:", newRuta)
            addRuta(newRuta)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rutas })
            toast.success('Ruta creada exitosamente')
        },
        onError: (error: Error) => {
            console.error("🔴 CREATE HOOK - Error:", error)
            toast.error(error.message || 'Error al crear ruta')
        },
    })
}

// Hook para actualizar ruta
export function useUpdateRuta() {
    const queryClient = useQueryClient()
    const { updateRuta } = useRutaViajeStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRutaViajeRequest }) =>
            RutaViajeService.updateRuta(id, data ),
        onSuccess: (updatedRuta) => {
            updateRuta(updatedRuta)
            queryClient.setQueryData(QUERY_KEYS.detail(updatedRuta.id), updatedRuta)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rutas })
            toast.success('Ruta actualizada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar ruta')
        },
    })
}

// Hook para eliminar ruta
export function useDeleteRuta() {
    const queryClient = useQueryClient()
    const { removeRuta } = useRutaViajeStore()

    return useMutation({
        mutationFn: (id: string) => RutaViajeService.deleteRuta(id),
        onSuccess: (_, rutaId) => {
            removeRuta(rutaId)
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(rutaId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rutas })
            toast.success('Ruta eliminada exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar ruta')
        },
    })
}

// Hook para estadísticas calculadas localmente
export function useRutasStats() {
    const { stats } = useRutaViajeStore()
    return {
        data: stats || { total: 0, total_ingresos: 0, total_gastos: 0, ganancia_neta: 0, kms_totales: 0 }
    }
}

// Hook para búsqueda
export function useSearchRutas(searchTerm: string) {
    return useQuery({
        queryKey: QUERY_KEYS.search(searchTerm),
        queryFn: () => RutaViajeService.getRutas({ searchTerm }),
        enabled: searchTerm.length >= 2,
        staleTime: 30 * 1000,
    })
}

// Hook combinado para filtros del store
export function useFilteredRutas() {
    const { filters, getFilteredRutas, isLoading, error } = useRutaViajeStore()
    const { data: allRutas } = useRutas(filters)

    return {
        rutas: getFilteredRutas(),
        allRutas: allRutas || [],
        isLoading,
        error: error,
        filters,
    }
}

// Hook simple alternativo (para componentes que no necesitan React Query)
export const useRutasSimple = () => {
    const [rutas, setRutas] = useState<RutaViaje[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRutas();
    }, []);

    const fetchRutas = async () => {
        try {
            setLoading(true);
            const rutasData = await RutaViajeService.getRutas();
            setRutas(rutasData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar las rutas');
        } finally {
            setLoading(false);
        }
    };

    const createRuta = async (rutaData: CreateRutaViajeRequest): Promise<boolean> => {
        try {
            const newRuta = await RutaViajeService.createRuta(rutaData);
            if (newRuta) {
                setRutas(prev => [...prev, newRuta]);
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear la ruta');
            return false;
        }
    };

    const updateRuta = async (id: string, rutaData: UpdateRutaViajeRequest): Promise<boolean> => {
        try {
            const updatedRuta = await RutaViajeService.updateRuta( id, rutaData );
            if (updatedRuta) {
                setRutas(prev =>
                    prev.map(ruta => ruta.id === id ? updatedRuta : ruta)
                );
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar la ruta');
            return false;
        }
    };

    const deleteRuta = async (id: string): Promise<boolean> => {
        try {
            await RutaViajeService.deleteRuta(id);
            setRutas(prev => prev.filter(ruta => ruta.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar la ruta');
            return false;
        }
    };

    return {
        rutas,
        loading,
        error,
        fetchRutas,
        createRuta,
        updateRuta,
        deleteRuta,
    };
};

// Hook para opciones de filtro
export function useRutaFilterOptions() {
    const { rutas } = useRutaViajeStore()
    const { data: allRutas } = useRutas()

    const rutasToUse = allRutas || rutas

    const placas = [...new Set(rutasToUse.map(s => s.placa_vehiculo))].filter(Boolean);
    const conductores = [...new Set(rutasToUse.map(s => s.conductor))].filter(Boolean);
    const origenes = [...new Set(rutasToUse.map(s => s.origen))].filter(Boolean);
    const destinos = [...new Set(rutasToUse.map(s => s.destino))].filter(Boolean);

    return {
        placas,
        conductores,
        origenes,
        destinos,
    };
}