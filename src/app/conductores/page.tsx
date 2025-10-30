"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Truck, User, Phone, Mail, MapPin, IdCard, Loader2, X, Star, Calendar } from "lucide-react"
import Link from "next/link"
import EditConductorModal from "@/components/EditConductorModal"

// Importar los hooks y store
import { useDeleteConductor, useFilteredConductores, useConductoresStats, useConductorFilterOptions } from "@/hooks/use-conductores"
import { useConductorStore } from "@/store/conductor-store"
import { Conductor } from "@/types/conductor-types"

export default function ConductoresPage() {
    const [editingConductor, setEditingConductor] = useState<Conductor | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks de React Query y Zustand
    const { conductores, isLoading, error, filters } = useFilteredConductores()
    const { setFilters, clearFilters } = useConductorStore()
    const { data: stats } = useConductoresStats()
    const filterOptions = useConductorFilterOptions()
    const deleteConductorMutation = useDeleteConductor()

    const getEstadoLicenciaBadge = (estado: string) => {
        const estadoConfig = {
            'vigente': { color: 'bg-green-100 text-green-800', icon: '✅' },
            'por_vencer': { color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
            'vencida': { color: 'bg-red-100 text-red-800', icon: '❌' }
        }

        const config = estadoConfig[estado as keyof typeof estadoConfig] || { color: 'bg-gray-100 text-gray-800', icon: '❓' }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
            </span>
        )
    }

    const getEstadoBadge = (activo: boolean) => {
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                {activo ? '✅ Activo' : '❌ Inactivo'}
            </span>
        )
    }

    const getCalificacionStars = (calificacion: number = 0) => {
        const fullStars = Math.floor(calificacion)
        const hasHalfStar = calificacion % 1 !== 0
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

        return (
            <div className="flex items-center space-x-1">
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
                {hasHalfStar && <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-gray-300" />
                ))}
                <span className="ml-2 text-sm font-medium">{calificacion.toFixed(1)}</span>
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX')
    }

    const handleCreateConductor = () => {
        setEditingConductor(null)
        setIsEditModalOpen(true)
    }

    const handleEditConductor = (conductor: Conductor) => {
        setEditingConductor(conductor)
        setIsEditModalOpen(true)
    }

    const handleSaveConductor = (savedConductor: Conductor) => {
        console.log('Conductor guardado recibido en page:', savedConductor)
        setIsEditModalOpen(false)
        setEditingConductor(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingConductor(null)
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">{error}</p>
                        <Button
                            className="mt-4 w-full"
                            onClick={() => window.location.reload()}
                        >
                            Reintentar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center mr-4">
                                <Truck className="h-6 w-6 text-blue-600 mr-2" />
                                <span className="text-sm text-gray-600">Volver al Dashboard</span>
                            </Link>
                            <User className="h-8 w-8 text-indigo-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Conductores</h1>
                        </div>
                        <Button onClick={handleCreateConductor}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Conductor
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Conductores</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.total || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Activos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.activos || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Licencias Vencidas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.licencias_vencidas || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {isLoading ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            stats?.calificacion_promedio.toFixed(1) || "0.0"
                                        )}
                                    </div>
                                    {!isLoading && <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Gestión de Conductores</CardTitle>
                                    <CardDescription>Administra la información de los conductores de la flota</CardDescription>
                                </div>

                                {/* Filtros y búsqueda */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                        <Input
                                            placeholder="Buscar conductores..."
                                            value={filters.searchTerm || ''}
                                            onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                            className="pl-10 w-64"
                                        />
                                    </div>

                                    <Select
                                        value={filters.estado_licencia || "all"}
                                        onValueChange={(value) =>
                                            setFilters({ estado_licencia: value === "all" ? undefined : value })
                                        }
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Estado Licencia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los estados</SelectItem>
                                            {filterOptions.estadosLicencia.map((estado) => (
                                                <SelectItem key={estado} value={estado}>
                                                    {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={filters.activo === undefined ? "all" : filters.activo.toString()}
                                        onValueChange={(value) =>
                                            setFilters({ activo: value === "all" ? undefined : value === "true" })
                                        }
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos</SelectItem>
                                            <SelectItem value="true">Activos</SelectItem>
                                            <SelectItem value="false">Inactivos</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {(filters.searchTerm || filters.estado_licencia || filters.activo !== undefined) && (
                                        <Button variant="outline" onClick={clearFilters}>
                                            <X className="h-4 w-4 mr-2" />
                                            Limpiar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="ml-2">Cargando conductores...</span>
                                </div>
                            ) : (
                                <>
                                    {conductores.length === 0 ? (
                                        <div className="text-center py-8">
                                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No se encontraron conductores
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {filters.searchTerm || filters.estado_licencia || filters.activo !== undefined
                                                    ? "Intenta ajustar los filtros de búsqueda"
                                                    : "Comienza agregando tu primer conductor"
                                                }
                                            </p>
                                            {!(filters.searchTerm || filters.estado_licencia || filters.activo !== undefined) && (
                                                <Button onClick={handleCreateConductor}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agregar Conductor
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-20">ID</TableHead>
                                                        <TableHead>Documento</TableHead>
                                                        <TableHead>Nombre Conductor</TableHead>
                                                        <TableHead>N° Licencia</TableHead>
                                                        <TableHead>Dirección</TableHead>
                                                        <TableHead>Teléfono</TableHead>
                                                        <TableHead>Calificación</TableHead>
                                                        <TableHead>Email</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                        <TableHead>Vencimiento Licencia</TableHead>
                                                        <TableHead>Estado Licencia</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {conductores.map((conductor) => (
                                                        <TableRow key={conductor.id}>
                                                            <TableCell className="font-medium">{conductor.id}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <IdCard className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-mono text-sm">{conductor.documento_identidad}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <User className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-medium">{conductor.nombre_conductor}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="font-mono text-sm">{conductor.numero_licencia}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-start space-x-2 max-w-xs">
                                                                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                                    <span className="text-sm">{conductor.direccion}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Phone className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-mono text-sm">{conductor.telefono}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{getCalificacionStars(conductor.calificacion)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Mail className="h-4 w-4 text-gray-500" />
                                                                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{conductor.email}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{getEstadoBadge(conductor.activo)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    <span>{formatDate(conductor.fecha_vencimiento_licencia)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{getEstadoLicenciaBadge(conductor.estado_licencia)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-1">
                                                                    <Button variant="outline" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEditConductor(conductor)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (window.confirm("¿Seguro que deseas eliminar este conductor?")) {
                                                                                deleteConductorMutation.mutate(conductor.id)
                                                                            }
                                                                        }}
                                                                        disabled={deleteConductorMutation.isPending}
                                                                    >
                                                                        {deleteConductorMutation.isPending ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <X className="h-4 w-4 text-red-600" />
                                                                        )}
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {isEditModalOpen && (
                    <EditConductorModal
                        conductor={editingConductor}
                        onSave={handleSaveConductor}
                        onClose={handleCloseModal}
                        isOpen={isEditModalOpen}
                    />
                )}
            </main>
        </div>
    )
}