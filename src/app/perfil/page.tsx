'use client'

import { useAuth } from '@/hooks/autb/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Mail, Phone, Shield } from 'lucide-react'

export default function ProfilePage() {
    const { user, profile, isLoading, refreshProfile } = useAuth()

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h1 className="text-2xl font-bold">No has iniciado sesión</h1>
                <Button
                    onClick={() => window.location.href = '/login'}
                    className="mt-4"
                >
                    Ir a Iniciar Sesión
                </Button>
            </div>
        )
    }

    const displayName = profile?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Usuario'

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Mi Perfil</CardTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={refreshProfile}
                    >
                        Actualizar
                    </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{displayName}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Shield className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {profile?.role === 'admin' ? 'Administrador' :
                                            profile?.role === 'driver' ? 'Conductor' : 'Usuario'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Email:</span>
                                </div>
                                <p className="text-sm pl-6">{user.email}</p>
                            </div>

                            {profile?.phone && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Teléfono:</span>
                                    </div>
                                    <p className="text-sm pl-6">{profile.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información de cuenta */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Información de la cuenta</h3>
                        <div className="text-sm space-y-1">
                            <p>ID de usuario: <span className="text-muted-foreground">{user.id?.substring(0, 8)}...</span></p>
                            <p>Miembro desde: <span className="text-muted-foreground">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : 'N/A'}
                            </span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}