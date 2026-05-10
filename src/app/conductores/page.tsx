"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User, Loader2, Users, Lock, HelpCircle } from "lucide-react"
import { PageHeader } from '@/shared/components/common/PageHeader'

// Importar desde features
import {
  ConductorFiltersComponent,
  ConductorFormModal,
  ConductorTable,
  useDeleteConductor,
  useFilteredConductores,
  useConductoresStats,
  useLimiteConductores,
  type Conductor
} from "@/features/conductores"
import { ConductoresStats } from "@/features/conductores/components/ConductorStats"
import { useConductoresTutorial } from "@/features/conductores"

export default function ConductoresPage() {
    const [editingConductor, setEditingConductor] = useState<Conductor | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    const { conductores, isLoading, error, filters } = useFilteredConductores()
    const { data: stats } = useConductoresStats()
    const deleteConductorMutation = useDeleteConductor()
    const limite = useLimiteConductores()
    const { startTutorial } = useConductoresTutorial()

    const handleCreateConductor = () => {
        if (limite.alcanzado) return
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
            <PageHeader
                title="Gestión de Conductores"
                subtitle="Administra la información de los conductores de la flota"
                icon={Users}
                iconColor="text-purple-600"
                iconBg="bg-purple-100 dark:bg-purple-900/30"
                action={
                    <div className="flex items-center gap-3">
                        {!limite.ilimitado && (
                            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                                limite.alcanzado
                                    ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                            }`}>
                                {limite.actual}/{limite.maximo} conductores
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
                            id="conductores-new-btn"
                            onClick={handleCreateConductor}
                            disabled={limite.alcanzado}
                            title={limite.alcanzado ? `Límite del plan alcanzado (${limite.actual}/${limite.maximo})` : undefined}
                            className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {limite.alcanzado ? <Lock className="h-5 w-5 mr-2" /> : <Plus className="h-5 w-5 mr-2" />}
                            Nuevo Conductor
                        </Button>
                    </div>
                }
            />

            {/* Estadísticas */}
            <div id="conductores-stats" className="mb-8">
                <ConductoresStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <div id="conductores-filters">
                        <ConductorFiltersComponent />
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
                        <div id="conductores-table">
                            <ConductorTable
                                conductores={conductores}
                                onEdit={handleEditConductor}
                                onDelete={(conductorId) => deleteConductorMutation.mutate(conductorId)}
                                isDeleting={deleteConductorMutation.isPending}
                            />
                        </div>
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