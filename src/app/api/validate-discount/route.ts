import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const getSupabaseAdmin = () => createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/validate-discount
// Body: { codigo: string, empresa_id: string }
// Retorna: { valido, tipo, valor, descripcion, stripe_coupon_id, mensaje }
export async function POST(request: NextRequest) {
    try {
        const { codigo, empresa_id } = await request.json()

        if (!codigo || !empresa_id) {
            return NextResponse.json(
                { error: 'Faltan campos: codigo y empresa_id son requeridos' },
                { status: 400 }
            )
        }

        const { data, error } = await getSupabaseAdmin().rpc('redimir_codigo_descuento', {
            p_codigo:     codigo,
            p_empresa_id: empresa_id,
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch {
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

// GET /api/validate-discount?codigo=BETA2026
// Solo valida sin redimir (para mostrar preview en el form antes de confirmar)
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const codigo = searchParams.get('codigo')

    if (!codigo) {
        return NextResponse.json({ error: 'Falta parámetro: codigo' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
        .from('codigos_descuento')
        .select('codigo, descripcion, tipo, valor, activo, fecha_expiracion, usos_actuales, max_usos')
        .eq('codigo', codigo.toUpperCase().trim())
        .single()

    if (error || !data) {
        return NextResponse.json({ valido: false, mensaje: 'Código no encontrado' })
    }

    if (!data.activo) {
        return NextResponse.json({ valido: false, mensaje: 'Código inactivo' })
    }

    if (data.fecha_expiracion && new Date(data.fecha_expiracion) < new Date()) {
        return NextResponse.json({ valido: false, mensaje: 'Código expirado' })
    }

    if (data.max_usos !== null && data.usos_actuales >= data.max_usos) {
        return NextResponse.json({ valido: false, mensaje: 'Código agotado' })
    }

    return NextResponse.json({
        valido:      true,
        tipo:        data.tipo,
        valor:       data.valor,
        descripcion: data.descripcion,
        mensaje:     '¡Código válido!',
    })
}
