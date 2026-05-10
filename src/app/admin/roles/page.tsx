'use client'

import { useState, useMemo } from 'react'
import { RequirePermission, useAuth } from '@/features/auth'
import type { UserRole, UserProfile } from '@/features/auth'
import { useAllProfiles, useUserCountByRole, useDeleteEmployee } from '@/features/auth/hooks/useRoles'
import EditRoleModal from '@/features/auth/components/EditRoleModal'
import CreateEmployeeModal from '@/features/auth/components/CreateEmployeeModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Shield, Users, Search, Pencil, Loader2, UserPlus, Trash2, AlertTriangle } from 'lucide-react'
import { getRoleName } from '@/utils/role-names'

const ROLE_COLORS: Record<UserRole, string> = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    director: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    gerente: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    coordinador: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    supervisor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
    recursos_humanos: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    administrativo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    contador: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    comercial: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    atencion_cliente: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    conductor: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
}

export default function RolesAdminPage() {
    const { profile: currentUser } = useAuth()
    const canDelete = currentUser?.role === 'admin'

    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
    const [searchTerm, setSearchTerm] = useState('')

    const [editUser, setEditUser] = useState<UserProfile | null>(null)
    const [editModalOpen, setEditModalOpen] = useState(false)

    const [createModalOpen, setCreateModalOpen] = useState(false)

    const [deleteUser, setDeleteUser] = useState<UserProfile | null>(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const { data: profiles, isLoading } = useAllProfiles(
        roleFilter === 'all' ? undefined : roleFilter
    )
    const { data: roleCounts } = useUserCountByRole()
    const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee()

    const filteredProfiles = useMemo(() => {
        if (!profiles) return []
        if (!searchTerm) return profiles
        const term = searchTerm.toLowerCase()
        return profiles.filter(
            (p) =>
                p.nombre?.toLowerCase().includes(term) ||
                p.apellido?.toLowerCase().includes(term)
        )
    }, [profiles, searchTerm])

    const totalUsers = roleCounts?.reduce((sum, r) => sum + r.count, 0) || 0

    const handleEditRole = (user: UserProfile) => {
        setEditUser(user)
        setEditModalOpen(true)
    }

    const handleDeleteClick = (user: UserProfile) => {
        setDeleteUser(user)
        setDeleteModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!deleteUser) return
        deleteEmployee(deleteUser.id, {
            onSuccess: () => {
                setDeleteModalOpen(false)
                setDeleteUser(null)
            },
        })
    }

    return (
        <RequirePermission module="dashboard" action="edit">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            Gestión de Roles
                        </h1>
                        <p className="text-muted-foreground">
                            Administra los usuarios y roles de tu empresa
                        </p>
                    </div>
                    <Button
                        onClick={() => setCreateModalOpen(true)}
                        className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Agregar Empleado
                    </Button>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Usuarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-600" />
                                <span className="text-2xl font-bold">{totalUsers}</span>
                            </div>
                        </CardContent>
                    </Card>
                    {roleCounts?.slice(0, 3).map((rc) => (
                        <Card key={rc.role}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {getRoleName(rc.role)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-slate-500" />
                                    <span className="text-2xl font-bold">{rc.count}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={roleFilter}
                        onValueChange={(v) => setRoleFilter(v as UserRole | 'all')}
                    >
                        <SelectTrigger className="w-full sm:w-[220px]">
                            <SelectValue placeholder="Filtrar por rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los roles</SelectItem>
                            {Object.keys(ROLE_COLORS).map((role) => (
                                <SelectItem key={role} value={role}>
                                    {getRoleName(role as UserRole)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Tabla de usuarios */}
                <Card>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                <span className="ml-2 text-sm text-slate-500">Cargando usuarios...</span>
                            </div>
                        ) : filteredProfiles.length === 0 ? (
                            <div className="text-center py-12 text-sm text-slate-500">
                                No se encontraron usuarios
                                {searchTerm && ` con "${searchTerm}"`}
                                {roleFilter !== 'all' && ` con rol ${getRoleName(roleFilter)}`}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Departamento</TableHead>
                                        <TableHead>Cargo</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Fecha registro</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProfiles.map((profile) => {
                                        const fullName = [profile.nombre, profile.apellido]
                                            .filter(Boolean)
                                            .join(' ') || 'Sin nombre'
                                        const role = (profile.role || 'conductor') as UserRole
                                        const isSelf = currentUser?.id === profile.id

                                        return (
                                            <TableRow key={profile.id}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {fullName}
                                                            {isSelf && (
                                                                <span className="ml-2 text-xs text-blue-500">(Tú)</span>
                                                            )}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                    {profile.department || '—'}
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                    {profile.position || '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${ROLE_COLORS[role]} border-0`}
                                                    >
                                                        {getRoleName(role)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400 text-sm">
                                                    {profile.created_at
                                                        ? new Date(profile.created_at).toLocaleDateString('es-CO')
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEditRole(profile)}
                                                            title={isSelf ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                                                        >
                                                            <Pencil className="h-4 w-4 mr-1" />
                                                            Cambiar Rol
                                                        </Button>
                                                        {canDelete && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(profile)}
                                                                className={isSelf
                                                                    ? 'invisible'
                                                                    : 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                                }
                                                                title="Eliminar empleado"
                                                                tabIndex={isSelf ? -1 : undefined}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Eliminar
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Modal editar rol */}
                <EditRoleModal
                    open={editModalOpen}
                    onOpenChange={setEditModalOpen}
                    user={editUser}
                />

                {/* Modal crear empleado */}
                <CreateEmployeeModal
                    open={createModalOpen}
                    onOpenChange={setCreateModalOpen}
                />

                {/* Diálogo confirmar eliminación */}
                <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                                Eliminar empleado
                            </DialogTitle>
                            <DialogDescription>
                                Esta acción es permanente y no se puede deshacer. Se eliminará la cuenta
                                de acceso del empleado y todos sus datos de sesión.
                            </DialogDescription>
                        </DialogHeader>
                        {deleteUser && (
                            <div className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                    {[deleteUser.nombre, deleteUser.apellido].filter(Boolean).join(' ') || 'Sin nombre'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Rol: {getRoleName(deleteUser.role || 'conductor')}
                                </p>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModalOpen(false)}
                                disabled={isDeleting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Eliminando...' : 'Eliminar empleado'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </RequirePermission>
    )
}
