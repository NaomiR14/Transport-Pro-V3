'use client'

import { useState } from 'react'
import { RequirePermission } from '@/features/auth'
import { useAuditLogs, AUDIT_TABLAS } from '@/features/audit'
import type { AuditFilters, AuditAccion } from '@/features/audit'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from '@/components/ui/table'
import { ClipboardList, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { PageHeader } from '@/shared/components'

const ACCION_COLORS: Record<AuditAccion, string> = {
    INSERT: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    UPDATE: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const TABLE_LABELS: Record<string, string> = {
    ordenes: 'Órdenes',
    conductores: 'Conductores',
    vehiculos: 'Vehículos',
    rutas_viajes: 'Rutas',
    mantenimientos_vehiculos: 'Mantenimiento',
    multas_conductores: 'Multas',
    seguros_vehiculos: 'Seguros',
    impuestos_vehiculares: 'Impuestos',
    egresos_varios: 'Flujo de Caja',
}

export default function AuditPage() {
    const [filters, setFilters] = useState<AuditFilters>({})
    const [page, setPage] = useState(0)

    const { data: logs, isLoading } = useAuditLogs(filters, page)

    const setFilter = (key: keyof AuditFilters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value || undefined }))
        setPage(0)
    }

    return (
        <RequirePermission module="dashboard" action="edit">
            <div className="container mx-auto px-4 py-8">
                <PageHeader
                    title="Registro de Actividad"
                    subtitle="Historial de cambios realizados en la plataforma"
                    icon={ClipboardList}
                    iconColor="text-violet-600"
                    iconBg="bg-violet-100 dark:bg-violet-900/30"
                />

                {/* Filtros */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <Select
                        value={filters.tabla ?? ''}
                        onValueChange={(v) => setFilter('tabla', v)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Todas las tablas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todas las tablas</SelectItem>
                            {AUDIT_TABLAS.map((t) => (
                                <SelectItem key={t} value={t}>{TABLE_LABELS[t] ?? t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={filters.accion ?? ''}
                        onValueChange={(v) => setFilter('accion', v)}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Todas las acciones" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Todas las acciones</SelectItem>
                            <SelectItem value="INSERT">Creación</SelectItem>
                            <SelectItem value="UPDATE">Edición</SelectItem>
                            <SelectItem value="DELETE">Eliminación</SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        className="w-[160px]"
                        value={filters.fecha_desde ?? ''}
                        onChange={(e) => setFilter('fecha_desde', e.target.value)}
                        placeholder="Desde"
                    />
                    <Input
                        type="date"
                        className="w-[160px]"
                        value={filters.fecha_hasta ?? ''}
                        onChange={(e) => setFilter('fecha_hasta', e.target.value)}
                        placeholder="Hasta"
                    />
                </div>

                {/* Tabla */}
                <Card>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                <span className="ml-2 text-sm text-slate-500">Cargando registros...</span>
                            </div>
                        ) : !logs?.length ? (
                            <div className="text-center py-12 text-sm text-slate-500">
                                No hay registros de actividad para los filtros seleccionados
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fecha y hora</TableHead>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Módulo</TableHead>
                                        <TableHead>Acción</TableHead>
                                        <TableHead>ID Registro</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => {
                                        const nombre = log.profiles
                                            ? [log.profiles.nombre, log.profiles.apellido].filter(Boolean).join(' ')
                                            : null
                                        return (
                                            <TableRow key={log.id}>
                                                <TableCell className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                    {new Date(log.created_at).toLocaleString('es-CO', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {nombre || <span className="text-slate-400 italic">Sistema</span>}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {TABLE_LABELS[log.tabla] ?? log.tabla}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`${ACCION_COLORS[log.accion]} border-0 text-xs`}
                                                    >
                                                        {log.accion === 'INSERT' ? 'Creación'
                                                            : log.accion === 'UPDATE' ? 'Edición'
                                                            : 'Eliminación'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-slate-500 truncate max-w-[120px]">
                                                    {log.registro_id}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Paginación */}
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-500">
                        Página {page + 1} · 50 registros por página
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Anterior
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!logs || logs.length < 50}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Siguiente
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </RequirePermission>
    )
}
