'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { AlertTriangle, Home, ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth, usePermissions } from '@/features/auth'

export default function AccesoDenegadoPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, profile } = useAuth()
    const { getRoleName } = usePermissions()

    // Obtener parámetros de la URL
    const modulo = searchParams.get('modulo') || 'este módulo'
    const accion = searchParams.get('accion') || 'ver'

    const accionTexto: Record<string, string> = {
        view: 'ver',
        create: 'crear',
        edit: 'editar',
        delete: 'eliminar'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full border-orange-200 shadow-xl">
                <CardHeader className="text-center pb-4">
                    <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-10 w-10 text-orange-600" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-gray-900">
                        Acceso Restringido
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        No tienes permisos para acceder a esta sección
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Información del usuario */}
                    {user && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-sm text-blue-900">
                                        Tu información
                                    </h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Usuario: <span className="font-medium">{user.email}</span>
                                    </p>
                                    {profile?.role && (
                                        <p className="text-sm text-blue-700">
                                            Rol: <span className="font-medium">{getRoleName()}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Mensaje principal */}
                    <div className="text-center space-y-2">
                        <p className="text-gray-700">
                            No tienes permisos para{' '}
                            <span className="font-semibold text-orange-700">
                                {accionTexto[accion] || accion}
                            </span>{' '}
                            en el módulo de{' '}
                            <span className="font-semibold text-orange-700">
                                {modulo}
                            </span>.
                        </p>
                        <p className="text-sm text-gray-600">
                            Si crees que deberías tener acceso, contacta al administrador del sistema.
                        </p>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            onClick={() => router.push('/')}
                            className="flex-1"
                            size="lg"
                        >
                            <Home className="h-4 w-4 mr-2" />
                            Ir al Dashboard
                        </Button>
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="flex-1"
                            size="lg"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver Atrás
                        </Button>
                    </div>

                    {/* Información adicional */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                            ¿Necesitas acceso?
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Contacta al administrador del sistema</li>
                            <li>• Solicita los permisos necesarios para tu rol</li>
                            <li>• Verifica que tu cuenta tenga el rol correcto</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
