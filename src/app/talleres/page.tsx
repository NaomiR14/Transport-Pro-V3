"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { TallerFormModal } from "@/features/talleres"
import {
    useDeleteTaller,
    useFilteredTalleres,
    useTalleresStats,
    type Taller
} from "@/features/talleres"
import { TallerStats } from "@/features/talleres/components/TallerStats"
import { TallerFilters } from "@/features/talleres/components/TallerFilters"
import { TallerTable } from "@/features/talleres/components/TallerTable"


export default function TalleresPage() {
    const [editingTaller, setEditingTaller] = useState<Taller | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { talleres, isLoading, error } = useFilteredTalleres()
    const { data: stats } = useTalleresStats()
    const deleteTallerMutation = useDeleteTaller()

    const handleCreateTaller = () => {
        setEditingTaller(null)
        setIsEditModalOpen(true)
    }

    const handleEditTaller = (taller: Taller) => {
        setEditingTaller(taller)
        setIsEditModalOpen(true)
    }

    const handleSaveTaller = (savedTaller: Taller) => {
        setIsEditModalOpen(false)
        setEditingTaller(null)
    }

    const handleDeleteTaller = (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este taller?')) {
            deleteTallerMutation.mutate(id)
        }
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingTaller(null)
    }

    if (error) {
        return (
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Talleres
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
                        Gestión de Talleres
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Administra los talleres de mantenimiento y servicios automotrices
                    </p>
                </div>
                <Button 
                    onClick={handleCreateTaller} 
                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Taller
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
                <TallerStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <TallerFilters />

                    {/* Table */}
                    <TallerTable 
                        talleres={talleres}
                        loading={isLoading}
                        onEdit={handleEditTaller}
                        onDelete={handleDeleteTaller}
                        isDeleting={deleteTallerMutation.isPending}
                    />
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <TallerFormModal
                    taller={editingTaller}
                    onSave={handleSaveTaller}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
