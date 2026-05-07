import { LoginForm } from '@/features/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Truck } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect('/')

    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIiBkPSJNMCAwaDYwdjYwSDB6Ii8+PHBhdGggZD0iTTYwIDBIMHY2MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjAzIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-40 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="relative z-10 py-5 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="p-2 rounded-xl bg-blue-600 group-hover:bg-blue-700 transition-colors">
                            <Truck className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">
                            Transport<span className="text-blue-400">Pro</span>
                        </span>
                    </Link>
                    <Link
                        href="/registro-empresa"
                        className="text-sm text-blue-200 hover:text-white transition-colors"
                    >
                        ¿No tienes cuenta? <span className="font-semibold underline underline-offset-2">Regístrate</span>
                    </Link>
                </div>
            </header>

            {/* Main */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-white mb-2">Bienvenido de nuevo</h1>
                        <p className="text-blue-200/80">Accede al sistema de gestión de transporte</p>
                    </div>
                    <LoginForm />
                </div>

                <div className="relative z-10 mt-10 flex items-center gap-2 text-sm text-blue-300/60">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    Sistema seguro · Solo personal autorizado
                </div>
            </main>
        </div>
    )
}
