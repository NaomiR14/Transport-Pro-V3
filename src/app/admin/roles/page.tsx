'use client'

import { RequirePermission } from '@/features/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, Users, Lock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function RolesAdminPage() {
    return (
        <RequirePermission module="dashboard" action="edit">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Administración de Roles
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona roles de usuarios y permisos del sistema
                    </p>
                </div>

                {/* Aviso de desarrollo */}
                <Alert className="mb-6 border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">En desarrollo</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        Esta funcionalidad está en construcción. Próximamente podrás gestionar
                        roles y permisos desde esta interfaz.
                    </AlertDescription>
                </Alert>

                {/* Vista previa de roles actuales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rolesInfo.map((role) => (
                        <Card key={role.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-lg ${role.color} flex items-center justify-center`}>
                                        {role.icon}
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                        {role.userCount} usuarios
                                    </span>
                                </div>
                                <CardTitle className="mt-4">{role.name}</CardTitle>
                                <CardDescription>{role.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold text-gray-700">
                                        Módulos con acceso:
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                        {role.modules.slice(0, 3).map((module) => (
                                            <span
                                                key={module}
                                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                                            >
                                                {module}
                                            </span>
                                        ))}
                                        {role.modules.length > 3 && (
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                                +{role.modules.length - 3} más
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    disabled
                                >
                                    <Lock className="h-4 w-4 mr-2" />
                                    Ver detalles
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Acciones futuras */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Funcionalidades Planificadas</CardTitle>
                        <CardDescription>
                            Próximas características de esta sección
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Crear y eliminar roles personalizados
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Asignar y revocar permisos por módulo
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Cambiar rol de usuarios existentes
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Historial de cambios de permisos
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                Exportar matriz de permisos
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </RequirePermission>
    )
}

// Datos de ejemplo de roles
const rolesInfo = [
    {
        id: 'admin',
        name: 'Administrador',
        description: 'Acceso completo al sistema',
        color: 'bg-red-100',
        icon: <Shield className="h-6 w-6 text-red-600" />,
        userCount: 1,
        modules: ['Todos los módulos']
    },
    {
        id: 'director',
        name: 'Director',
        description: 'Gestión completa de operaciones',
        color: 'bg-purple-100',
        icon: <Users className="h-6 w-6 text-purple-600" />,
        userCount: 1,
        modules: ['Todos los módulos']
    },
    {
        id: 'gerente',
        name: 'Gerente',
        description: 'Supervisión y reportes',
        color: 'bg-blue-100',
        icon: <Users className="h-6 w-6 text-blue-600" />,
        userCount: 1,
        modules: ['Todos los módulos']
    },
    {
        id: 'coordinador',
        name: 'Coordinador',
        description: 'Gestión de operaciones diarias',
        color: 'bg-green-100',
        icon: <Users className="h-6 w-6 text-green-600" />,
        userCount: 1,
        modules: ['Órdenes', 'Rutas', 'Conductores', 'Vehículos', 'Talleres']
    },
    {
        id: 'supervisor',
        name: 'Supervisor',
        description: 'Supervisión de mantenimiento',
        color: 'bg-teal-100',
        icon: <Users className="h-6 w-6 text-teal-600" />,
        userCount: 1,
        modules: ['Vehículos', 'Mantenimiento', 'Talleres', 'Seguros']
    },
    {
        id: 'recursos_humanos',
        name: 'Recursos Humanos',
        description: 'Gestión de personal',
        color: 'bg-pink-100',
        icon: <Users className="h-6 w-6 text-pink-600" />,
        userCount: 1,
        modules: ['Conductores', 'Multas', 'Liquidaciones']
    },
    {
        id: 'administrativo',
        name: 'Administrativo',
        description: 'Gestión administrativa',
        color: 'bg-indigo-100',
        icon: <Users className="h-6 w-6 text-indigo-600" />,
        userCount: 0,
        modules: ['Conductores', 'Multas', 'Liquidaciones']
    },
    {
        id: 'contador',
        name: 'Contador',
        description: 'Gestión financiera',
        color: 'bg-yellow-100',
        icon: <Users className="h-6 w-6 text-yellow-600" />,
        userCount: 1,
        modules: ['Flujo de Caja', 'Liquidaciones', 'Impuestos', 'Seguros']
    },
    {
        id: 'comercial',
        name: 'Comercial',
        description: 'Ventas y clientes',
        color: 'bg-orange-100',
        icon: <Users className="h-6 w-6 text-orange-600" />,
        userCount: 1,
        modules: ['Clientes', 'Órdenes']
    },
    {
        id: 'atencion_cliente',
        name: 'Atención al Cliente',
        description: 'Soporte y servicio',
        color: 'bg-cyan-100',
        icon: <Users className="h-6 w-6 text-cyan-600" />,
        userCount: 0,
        modules: ['Clientes', 'Órdenes']
    },
    {
        id: 'conductor',
        name: 'Conductor',
        description: 'Visualización de asignaciones',
        color: 'bg-gray-100',
        icon: <Users className="h-6 w-6 text-gray-600" />,
        userCount: 1,
        modules: ['Órdenes', 'Rutas', 'Multas']
    }
]
