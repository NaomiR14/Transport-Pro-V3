// components/auth/UserMenu.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface UserMenuProps {
    userEmail: string
    userName?: string
}

export default function UserMenu({ userEmail, userName }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
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

    const displayName = userName || userEmail.split('@')[0]

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <button
                            onClick={() => {
                                setIsOpen(false)
                                router.push('/perfil')
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            <User className="h-4 w-4 mr-3 text-gray-400" />
                            Mi Perfil
                        </button>

                        <button
                            onClick={() => {
                                setIsOpen(false)
                                router.push('/configuracion')
                            }}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            <Settings className="h-4 w-4 mr-3 text-gray-400" />
                            Configuración
                        </button>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
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