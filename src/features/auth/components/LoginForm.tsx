'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState('')

    const supabase = createClient()
    const router = useRouter()

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess('')

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccess('¡Inicio de sesión exitoso! Redirigiendo...')
                router.refresh()
                setTimeout(() => router.push('/'), 1500)
            }
        } catch (err: any) {
            setError(err.message || 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordReset = async () => {
        if (!email) {
            setError('Ingresa tu email para recuperar la contraseña')
            return
        }
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            setError(error.message)
        } else {
            setSuccess('¡Email de recuperación enviado! Revisa tu bandeja de entrada.')
        }
        setLoading(false)
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleEmailLogin} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                            placeholder="tu@empresa.com"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            className="text-xs text-blue-600 hover:text-blue-700 hover:underline focus:outline-none transition-colors"
                            disabled={loading}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            {showPassword
                                ? <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                : <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            }
                        </button>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-700">{success}</p>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Iniciando sesión...
                        </>
                    ) : 'Iniciar sesión'}
                </button>

                {/* Register link */}
                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                        ¿Quieres registrar tu empresa?{' '}
                        <Link
                            href="/registro-empresa"
                            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
