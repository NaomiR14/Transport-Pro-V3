"use client"

import { LogOut, Menu, Moon, Settings, Shield, Sun, User, Truck } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState, useRef } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "./sidebar-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth, useAuthStore } from "@/features/auth"
import { getRoleName } from '@/utils/role-names'
import { NotificacionesPanel, useNotificacionesRealtime } from '@/features/notificaciones'

export function MainHeader() {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState("")
  const [isOpen, setIsOpen] = useState(false) // ← Estado para el dropdown
  const menuRef = useRef<HTMLDivElement>(null) // ← Ref para el dropdown
  const router = useRouter()
  const { user, profile } = useAuth()

  // Suscripción Realtime: escucha notificaciones nuevas del usuario autenticado
  useNotificacionesRealtime(user?.id)

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const formattedDate = now.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      const formattedTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
      setCurrentDateTime(`${formattedDate} ${formattedTime}`)
    }

    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    router.push("/perfil")
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    router.push("/configuracion/suscripcion")
  }

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('🚪 Iniciando logout con timeout...')

    // 1. Cerrar dropdown inmediatamente
    setIsOpen(false)

    // 2. Establecer timeout para forzar limpieza si se atasca
    const logoutTimeout = setTimeout(() => {
      console.log('⏰ Timeout: Forzando limpieza después de 3 segundos...')
      forceCleanupAndRedirect()
    }, 3000)
    // 3 segundos máximo

    try {
      // 3. Limpiar estado LOCALMENTE PRIMERO (antes del logout)
      console.log('🔄 Limpiando estado local inmediatamente...')
      useAuthStore.getState().setUser(null)
      useAuthStore.getState().setProfile(null)
      useAuthStore.getState().setError(null)
      useAuthStore.getState().setLoading(true) // Solo para UI

      // 4. Limpiar localStorage manualmente
      try {
        localStorage.removeItem('auth-storage')
        console.log('✅ localStorage limpiado')
      } catch (storageError) {
        console.warn('⚠️ No se pudo limpiar localStorage:', storageError)
      }

      // 5. Hacer logout de Supabase con timeout
      console.log('🔄 Intentando signOut de Supabase...')
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      // Intentar logout pero con catch separado
      const logoutPromise = supabase.auth.signOut()
        .then(({ error }) => {
          clearTimeout(logoutTimeout)
          if (error) {
            console.error('❌ Error en signOut de Supabase:', error)
            throw error
          }
          console.log('✅ Supabase signOut exitoso')
          return true
        })
        .catch(error => {
          console.warn('⚠️ Error en signOut (continuando de todas formas):', error)
          return false // Continuar incluso con error
        })

      // Esperar máximo 2 segundos
      const logoutSuccess = await Promise.race([
        logoutPromise,
        new Promise(resolve => setTimeout(() => {
          console.log('⏰ SignOut tardó demasiado, continuando...')
          resolve(false)
        }, 2000))
      ])

      console.log('📋 Resultado signOut:', logoutSuccess)

    } catch (error) {
      console.error('❌ Error en proceso de logout:', error)
    } finally {
      // 6. SIEMPRE ejecutar limpieza final y redirección
      clearTimeout(logoutTimeout)
      forceCleanupAndRedirect()
    }
  }

  // Función auxiliar para forzar limpieza
  const forceCleanupAndRedirect = () => {
    console.log('🧹 Forzando limpieza completa...')

    // Limpiar TODO el estado
    useAuthStore.getState().setUser(null)
    useAuthStore.getState().setProfile(null)
    useAuthStore.getState().setError(null)
    useAuthStore.getState().setLoading(false)

    // Limpiar todos los storages
    try {
      localStorage.removeItem('auth-storage')
      sessionStorage.removeItem('auth-storage')
      localStorage.removeItem('supabase.auth.token')
    } catch (e) {
      console.warn('No se pudo limpiar storage:', e)
    }

    // Limpiar cookies de Supabase manualmente
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })

    console.log('🔄 Redirigiendo a /login...')

    // Redirección FORZADA
    setTimeout(() => {
      window.location.href = '/login'
    }, 100)
  }


  // Funciones para manejar clics en el dropdown
  const handleDropdownItemClick = (action: 'profile' | 'settings' | 'logout', e?: React.MouseEvent) => {
    if (e) e.preventDefault()

    switch (action) {
      case 'profile':
        handleProfileClick(e as unknown as React.MouseEvent)
        break
      case 'settings':
        handleSettingsClick(e as unknown as React.MouseEvent)
        break
      case 'logout':
        handleLogoutClick(e as unknown as React.MouseEvent)
        break
    }
  }

  const getUserInitials = () => {
  if (!user) return "US"
  if (profile?.nombre && profile?.apellido) {
    return (profile.nombre[0] + profile.apellido[0]).toUpperCase()
  }
  if (profile?.nombre) {
    return profile.nombre.substring(0, 2).toUpperCase()
  }
  return user.email?.substring(0, 2).toUpperCase() || "US"
}

  const getUserDisplayName = () => {
    if (!user) return "Usuario"
    if (profile?.nombre && profile?.apellido) {
      return `${profile.nombre} ${profile.apellido}`
    }
    if (profile?.nombre) return profile.nombre
    return user.email?.split('@')[0] || "Usuario"
  }

  const getUserEmail = () => {
    if (!user) return "admin@transportpro.com"
    return user.email || "usuario@ejemplo.com"
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="flex rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Botón Volver al Dashboard - solo mostrar si hay usuario*/}
          {user && (
            <Link
              href="/"
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
            >
              <Truck className="h-6 w-6 mr-2" />
              <span className="text-sm font-medium hidden sm:inline">Volver al Dashboard</span>
            </Link>
          )}

          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 hidden md:block">
            Sistema de Gestión de Transporte
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 hidden lg:block">
            <span className="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              Actualizado: {currentDateTime}
            </span>
          </div>

          <div className="flex items-center gap-2" ref={menuRef}>
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
                aria-label="Cambiar tema"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            )}

            <NotificacionesPanel />

            {user ? (
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-800 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white font-bold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72 p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl" align="end" forceMount>
                  {/* Profile header */}
                  <div className="bg-gradient-to-br from-blue-600 to-violet-600 px-4 pt-4 pb-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-white/30">
                        <AvatarFallback className="bg-white/20 text-white font-bold text-base backdrop-blur-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{getUserDisplayName()}</p>
                        <p className="text-xs text-blue-100 truncate">{getUserEmail()}</p>
                        {profile?.role && (
                          <span className="inline-flex items-center mt-1.5 bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {getRoleName(profile.role)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={(e) => handleDropdownItemClick('profile', e)}
                        className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Mi Perfil</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">Ver y editar datos personales</p>
                        </div>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={(e) => handleDropdownItemClick('settings', e)}
                        className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/50 transition-colors">
                          <Settings className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Configuración</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">Suscripción y preferencias</p>
                        </div>
                      </DropdownMenuItem>

                      {(profile?.role === 'admin' || profile?.role === 'director') && (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsOpen(false)
                            router.push('/admin/roles')
                          }}
                          className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/50 transition-colors">
                            <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Gestión de Roles</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500">Permisos y accesos del equipo</p>
                          </div>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>

                    <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

                    <DropdownMenuItem
                      onClick={(e) => handleDropdownItemClick('logout', e)}
                      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                        <LogOut className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Cerrar sesión</p>
                        <p className="text-xs text-red-400/70 dark:text-red-500/70">Salir de la cuenta</p>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Mostrar botones de login/registro si no hay usuario
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/registro-empresa">Registrarse</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}