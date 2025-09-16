"use client"

import { Bell, LogOut, Menu, Moon, Settings, Sun, User, Truck } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
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

export function MainHeader() {
  const { theme, setTheme } = useTheme()
  const { isOpen, toggle } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState("")
  const router = useRouter()

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
    const interval = setInterval(updateDateTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("🔄 Navegando a perfil...")
    console.log("Router object:", router)
    try {
      router.push("/perfil")
      console.log("✅ Navegación a /perfil iniciada")
    } catch (error) {
      console.error("❌ Error al navegar:", error)
    }
  }

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("🔄 Navegando a configuración...")
    try {
      router.push("/configuracion")
      console.log("✅ Navegación a /configuracion iniciada")
    } catch (error) {
      console.error("❌ Error al navegar:", error)
    }
  }

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("🔄 Cerrando sesión...")
    // Aquí se implementaría la lógica de logout
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="flex rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Botón Volver al Dashboard */}
          <Link 
            href="/" 
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
          >
            <Truck className="h-6 w-6 mr-2" />
            <span className="text-sm font-medium hidden sm:inline">Volver al Dashboard</span>
          </Link>

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

          <div className="flex items-center gap-2">
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

            <Button variant="ghost" size="icon" className="rounded-full relative" aria-label="Notificaciones">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-[10px]">
                1
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                  onClick={() => console.log("🎯 Avatar clickeado")}
                >
                  <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      JR
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Juan Carlos Rodríguez</p>
                    <p className="text-xs leading-none text-muted-foreground">admin@transportpro.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleProfileClick}
                    className="cursor-pointer"
                    onSelect={(e) => {
                      console.log("🎯 MenuItem Mi Perfil seleccionado")
                      handleProfileClick(e as any)
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleSettingsClick}
                    className="cursor-pointer"
                    onSelect={(e) => {
                      console.log("🎯 MenuItem Configuración seleccionado")
                      handleSettingsClick(e as any)
                    }}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogoutClick}
                  className="cursor-pointer"
                  onSelect={(e) => {
                    console.log("🎯 MenuItem Cerrar sesión seleccionado")
                    handleLogoutClick(e as any)
                  }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}