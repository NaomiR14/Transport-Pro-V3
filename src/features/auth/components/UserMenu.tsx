'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

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
        : user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Usuario'
    const userEmail = user.email || ''

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                    <User className="h-5 w-5" />
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-[150px]">
                        {displayName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                        {userEmail}
                    </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-500 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {displayName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                            {userEmail}
                        </p>
                        {profile?.role && (
                            <div className="mt-1">
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                                    {profile.role === 'director' ? 'Administrador' :
                                        profile.role === 'conductor' ? 'Conductor' : 'Usuario'}
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
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                        >
                            <User className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                            Mi Perfil
                        </button>

                        <button
                            onClick={() => {
                                setIsOpen(false)
                                router.push('/configuracion')
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                        >
                            <Settings className="h-4 w-4 mr-3 text-slate-400 dark:text-slate-500" />
                            Configuración
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-800 dark:hover:text-red-300 transition-colors text-left"
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