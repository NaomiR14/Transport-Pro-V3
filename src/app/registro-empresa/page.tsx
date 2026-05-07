'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Truck, Building2, User, AlertCircle, Mail, Lock,
    Eye, EyeOff, Phone, MapPin, FileText, CheckCircle2,
} from 'lucide-react'

const INPUT_CLASS =
    'pl-10 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400'

const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1.5'

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
        if (!empresaNombre.trim()) { setError('El nombre de la empresa es requerido'); return false }
        if (!empresaEmail.trim() || !/\S+@\S+\.\S+/.test(empresaEmail)) { setError('Ingresa un email de contacto válido'); return false }
        if (!adminNombre.trim()) { setError('El nombre del administrador es requerido'); return false }
        if (!adminApellido.trim()) { setError('El apellido del administrador es requerido'); return false }
        if (!adminEmail.trim() || !/\S+@\S+\.\S+/.test(adminEmail)) { setError('Ingresa un email válido para el administrador'); return false }
        if (adminPassword.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return false }
        if (adminPassword !== adminPasswordConfirm) { setError('Las contraseñas no coinciden'); return false }
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
            if (!res.ok) { setError(data.error || 'Error al registrar'); return }

            setSuccess(true)
            setTimeout(() => router.push('/login'), 5000)
        } catch {
            setError('Error de conexión. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    // ── Pantalla de éxito ──────────────────────────────────────────────────────
    if (success) {
        return (
            <PageShell showRegisterLink={false}>
                <div className="w-full max-w-md mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-10 text-center">
                        <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-5">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">¡Registro exitoso!</h2>
                        <p className="text-gray-500 mb-6">
                            Tu empresa y cuenta de administrador han sido creadas. Serás redirigido al login en unos segundos.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all"
                        >
                            Ir al login ahora
                        </Link>
                    </div>
                </div>
            </PageShell>
        )
    }

    // ── Formulario ─────────────────────────────────────────────────────────────
    return (
        <PageShell showRegisterLink={false}>
            <div className="w-full max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white mb-2">Registra tu empresa</h1>
                    <p className="text-blue-200/80">Crea tu cuenta empresarial y comienza a gestionar tu flota hoy</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ── Sección Empresa ── */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <Building2 className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-extrabold text-gray-900">Datos de la empresa</h2>
                        </div>

                        <div className="space-y-5">
                            {/* Nombre empresa */}
                            <div>
                                <label htmlFor="empresa-nombre" className={LABEL_CLASS}>
                                    Nombre de la empresa <span className="text-red-500">*</span>
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
                                        className={INPUT_CLASS}
                                        placeholder="Mi Empresa de Transporte S.A."
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* NIT */}
                                <div>
                                    <label htmlFor="empresa-nit" className={LABEL_CLASS}>NIT / RUC</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FileText className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="empresa-nit"
                                            type="text"
                                            value={empresaNit}
                                            onChange={(e) => setEmpresaNit(e.target.value)}
                                            className={INPUT_CLASS}
                                            placeholder="123456789"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Email contacto */}
                                <div>
                                    <label htmlFor="empresa-email" className={LABEL_CLASS}>
                                        Email de contacto <span className="text-red-500">*</span>
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
                                            className={INPUT_CLASS}
                                            placeholder="contacto@miempresa.com"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label htmlFor="empresa-tel" className={LABEL_CLASS}>Teléfono</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="empresa-tel"
                                            type="tel"
                                            value={empresaTelefono}
                                            onChange={(e) => setEmpresaTelefono(e.target.value)}
                                            className={INPUT_CLASS}
                                            placeholder="+51 999 999 999"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label htmlFor="empresa-dir" className={LABEL_CLASS}>Dirección</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="empresa-dir"
                                            type="text"
                                            value={empresaDireccion}
                                            onChange={(e) => setEmpresaDireccion(e.target.value)}
                                            className={INPUT_CLASS}
                                            placeholder="Av. Principal 123, Ciudad"
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Sección Admin ── */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-extrabold text-gray-900">Cuenta del administrador</h2>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Nombre */}
                                <div>
                                    <label htmlFor="admin-nombre" className={LABEL_CLASS}>
                                        Nombre <span className="text-red-500">*</span>
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
                                            className={INPUT_CLASS}
                                            placeholder="Juan"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Apellido */}
                                <div>
                                    <label htmlFor="admin-apellido" className={LABEL_CLASS}>
                                        Apellido <span className="text-red-500">*</span>
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
                                            className={INPUT_CLASS}
                                            placeholder="Pérez"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email admin */}
                            <div>
                                <label htmlFor="admin-email" className={LABEL_CLASS}>
                                    Correo electrónico <span className="text-red-500">*</span>
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
                                        className={INPUT_CLASS}
                                        placeholder="admin@miempresa.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Contraseña */}
                                <div>
                                    <label htmlFor="admin-password" className={LABEL_CLASS}>
                                        Contraseña <span className="text-red-500">*</span>
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
                                            className={`${INPUT_CLASS} pr-10`}
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
                                                : <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                                        </button>
                                    </div>
                                    <p className="mt-1.5 text-xs text-gray-400">Mínimo 8 caracteres</p>
                                </div>

                                {/* Confirmar contraseña */}
                                <div>
                                    <label htmlFor="admin-confirm" className={LABEL_CLASS}>
                                        Confirmar contraseña <span className="text-red-500">*</span>
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
                                            className={`${INPUT_CLASS} pr-10`}
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
                                            {showConfirmPassword
                                                ? <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                                : <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-4 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Registrando empresa...
                            </>
                        ) : 'Crear cuenta empresarial'}
                    </button>

                    {/* Login link */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-blue-200/70">
                            ¿Ya tienes una cuenta?{' '}
                            <Link href="/login" className="font-semibold text-blue-300 hover:text-white transition-colors underline underline-offset-2">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </PageShell>
    )
}

// ── Shell compartido ───────────────────────────────────────────────────────────
function PageShell({ children, showRegisterLink }: { children: React.ReactNode; showRegisterLink: boolean }) {
    return (
        <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Background */}
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
                    {showRegisterLink && (
                        <Link href="/login" className="text-sm text-blue-200 hover:text-white transition-colors">
                            ¿Ya tienes cuenta? <span className="font-semibold underline underline-offset-2">Inicia sesión</span>
                        </Link>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
                {children}
            </main>

            <footer className="relative z-10 py-6 text-center">
                <p className="text-xs text-blue-300/40">
                    © {new Date().getFullYear()} TransportPro · Todos los derechos reservados
                </p>
            </footer>
        </div>
    )
}
