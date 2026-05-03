'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useCreateEmployee } from '../hooks/useRoles'
import { getRoleName } from '@/utils/role-names'
import type { UserRole } from '../types/auth.types'

const ALL_ROLES: UserRole[] = [
    'admin',
    'director',
    'gerente',
    'coordinador',
    'supervisor',
    'recursos_humanos',
    'administrativo',
    'contador',
    'comercial',
    'atencion_cliente',
    'conductor',
]

const EMPTY_FORM = {
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    role: 'conductor' as UserRole,
}

interface CreateEmployeeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function CreateEmployeeModal({ open, onOpenChange }: CreateEmployeeModalProps) {
    const { mutate: createEmployee, isPending } = useCreateEmployee()
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)

    const handleChange = (field: keyof typeof EMPTY_FORM, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            setForm(EMPTY_FORM)
            setShowPassword(false)
        }
        onOpenChange(isOpen)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createEmployee(form, {
            onSuccess: () => handleOpenChange(false),
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        Agregar Empleado
                    </DialogTitle>
                    <DialogDescription>
                        Crea una nueva cuenta de usuario para tu empresa.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="emp-nombre">Nombre *</Label>
                            <Input
                                id="emp-nombre"
                                value={form.nombre}
                                onChange={(e) => handleChange('nombre', e.target.value)}
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emp-apellido">Apellido *</Label>
                            <Input
                                id="emp-apellido"
                                value={form.apellido}
                                onChange={(e) => handleChange('apellido', e.target.value)}
                                required
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="emp-email">Email *</Label>
                        <Input
                            id="emp-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="emp-password">Contraseña *</Label>
                        <div className="relative">
                            <Input
                                id="emp-password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                                required
                                minLength={6}
                                disabled={isPending}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword
                                    ? <Eye className="h-4 w-4 text-slate-400" />
                                    : <EyeOff className="h-4 w-4 text-slate-400" />
                                }
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Rol *</Label>
                        <Select
                            value={form.role}
                            onValueChange={(v) => handleChange('role', v)}
                            disabled={isPending}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {ALL_ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {getRoleName(r)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? 'Creando...' : 'Crear Empleado'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
