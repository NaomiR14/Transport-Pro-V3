"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  IdCard, 
  Loader2, 
  X, 
  Star, 
  Calendar 
} from "lucide-react"

// Importar desde features
import {
  useDeleteConductor,
  useFilteredConductores,
  useConductoresStats,
  useConductorFilterOptions,
  useConductorStore,
  ConductorFormModal as EditConductorModal,
  type Conductor
} from "@/features/conductores"
import { ConductoresStats } from "@/features/conductores/components/ConductorStats"

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
            'vigente': { 
              color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', 
              icon: '✅' 
            },
            'por_vencer': { 
              color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', 
              icon: '⚠️' 
            },
            'vencida': { 
              color: 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text', 
              icon: '❌' 
            }
        }

        const config = estadoConfig[estado as keyof typeof estadoConfig] || { 
            color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', 
            icon: '❓' 
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
            </span>
        )
    }

    const getEstadoBadge = (activo: boolean) => {
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                activo 
                  ? 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
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
                    <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                ))}
                {hasHalfStar && <Star className="h-4 w-4 fill-amber-500/50 text-amber-500" />}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                ))}
                <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {calificacion.toFixed(1)}
                </span>
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
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Conductores
                    </h1>
                </div>
                <Card className="w-full max-w-md mx-auto border-border-light dark:border-border-dark">
                    <CardContent className="pt-6">
                        <p className="text-error-text mb-4">{error}</p>
                        <Button
                            className="w-full bg-gradient-to-r from-primary-blue to-primary-purple hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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
        <div className="p-6 container-padding">
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Conductores
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Administra la información de los conductores de la flota
                    </p>
                </div>
                <Button 
                    onClick={handleCreateConductor} 
                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Conductor
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
                <ConductoresStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters and Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                                <Input
                                    placeholder="Buscar conductores..."
                                    value={filters.searchTerm || ''}
                                    onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                    className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
                                />
                            </div>

                            {/* Estado Licencia Filter */}
                            <Select
                                value={filters.estado_licencia || "all"}
                                onValueChange={(value) =>
                                    setFilters({ estado_licencia: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
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

                            {/* Estado Filter */}
                            <Select
                                value={filters.activo === undefined ? "all" : filters.activo.toString()}
                                onValueChange={(value) =>
                                    setFilters({ activo: value === "all" ? undefined : value === "true" })
                                }
                            >
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="true">Activos</SelectItem>
                                    <SelectItem value="false">Inactivos</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {(filters.searchTerm || filters.estado_licencia || filters.activo !== undefined) && (
                                <Button 
                                    variant="outline" 
                                    onClick={clearFilters}
                                    className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
                            <span className="ml-3 text-slate-600 dark:text-slate-400">
                                Cargando conductores...
                            </span>
                        </div>
                    ) : conductores.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <User className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No se encontraron conductores
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                {filters.searchTerm || filters.estado_licencia || filters.activo !== undefined
                                    ? "Intenta ajustar los filtros de búsqueda"
                                    : "Comienza agregando tu primer conductor"
                                }
                            </p>
                            {!(filters.searchTerm || filters.estado_licencia || filters.activo !== undefined) && (
                                <Button 
                                    onClick={handleCreateConductor} 
                                    className="bg-gradient-to-r from-primary-blue to-primary-purple hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Agregar Conductor
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                    <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-20">
                                            ID
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Documento
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Nombre
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            N° Licencia
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Dirección
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Teléfono
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Calificación
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Email
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Estado
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Vencimiento Lic.
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Estado Lic.
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {conductores.map((conductor) => (
                                        <TableRow 
                                            key={conductor.id} 
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                        >
                                            <TableCell className="font-medium text-slate-900 dark:text-white">
                                                {conductor.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <IdCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <span className="font-mono text-sm text-slate-900 dark:text-white">
                                                        {conductor.documento_identidad}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {conductor.nombre_conductor}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-sm text-slate-900 dark:text-white">
                                                {conductor.numero_licencia}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-start space-x-2 max-w-xs">
                                                    <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {conductor.direccion}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <span className="font-mono text-sm text-slate-900 dark:text-white">
                                                        {conductor.telefono}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getCalificacionStars(conductor.calificacion)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <span className="text-sm text-primary-blue hover:text-primary-purple hover:underline cursor-pointer transition-colors duration-150">
                                                        {conductor.email}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getEstadoBadge(conductor.activo)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 justify-start">
                                                    <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <span className="text-slate-700 dark:text-slate-300">
                                                        {formatDate(conductor.fecha_vencimiento_licencia)}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getEstadoLicenciaBadge(conductor.estado_licencia)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditConductor(conductor)}
                                                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (window.confirm("¿Seguro que deseas eliminar este conductor?")) {
                                                                deleteConductorMutation.mutate(conductor.id)
                                                            }
                                                        }}
                                                        disabled={deleteConductorMutation.isPending}
                                                        className="h-8 w-8 p-0 hover:bg-error-bg dark:hover:bg-error-bg/20"
                                                    >
                                                        {deleteConductorMutation.isPending ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <X className="h-4 w-4 text-error-text dark:text-error-text" />
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
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <EditConductorModal
                    conductor={editingConductor}
                    onSave={handleSaveConductor}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}