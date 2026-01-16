'use client'

import { useAuth } from '@/hooks/auth/useAuth'
import { UserRole } from '@/types/auth'

export type Module =
    | 'dashboard'
    | 'ordenes'
    | 'vehiculos'
    | 'conductores'
    | 'rutas'
    | 'multas'
    | 'flujo_caja'
    | 'indicadores_vehiculo'
    | 'indicadores_conductor'
    | 'liquidaciones'
    | 'talleres'
    | 'mantenimiento_vehiculos'
    | 'seguros'
    | 'impuestos_vehiculares'
    | 'clientes'

export type Action = 'view' | 'create' | 'edit' | 'delete'

export function usePermissions() {
    const { profile } = useAuth()

    // Mapeo de roles a módulos visibles
    const roleModules: Record<UserRole, Module[]> = {
        admin: [
            'dashboard', 'ordenes', 'vehiculos', 'conductores', 'rutas', 'multas',
            'flujo_caja', 'indicadores_vehiculo', 'indicadores_conductor', 'liquidaciones',
            'talleres', 'mantenimiento_vehiculos', 'seguros', 'impuestos_vehiculares', 'clientes'
        ],
        director: [
            'dashboard', 'ordenes', 'vehiculos', 'conductores', 'rutas', 'multas',
            'flujo_caja', 'indicadores_vehiculo', 'indicadores_conductor', 'liquidaciones',
            'talleres', 'mantenimiento_vehiculos', 'seguros', 'impuestos_vehiculares', 'clientes'
        ],
        gerente: [
            'dashboard', 'ordenes', 'vehiculos', 'conductores', 'rutas', 'multas',
            'flujo_caja', 'indicadores_vehiculo', 'indicadores_conductor', 'liquidaciones',
            'talleres', 'mantenimiento_vehiculos', 'seguros', 'impuestos_vehiculares', 'clientes'
        ],
        coordinador: [
            'dashboard', 'ordenes', 'rutas', 'conductores', 'vehiculos',
            'talleres', 'mantenimiento_vehiculos'
        ],
        supervisor: [
            'dashboard', 'vehiculos', 'mantenimiento_vehiculos', 'talleres',
            'seguros', 'impuestos_vehiculares'
        ],
        recursos_humanos: [
            'dashboard', 'conductores', 'multas', 'liquidaciones'
        ],
        administrativo: [
            'dashboard', 'conductores', 'multas', 'liquidaciones'
        ],
        contador: [
            'dashboard', 'flujo_caja', 'liquidaciones', 'impuestos_vehiculares',
            'seguros', 'indicadores_vehiculo'
        ],
        comercial: [
            'dashboard', 'clientes', 'ordenes'
        ],
        atencion_cliente: [
            'dashboard', 'clientes', 'ordenes'
        ],
        conductor: [
            'dashboard', 'ordenes', 'rutas', 'multas'
        ]
    }

    const checkPermission = (module: Module, action: Action = 'view'): boolean => {
        if (!profile?.role) return false

        const role = profile.role

        // Admin, Director y Gerente tienen acceso completo
        if (['admin', 'director', 'gerente'].includes(role)) return true

        // Verificar si el módulo está permitido para el rol
        const allowedModules = roleModules[role] || []
        if (!allowedModules.includes(module)) return false

        // Restricciones adicionales por acción
        switch (role) {
            case 'comercial':
            case 'atencion_cliente':
                // Solo pueden ver órdenes (no editar)
                return module === 'ordenes' ? action === 'view' : true

            case 'conductor':
                // Solo pueden ver (no crear/editar/eliminar)
                return action === 'view'

            case 'recursos_humanos':
            case 'administrativo':
                // No pueden eliminar multas
                if (module === 'multas' && action === 'delete') return false
                break
        }

        return true
    }

    const getVisibleModules = (): Module[] => {
        if (!profile?.role) return ['dashboard']
        return roleModules[profile.role] || ['dashboard']
    }

    const getRoleName = (): string => {
        const roleNames: Record<UserRole, string> = {
            admin: 'Administrador',
            director: 'Director',
            gerente: 'Gerente',
            coordinador: 'Coordinador',
            supervisor: 'Supervisor',
            recursos_humanos: 'Recursos Humanos',
            administrativo: 'Administrativo',
            contador: 'Contador',
            comercial: 'Comercial',
            atencion_cliente: 'Atención al Cliente',
            conductor: 'Conductor'
        }
        return profile?.role ? roleNames[profile.role] : 'Usuario'
    }

    const canAccessModule = (module: Module): boolean => {
        return checkPermission(module, 'view')
    }

    return {
        checkPermission,
        getVisibleModules,
        getRoleName,
        canAccessModule,
        role: profile?.role
    }
}