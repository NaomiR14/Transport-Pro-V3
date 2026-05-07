export type AuditAccion = 'INSERT' | 'UPDATE' | 'DELETE'

export interface AuditLog {
    id: string
    empresa_id: string
    tabla: string
    registro_id: string
    accion: AuditAccion
    user_id: string | null
    datos_antes: Record<string, unknown> | null
    datos_despues: Record<string, unknown> | null
    created_at: string
    profiles?: {
        nombre: string | null
        apellido: string | null
    } | null
}

export interface AuditFilters {
    tabla?: string
    accion?: AuditAccion | ''
    fecha_desde?: string
    fecha_hasta?: string
}

export const AUDIT_TABLAS = [
    'ordenes',
    'conductores',
    'vehiculos',
    'rutas_viajes',
    'mantenimientos_vehiculos',
    'multas_conductores',
    'seguros_vehiculos',
    'impuestos_vehiculares',
    'egresos_varios',
] as const

export type AuditTabla = typeof AUDIT_TABLAS[number]
