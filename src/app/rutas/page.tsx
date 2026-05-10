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
import { Plus, Search, Map, X, HelpCircle } from "lucide-react"
import { PageHeader } from '@/shared/components/common/PageHeader'
import { RutaViajeFormModal as EditRutaViajeModal, RutasTable, useRutasTutorial } from "@/features/rutas"

// Importar los hooks y store
import { 
  useDeleteRuta, 
  useFilteredRutas, 
  useRutasStats, 
  useRutaFilterOptions,
  useRutaViajeStore,
  type RutaViaje
} from "@/features/rutas"
import { RutaViajesStats } from "@/features/rutas/components/RutasStats"

export default function RutasViajePage() {
    const [editingRuta, setEditingRuta] = useState<RutaViaje | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks de React Query y Zustand
    const { rutas, isLoading, error, filters } = useFilteredRutas()
    const { setFilters, clearFilters } = useRutaViajeStore()
    const { data: stats } = useRutasStats()
    const filterOptions = useRutaFilterOptions()
    const deleteRutaMutation = useDeleteRuta()
    const { startTutorial } = useRutasTutorial()

    // Verificar si hay filtros activos
    const hasActiveFilters = !!(filters.searchTerm || filters.placa_vehiculo || filters.conductor || filters.fecha_desde || filters.fecha_hasta)

    const handleCreateRuta = () => {
        setEditingRuta(null)
        setIsEditModalOpen(true)
    }

    const handleEditRuta = (ruta: RutaViaje) => {
        setEditingRuta(ruta)
        setIsEditModalOpen(true)
    }

    const handleSaveRuta = (savedRuta: RutaViaje) => {
        console.log('Ruta guardada recibida en page:', savedRuta)
        setIsEditModalOpen(false)
        setEditingRuta(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingRuta(null)
    }

    if (error) {
        return (
            <div className="p-6 container-padding">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Gestión de Rutas de Viaje
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
                title="Gestión de Rutas de Viaje"
                subtitle="Administra la información de las rutas de viaje, ingresos, gastos y rendimiento de tu flota"
                icon={Map}
                iconColor="text-blue-600"
                iconBg="bg-blue-100 dark:bg-blue-900/30"
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
                        <Button id="rutas-new-btn" onClick={handleCreateRuta} className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 rounded-xl">
                            <Plus className="h-5 w-5 mr-2" />
                            Nueva Ruta
                        </Button>
                    </div>
                }
            />
            
            {/* Estadísticas */}
            <div id="rutas-stats" className="mb-8">
                <RutaViajesStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters and Actions */}
                    <div id="rutas-filters" className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search */}
                            <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                                <Input
                                    placeholder="Buscar rutas..."
                                    value={filters.searchTerm || ''}
                                    onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                    className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
                                />
                            </div>

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

                            <Select
                                value={filters.conductor || "all"}
                                onValueChange={(value) =>
                                    setFilters({ conductor: value === "all" ? undefined : value })
                                }
                            >
                                <SelectTrigger className="w-56 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Conductor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los conductores</SelectItem>
                                    {filterOptions.conductores.map((conductor) => (
                                        <SelectItem key={conductor.documento} value={conductor.documento}>
                                            {conductor.nombre}
                                        </SelectItem>
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
                        
                    {/* Tabla de Rutas */}
                    <div id="rutas-table">
                        <RutasTable
                            rutas={rutas}
                            loading={isLoading}
                            onEdit={handleEditRuta}
                            onDelete={(rutaId) => deleteRutaMutation.mutate(rutaId)}
                            isDeleting={deleteRutaMutation.isPending}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Modales */}
            {isEditModalOpen && (
                <EditRutaViajeModal
                    ruta={editingRuta}
                    onSave={handleSaveRuta}
                    onClose={handleCloseModal}
                    isOpen={isEditModalOpen}
                />
            )}
        </div>
    )
}