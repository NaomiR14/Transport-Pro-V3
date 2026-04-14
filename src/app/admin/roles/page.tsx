'use client'

import { useState, useMemo } from 'react'
import { RequirePermission, useAuth } from '@/features/auth'
import type { UserRole, UserProfile } from '@/features/auth'
import { useAllProfiles, useUserCountByRole } from '@/features/auth/hooks/useRoles'
import EditRoleModal from '@/features/auth/components/EditRoleModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Shield, Users, Search, Pencil, Loader2 } from 'lucide-react'
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
    const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [editUser, setEditUser] = useState<UserProfile | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const { data: profiles, isLoading } = useAllProfiles(
        roleFilter === 'all' ? undefined : roleFilter
    )
    const { data: roleCounts } = useUserCountByRole()

    // Filtrar por búsqueda localmente
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
        setModalOpen(true)
    }

    return (
        <RequirePermission module="dashboard" action="edit">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">
                        Administración de Roles
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona roles de usuarios y permisos del sistema
                    </p>
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
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditRole(profile)}
                                                        title={isSelf ? 'No puedes cambiar tu propio rol' : 'Cambiar rol'}
                                                    >
                                                        <Pencil className="h-4 w-4 mr-1" />
                                                        Cambiar Rol
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Modal de edición */}
                <EditRoleModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    user={editUser}
                />
            </div>
        </RequirePermission>
    )
}
