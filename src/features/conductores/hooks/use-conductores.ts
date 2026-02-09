import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { ConductorService } from '../services/conductor-service'
import { useConductorStore } from '../store/conductor-store'
import type {
    Conductor,
    CreateConductorRequest,
    UpdateConductorRequest,
    ConductorFilters,
} from '../types/conductor.types'

// Re-export store for components
export { useConductorStore } from '../store/conductor-store'

// Query keys
const QUERY_KEYS = {
    conductores: ['conductores'] as const,
    list: (filters?: ConductorFilters) => [...QUERY_KEYS.conductores, 'list', filters] as const,
    detail: (id: string) => [...QUERY_KEYS.conductores, 'detail', id] as const,
    stats: () => [...QUERY_KEYS.conductores, 'stats'] as const,
    search: (term: string) => [...QUERY_KEYS.conductores, 'search', term] as const,
}

// Hook para listar conductores con sincronización automática del store
export function useConductores(filters?: ConductorFilters) {
    const { setConductores, setLoading, setError } = useConductorStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => ConductorService.getConductores(filters),
        staleTime: 30 * 1000, // 30 segundos - reduce cache para evitar problemas entre páginas
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setConductores(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setConductores, setError, setLoading])

    return query
}

// Hook para un conductor específico
export function useConductor(id: string | null) {
    const { setSelectedConductor, setLoading, setError } = useConductorStore()

    const query = useQuery({
        queryKey: QUERY_KEYS.detail(id!),
        queryFn: () => ConductorService.getConductorById(id!),
        enabled: !!id,
        staleTime: 30 * 1000,
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setSelectedConductor(query.data)
            setError(null)
        }
        if (query.error) {
            setError(query.error.message)
        }
        setLoading(query.isLoading)
    }, [query.data, query.error, query.isLoading, setSelectedConductor, setError, setLoading])

    return query
}

// Hook para crear conductor
export function useCreateConductor() {
    const queryClient = useQueryClient()
    const { addConductor } = useConductorStore()

    return useMutation({
        mutationFn: (data: CreateConductorRequest) => ConductorService.createConductor(data),
        onSuccess: (newConductor) => {
            console.log("🟢 CREATE HOOK - Conductor creado:", newConductor)
            addConductor(newConductor)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conductores })
            toast.success('Conductor creado exitosamente')
        },
        onError: (error: Error) => {
            console.error("🔴 CREATE HOOK - Error:", error)
            toast.error(error.message || 'Error al crear conductor')
        },
    })
}

// Hook para actualizar conductor
export function useUpdateConductor() {
    const queryClient = useQueryClient()
    const { updateConductor } = useConductorStore()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateConductorRequest }) =>
            ConductorService.updateConductor( id, data ),
        onSuccess: (updatedConductor) => {
            updateConductor(updatedConductor)
            queryClient.setQueryData(QUERY_KEYS.detail(updatedConductor.id), updatedConductor)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conductores })
            toast.success('Conductor actualizado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar conductor')
        },
    })
}

// Hook para eliminar conductor
export function useDeleteConductor() {
    const queryClient = useQueryClient()
    const { removeConductor } = useConductorStore()

    return useMutation({
        mutationFn: (id: string) => ConductorService.deleteConductor(id),
        onSuccess: (_, conductorId) => {
            removeConductor(conductorId)
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(conductorId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conductores })
            toast.success('Conductor eliminado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar conductor')
        },
    })
}

// Hook para estadísticas calculadas localmente
export function useConductoresStats() {
    const { stats } = useConductorStore()
    return {
        data: stats || { total: 0, activos: 0, licencias_vencidas: 0, calificacion_promedio: 0 }
    }
}

// Hook para búsqueda
export function useSearchConductores(searchTerm: string) {
    return useQuery({
        queryKey: QUERY_KEYS.search(searchTerm),
        queryFn: () => ConductorService.getConductores({ searchTerm }),
        enabled: searchTerm.length >= 2,
        staleTime: 30 * 1000,
    })
}

// Hook combinado para filtros del store
export function useFilteredConductores() {
    const { filters, getFilteredConductores, isLoading, error } = useConductorStore()
    const { data: allConductores } = useConductores(filters)

    return {
        conductores: getFilteredConductores(),
        allConductores: allConductores || [],
        isLoading,
        error: error,
        filters,
    }
}

// Hook simple alternativo (para componentes que no necesitan React Query)
export const useConductoresSimple = () => {
    const [conductores, setConductores] = useState<Conductor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchConductores();
    }, []);

    const fetchConductores = async () => {
        try {
            setLoading(true);
            const conductoresData = await ConductorService.getConductores();
            setConductores(conductoresData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los conductores');
        } finally {
            setLoading(false);
        }
    };

    const createConductor = async (conductorData: CreateConductorRequest): Promise<boolean> => {
        try {
            const newConductor = await ConductorService.createConductor(conductorData);
            if (newConductor) {
                setConductores(prev => [...prev, newConductor]);
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el conductor');
            return false;
        }
    };

    const updateConductor = async (id: string, conductorData: UpdateConductorRequest): Promise<boolean> => {
        try {
            const updatedConductor = await ConductorService.updateConductor(id, conductorData );
            if (updatedConductor) {
                setConductores(prev =>
                    prev.map(conductor => conductor.id === id ? updatedConductor : conductor)
                );
                return true;
            }
            return false;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el conductor');
            return false;
        }
    };

    const deleteConductor = async (id: string): Promise<boolean> => {
        try {
            await ConductorService.deleteConductor(id);
            setConductores(prev => prev.filter(conductor => conductor.id !== id));
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar el conductor');
            return false;
        }
    };

    return {
        conductores,
        loading,
        error,
        fetchConductores,
        createConductor,
        updateConductor,
        deleteConductor,
    };
};

// Hook para opciones de filtro
export function useConductorFilterOptions() {
    //const { conductores } = useConductorStore()
    //const { data: allConductores } = useConductores()

    //const conductoresToUse = allConductores || conductores

    const estadosLicencia = ['vigente', 'por_vencer', 'vencida'];
    const estadosActivo = [
        { value: 'true', label: 'Activos' },
        { value: 'false', label: 'Inactivos' }
    ];

    return {
        estadosLicencia,
        estadosActivo,
    };
}