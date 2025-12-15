'use client'

import { useAuth } from '@/hooks/autb/useAuth'
import { Loader2 } from 'lucide-react'

export default function AuthLoading() {
    const { isLoading } = useAuth()

    // Solo mostrar si está cargando por más de 500ms (para evitar flash)
    if (!isLoading) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Cargando aplicación...</p>
            </div>
        </div>
    )
}