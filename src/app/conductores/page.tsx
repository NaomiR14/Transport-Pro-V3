"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User, Loader2 } from "lucide-react"

// Importar desde features
import {
  ConductorFiltersComponent,
  ConductorFormModal,
  ConductorTable,
  useDeleteConductor,
  useFilteredConductores,
  useConductoresStats,
  type Conductor
} from "@/features/conductores"
import { ConductoresStats } from "@/features/conductores/components/ConductorStats"

export default function ConductoresPage() {
    const [editingConductor, setEditingConductor] = useState<Conductor | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { conductores, isLoading, error, filters } = useFilteredConductores()
    const { data: stats } = useConductoresStats()
    const deleteConductorMutation = useDeleteConductor()

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
                    {/* Filters */}
                    <ConductorFiltersComponent />

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
                        <ConductorTable
                            conductores={conductores}
                            onEdit={handleEditConductor}
                            onDelete={(conductorId) => deleteConductorMutation.mutate(conductorId)}
                            isDeleting={deleteConductorMutation.isPending}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <ConductorFormModal
                    conductor={editingConductor}
                    onSave={handleSaveConductor}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}