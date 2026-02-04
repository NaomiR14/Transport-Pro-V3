'use client'

import { useAuth } from '@/hooks/auth/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAuth?: boolean
}

export default function ProtectedRoute({
    children,
    requireAuth = true
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    // Rutas públicas que no requieren autenticación
    const publicPaths = ['/login', '/registro', '/auth/callback', '/reset-password']
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))

    useEffect(() => {
        if (isLoading) return

        // Si requiere auth y no hay usuario, redirigir a login
        if (requireAuth && !user && !isPublicPath && pathname !== '/') {
            router.push('/login')
        }

        // Si hay usuario y está en ruta pública (login/registro), redirigir al dashboard
        if (user && isPublicPath) {
            router.push('/')
        }
    }, [user, isLoading, pathname, router, requireAuth, isPublicPath])

    // Mostrar loading mientras verifica
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-2 text-muted-foreground">Verificando autenticación...</p>
                </div>
            </div>
        )
    }

    // Si está en página principal sin usuario, mostrar contenido público
    if (!user && pathname === '/') {
        return <>{children}</>
    }

    // Si es ruta pública, mostrar contenido
    if (isPublicPath) {
        return <>{children}</>
    }

    // Si requiere auth y no hay usuario, no mostrar nada (ya redirige)
    if (requireAuth && !user) {
        return null
    }

    // Mostrar contenido protegido
    return <>{children}</>
}