import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import React from 'react' // Agregar import para useEffect
import { talleresApi } from '@/services/api/talleres'
import { useTallerStore } from '@/store/taller-store'
import { UpdateTallerRequest} from '@/types/taller'

// Query keys para React Query
export const tallerQueryKeys = {
  all: ['talleres'] as const,
  lists: () => [...tallerQueryKeys.all, 'list'] as const,
  list: (filters: TallerFilters) => [...tallerQueryKeys.lists(), filters] as const,
  details: () => [...tallerQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tallerQueryKeys.details(), id] as const,
  search: (searchTerm: string) => [...tallerQueryKeys.all, 'search', searchTerm] as const,
  especialidad: (especialidad: string) => [...tallerQueryKeys.all, 'especialidad', especialidad] as const,
}

type TallerFilters = {
  searchTerm?: string
  activo?: boolean
  especialidad?: string
  calificacionMinima?: number
}

// Hook para obtener todos los talleres
export const useTalleres = (filters?: TallerFilters) => {
  const { setTalleres, setLoading, setError } = useTallerStore()

  const query = useQuery({
    queryKey: tallerQueryKeys.list(filters || {}),
    queryFn: () => talleresApi.getTalleres(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos (gcTime reemplaza cacheTime en v5)
  })

  // Usar useEffect para manejar los side effects
  React.useEffect(() => {
    if (query.data) {
      setTalleres(query.data)
      setError(null)
    }
    if (query.error) {
      setError(query.error instanceof Error ? query.error.message : 'Error al cargar talleres')
      toast.error('Error al cargar los talleres')
    }
    setLoading(query.isLoading)
  }, [query.data, query.error, query.isLoading, setTalleres, setError, setLoading])

  return query
}

// Hook para obtener un taller específico
export const useTaller = (id: string) => {
  return useQuery({
    queryKey: tallerQueryKeys.detail(id),
    queryFn: () => talleresApi.getTaller(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para buscar talleres
export const useSearchTalleres = (searchTerm: string) => {
  return useQuery({
    queryKey: tallerQueryKeys.search(searchTerm),
    queryFn: () => talleresApi.searchTalleres(searchTerm),
    enabled: searchTerm.length > 2, // Solo buscar con al menos 3 caracteres
    staleTime: 30 * 1000, // 30 segundos para búsquedas
  })
}

// Hook para crear un taller
export const useCreateTaller = () => {
  const queryClient = useQueryClient()
  const { addTaller } = useTallerStore()

  return useMutation({
    mutationFn: talleresApi.createTaller,
    onSuccess: (newTaller) => {
      // Actualizar el store local
      addTaller(newTaller)
      
      // Invalidar y actualizar caché de React Query
      queryClient.invalidateQueries({ queryKey: tallerQueryKeys.lists() })
      
      toast.success('Taller creado exitosamente')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al crear el taller'
      toast.error(message)
    },
  })
}

// Hook para actualizar un taller
export const useUpdateTaller = () => {
  const queryClient = useQueryClient()
  const { updateTaller } = useTallerStore()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTallerRequest }) => 
      talleresApi.updateTaller(id, data),
    onSuccess: (updatedTaller) => {
      // Actualizar el store local
      updateTaller(updatedTaller)
      
      // Actualizar caché específico del taller
      queryClient.setQueryData(
        tallerQueryKeys.detail(updatedTaller.id),
        updatedTaller
      )
      
      // Invalidar lista de talleres
      queryClient.invalidateQueries({ queryKey: tallerQueryKeys.lists() })
      
      toast.success('Taller actualizado exitosamente')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al actualizar el taller'
      toast.error(message)
    },
  })
}

// Hook para eliminar un taller
export const useDeleteTaller = () => {
  const queryClient = useQueryClient()
  const { removeTaller } = useTallerStore()

  return useMutation({
    mutationFn: talleresApi.deleteTaller,
    onSuccess: (_, tallerId) => {
      // Actualizar el store local
      removeTaller(tallerId)
      
      // Remover del caché
      queryClient.removeQueries({ queryKey: tallerQueryKeys.detail(tallerId) })
      queryClient.invalidateQueries({ queryKey: tallerQueryKeys.lists() })
      
      toast.success('Taller eliminado exitosamente')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al eliminar el taller'
      toast.error(message)
    },
  })
}

// Hook para cambiar el estado de un taller
export const useToggleTallerStatus = () => {
  const queryClient = useQueryClient()
  const { updateTaller } = useTallerStore()

  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) => 
      talleresApi.toggleTallerStatus(id, activo),
    onSuccess: (updatedTaller) => {
      updateTaller(updatedTaller)
      
      queryClient.setQueryData(
        tallerQueryKeys.detail(updatedTaller.id),
        updatedTaller
      )
      queryClient.invalidateQueries({ queryKey: tallerQueryKeys.lists() })
      
      const status = updatedTaller.activo ? 'activado' : 'desactivado'
      toast.success(`Taller ${status} exitosamente`)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Error al cambiar el estado del taller'
      toast.error(message)
    },
  })
}

// Hook combinado para obtener talleres con filtros del store
export const useFilteredTalleres = () => {
  const { filters } = useTallerStore()
  const { data: talleres, isLoading, error } = useTalleres(filters)
  const { getFilteredTalleres } = useTallerStore()

  return {
    talleres: getFilteredTalleres(),
    allTalleres: talleres,
    isLoading,
    error,
    filters,
  }
}