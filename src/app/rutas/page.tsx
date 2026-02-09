"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Eye, Edit, Truck, Map, Calendar, User, Fuel, Loader2, X, BarChart3, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RutaViajeFormModal as EditRutaViajeModal } from "@/features/rutas"

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

// Componente para mostrar detalles de la ruta
function RutaDetailsModal({ ruta, isOpen, onClose }: { ruta: RutaViaje | null, isOpen: boolean, onClose: () => void }) {
    if (!isOpen || !ruta) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Detalles de Ruta #{ruta.id}
                    </h3>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClose}
                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información Básica */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                                Información de la Ruta
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Vehículo:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.placa_vehiculo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Conductor:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.conductor}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Ruta:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.origen} → {ruta.destino}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Fechas:</span>
                                    <span className="text-slate-900 dark:text-white">
                                        {new Date(ruta.fecha_salida).toLocaleDateString()} - {new Date(ruta.fecha_llegada).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Kilometraje */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                                Kilometraje
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Inicial:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.kms_inicial.toLocaleString()} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Final:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.kms_final.toLocaleString()} km</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Recorrido:</span>
                                    <span className="font-semibold text-primary-blue">{ruta.kms_recorridos.toLocaleString()} km</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Carga e Ingresos */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                                Carga e Ingresos
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Peso Carga:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.peso_carga_kg.toLocaleString()} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Costo por KG:</span>
                                    <span className="text-slate-900 dark:text-white">${ruta.costo_por_kg.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Ingreso Total:</span>
                                    <span className="font-semibold text-success-text">${ruta.ingreso_total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Ingreso por KM:</span>
                                    <span className="text-slate-900 dark:text-white">${ruta.ingreso_por_km.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Combustible */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                                Combustible
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Estación:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.estacion_combustible}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Tipo:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.tipo_combustible}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Precio Galón:</span>
                                    <span className="text-slate-900 dark:text-white">${ruta.precio_por_galon.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Volumen:</span>
                                    <span className="text-slate-900 dark:text-white">{ruta.volumen_combustible_gal.toFixed(1)} gal</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Rendimiento:</span>
                                    <span className="font-semibold text-primary-blue">{ruta.recorrido_por_galon.toFixed(1)} km/gal</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Gastos */}
                    <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                                Gastos
                            </h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Combustible:</span>
                                    <span className="text-slate-900 dark:text-white">${ruta.total_combustible.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Peajes:</span>
                                    <span className="text-slate-900 dark:text-white">${ruta.gasto_peajes.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Comidas:</span>
                                    <span className="text-slate-900 dark:text-white">${ruta.gasto_comidas.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Otros:</span>
                                    <span className="text-slate-900 dark:text-white">${ruta.otros_gastos.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Total Gastos:</span>
                                    <span className="font-semibold text-error-text">${ruta.gasto_total.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resumen Financiero */}
                    <Card className="border-slate-200 dark:border-slate-800 md:col-span-2">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                                Resumen Financiero
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ingresos</p>
                                    <p className="text-xl font-semibold text-success-text">
                                        ${ruta.ingreso_total.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Gastos</p>
                                    <p className="text-xl font-semibold text-error-text">
                                        ${ruta.gasto_total.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ganancia Neta</p>
                                    <p className={`text-xl font-semibold ${
                                        ruta.ingreso_total - ruta.gasto_total >= 0 
                                            ? 'text-success-text' 
                                            : 'text-error-text'
                                    }`}>
                                        ${(ruta.ingreso_total - ruta.gasto_total).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {ruta.observaciones && (
                    <Card className="mt-6 border-slate-200 dark:border-slate-800">
                        <CardContent className="pt-6">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Observaciones</h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300">{ruta.observaciones}</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default function RutasViajePage() {
    const [editingRuta, setEditingRuta] = useState<RutaViaje | null>(null)
    const [viewingRuta, setViewingRuta] = useState<RutaViaje | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    // Usar los hooks de React Query y Zustand
    const { rutas, isLoading, error, filters } = useFilteredRutas()
    const { setFilters, clearFilters } = useRutaViajeStore()
    const { data: stats } = useRutasStats()
    const filterOptions = useRutaFilterOptions()
    const deleteRutaMutation = useDeleteRuta()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX')
    }

    const getEstadoVehiculoBadge = (estado: string | null | undefined) => {
        if (!estado) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    ❓ Desconocido
                </span>
            )
        }

        const estadoConfig = {
            'activo': { 
                color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', 
                icon: '✅' 
            },
            'inactivo': { 
                color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', 
                icon: '⏸️' 
            },
            'mantenimiento': { 
                color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', 
                icon: '🔧' 
            }
        }

        const config = estadoConfig[estado as keyof typeof estadoConfig] || { 
            color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', 
            icon: '❓' 
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </span>
        )
    }

    const handleCreateRuta = () => {
        setEditingRuta(null)
        setIsEditModalOpen(true)
    }

    const handleEditRuta = (ruta: RutaViaje) => {
        setEditingRuta(ruta)
        setIsEditModalOpen(true)
    }

    const handleViewRuta = (ruta: RutaViaje) => {
        setViewingRuta(ruta)
        setIsViewModalOpen(true)
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

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false)
        setViewingRuta(null)
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
            {/* Page Header */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <div className="flex items-center mb-2">
                        <Map className="h-8 w-8 text-primary-blue mr-3" />
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Gestión de Rutas de Viaje
                        </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                        Administra la información de las rutas de viaje, ingresos, gastos y rendimiento de tu flota
                    </p>
                </div>
                <Button 
                    onClick={handleCreateRuta} 
                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Nueva Ruta
                </Button>
            </div>
            
            {/* Estadísticas */}
            <div className="mb-8">
                <RutaViajesStats stats={stats} loading={isLoading} />
            </div>

            {/* Main Card */}
            <Card className="hover:shadow-lg transition-shadow duration-200 border border-slate-200 dark:border-slate-800 bg-card dark:bg-card-dark">
                <CardContent className="pt-6">
                    {/* Filters and Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
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
                                <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                                    <SelectValue placeholder="Conductor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los conductores</SelectItem>
                                    {filterOptions.conductores.map((conductor) => (
                                        <SelectItem key={conductor} value={conductor}>{conductor}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Clear Filters */}
                            {(filters.searchTerm || filters.placa_vehiculo || filters.conductor || filters.fecha_desde || filters.fecha_hasta) && (
                                <Button 
                                    variant="outline" 
                                    onClick={clearFilters}
                                    className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                    </div>
                        
                    {/* Table */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
                            <span className="ml-3 text-slate-600 dark:text-slate-400">
                                Cargando rutas...
                            </span>
                        </div>
                    ) : rutas.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <Map className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                No se encontraron rutas de viaje
                            </h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                                {filters.searchTerm || filters.placa_vehiculo || filters.conductor || filters.fecha_desde || filters.fecha_hasta
                                    ? "Intenta ajustar los filtros de búsqueda"
                                    : "Comienza agregando tu primera ruta de viaje"
                                }
                            </p>
                            {!(filters.searchTerm || filters.placa_vehiculo || filters.conductor || filters.fecha_desde || filters.fecha_hasta) && (
                                <Button 
                                    onClick={handleCreateRuta} 
                                    className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Agregar Ruta
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                    <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-20">ID</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Fechas</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Vehículo</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Conductor</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Ruta</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kilometraje</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Carga</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Ingresos</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Combustible</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Gastos</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Rendimiento</TableHead>
                                        <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rutas.map((ruta) => (
                                        <TableRow 
                                            key={ruta.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
                                        >
                                            <TableCell className="font-medium text-slate-900 dark:text-white">{ruta.id}</TableCell>
        
                                            {/* Fechas */}
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-slate-900 dark:text-white">
                                                        <Calendar className="h-3 w-3 mr-1 text-slate-500 dark:text-slate-400" />
                                                        {formatDate(ruta.fecha_salida)}
                                                    </div>
                                                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                                        <Calendar className="h-3 w-3 mr-1 text-slate-400 dark:text-slate-500" />
                                                        {formatDate(ruta.fecha_llegada)}
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Vehículo */}
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <div className="flex items-center">
                                                        <Truck className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
                                                        <span className="font-mono text-sm text-slate-900 dark:text-white">
                                                            {ruta.placa_vehiculo}
                                                        </span>
                                                    </div>
                                                    {getEstadoVehiculoBadge(ruta.estado_vehiculo)}
                                                </div>
                                            </TableCell>
        
                                            {/* Conductor */}
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <User className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
                                                    <span className="text-sm text-slate-900 dark:text-white">
                                                        {ruta.conductor}
                                                    </span>
                                                </div>
                                            </TableCell>
        
                                            {/* Ruta */}
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {ruta.origen}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        → {ruta.destino}
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Kilometraje */}
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        Ini: {ruta.kms_inicial.toLocaleString()}
                                                    </div>
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        Fin: {ruta.kms_final.toLocaleString()}
                                                    </div>
                                                    <div className="font-semibold text-primary-blue">
                                                        Rec: {ruta.kms_recorridos.toLocaleString()}
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Carga */}
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="text-slate-900 dark:text-white">
                                                        {ruta.peso_carga_kg.toLocaleString()} kg
                                                    </div>
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        ${ruta.costo_por_kg}/kg
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Ingresos */}
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-semibold text-success-text">
                                                        {formatCurrency(ruta.ingreso_total)}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                                        ${ruta.ingreso_por_km.toFixed(2)}/km
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Combustible */}
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center text-slate-900 dark:text-white">
                                                        <Fuel className="h-3 w-3 mr-1 text-slate-500 dark:text-slate-400" />
                                                        {ruta.estacion_combustible}
                                                    </div>
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        {ruta.tipo_combustible}
                                                    </div>
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        ${ruta.precio_por_galon}/gal
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Gastos */}
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        Comb: {formatCurrency(ruta.total_combustible)}
                                                    </div>
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        Peajes: {formatCurrency(ruta.gasto_peajes)}
                                                    </div>
                                                    <div className="font-semibold text-error-text">
                                                        Total: {formatCurrency(ruta.gasto_total)}
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Rendimiento */}
                                            <TableCell>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center text-primary-blue">
                                                        <BarChart3 className="h-3 w-3 mr-1 text-primary-blue" />
                                                        {ruta.recorrido_por_galon.toFixed(1)} km/gal
                                                    </div>
                                                    <div className="text-slate-700 dark:text-slate-300">
                                                        Vol: {ruta.volumen_combustible_gal.toFixed(1)} gal
                                                    </div>
                                                </div>
                                            </TableCell>
        
                                            {/* Acciones */}
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleViewRuta(ruta)}
                                                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditRuta(ruta)}
                                                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (window.confirm("¿Seguro que deseas eliminar esta ruta?")) {
                                                                deleteRutaMutation.mutate(ruta.id)
                                                            }
                                                        }}
                                                        disabled={deleteRutaMutation.isPending}
                                                        className="h-8 w-8 p-0 hover:bg-error-bg dark:hover:bg-error-bg/20"
                                                    >
                                                        {deleteRutaMutation.isPending ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <X className="h-4 w-4 text-error-text dark:text-error-text" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
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

            {isViewModalOpen && (
                <RutaDetailsModal
                    ruta={viewingRuta}
                    isOpen={isViewModalOpen}
                    onClose={handleCloseViewModal}
                />
            )}
        </div>
    )
}