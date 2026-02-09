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
import { Plus, Search, Eye, Edit, Car, Loader2, X, Gauge, Calendar } from "lucide-react"
import { VehiculoFormModal as EditVehicleModal } from "@/features/vehiculos"

// Importar desde el feature vehiculos
import {
    useDeleteVehicle,
    useFilteredVehicles,
    useVehiclesStats,
    useVehicleFilterOptions,
    useVehicleStore,
    Vehicle
} from "@/features/vehiculos"
import { VehiculoStats } from "@/features/vehiculos/components/VehiculoStats"

export default function VehiculosPage() {
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { vehicles, isLoading, error, filters } = useFilteredVehicles()
    const { setFilters, clearFilters } = useVehicleStore()
    const { data: stats } = useVehiclesStats()
    const filterOptions = useVehicleFilterOptions()
    const deleteVehicleMutation = useDeleteVehicle()

    const getMaintenanceStatusBadge = (status: string) => {
        const statusConfig = {
            'Al día': { 
                color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', 
                icon: '✅' 
            },
            'Próximo': { 
                color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', 
                icon: '⚠️' 
            },
            'Urgente': { 
                color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400', 
                icon: '🚨' 
            },
            'Vencido': { 
                color: 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text', 
                icon: '❌' 
            }
        }

        const config = statusConfig[status as keyof typeof statusConfig] || {
            color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', 
            icon: '❓'
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {status}
            </span>
        )
    }

    const getVehicleStateBadge = (state: string) => {
        const stateConfig = {
            'Disponible': 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text',
            'En Mantenimiento': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
            'En Uso': 'bg-info-bg text-info-text dark:bg-info-bg/20 dark:text-info-text',
            'Inactivo': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                stateConfig[state as keyof typeof stateConfig] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
            }`}>
                {state}
            </span>
        )
    }

    const handleCreateVehicle = () => {
        setEditingVehicle(null)
        setIsEditModalOpen(true)
    }

    const handleEditVehicle = (vehicle: Vehicle) => {
        setEditingVehicle(vehicle)
        setIsEditModalOpen(true)
    }

    const handleSaveVehicle = (savedVehicle: Vehicle) => {
        setIsEditModalOpen(false)
        setEditingVehicle(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingVehicle(null)
    }

    if (error) {
        return (
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Vehículos
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
                        Gestión de Vehículos
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Administra la flota de vehículos y su estado de mantenimiento
                    </p>
                </div>
                <Button 
                    onClick={handleCreateVehicle} 
                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Vehículo
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
                <VehiculoStats stats={stats} loading={isLoading} />
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
                                    placeholder="Buscar vehículos..."
                                    value={filters.searchTerm || ''}
                                    onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                    className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
                                />
                            </div>

                            {/* Type Filter */}
                            <Select
                                value={filters.type !== undefined ? String(filters.type) : "all"}
                                onValueChange={(value) =>
                                    setFilters({ type: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    {filterOptions.types.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Brand Filter */}
                            <Select
                                value={filters.brand !== undefined ? String(filters.brand) : "all"}
                                onValueChange={(value) =>
                                    setFilters({ brand: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las marcas</SelectItem>
                                    {filterOptions.brands.map((brand) => (
                                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* State Filter */}
                            <Select
                                value={filters.vehicleState !== undefined ? String(filters.vehicleState) : "all"}
                                onValueChange={(value) =>
                                    setFilters({ vehicleState: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    {filterOptions.states.map((state) => (
                                        <SelectItem key={state} value={state}>{state}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {(filters.searchTerm || filters.type || filters.brand || filters.vehicleState) && (
                                <Button 
                                    variant="outline" 
                                    onClick={clearFilters} 
                                    size="sm"
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
                                Cargando vehículos...
                            </span>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <Car className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No se encontraron vehículos
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                {filters.searchTerm || filters.type || filters.brand || filters.vehicleState
                                    ? "Intenta ajustar los filtros de búsqueda"
                                    : "Comienza agregando tu primer vehículo"
                                }
                            </p>
                            {!(filters.searchTerm || filters.type || filters.brand || filters.vehicleState) && (
                                <Button 
                                    onClick={handleCreateVehicle} 
                                    className="bg-gradient-to-r from-primary-blue to-primary-purple hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Agregar Vehículo
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                    <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            ID
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Tipo
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Marca
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Modelo
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Placa
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Color
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Año
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Estado
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Km Actual
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Estado Mnto
                                        </TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicles.map((vehicle) => (
                                        <TableRow 
                                            key={vehicle.id} 
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                        >
                                            <TableCell className="font-medium text-slate-900 dark:text-white">
                                                {vehicle.id}
                                            </TableCell>
                                            <TableCell className="text-slate-700 dark:text-slate-300">
                                                {vehicle.type}
                                            </TableCell>
                                            <TableCell className="text-slate-700 dark:text-slate-300">
                                                {vehicle.brand}
                                            </TableCell>
                                            <TableCell className="text-slate-700 dark:text-slate-300">
                                                {vehicle.model}
                                            </TableCell>
                                            <TableCell className="font-mono font-bold text-slate-900 dark:text-white">
                                                {vehicle.licensePlate}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
                                                        style={{ backgroundColor: vehicle.color?.toLowerCase() }}
                                                    />
                                                    <span className="text-slate-700 dark:text-slate-300">
                                                        {vehicle.color}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-700 dark:text-slate-300">
                                                {vehicle.year}
                                            </TableCell>
                                            <TableCell>
                                                {getVehicleStateBadge(vehicle.vehicleState)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 justify-start">
                                                    <Gauge className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <span className="text-slate-700 dark:text-slate-300">
                                                        {vehicle.maintenanceData.currentKm || 0}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getMaintenanceStatusBadge(vehicle.maintenanceData.maintenanceStatus || "Al día")}
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
                                                        onClick={() => handleEditVehicle(vehicle)}
                                                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (window.confirm("¿Seguro que deseas eliminar este vehículo?")) {
                                                                deleteVehicleMutation.mutate(vehicle.id)
                                                            }
                                                        }}
                                                        disabled={deleteVehicleMutation.isPending}
                                                        className="h-8 w-8 p-0 hover:bg-error-bg dark:hover:bg-error-bg/20"
                                                    >
                                                        {deleteVehicleMutation.isPending ? (
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
                <EditVehicleModal
                    vehicle={editingVehicle}
                    onSave={handleSaveVehicle}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}