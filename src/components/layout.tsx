"use client"
import { MainHeader } from "./main-header"
import { SidebarNav } from "./sidebar-nav"
import { SidebarProvider } from "./sidebar-context"
import { ThemeProvider } from "./theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "sonner"
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { AuthProvider, useAuth } from "@/components/auth/auth-context"

interface LayoutProps {
  children: React.ReactNode
}

// Componente interno que usa el contexto de autenticación
function AuthenticatedLayout({ children }: LayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth() // Usar el contexto
  
  const supabase = createClient()

  useEffect(() => {
    const checkRoute = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Rutas públicas
      const publicPaths = ['/login', '/registro', '/auth/callback', '/reset-password']
      const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))
      
      if (!session && !isPublicPath && pathname !== '/') {
        router.push('/login')
      } else if (session && isPublicPath) {
        router.push('/')
      }
    }
    checkRoute()
  }, [pathname, router, supabase])

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

  // Si está en una ruta pública
  const publicPaths = ['/login', '/registro', '/auth/callback', '/reset-password']
  const isPublicPath = publicPaths.some(path => pathname?.startsWith(path))
  
  if (isPublicPath) {
    return (
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" richColors closeButton duration={4000} />
        </ThemeProvider>
      </QueryProvider>
    )
  }

  // Si está en la página principal sin usuario
  if (!user && pathname === '/') {
    return (
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" richColors closeButton duration={4000} />
        </ThemeProvider>
      </QueryProvider>
    )
  }

  // Layout completo para rutas autenticadas
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            {/* SidebarNav ahora obtendrá user del contexto */}
            <MainHeader />
            <div className="flex">
              <SidebarNav />
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </div>
          <Toaster position="top-right" richColors closeButton duration={4000} />
        </SidebarProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

// Componente principal envuelto en AuthProvider
export default function LayoutProviders({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </AuthProvider>
  )
}