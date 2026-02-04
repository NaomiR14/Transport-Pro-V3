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
            'Al día': { color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400', icon: '✅' },
            'Próximo': { color: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400', icon: '⚠️' },
            'Urgente': { color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400', icon: '🚨' },
            'Vencido': { color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400', icon: '❌' }
        }

        const config = statusConfig[status as keyof typeof statusConfig] || {
            color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400', icon: '❓'
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {status}
            </span>
        )
    }

    const getVehicleStateBadge = (state: string) => {
        const stateConfig = {
            'Disponible': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
            'En Mantenimiento': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
            'En Uso': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
            'Inactivo': 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stateConfig[state as keyof typeof stateConfig] || 'bg-gray-100 text-gray-800'}`}>
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
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Vehículos</h1>
                </div>
                <Card className="w-full max-w-md mx-auto">
                    <CardContent className="pt-6">
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
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
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Vehículos</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Administra la flota de vehículos y su estado de mantenimiento</p>
                </div>
                <Button onClick={handleCreateVehicle} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Vehículo
                </Button>
            </div>
           

            {/* Estadísticas */}
            <div className="mb-6">
                <VehiculoStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                    {/* Filters and Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Search */}
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                <Input
                                    placeholder="Buscar vehículos..."
                                    value={filters.searchTerm || ''}
                                    onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                    className="pl-10 w-64 bg-gray-50 dark:bg-gray-800"
                                />
                            </div>

                            {/* Type Filter */}
                            <Select
                                value={filters.type !== undefined ? String(filters.type) : "all"}
                                onValueChange={(value) =>
                                    setFilters({ type: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="w-40">
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
                                <SelectTrigger className="w-40">
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
                                <SelectTrigger className="w-40">
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
                                <Button variant="outline" onClick={clearFilters} size="sm">
                                    <X className="h-4 w-4 mr-2" />
                                    Limpiar
                                </Button>
                            )}
                        </div>

                    {/* Table */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando vehículos...</span>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-12">
                            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No se encontraron vehículos
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {filters.searchTerm || filters.type || filters.brand || filters.vehicleState
                                    ? "Intenta ajustar los filtros de búsqueda"
                                    : "Comienza agregando tu primer vehículo"
                                }
                            </p>
                            {!(filters.searchTerm || filters.type || filters.brand || filters.vehicleState) && (
                                <Button onClick={handleCreateVehicle} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Vehículo
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold">ID</TableHead>
                                        <TableHead className="font-semibold">Tipo</TableHead>
                                        <TableHead className="font-semibold">Marca</TableHead>
                                        <TableHead className="font-semibold">Modelo</TableHead>
                                        <TableHead className="font-semibold">Placa</TableHead>
                                        <TableHead className="font-semibold">Color</TableHead>
                                        <TableHead className="font-semibold">Año</TableHead>
                                        <TableHead className="font-semibold">Estado</TableHead>
                                        <TableHead className="font-semibold">Km Actual</TableHead>
                                        <TableHead className="font-semibold">Estado Mnto</TableHead>
                                        <TableHead className="font-semibold">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                            <TableCell className="font-medium">{vehicle.id}</TableCell>
                                            <TableCell>{vehicle.type}</TableCell>
                                            <TableCell>{vehicle.brand}</TableCell>
                                            <TableCell>{vehicle.model}</TableCell>
                                            <TableCell className="font-mono font-bold">{vehicle.licensePlate}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded border border-gray-300"
                                                        style={{ backgroundColor: vehicle.color?.toLowerCase() }}
                                                    />
                                                    <span>{vehicle.color}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{vehicle.year}</TableCell>
                                            <TableCell>{getVehicleStateBadge(vehicle.vehicleState)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Gauge className="h-4 w-4 text-gray-500" />
                                                    <span>{vehicle.maintenanceData.currentKm || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getMaintenanceStatusBadge(vehicle.maintenanceData.maintenanceStatus || "Al día")}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditVehicle(vehicle)}
                                                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        <Edit className="h-4 w-4" />
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
                                                        className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        {deleteVehicleMutation.isPending ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
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
                    </div>
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
