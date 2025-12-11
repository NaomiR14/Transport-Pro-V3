'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarProvider } from './sidebar-context'
import { MainHeader } from './main-header'
import { SidebarNav } from './sidebar-nav'
import { Loader2 } from 'lucide-react'

interface ProtectedLayoutProps {
    children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const { user, isLoading } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    // Rutas públicas que NO deben mostrar layout completo
    const publicPaths = ['/login', '/registro', '/auth/callback', '/reset-password']
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))

    // Redirigir si hay usuario y está en ruta pública
    useEffect(() => {
        if (!isLoading && user && isPublicPath) {
            router.push('/')
        }
    }, [user, isLoading, isPublicPath, router])

    // Redirigir si no hay usuario y está en ruta protegida
    useEffect(() => {
        if (!isLoading && !user && !isPublicPath && pathname !== '/') {
            router.push('/login')
        }
    }, [user, isLoading, isPublicPath, pathname, router])

    // Mostrar loading mientras se verifica
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

    // Si es ruta pública y no hay usuario, mostrar solo children (sin layout)
    if (isPublicPath && !user) {
        return <>{children}</>
    }

    // Si está en página principal sin usuario, mostrar landing pública (ya lo hace DashboardContent)
    if (!user && pathname === '/') {
        return <>{children}</>
    }

    // Si no hay usuario pero no es ruta pública ni página principal, mostrar loading (ya redirige)
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    // Layout completo para usuario autenticado
    return (
        <SidebarProvider>
            <div className="min-h-screen bg-background">
                <MainHeader />
                <div className="flex">
                    <SidebarNav />
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}