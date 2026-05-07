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
    static async getAllProfiles(): Promise<ProfileWithEmail[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw new Error(`Error al obtener perfiles: ${error.message}`)
        return (data as ProfileWithEmail[]) || []
    }

    static async getProfilesByRole(role: UserRole): Promise<ProfileWithEmail[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', role)
            .order('nombre', { ascending: true })

        if (error) throw new Error(`Error al obtener perfiles por rol: ${error.message}`)
        return (data as ProfileWithEmail[]) || []
    }

    // Delega en PATCH /api/employees para centralizar la autorización en el servidor
    static async updateUserRole(userId: string, newRole: UserRole): Promise<ProfileWithEmail> {
        const res = await fetch('/api/employees', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, role: newRole }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Error al actualizar rol')
        return json.employee as ProfileWithEmail
    }

    static async countUsersByRole(): Promise<RoleCount[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('role')

        if (error) throw new Error(`Error al contar usuarios por rol: ${error.message}`)

        // Supabase client no soporta GROUP BY; agrupamos en memoria sobre la columna mínima
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

    static async searchProfiles(searchTerm: string): Promise<ProfileWithEmail[]> {
        const supabase = createClient()
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .or(`nombre.ilike.%${searchTerm}%,apellido.ilike.%${searchTerm}%`)
            .order('nombre', { ascending: true })

        if (error) throw new Error(`Error al buscar perfiles: ${error.message}`)
        return (data as ProfileWithEmail[]) || []
    }
}
