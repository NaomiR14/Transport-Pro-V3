// app/login/page.tsx
import { LoginForm } from '@/features/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Truck } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage() {
    const supabase = await createClient()

    // Si ya está autenticado, redirigir al dashboard
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 flex flex-col">
            {/* Header */}
            <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-600">
                                <Truck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Transport-Pro</span>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Sistema de Gestión</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                            <Truck className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                            Bienvenido de nuevo
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Accede al sistema de gestión de transporte
                        </p>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white dark:bg-gray-900 py-8 px-6 shadow-xl rounded-lg border border-gray-200 dark:border-gray-800">
                        <LoginForm />
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Sistema seguro • Para uso exclusivo del personal autorizado
                    </div>
                </div>
            </main>

            {/* Background Pattern */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 -right-48 w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    )
}
