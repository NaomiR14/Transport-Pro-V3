"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MantenimientoFormModal } from "@/features/mantenimiento"
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
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Mantenimiento de Vehículos
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Administra el mantenimiento preventivo y correctivo de la flota
                    </p>
                </div>
                <Button 
                    onClick={handleCreateMantenimiento} 
                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Mantenimiento
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
                <MantenimientoStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <MantenimientoFilters />

                    {/* Table */}
                    <MantenimientoTable 
                        mantenimientos={mantenimientos}
                        loading={isLoading}
                        onEdit={handleEditMantenimiento}
                    />
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <MantenimientoFormModal
                    mantenimiento={selectedMantenimiento}
                    onClose={handleCloseModal}
                    onSubmit={handleSaveMantenimiento}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
