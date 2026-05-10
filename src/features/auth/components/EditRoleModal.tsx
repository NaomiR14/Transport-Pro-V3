'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertCircle, Shield } from 'lucide-react'
import { useUpdateUserRole } from '../hooks/useRoles'
import { useAuth } from '../hooks/useAuth'
import type { UserRole, UserProfile } from '../types/auth.types'
import { getRoleName } from '@/utils/role-names'

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

interface EditRoleModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: UserProfile | null
}

export default function EditRoleModal({ open, onOpenChange, user }: EditRoleModalProps) {
    const { profile: currentAdmin } = useAuth()
    const updateRole = useUpdateUserRole()
    const [selectedRole, setSelectedRole] = useState<UserRole | ''>('')

    const isSelf = currentAdmin?.id === user?.id

    const handleOpen = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedRole('')
        }
        onOpenChange(isOpen)
    }

    const handleSubmit = () => {
        if (!user || !selectedRole || selectedRole === user.role) return

        updateRole.mutate(
            { userId: user.id, newRole: selectedRole },
            {
                onSuccess: () => {
                    handleOpen(false)
                },
            }
        )
    }

    if (!user) return null

    const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ') || 'Sin nombre'

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        Cambiar Rol de Usuario
                    </DialogTitle>
                    <DialogDescription>
                        Modifica el rol y permisos del usuario seleccionado.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Info del usuario */}
                    <div className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {fullName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Rol actual: <span className="font-medium text-slate-700 dark:text-slate-300">{getRoleName(user.role || 'conductor')}</span>
                        </p>
                    </div>

                    {isSelf && (
                        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-amber-700">
                                No puedes cambiar tu propio rol. Pide a otro administrador que lo haga.
                            </p>
                        </div>
                    )}

                    {/* Select de rol */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Nuevo rol
                        </label>
                        <Select
                            value={selectedRole}
                            onValueChange={(value) => setSelectedRole(value as UserRole)}
                            disabled={isSelf}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccionar nuevo rol" />
                            </SelectTrigger>
                            <SelectContent>
                                {ALL_ROLES.map((role) => (
                                    <SelectItem
                                        key={role}
                                        value={role}
                                        disabled={role === user.role}
                                    >
                                        {getRoleName(role)}
                                        {role === user.role && ' (actual)'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => handleOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedRole || selectedRole === user.role || isSelf || updateRole.isPending}
                    >
                        {updateRole.isPending ? 'Guardando...' : 'Guardar Cambio'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
