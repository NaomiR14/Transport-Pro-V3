"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    VehiculoFilters,
    VehiculoFormModal,
    VehiculosTable,
    useDeleteVehicle,
    useFilteredVehicles,
    useVehiclesStats,
    type Vehicle
} from "@/features/vehiculos"
import { VehiculoStats } from "@/features/vehiculos/components/VehiculoStats"
import { Plus, Car, Loader2 } from "lucide-react"




export default function VehiculosPage() {
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { vehicles, isLoading, error, filters } = useFilteredVehicles()
    const { data: stats } = useVehiclesStats()
    const deleteVehicleMutation = useDeleteVehicle()

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
                    {/* Filters */}
                    <VehiculoFilters  />

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
                                {filters.searchTerm || filters.type || filters.brand || filters.estadoCalculado
                                    ? "Intenta ajustar los filtros de búsqueda"
                                    : "Comienza agregando tu primer vehículo"
                                }
                            </p>
                            {!(filters.searchTerm || filters.type || filters.brand || filters.estadoCalculado) && (
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
                        <VehiculosTable
                            vehicles={vehicles}
                            onEdit={handleEditVehicle}
                            onDelete={(vehicleId) => deleteVehicleMutation.mutate(vehicleId)}
                            isDeleting={deleteVehicleMutation.isPending}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <VehiculoFormModal
                    vehicle={editingVehicle}
                    onSave={handleSaveVehicle}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
