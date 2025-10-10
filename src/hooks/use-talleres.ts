// src/hooks/useTalleres.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { talleresService } from '@/services/api/talleres-service'
import { useTallerStore } from '@/store/taller-store'
import { 
  Taller, 
  CreateTallerRequest, 
  UpdateTallerRequest, 
  TallerFilters, 
} from '@/types/taller-types'

// Query keys (se mantienen igual)
const QUERY_KEYS = {
  talleres: ['talleres'] as const,
  list: (filters?: TallerFilters) => [...QUERY_KEYS.talleres, 'list', filters] as const,
  detail: (id: string) => [...QUERY_KEYS.talleres, 'detail', id] as const,
  stats: () => [...QUERY_KEYS.talleres, 'stats'] as const,
  search: (term: string) => [...QUERY_KEYS.talleres, 'search', term] as const,
}

// Hook para listar talleres con sincronización automática del store
export function useTalleres(filters?: TallerFilters) {
  const { setTalleres, setLoading, setError } = useTallerStore()
  
  const query = useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => talleresService.getTalleres(filters),
    staleTime: 5 * 60 * 1000,
  })

  // Auto-sync con store
  useEffect(() => {
    if (query.data) {
      setTalleres(query.data)
      setError(null)
    }
    if (query.error) {
      setError(query.error.message)
    }
    setLoading(query.isLoading)
  }, [query.data, query.error, query.isLoading, setTalleres, setError, setLoading])

  return query
}

// Hook para un taller específico
export function useTaller(id: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id!),
    queryFn: () => talleresService.getTaller(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para crear taller
export function useCreateTaller() {
  const queryClient = useQueryClient()
  const { addTaller } = useTallerStore()
  
  return useMutation({
    mutationFn: talleresService.createTaller,
    onSuccess: (newTaller) => {
      addTaller(newTaller)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.talleres })
      toast.success('Taller creado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear taller')
    },
  })
}

// Hook para actualizar taller
export function useUpdateTaller() {
  const queryClient = useQueryClient()
  const { updateTaller } = useTallerStore()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTallerRequest }) => 
      talleresService.updateTaller(id, data),
    onSuccess: (updatedTaller) => {
      updateTaller(updatedTaller)
      queryClient.setQueryData(QUERY_KEYS.detail(updatedTaller.id), updatedTaller)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.talleres })
      toast.success('Taller actualizado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar taller')
    },
  })
}

// Hook para eliminar taller
export function useDeleteTaller() {
  const queryClient = useQueryClient()
  const { removeTaller } = useTallerStore()
  
  return useMutation({
    mutationFn: talleresService.deleteTaller,
    onSuccess: (_, tallerId) => {
      removeTaller(tallerId)
      queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(tallerId) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.talleres })
      toast.success('Taller eliminado exitosamente')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar taller')
    },
  })
}

// Hook para toggle status
export function useToggleTallerStatus() {
  const queryClient = useQueryClient()
  const { updateTaller } = useTallerStore()
  
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) => 
      talleresService.toggleStatus(id, activo),
    onSuccess: (updatedTaller) => {
      updateTaller(updatedTaller)
      queryClient.setQueryData(QUERY_KEYS.detail(updatedTaller.id), updatedTaller)
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.talleres })
      const status = updatedTaller.activo ? 'activado' : 'desactivado'
      toast.success(`Taller ${status} exitosamente`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al cambiar estado del taller')
    },
  })
}

// Hook para estadísticas
export function useTalleresStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats(),
    queryFn: talleresService.getStats,
    staleTime: 2 * 60 * 1000,
  })
}

// Hook para búsqueda
export function useSearchTalleres(searchTerm: string) {
  return useQuery({
    queryKey: QUERY_KEYS.search(searchTerm),
    queryFn: () => talleresService.search(searchTerm),
    enabled: searchTerm.length >= 2,
    staleTime: 30 * 1000,
  })
}

// Hook combinado para filtros del store
export function useFilteredTalleres() {
  const { filters, getFilteredTalleres } = useTallerStore()
  const { data: talleres, isLoading, error } = useTalleres(filters)

  return {
    talleres: getFilteredTalleres(),
    allTalleres: talleres || [],
    isLoading,
    error: error?.message || null,
    filters,
  }
}

// Hook simple alternativo (para componentes que no necesitan React Query)
export const useTalleresSimple = () => {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTalleres();
  }, []);

  const fetchTalleres = async () => {
    try {
      setLoading(true);
      const talleresData = await talleresService.getTalleres();
      setTalleres(talleresData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los talleres');
    } finally {
      setLoading(false);
    }
  };

  const createTaller = async (tallerData: Omit<Taller, 'id'>): Promise<boolean> => {
    try {
      // Extraemos las propiedades que necesitamos y el resto van en `otrosCampos`
      const { name, address, phoneNumber, email, contactPerson, ...otrosCampos } = tallerData;
      
      const createData: CreateTallerRequest = {
        id: '', // El backend probablemente genera el ID
        name,
        address,
        phoneNumber,
        email,
        contactPerson,
        telefono_contacto: otrosCampos.telefono_contacto || '',
        especialidades: otrosCampos.especialidades || [],
        activo: otrosCampos.activo ?? true,
        calificacion: otrosCampos.calificacion || 0,
        horario_atencion: otrosCampos.horario_atencion || '',
        sitio_web: otrosCampos.sitio_web,
        notas: otrosCampos.notas,
        // No usamos spread aquí para evitar sobrescritura
      };
      
      const newTaller = await talleresService.createTaller(createData);
      if (newTaller) {
        setTalleres(prev => [...prev, newTaller]);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el taller');
      return false;
    }
  };

  const updateTaller = async (id: string, tallerData: Partial<Taller>): Promise<boolean> => {
    try {
      const updatedTaller = await talleresService.updateTaller(id, tallerData as UpdateTallerRequest);
      if (updatedTaller) {
        setTalleres(prev => 
          prev.map(taller => taller.id === id ? updatedTaller : taller)
        );
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el taller');
      return false;
    }
  };

  const deleteTaller = async (id: string): Promise<boolean> => {
    try {
      await talleresService.deleteTaller(id);
      setTalleres(prev => prev.filter(taller => taller.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el taller');
      return false;
    }
  };

  return {
    talleres,
    loading,
    error,
    fetchTalleres,
    createTaller,
    updateTaller,
    deleteTaller,
  };
};
