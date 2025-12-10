// components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react'

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
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            })

            if (error) {
                setError(error.message)
            } else {
                setSuccess('¡Inicio de sesión exitoso! Redirigiendo...')
                // Forzar refresh para que el middleware detecte la sesión
                router.refresh()
                // Redirigir después de un breve delay
                setTimeout(() => {
                    router.push('/multas-conductores')
                }, 1500)
            }
        } catch (err: any) {
            setError(err.message || 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    const handlePasswordReset = async () => {
        if (!email) {
            setError('Por favor ingresa tu email para recuperar la contraseña')
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
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
                    <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email
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
                                className="pl-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                placeholder="tu@email.com"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
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
                                className="pl-10 pr-10 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
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
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Iniciando sesión...
                            </span>
                        ) : (
                            'Iniciar Sesión'
                        )}
                    </button>

                    {/* Register Link */}
                    <div className="text-center pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{' '}
                            <Link
                                href="/registro"
                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline focus:outline-none"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}