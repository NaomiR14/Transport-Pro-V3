'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/auth/useAuth'

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { user, profile, signOut } = useAuth()

    const handleLogout = async () => {
        try {
            await signOut()
            setIsOpen(false)
            router.push('/login')
            router.refresh()
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    // Cerrar menú al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Si no hay usuario, mostrar botón de login
    if (!user) {
        return (
            <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
                Iniciar Sesión
            </button>
        )
    }

    // Determinar qué nombre mostrar
    const displayName = profile?.nombre && profile?.apellido
        ? `${profile.nombre} ${profile.apellido}`
        : profile?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          'Usuario'
    const userEmail = user.email || ''

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                    <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                        {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {userEmail}
                    </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                            {userEmail}
                        </p>
                        {profile?.role && (
                            <div className="mt-1">
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                    {profile.role === 'admin' ? 'Administrador' :
                                        profile.role === 'driver' ? 'Conductor' : 'Usuario'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                router.push('/perfil')
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                        >
                            <User className="h-4 w-4 mr-3 text-gray-400" />
                            Mi Perfil
                        </button>

                        <button
                            onClick={() => {
                                setIsOpen(false)
                                router.push('/configuracion')
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-left"
                        >
                            <Settings className="h-4 w-4 mr-3 text-gray-400" />
                            Configuración
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors text-left"
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}