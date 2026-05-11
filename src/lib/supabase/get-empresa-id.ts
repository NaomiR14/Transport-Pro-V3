import { createClient } from './client'
import { useAuthStore } from '@/features/auth/store/auth-store'

/**
 * Obtiene el empresa_id del usuario autenticado actual.
 * Primero intenta el store de Zustand (sin red). Si no está disponible,
 * cae al par de llamadas auth + profiles.
 */
export async function getEmpresaId(): Promise<string> {
    // Ruta rápida: el profile ya está en el store (persisted en localStorage)
    const { profile } = useAuthStore.getState()
    if (profile?.empresa_id) {
        return profile.empresa_id
    }

    // Fallback: fetch de red (solo en carga inicial o si el store aún no hidrata)
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Usuario no autenticado')
    }

    const { data: fetchedProfile, error: profileError } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single()

    if (profileError || !fetchedProfile?.empresa_id) {
        throw new Error('No se pudo obtener empresa_id del perfil')
    }

    return fetchedProfile.empresa_id
}
