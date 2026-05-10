"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Wrench, HelpCircle } from "lucide-react"
import { PageHeader } from '@/shared/components/common/PageHeader'
import { MantenimientoFormModal, useMantenimientoTutorial } from "@/features/mantenimiento"
import {
    useFilteredMantenimientos,
    type MantenimientoVehiculo
} from "@/features/mantenimiento"
import { MantenimientoStats } from "@/features/mantenimiento/components/MantenimientoStats"
import { MantenimientoFilters } from "@/features/mantenimiento/components/MantenimientoFilters"
import { MantenimientoTable } from "@/features/mantenimiento/components/MantenimientoTable"

export default function MantenimientoVehiculosPage() {
    const [selectedMantenimiento, setSelectedMantenimiento] = useState<MantenimientoVehiculo | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { mantenimientos, stats, isLoading } = useFilteredMantenimientos()
    const { startTutorial } = useMantenimientoTutorial()

    const handleCreateMantenimiento = () => {
        setSelectedMantenimiento(null)
        setIsEditModalOpen(true)
    }

    const handleEditMantenimiento = (mantenimiento: MantenimientoVehiculo) => {
        setSelectedMantenimiento(mantenimiento)
        setIsEditModalOpen(true)
    }

    const handleSaveMantenimiento = (data: any) => {
        // The form data is handled by the modal's internal logic
        setIsEditModalOpen(false)
        setSelectedMantenimiento(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setSelectedMantenimiento(null)
    }

    return (
        <div className="p-6 container-padding">
            <PageHeader
                title="Mantenimiento de Vehículos"
                subtitle="Administra el mantenimiento preventivo y correctivo de la flota"
                badge="Mantenimiento"
                icon={Wrench}
                iconColor="text-teal-600"
                iconBg="bg-teal-100 dark:bg-teal-900/30"
                action={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={startTutorial}
                            className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        >
                            <HelpCircle className="h-4 w-4" />
                            Ver tutorial
                        </Button>
                        <Button id="mantenimiento-new-btn" onClick={handleCreateMantenimiento} className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                            <Plus className="h-5 w-5 mr-2" />
                            Nuevo Mantenimiento
                        </Button>
                    </div>
                }
            />

            {/* Estadísticas */}
            <div id="mantenimiento-stats" className="mb-8">
                <MantenimientoStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <div id="mantenimiento-filters">
                        <MantenimientoFilters />
                    </div>

                    {/* Table */}
                    <div id="mantenimiento-table">
                        <MantenimientoTable
                            mantenimientos={mantenimientos}
                            loading={isLoading}
                            onEdit={handleEditMantenimiento}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <MantenimientoFormModal
                    mantenimiento={selectedMantenimiento}
                    onClose={handleCloseModal}
                    onSave={handleSaveMantenimiento}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
