'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Truck, Building2, User, AlertCircle, Mail, Lock, Eye, EyeOff, Phone, MapPin, FileText, CheckCircle } from 'lucide-react'

export default function RegistroEmpresaPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Datos empresa
    const [empresaNombre, setEmpresaNombre] = useState('')
    const [empresaNit, setEmpresaNit] = useState('')
    const [empresaEmail, setEmpresaEmail] = useState('')
    const [empresaTelefono, setEmpresaTelefono] = useState('')
    const [empresaDireccion, setEmpresaDireccion] = useState('')

    // Datos admin
    const [adminNombre, setAdminNombre] = useState('')
    const [adminApellido, setAdminApellido] = useState('')
    const [adminEmail, setAdminEmail] = useState('')
    const [adminPassword, setAdminPassword] = useState('')
    const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('')

    const validateForm = () => {
        if (!empresaNombre.trim()) {
            setError('El nombre de la empresa es requerido')
            return false
        }
        if (!empresaEmail.trim() || !/\S+@\S+\.\S+/.test(empresaEmail)) {
            setError('Por favor ingresa un email de contacto válido')
            return false
        }
        if (!adminNombre.trim()) {
            setError('El nombre del administrador es requerido')
            return false
        }
        if (!adminApellido.trim()) {
            setError('El apellido del administrador es requerido')
            return false
        }
        if (!adminEmail.trim() || !/\S+@\S+\.\S+/.test(adminEmail)) {
            setError('Por favor ingresa un email válido para el administrador')
            return false
        }
        if (adminPassword.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres')
            return false
        }
        if (adminPassword !== adminPasswordConfirm) {
            setError('Las contraseñas no coinciden')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!validateForm()) return

        setLoading(true)

        try {
            const res = await fetch('/api/register-empresa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    empresa_nombre: empresaNombre.trim(),
                    empresa_nit: empresaNit.trim() || undefined,
                    empresa_email: empresaEmail.trim(),
                    empresa_telefono: empresaTelefono.trim() || undefined,
                    empresa_direccion: empresaDireccion.trim() || undefined,
                    admin_nombre: adminNombre.trim(),
                    admin_apellido: adminApellido.trim(),
                    admin_email: adminEmail.trim(),
                    admin_password: adminPassword,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error al registrar')
                return
            }

            setSuccess(true)
            setTimeout(() => router.push('/login'), 5000)
        } catch {
            setError('Error de conexión. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
                <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-900/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <Truck className="h-8 w-8 text-blue-600" />
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Transport Pro</span>
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                            <div className="inline-flex items-center justify-center p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Registro exitoso!</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Tu empresa y cuenta de administrador han sido creadas exitosamente.
                            </p>
                            <p className="text-xs text-green-600 mb-4">
                                Serás redirigido automáticamente en 5 segundos...
                            </p>
                            <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline">
                                Ir al login ahora
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Truck className="h-8 w-8 text-blue-600" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">Transport Pro</span>
                        </Link>
                        <Link
                            href="/login"
                            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                        >
                            ¿Ya tienes cuenta? Inicia sesión
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registra tu Empresa</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Crea tu cuenta empresarial para acceder a Transport-Pro</p>
                    </div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Sección Empresa */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Building2 className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Datos de la Empresa</h2>
                            </div>

                            <div className="space-y-6">
                                {/* Nombre Empresa */}
                                <div>
                                    <label htmlFor="empresa-nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nombre de la empresa
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="empresa-nombre"
                                            type="text"
                                            value={empresaNombre}
                                            onChange={(e) => setEmpresaNombre(e.target.value)}
                                            className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                            placeholder="Mi Empresa de Transporte S.A."
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* NIT */}
                                    <div>
                                        <label htmlFor="empresa-nit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            NIT / RUC
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="empresa-nit"
                                                type="text"
                                                value={empresaNit}
                                                onChange={(e) => setEmpresaNit(e.target.value)}
                                                className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                                placeholder="123456789"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Email Contacto */}
                                    <div>
                                        <label htmlFor="empresa-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email de contacto
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="empresa-email"
                                                type="email"
                                                value={empresaEmail}
                                                onChange={(e) => setEmpresaEmail(e.target.value)}
                                                className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                                placeholder="contacto@miempresa.com"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <label htmlFor="empresa-tel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Teléfono
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="empresa-tel"
                                                type="tel"
                                                value={empresaTelefono}
                                                onChange={(e) => setEmpresaTelefono(e.target.value)}
                                                className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                                placeholder="+51 999 999 999"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div>
                                        <label htmlFor="empresa-dir" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Dirección
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPin className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="empresa-dir"
                                                type="text"
                                                value={empresaDireccion}
                                                onChange={(e) => setEmpresaDireccion(e.target.value)}
                                                className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                                placeholder="Av. Principal 123, Lima"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sección Admin */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Cuenta del Administrador</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombre */}
                                    <div>
                                        <label htmlFor="admin-nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nombre
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="admin-nombre"
                                                type="text"
                                                value={adminNombre}
                                                onChange={(e) => setAdminNombre(e.target.value)}
                                                className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                                placeholder="Juan"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    {/* Apellido */}
                                    <div>
                                        <label htmlFor="admin-apellido" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Apellido
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="admin-apellido"
                                                type="text"
                                                value={adminApellido}
                                                onChange={(e) => setAdminApellido(e.target.value)}
                                                className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                                placeholder="Pérez"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email Admin */}
                                <div>
                                    <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="admin-email"
                                            type="email"
                                            value={adminEmail}
                                            onChange={(e) => setAdminEmail(e.target.value)}
                                            className="pl-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                            placeholder="admin@miempresa.com"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contraseña */}
                                    <div>
                                        <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="admin-password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={adminPassword}
                                                onChange={(e) => setAdminPassword(e.target.value)}
                                                className="pl-10 pr-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
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
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Mínimo 8 caracteres
                                        </p>
                                    </div>

                                    {/* Confirmar Contraseña */}
                                    <div>
                                        <label htmlFor="admin-confirm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirmar Contraseña
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="admin-confirm"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={adminPasswordConfirm}
                                                onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                                                className="pl-10 pr-10 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
                                                placeholder="••••••••"
                                                required
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={loading}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                ) : (
                                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
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
                                    Registrando empresa...
                                </span>
                            ) : (
                                'Registrar Empresa'
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                ¿Ya tienes una cuenta?{' '}
                                <Link
                                    href="/login"
                                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sistema seguro • Solo personal autorizado
                    </p>
                </div>
            </main>
        </div>
    )
}
