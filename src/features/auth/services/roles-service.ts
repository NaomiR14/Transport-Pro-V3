import { createClient } from '@/lib/supabase/client'
import type { UserRole, UserProfile } from '../types/auth.types'

export interface ProfileWithEmail extends UserProfile {
    email?: string
}

export interface RoleCount {
    role: UserRole
    count: number
}

export class RolesService {
    private supabase = createClient()

    /**
     * Obtener todos los perfiles de usuarios
     */
    async getAllProfiles(): Promise<ProfileWithEmail[]> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`Error al obtener perfiles: ${error.message}`)
        }

        return (data as ProfileWithEmail[]) || []
    }

    /**
     * Obtener perfiles filtrados por rol
     */
    async getProfilesByRole(role: UserRole): Promise<ProfileWithEmail[]> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('role', role)
            .order('nombre', { ascending: true })

        if (error) {
            throw new Error(`Error al obtener perfiles por rol: ${error.message}`)
        }

        return (data as ProfileWithEmail[]) || []
    }

    /**
     * Actualizar el rol de un usuario
     */
    async updateUserRole(userId: string, newRole: UserRole): Promise<ProfileWithEmail> {
        const { data, error } = await this.supabase
            .from('profiles')
            .update({ role: newRole, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single()

        if (error) {
            throw new Error(`Error al actualizar rol: ${error.message}`)
        }

        if (!data) {
            throw new Error('No se pudo actualizar el perfil')
        }

        return data as ProfileWithEmail
    }

    /**
     * Contar usuarios por cada rol
     */
    async countUsersByRole(): Promise<RoleCount[]> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('role')

        if (error) {
            throw new Error(`Error al contar usuarios por rol: ${error.message}`)
        }

        // Agrupar manualmente ya que Supabase client no soporta GROUP BY directo
        const counts: Record<string, number> = {}
        for (const profile of data || []) {
            const role = profile.role || 'conductor'
            counts[role] = (counts[role] || 0) + 1
        }

        return Object.entries(counts).map(([role, count]) => ({
            role: role as UserRole,
            count,
        }))
    }

    /**
     * Buscar perfiles por nombre
     */
    async searchProfiles(searchTerm: string): Promise<ProfileWithEmail[]> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .or(`nombre.ilike.%${searchTerm}%,apellido.ilike.%${searchTerm}%`)
            .order('nombre', { ascending: true })

        if (error) {
            throw new Error(`Error al buscar perfiles: ${error.message}`)
        }

        return (data as ProfileWithEmail[]) || []
    }
}

export const rolesService = new RolesService()
