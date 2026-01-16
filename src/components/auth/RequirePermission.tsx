'use client'

import { useAuth } from '@/hooks/auth/useAuth'
import { usePermissions, Module, Action } from '@/hooks/auth/usePermissions'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RequirePermissionProps {
    children: React.ReactNode
    module: Module
    action?: Action
    fallback?: React.ReactNode
    redirectOnDenied?: boolean // Si es true, redirige a /acceso-denegado
}

export function RequirePermission({
    children,
    module,
    action = 'view',
    fallback,
    redirectOnDenied = false
}: RequirePermissionProps) {
    const { user, isLoading } = useAuth()
    const { checkPermission } = usePermissions()
    const router = useRouter()

    useEffect(() => {
        // Si no hay usuario y ya terminó de cargar, redirigir a login
        if (!isLoading && !user) {
            router.push('/login')
        }
    }, [user, isLoading, router])

    // Mostrar loading mientras se verifica autenticación
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Si no hay usuario, no mostrar nada (ya se está redirigiendo)
    if (!user) {
        return null
    }

    // Verificar permisos
    const hasPermission = checkPermission(module, action)

    // Si no tiene permisos y debe redirigir, hacerlo
    useEffect(() => {
        if (!isLoading && user && !hasPermission && redirectOnDenied) {
            router.push(`/acceso-denegado?modulo=${encodeURIComponent(module)}&accion=${action}`)
        }
    }, [hasPermission, isLoading, user, module, action, redirectOnDenied, router])

    // Si no tiene permisos, mostrar fallback o mensaje por defecto
    if (!hasPermission) {
        if (fallback) {
            return <>{fallback}</>
        }

        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto border-orange-200">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-6 w-6 text-orange-600" />
                            </div>
                            <CardTitle className="text-xl">Acceso Restringido</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            No tienes permisos para acceder a este módulo. Si crees que esto es un error,
                            contacta con el administrador del sistema.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => router.push('/')}
                                variant="default"
                            >
                                Volver al Dashboard
                            </Button>
                            <Button
                                onClick={() => router.back()}
                                variant="outline"
                            >
                                Volver Atrás
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Si tiene permisos, mostrar el contenido
    return <>{children}</>
}
