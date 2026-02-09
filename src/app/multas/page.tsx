"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MultaFormModal } from "@/features/multas"
import {
    useFilteredMultasConductores,
    useCreateMultaConductor,
    useUpdateMultaConductor,
    useDeleteMultaConductor,
    useMultasStats,
    useMultasStore,
    type MultaConductor
} from "@/features/multas"
import { MultasStats } from "@/features/multas/components/MultasStats"
import { MultasFilters } from "@/features/multas/components/MultasFilters"
import { MultasTable } from "@/features/multas/components/MultasTable"

export default function MultasConductoresPage() {
    const [editingMulta, setEditingMulta] = useState<MultaConductor | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { multas, isLoading, error } = useFilteredMultasConductores()
    const { clearFilters } = useMultasStore()
    const { data: stats } = useMultasStats()
    const createMultaMutation = useCreateMultaConductor()
    const updateMultaMutation = useUpdateMultaConductor()
    const deleteMultaMutation = useDeleteMultaConductor()

    const handleCreateMulta = () => {
        setEditingMulta(null)
        setIsEditModalOpen(true)
    }

    const handleEditMulta = (multa: MultaConductor) => {
        setEditingMulta(multa)
        setIsEditModalOpen(true)
    }

    const handleSaveMulta = (savedMulta: MultaConductor) => {
        setIsEditModalOpen(false)
        setEditingMulta(null)
    }

    const handleDeleteMulta = (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta multa?')) {
            deleteMultaMutation.mutate(id)
        }
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingMulta(null)
    }


    if (error) {
        return (
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Multas de Conductores
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
                        Gestión de Multas de Conductores
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-2">
                        Administra las multas e infracciones de tránsito de los conductores, realiza pagos y lleva un control detallado de cada caso.
                    </p>
                </div>
                <Button 
                    onClick={handleCreateMulta} 
                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Multa
                </Button>
            </div>

            {/* Estadísticas */}
            <div className="mb-8">
                <MultasStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <MultasFilters />

                    {/* Table */}
                    <MultasTable 
                        multas={multas}
                        loading={isLoading}
                        onEdit={handleEditMulta}
                        onDelete={handleDeleteMulta}
                        isDeleting={deleteMultaMutation.isPending}
                    />
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <MultaFormModal
                    multa={editingMulta}
                    onSave={handleSaveMulta}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
