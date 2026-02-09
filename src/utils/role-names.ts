import { UserRole } from '@/features/auth'

export function getRoleName(role: UserRole): string {
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
    return roleNames[role] || role
}