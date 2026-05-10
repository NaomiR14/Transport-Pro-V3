import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import logger from '@/lib/logger'

// Usar service_role_key para crear usuarios (server-side only)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            empresa_nombre,
            empresa_nit,
            empresa_email,
            empresa_telefono,
            empresa_direccion,
            admin_nombre,
            admin_apellido,
            admin_email,
            admin_password,
        } = body

        // Validaciones básicas
        if (!empresa_nombre || !empresa_email || !admin_nombre || !admin_apellido || !admin_email || !admin_password) {
            return NextResponse.json(
                { error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        if (admin_password.length < 6) {
            return NextResponse.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            )
        }

        // 1. Crear la empresa
        const { data: empresa, error: empresaError } = await supabaseAdmin
            .from('empresas')
            .insert({
                nombre: empresa_nombre,
                nit: empresa_nit || null,
                email_contacto: empresa_email,
                telefono: empresa_telefono || null,
                direccion: empresa_direccion || null,
            })
            .select()
            .single()

        if (empresaError) {
            // Si el NIT ya existe
            if (empresaError.code === '23505') {
                return NextResponse.json(
                    { error: 'Ya existe una empresa registrada con ese NIT' },
                    { status: 409 }
                )
            }
            logger.error({ err: empresaError }, 'Error creando empresa')
            return NextResponse.json(
                { error: 'Error al registrar la empresa' },
                { status: 500 }
            )
        }

        // 2. Crear el usuario admin en Supabase Auth
        // El trigger (SECURITY DEFINER) crea el profile con role='conductor', empresa_id=NULL.
        // La API route asigna role='admin' y empresa_id en el paso 3 via service_role.
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: admin_email,
            password: admin_password,
            email_confirm: false,
            user_metadata: {
                nombre: admin_nombre,
                apellido: admin_apellido,
            },
        })

        if (authError) {
            // Rollback: eliminar la empresa creada
            await supabaseAdmin.from('empresas').delete().eq('id', empresa.id)

            if (authError.message.includes('already been registered')) {
                return NextResponse.json(
                    { error: 'Ya existe un usuario con ese email' },
                    { status: 409 }
                )
            }
            logger.error({ err: authError }, 'Error creando usuario admin')
            return NextResponse.json(
                { error: 'Error al crear el usuario administrador' },
                { status: 500 }
            )
        }

        // 3. Confirmar role='admin' y empresa_id en el profile via service_role (bypasea RLS)
        // El trigger ya los asignó desde metadata, esto es un safety-net por si el trigger falla
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({ role: 'admin', empresa_id: empresa.id })
            .eq('id', authData.user.id)

        if (profileError) {
            // Rollback: eliminar usuario y empresa
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
            await supabaseAdmin.from('empresas').delete().eq('id', empresa.id)
            logger.error({ err: profileError }, 'Error actualizando profile admin')
            return NextResponse.json(
                { error: 'Error al configurar el perfil del administrador' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            empresa_id: empresa.id,
            user_id: authData.user.id,
            message: 'Empresa y administrador registrados exitosamente',
        })
    } catch (error: any) {
        logger.error({ err: error }, 'Error en registro de empresa')
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
