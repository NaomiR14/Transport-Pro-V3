"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Receipt } from "lucide-react"
import { PageHeader } from '@/shared/components/common/PageHeader'
import { ImpuestoFormModal } from "@/features/impuestos"
import {
    useDeleteImpuesto,
    useFilteredImpuestos,
    useImpuestosStats,
    type ImpuestoVehicular
} from "@/features/impuestos"
import { ImpuestoStats } from "@/features/impuestos/components/ImpuestoStats"
import { ImpuestoFilters } from "@/features/impuestos/components/ImpuestoFilters"
import { ImpuestoTable } from "@/features/impuestos/components/ImpuestoTable"

export default function ImpuestosVehicularesPage() {
    const [editingImpuesto, setEditingImpuesto] = useState<ImpuestoVehicular | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks del feature
    const { impuestos, isLoading, error } = useFilteredImpuestos()
    const { data: stats } = useImpuestosStats()
    const deleteImpuestoMutation = useDeleteImpuesto()

    const handleCreateImpuesto = () => {
        setEditingImpuesto(null)
        setIsEditModalOpen(true)
    }

    const handleEditImpuesto = (impuesto: ImpuestoVehicular) => {
        setEditingImpuesto(impuesto)
        setIsEditModalOpen(true)
    }

    const handleSaveImpuesto = (savedImpuesto: ImpuestoVehicular) => {
        setIsEditModalOpen(false)
        setEditingImpuesto(null)
    }

    const handleDeleteImpuesto = (id: string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este impuesto?')) {
            deleteImpuestoMutation.mutate(id)
        }
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingImpuesto(null)
    }

    if (error) {
        return (
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Impuestos Vehiculares
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
                title="Impuestos Vehiculares"
                subtitle="Administra los impuestos y contribuciones de la flota vehicular"
                badge="Impuestos"
                icon={Receipt}
                iconColor="text-purple-600"
                iconBg="bg-purple-100 dark:bg-purple-900/30"
                action={
                    <Button onClick={handleCreateImpuesto} className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                        <Plus className="h-5 w-5 mr-2" />
                        Nuevo Impuesto
                    </Button>
                }
            />

            {/* Estadísticas */}
            <div className="mb-8">
                <ImpuestoStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <ImpuestoFilters />

                    {/* Table */}
                    <ImpuestoTable 
                        impuestos={impuestos}
                        loading={isLoading}
                        onEdit={handleEditImpuesto}
                        onDelete={handleDeleteImpuesto}
                        isDeleting={deleteImpuestoMutation.isPending}
                    />
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <ImpuestoFormModal
                    impuesto={editingImpuesto}
                    onSave={handleSaveImpuesto}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
