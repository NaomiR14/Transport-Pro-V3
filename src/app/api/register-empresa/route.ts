import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

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
            console.error('Error creando empresa:', empresaError)
            return NextResponse.json(
                { error: 'Error al registrar la empresa' },
                { status: 500 }
            )
        }

        // 2. Crear el usuario admin en Supabase Auth
        // El trigger handle_new_user creará el profile automáticamente
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: admin_email,
            password: admin_password,
            email_confirm: true, // Confirmar email automáticamente
            user_metadata: {
                nombre: admin_nombre,
                apellido: admin_apellido,
                role: 'admin',
                empresa_id: empresa.id,
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
            console.error('Error creando usuario:', authError)
            return NextResponse.json(
                { error: 'Error al crear el usuario administrador' },
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
        console.error('Error en registro de empresa:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
