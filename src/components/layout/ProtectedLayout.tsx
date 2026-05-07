'use client'

import { useAuth, usePermissions } from '@/features/auth'
import { useEstadoSuscripcion } from '@/features/pagos'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SidebarProvider } from './sidebar-context'
import { MainHeader } from './main-header'
import { SidebarNav } from './sidebar-nav'
import { Loader2, Lock, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Rutas que no requieren suscripción activa
const SUSCRIPCION_LIBRE = [
    '/configuracion/suscripcion',
    '/planes',
    '/perfil',
    '/configuracion',
    '/login',
    '/registro-empresa',
    '/auth',
]

interface ProtectedLayoutProps {
    children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
    const { user, isLoading } = useAuth()
    const { role } = usePermissions()
    const pathname = usePathname()
    const router = useRouter()

    const isAdmin = role === 'admin'
    const { data: suscripcion, isLoading: loadingSub } = useEstadoSuscripcion({
        enabled: !!user,
    })

    const publicPaths = ['/login', '/registro-empresa', '/auth/callback', '/reset-password', '/terminos', '/privacidad', '/cookies']
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))

    const isSuscripcionLibre = SUSCRIPCION_LIBRE.some(path => pathname?.startsWith(path))

    const suscripcionInactiva = !loadingSub && suscripcion !== null && suscripcion !== undefined && !suscripcion.plan_activo

    useEffect(() => {
        if (!isLoading && user && isPublicPath) {
            router.push('/')
        }
    }, [user, isLoading, isPublicPath, router])

    useEffect(() => {
        if (!isLoading && !user && !isPublicPath && pathname !== '/') {
            router.push('/login')
        }
    }, [user, isLoading, isPublicPath, pathname, router])

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

    if (isPublicPath && !user) return <>{children}</>
    if (!user && pathname === '/') return <>{children}</>
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
                        {suscripcionInactiva && !isSuscripcionLibre
                            ? <SuscripcionRequerida isAdmin={isAdmin} />
                            : children
                        }
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

function SuscripcionRequerida({ isAdmin }: { isAdmin: boolean }) {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Lock className="h-9 w-9 text-slate-400" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center">
                            <Crown className="h-4 w-4 text-amber-900" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Suscripción requerida
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {isAdmin
                            ? 'Tu suscripción ha vencido o no está activa. Activa un plan para continuar usando la plataforma. Tus datos están seguros y disponibles.'
                            : 'La suscripción de tu empresa ha vencido. Contacta al administrador de tu empresa para renovarla y recuperar el acceso.'
                        }
                    </p>
                </div>

                {isAdmin ? (
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                            <Link href="/configuracion/suscripcion">
                                <Crown className="h-4 w-4 mr-2" />
                                Activar suscripción
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/planes">Ver planes</Link>
                        </Button>
                    </div>
                ) : (
                    <Button asChild variant="outline">
                        <Link href="/perfil">Ver mi perfil</Link>
                    </Button>
                )}

                <p className="text-xs text-slate-400 dark:text-slate-500">
                    Tus datos están seguros y se restaurarán automáticamente al renovar.
                </p>
            </div>
        </div>
    )
}
