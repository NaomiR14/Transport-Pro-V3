"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { SeguroFormModal } from "@/features/seguros"
import {
    useDeleteSeguro,
    useFilteredSeguros,
    useSegurosStats,
    type SeguroVehiculo
} from "@/features/seguros"
import { SeguroStats } from "@/features/seguros/components/SeguroStats"
import { SeguroFilters } from "@/features/seguros/components/SeguroFilters"
import { SeguroTable } from "@/features/seguros/components/SeguroTable"

export default function SegurosPage() {
    const [editingSeguro, setEditingSeguro] = useState<SeguroVehiculo | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { seguros, isLoading, error } = useFilteredSeguros()
    const { data: stats } = useSegurosStats()
    const deleteSeguroMutation = useDeleteSeguro()

    const handleCreateSeguro = () => {
        setEditingSeguro(null)
        setIsEditModalOpen(true)
    }

    const handleEditSeguro = (seguro: SeguroVehiculo) => {
        setEditingSeguro(seguro)
        setIsEditModalOpen(true)
    }

    const handleSaveSeguro = (savedSeguro: SeguroVehiculo) => {
        setIsEditModalOpen(false)
        setEditingSeguro(null)
    }

    const handleDeleteSeguro = (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este seguro?')) {
            deleteSeguroMutation.mutate(id)
        }
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingSeguro(null)
    }

    if (error) {
        return (
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Seguros
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
                        Gestión de Seguros
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Administra las pólizas de seguro de la flota vehicular
                    </p>
                </div>
                <Button 
                    onClick={handleCreateSeguro} 
                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nuevo Seguro
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
                <SeguroStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <SeguroFilters />

                    {/* Table */}
                    <SeguroTable 
                        seguros={seguros}
                        loading={isLoading}
                        onEdit={handleEditSeguro}
                        onDelete={handleDeleteSeguro}
                        isDeleting={deleteSeguroMutation.isPending}
                    />
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <SeguroFormModal
                    seguro={editingSeguro}
                    onSave={handleSaveSeguro}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
