import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Admin client para crear usuarios
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Verifica que el usuario autenticado sea admin y retorna su empresa_id
 */
async function verifyAdmin(): Promise<{ empresa_id: string } | NextResponse> {
    const supabase = await createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, empresa_id')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        return NextResponse.json({ error: 'Solo administradores pueden gestionar empleados' }, { status: 403 })
    }

    return { empresa_id: profile.empresa_id }
}

/**
 * POST: Crear un nuevo empleado
 */
export async function POST(request: NextRequest) {
    try {
        const auth = await verifyAdmin()
        if (auth instanceof NextResponse) return auth

        const body = await request.json()
        const { nombre, apellido, email, password, role } = body

        if (!nombre || !apellido || !email || !password || !role) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
        }

        // Crear usuario en Supabase Auth
        // El trigger handle_new_user creará el profile con empresa_id
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                nombre,
                apellido,
                role,
                empresa_id: auth.empresa_id,
            },
        })

        if (authError) {
            if (authError.message.includes('already been registered')) {
                return NextResponse.json({ error: 'Ya existe un usuario con ese email' }, { status: 409 })
            }
            console.error('Error creando empleado:', authError)
            return NextResponse.json({ error: 'Error al crear el empleado' }, { status: 500 })
        }

        // Obtener el profile creado por el trigger
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single()

        return NextResponse.json({
            success: true,
            employee: {
                ...profile,
                email: authData.user.email,
            },
        })
    } catch (error: any) {
        console.error('Error en crear empleado:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

/**
 * DELETE: Eliminar un empleado (solo admin)
 */
export async function DELETE(request: NextRequest) {
    try {
        const auth = await verifyAdmin()
        if (auth instanceof NextResponse) return auth

        const { searchParams } = new URL(request.url)
        const user_id = searchParams.get('user_id')

        if (!user_id) {
            return NextResponse.json({ error: 'Falta user_id' }, { status: 400 })
        }

        const { data: targetProfile } = await supabaseAdmin
            .from('profiles')
            .select('empresa_id')
            .eq('id', user_id)
            .single()

        if (!targetProfile || targetProfile.empresa_id !== auth.empresa_id) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 })
        }

        const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id)

        if (error) {
            console.error('Error eliminando empleado:', error)
            return NextResponse.json({ error: 'Error al eliminar el empleado' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error en eliminar empleado:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

/**
 * PATCH: Actualizar rol de un empleado
 */
export async function PATCH(request: NextRequest) {
    try {
        const auth = await verifyAdmin()
        if (auth instanceof NextResponse) return auth

        const body = await request.json()
        const { user_id, role } = body

        if (!user_id || !role) {
            return NextResponse.json({ error: 'Faltan user_id o role' }, { status: 400 })
        }

        // Verificar que el empleado pertenece a la misma empresa
        const { data: targetProfile } = await supabaseAdmin
            .from('profiles')
            .select('empresa_id')
            .eq('id', user_id)
            .single()

        if (!targetProfile || targetProfile.empresa_id !== auth.empresa_id) {
            return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 })
        }

        // Actualizar rol
        const { data: updated, error } = await supabaseAdmin
            .from('profiles')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('id', user_id)
            .select()
            .single()

        if (error) {
            console.error('Error actualizando rol:', error)
            return NextResponse.json({ error: 'Error al actualizar rol' }, { status: 500 })
        }

        return NextResponse.json({ success: true, employee: updated })
    } catch (error: any) {
        console.error('Error en actualizar empleado:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
