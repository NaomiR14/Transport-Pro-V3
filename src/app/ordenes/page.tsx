"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Package, X } from "lucide-react"
import { PageHeader } from '@/shared/components/common/PageHeader'
import {
    OrdenFormModal,
    OrdenesTable,
    OrdenesStats,
    useDeleteOrden,
    useFilteredOrdenes,
    useOrdenesStats,
    useOrdenFilterOptions,
    useOrdenStore,
    type Orden,
} from "@/features/ordenes"

export default function OrdenesPage() {
    const [editingOrden, setEditingOrden] = useState<Orden | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Hooks de React Query y Zustand
    const { ordenes, isLoading, error, filters } = useFilteredOrdenes()
    const { setFilters, clearFilters } = useOrdenStore()
    const { data: stats } = useOrdenesStats()
    const filterOptions = useOrdenFilterOptions()
    const deleteOrdenMutation = useDeleteOrden()

    // Verificar si hay filtros activos
    const hasActiveFilters = !!(filters.searchTerm || filters.estado || filters.placa_vehiculo)

    const handleCreateOrden = () => {
        setEditingOrden(null)
        setIsEditModalOpen(true)
    }

    const handleEditOrden = (orden: Orden) => {
        setEditingOrden(orden)
        setIsEditModalOpen(true)
    }

    const handleSaveOrden = () => {
        setIsEditModalOpen(false)
        setEditingOrden(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingOrden(null)
    }

    if (error) {
        return (
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Órdenes
                    </h1>
                </div>
                <Card className="w-full max-w-md mx-auto border-border-light dark:border-border-dark">
                    <CardContent className="pt-6">
                        <p className="text-error-text mb-4">{error}</p>
                        <Button
                            className="w-full bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
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
                title="Gestión de Órdenes"
                subtitle="Administra las órdenes de transporte, asigna rutas y realiza seguimiento de entregas"
                badge="Órdenes"
                icon={Package}
                iconColor="text-orange-600"
                iconBg="bg-orange-100 dark:bg-orange-900/30"
                action={
                    <Button onClick={handleCreateOrden} className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                        <Plus className="h-5 w-5 mr-2" />
                        Nueva Orden
                    </Button>
                }
            />

            {/* Estadísticas */}
            <div className="mb-8">
                <OrdenesStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                                <Input
                                    placeholder="Buscar órdenes..."
                                    value={filters.searchTerm || ''}
                                    onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                    className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
                                />
                            </div>

                            {/* Filtro por estado */}
                            <Select
                                value={filters.estado || "all"}
                                onValueChange={(value) =>
                                    setFilters({ estado: value === "all" ? undefined : value as any })
                                }
                            >
                                <SelectTrigger className="w-44 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="pendiente">Pendiente</SelectItem>
                                    <SelectItem value="transito">En Tránsito</SelectItem>
                                    <SelectItem value="entregado">Entregado</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filtro por vehículo */}
                            <Select
                                value={filters.placa_vehiculo || "all"}
                                onValueChange={(value) =>
                                    setFilters({ placa_vehiculo: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Vehículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los vehículos</SelectItem>
                                    {filterOptions.placas.map((placa) => (
                                        <SelectItem key={placa} value={placa}>{placa}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    size="sm"
                                    className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tabla de Órdenes */}
                    <OrdenesTable
                        ordenes={ordenes}
                        loading={isLoading}
                        onEdit={handleEditOrden}
                        onDelete={(ordenId) => deleteOrdenMutation.mutate(ordenId)}
                        isDeleting={deleteOrdenMutation.isPending}
                    />
                </CardContent>
            </Card>

            {/* Modal */}
            {isEditModalOpen && (
                <OrdenFormModal
                    orden={editingOrden}
                    onSave={handleSaveOrden}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}
