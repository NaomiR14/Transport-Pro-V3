import { createClient } from './client'

/**
 * Obtiene el empresa_id del usuario autenticado actual.
 * Usado por los servicios al crear registros para asignar empresa_id.
 */
export async function getEmpresaId(): Promise<string> {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        throw new Error('Usuario no autenticado')
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.empresa_id) {
        throw new Error('No se pudo obtener empresa_id del perfil')
    }

    return profile.empresa_id
}
