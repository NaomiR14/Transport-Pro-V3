'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { rolesService } from '../services/roles-service'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '../types/auth.types'

const QUERY_KEYS = {
    profiles: ['admin-profiles'] as const,
    list: (roleFilter?: UserRole) => [...QUERY_KEYS.profiles, 'list', roleFilter] as const,
    counts: () => [...QUERY_KEYS.profiles, 'counts'] as const,
    search: (term: string) => [...QUERY_KEYS.profiles, 'search', term] as const,
}

/** Hook para listar todos los perfiles */
export function useAllProfiles(roleFilter?: UserRole) {
    return useQuery({
        queryKey: QUERY_KEYS.list(roleFilter),
        queryFn: () =>
            roleFilter
                ? rolesService.getProfilesByRole(roleFilter)
                : rolesService.getAllProfiles(),
        staleTime: 30 * 1000,
    })
}

/** Hook para contar usuarios por rol */
export function useUserCountByRole() {
    return useQuery({
        queryKey: QUERY_KEYS.counts(),
        queryFn: () => rolesService.countUsersByRole(),
        staleTime: 60 * 1000,
    })
}

/** Hook para buscar perfiles */
export function useSearchProfiles(searchTerm: string) {
    return useQuery({
        queryKey: QUERY_KEYS.search(searchTerm),
        queryFn: () => rolesService.searchProfiles(searchTerm),
        enabled: searchTerm.length >= 2,
        staleTime: 30 * 1000,
    })
}

/** Hook para crear un empleado vía API route (solo admin) */
export function useCreateEmployee() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: {
            nombre: string
            apellido: string
            email: string
            password: string
            role: UserRole
        }) => {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Error al crear empleado')
            return json
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles })
            toast.success('Empleado creado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear el empleado')
        },
    })
}

/** Hook para eliminar un empleado (solo admin) */
export function useDeleteEmployee() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (userId: string) => {
            const res = await fetch(`/api/employees?user_id=${userId}`, {
                method: 'DELETE',
            })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Error al eliminar empleado')
            return json
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles })
            toast.success('Empleado eliminado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al eliminar el empleado')
        },
    })
}

/** Hook para obtener datos de la empresa por su id */
export function useEmpresa(empresaId?: string) {
    return useQuery({
        queryKey: ['empresa', empresaId],
        queryFn: async () => {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('empresas')
                .select('nombre, plan')
                .eq('id', empresaId!)
                .single()
            if (error) throw error
            return data as { nombre: string; plan: string }
        },
        enabled: !!empresaId,
        staleTime: 5 * 60 * 1000,
    })
}

/** Hook para actualizar el rol de un usuario */
export function useUpdateUserRole() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ userId, newRole }: { userId: string; newRole: UserRole }) =>
            rolesService.updateUserRole(userId, newRole),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles })
            toast.success('Rol actualizado exitosamente')
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al actualizar el rol')
        },
    })
}
