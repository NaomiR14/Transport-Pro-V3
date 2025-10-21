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
import { Plus, Search, Eye, Edit, Truck, Car, Loader2, X, Gauge, Calendar } from "lucide-react"
import Link from "next/link"
import EditVehicleModal from "@/components/EditVehicleModal"

// Importar los hooks y store
import { useDeleteVehicle, useFilteredVehicles, useVehiclesStats, useVehicleFilterOptions } from "@/hooks/use-vehicle"
import { useVehicleStore } from "@/store/vehicle-store"
import { Vehicle } from "@/types/vehicles-types"

export default function VehiclesPage() {
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks de React Query y Zustand
    const { vehicles, isLoading, error, filters } = useFilteredVehicles()
    const { setFilters, clearFilters } = useVehicleStore()
    const { data: stats } = useVehiclesStats()
    const filterOptions = useVehicleFilterOptions()
    const deleteVehicleMutation = useDeleteVehicle()

    const getMaintenanceStatusBadge = (status: string) => {
        const statusConfig = {
            'Al día': { color: 'bg-green-100 text-green-800', icon: '✅' },
            'Próximo': { color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
            'Urgente': { color: 'bg-orange-100 text-orange-800', icon: '🚨' },
            'Vencido': { color: 'bg-red-100 text-red-800', icon: '❌' }
        }

        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', icon: '❓' }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {status}
            </span>
        )
    }

    const getVehicleStateBadge = (state: string) => {
        const stateConfig = {
            'Disponible': 'bg-green-100 text-green-800',
            'En Mantenimiento': 'bg-yellow-100 text-yellow-800',
            'En Uso': 'bg-blue-100 text-blue-800',
            'Inactivo': 'bg-gray-100 text-gray-800'
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
        console.log('Vehículo guardado recibido en page:', savedVehicle)
        setIsEditModalOpen(false)
        setEditingVehicle(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingVehicle(null)
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
                            <Car className="h-8 w-8 text-indigo-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Vehículos</h1>
                        </div>
                        <Button onClick={handleCreateVehicle}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Vehículo
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
                                <CardTitle className="text-sm font-medium">Total Vehículos</CardTitle>
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
                                <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.available || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">En Mantenimiento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.inMaintenance || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">En Uso</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.requierenMantenimiento || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Gestión de Vehículos</CardTitle>
                                    <CardDescription>Administra la flota de vehículos y su estado de mantenimiento</CardDescription>
                                </div>

                                {/* Filtros y búsqueda */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                        <Input
                                            placeholder="Buscar vehículos..."
                                            value={filters.searchTerm || ''}
                                            onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                            className="pl-10 w-64"
                                        />
                                    </div>

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

                                    {(filters.searchTerm || filters.type || filters.brand || filters.vehicleState || filters.yearMin || filters.yearMax) && (
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
                                    <span className="ml-2">Cargando vehículos...</span>
                                </div>
                            ) : (
                                <>
                                    {vehicles.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No se encontraron vehículos
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {filters.searchTerm || filters.type || filters.brand || filters.vehicleState
                                                    ? "Intenta ajustar los filtros de búsqueda"
                                                    : "Comienza agregando tu primer vehículo"
                                                }
                                            </p>
                                            {!(filters.searchTerm || filters.type || filters.brand || filters.vehicleState) && (
                                                <Button onClick={handleCreateVehicle}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agregar Vehículo
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-24">ID</TableHead>
                                                        <TableHead>Tipo</TableHead>
                                                        <TableHead>Marca</TableHead>
                                                        <TableHead>Modelo</TableHead>
                                                        <TableHead>Placa</TableHead>
                                                        <TableHead>N° Serie</TableHead>
                                                        <TableHead>Color</TableHead>
                                                        <TableHead>Año</TableHead>
                                                        <TableHead>Capacidad (kg)</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                        <TableHead>Ciclo Mnto (km)</TableHead>
                                                        <TableHead>Km Inicial</TableHead>
                                                        <TableHead>Km Mnto Prev</TableHead>
                                                        <TableHead>Km Actual</TableHead>
                                                        <TableHead>Falta Mnto (km)</TableHead>
                                                        <TableHead>Estado Mnto</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {vehicles.map((vehicle) => (
                                                        <TableRow key={vehicle.id}>
                                                            <TableCell className="font-medium">{vehicle.id}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Car className="h-4 w-4 text-gray-500" />
                                                                    <span>{vehicle.type}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{vehicle.brand}</TableCell>
                                                            <TableCell>{vehicle.model}</TableCell>
                                                            <TableCell className="font-mono font-bold">{vehicle.licensePlate}</TableCell>
                                                            <TableCell className="font-mono text-sm">{vehicle.serialNumber}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <div
                                                                        className="w-4 h-4 rounded border border-gray-300"
                                                                        style={{ backgroundColor: vehicle.color?.toLowerCase() }}
                                                                    />
                                                                    <span>{vehicle.color}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    <span>{vehicle.year}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right">{vehicle.maxLoadCapacity}</TableCell>
                                                            <TableCell>{getVehicleStateBadge(vehicle.vehicleState)}</TableCell>
                                                            <TableCell className="text-right">{vehicle.maintenanceCycle || 5000}</TableCell>
                                                            <TableCell className="text-right">{vehicle.initialKm || 0}</TableCell>
                                                            <TableCell className="text-right">{vehicle.prevMaintenanceKm || vehicle.initialKm || 0}</TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex items-center space-x-2 justify-end">
                                                                    <Gauge className="h-4 w-4 text-gray-500" />
                                                                    <span>{vehicle.currentKm || 0}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right font-medium">
                                                                {vehicle.remainingMaintenanceKm !== undefined ? (
                                                                    <span className={vehicle.remainingMaintenanceKm <= 0 ? "text-red-600" : vehicle.remainingMaintenanceKm <= 500 ? "text-orange-600" : vehicle.remainingMaintenanceKm <= 1000 ? "text-yellow-600" : "text-green-600"}>
                                                                        {vehicle.remainingMaintenanceKm}
                                                                    </span>
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </TableCell>
                                                            <TableCell>{getMaintenanceStatusBadge(vehicle.maintenanceStatus || "Al día")}</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-1">
                                                                    <Button variant="outline" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEditVehicle(vehicle)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (window.confirm("¿Seguro que deseas eliminar este vehículo?")) {
                                                                                deleteVehicleMutation.mutate(vehicle.id)
                                                                            }
                                                                        }}
                                                                        disabled={deleteVehicleMutation.isPending}
                                                                    >
                                                                        {deleteVehicleMutation.isPending ? (
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
                    <EditVehicleModal
                        vehicle={editingVehicle}
                        onSave={handleSaveVehicle}
                        onClose={handleCloseModal}
                        isOpen={isEditModalOpen}
                    />
                )}
            </main>
        </div>
    )
}