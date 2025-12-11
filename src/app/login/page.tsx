// app/login/page.tsx
import LoginForm from '@/components/auth/LoginForm'
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Truck className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900">Transport Pro</span>
                        </Link>
                        <div className="text-sm text-gray-600">
                            Sistema de Gestión
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Bienvenido de nuevo
                        </h1>
                        <p className="text-lg text-gray-600">
                            Accede al sistema de gestión de transporte
                        </p>
                    </div>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <LoginForm />
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        Sistema seguro • Para uso exclusivo del personal autorizado
                    </p>
                </div>
            </main>
        </div>
    )
}