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
    useLimiteVehiculos,
    type Vehicle
} from "@/features/vehiculos"
import { VehiculoStats } from "@/features/vehiculos/components/VehiculoStats"
import { Plus, Car, Loader2, Truck, Lock, HelpCircle } from "lucide-react"
import { PageHeader } from '@/shared/components/common/PageHeader'
import { useVehiculosTutorial } from "@/features/vehiculos"




export default function VehiculosPage() {
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const { startTutorial } = useVehiculosTutorial()

    const { vehicles, isLoading, error, filters } = useFilteredVehicles()
    const { data: stats } = useVehiclesStats()
    const deleteVehicleMutation = useDeleteVehicle()
    const limite = useLimiteVehiculos()

    const handleCreateVehicle = () => {
        if (limite.alcanzado) return
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
            <PageHeader
                title="Gestión de Vehículos"
                subtitle="Administra la flota de vehículos y su estado de mantenimiento"
                badge="Flota"
                icon={Truck}
                iconColor="text-green-600"
                iconBg="bg-green-100 dark:bg-green-900/30"
                action={
                    <div className="flex items-center gap-3">
                        {!limite.ilimitado && (
                            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                                limite.alcanzado
                                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                            }`}>
                                {limite.actual}/{limite.maximo} vehículos
                            </span>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={startTutorial}
                            className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                            <HelpCircle className="h-4 w-4" />
                            Ver tutorial
                        </Button>
                        <Button
                            id="vehiculos-new-btn"
                            onClick={handleCreateVehicle}
                            disabled={limite.alcanzado}
                            title={limite.alcanzado ? `Límite del plan alcanzado (${limite.actual}/${limite.maximo})` : undefined}
                            className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {limite.alcanzado ? <Lock className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                            Nuevo Vehículo
                        </Button>
                    </div>
                }
            />
           

            {/* Estadísticas */}
            <div id="vehiculos-stats" className="mb-8">
                <VehiculoStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <div id="vehiculos-filters">
                        <VehiculoFilters  />
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
                        <div id="vehiculos-table">
                            <VehiculosTable
                                vehicles={vehicles}
                                onEdit={handleEditVehicle}
                                onDelete={(vehicleId) => deleteVehicleMutation.mutate(vehicleId)}
                                isDeleting={deleteVehicleMutation.isPending}
                            />
                        </div>
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
