"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Plus, Search, Eye, Edit, Truck, Map, Calendar, User, Fuel, Loader2, X, BarChart3 } from "lucide-react"
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

// Componente para mostrar detalles de la ruta
function RutaDetailsModal({ ruta, isOpen, onClose }: { ruta: RutaViaje | null, isOpen: boolean, onClose: () => void }) {
    if (!isOpen || !ruta) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Detalles de Ruta #{ruta.id}</h3>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información Básica */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-blue-900">Información de la Ruta</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Vehículo:</span> {ruta.placa_vehiculo}</div>
                            <div><span className="font-medium">Conductor:</span> {ruta.conductor}</div>
                            <div><span className="font-medium">Ruta:</span> {ruta.origen} → {ruta.destino}</div>
                            <div><span className="font-medium">Fechas:</span> {new Date(ruta.fecha_salida).toLocaleDateString()} - {new Date(ruta.fecha_llegada).toLocaleDateString()}</div>
                        </div>
                    </div>

                    {/* Kilometraje */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-blue-900">Kilometraje</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Inicial:</span> {ruta.kms_inicial.toLocaleString()} km</div>
                            <div><span className="font-medium">Final:</span> {ruta.kms_final.toLocaleString()} km</div>
                            <div><span className="font-medium">Recorrido:</span> {ruta.kms_recorridos.toLocaleString()} km</div>
                        </div>
                    </div>

                    {/* Carga e Ingresos */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-blue-900">Carga e Ingresos</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Peso Carga:</span> {ruta.peso_carga_kg.toLocaleString()} kg</div>
                            <div><span className="font-medium">Costo por KG:</span> ${ruta.costo_por_kg.toLocaleString()}</div>
                            <div><span className="font-medium">Ingreso Total:</span> ${ruta.ingreso_total.toLocaleString()}</div>
                            <div><span className="font-medium">Ingreso por KM:</span> ${ruta.ingreso_por_km.toFixed(2)}</div>
                        </div>
                    </div>

                    {/* Combustible */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-blue-900">Combustible</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Estación:</span> {ruta.estacion_combustible}</div>
                            <div><span className="font-medium">Tipo:</span> {ruta.tipo_combustible}</div>
                            <div><span className="font-medium">Precio Galón:</span> ${ruta.precio_por_galon.toLocaleString()}</div>
                            <div><span className="font-medium">Volumen:</span> {ruta.volumen_combustible_gal.toFixed(1)} gal</div>
                            <div><span className="font-medium">Rendimiento:</span> {ruta.recorrido_por_galon.toFixed(1)} km/gal</div>
                        </div>
                    </div>

                    {/* Gastos */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-blue-900">Gastos</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Combustible:</span> ${ruta.total_combustible.toLocaleString()}</div>
                            <div><span className="font-medium">Peajes:</span> ${ruta.gasto_peajes.toLocaleString()}</div>
                            <div><span className="font-medium">Comidas:</span> ${ruta.gasto_comidas.toLocaleString()}</div>
                            <div><span className="font-medium">Otros:</span> ${ruta.otros_gastos.toLocaleString()}</div>
                            <div><span className="font-medium">Total Gastos:</span> ${ruta.gasto_total.toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Resumen Financiero */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-blue-900">Resumen Financiero</h4>
                        <div className="space-y-2 text-sm">
                            <div><span className="font-medium">Ingresos:</span> ${ruta.ingreso_total.toLocaleString()}</div>
                            <div><span className="font-medium">Gastos:</span> ${ruta.gasto_total.toLocaleString()}</div>
                            <div><span className="font-medium">Ganancia Neta:</span>
                                <span className={`ml-2 ${ruta.ingreso_total - ruta.gasto_total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${(ruta.ingreso_total - ruta.gasto_total).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {ruta.observaciones && (
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                        <h4 className="font-semibold text-blue-900 mb-2">Observaciones</h4>
                        <p className="text-sm">{ruta.observaciones}</p>
                    </div>
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
        // Manejar valores undefined/null
        if (!estado) {
            return (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    ❓ Desconocido
                </span>
            )
        }

        const estadoConfig = {
            'activo': { color: 'bg-green-100 text-green-800', icon: '✅' },
            'inactivo': { color: 'bg-gray-100 text-gray-800', icon: '⏸️' },
            'mantenimiento': { color: 'bg-yellow-100 text-yellow-800', icon: '🔧' }
        }

        const config = estadoConfig[estado as keyof typeof estadoConfig] || { color: 'bg-gray-100 text-gray-800', icon: '❓' }

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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">{error}</p>
                        <Button
                            className="mt-4 w-full"
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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center mr-4">
                                <Truck className="h-6 w-6 text-blue-600 mr-2" />
                                <span className="text-sm text-gray-600">Volver al Dashboard</span>
                            </Link>
                            <Map className="h-8 w-8 text-indigo-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Rutas de Viaje</h1>
                        </div>
                        <Button onClick={handleCreateRuta}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Ruta
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Rutas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.total || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Ingresos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        formatCurrency(stats?.total_ingresos || 0)
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        formatCurrency(stats?.total_gastos || 0)
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Ganancia Neta</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${(stats?.ganancia_neta || 0) >= 0 ? 'text-blue-600' : 'text-red-600'
                                    }`}>
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        formatCurrency(stats?.ganancia_neta || 0)
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">KM Totales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        `${((stats?.kms_totales || 0) / 1000).toFixed(0)}K km`
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Gestión de Rutas de Viaje</CardTitle>
                                    <CardDescription>Administra los registros de rutas y viajes de la flota</CardDescription>
                                </div>

                                {/* Filtros y búsqueda */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                        <Input
                                            placeholder="Buscar rutas..."
                                            value={filters.searchTerm || ''}
                                            onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                            className="pl-10 w-64"
                                        />
                                    </div>

                                    <Select
                                        value={filters.placa_vehiculo || "all"}
                                        onValueChange={(value) =>
                                            setFilters({ placa_vehiculo: value === "all" ? undefined : value })
                                        }
                                    >
                                        <SelectTrigger className="w-40">
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
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Conductor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los conductores</SelectItem>
                                            {filterOptions.conductores.map((conductor) => (
                                                <SelectItem key={conductor} value={conductor}>{conductor}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {(filters.searchTerm || filters.placa_vehiculo || filters.conductor || filters.fecha_desde || filters.fecha_hasta) && (
                                        <Button variant="outline" onClick={clearFilters}>
                                            <X className="h-4 w-4 mr-2" />
                                            Limpiar
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                    <span className="ml-2">Cargando rutas...</span>
                                </div>
                            ) : (
                                <>
                                    {rutas.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No se encontraron rutas
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {filters.searchTerm || filters.placa_vehiculo || filters.conductor
                                                    ? "Intenta ajustar los filtros de búsqueda"
                                                    : "Comienza agregando tu primera ruta de viaje"
                                                }
                                            </p>
                                            {!(filters.searchTerm || filters.placa_vehiculo || filters.conductor) && (
                                                <Button onClick={handleCreateRuta}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agregar Ruta
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-20">ID</TableHead>
                                                        <TableHead>Fechas</TableHead>
                                                        <TableHead>Vehículo</TableHead>
                                                        <TableHead>Conductor</TableHead>
                                                        <TableHead>Ruta</TableHead>
                                                        <TableHead>Kilometraje</TableHead>
                                                        <TableHead>Carga</TableHead>
                                                        <TableHead>Ingresos</TableHead>
                                                        <TableHead>Combustible</TableHead>
                                                        <TableHead>Gastos</TableHead>
                                                        <TableHead>Rendimiento</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {rutas.map((ruta) => (
                                                        <TableRow key={ruta.id}>
                                                            <TableCell className="font-medium">{ruta.id}</TableCell>

                                                            {/* Fechas */}
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center text-sm">
                                                                        <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                                                                        {formatDate(ruta.fecha_salida)}
                                                                    </div>
                                                                    <div className="flex items-center text-sm text-gray-500">
                                                                        <Calendar className="h-3 w-3 mr-1" />
                                                                        {formatDate(ruta.fecha_llegada)}
                                                                    </div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Vehículo */}
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center">
                                                                        <Truck className="h-4 w-4 mr-1 text-gray-500" />
                                                                        <span className="font-mono text-sm">{ruta.placa_vehiculo}</span>
                                                                    </div>
                                                                    {getEstadoVehiculoBadge(ruta.estado_vehiculo)}
                                                                </div>
                                                            </TableCell>

                                                            {/* Conductor */}
                                                            <TableCell>
                                                                <div className="flex items-center">
                                                                    <User className="h-4 w-4 mr-1 text-gray-500" />
                                                                    <span className="text-sm">{ruta.conductor}</span>
                                                                </div>
                                                            </TableCell>

                                                            {/* Ruta */}
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    <div className="text-sm font-medium">{ruta.origen}</div>
                                                                    <div className="text-xs text-gray-500">→ {ruta.destino}</div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Kilometraje */}
                                                            <TableCell>
                                                                <div className="space-y-1 text-sm">
                                                                    <div>Ini: {ruta.kms_inicial.toLocaleString()}</div>
                                                                    <div>Fin: {ruta.kms_final.toLocaleString()}</div>
                                                                    <div className="font-semibold">Rec: {ruta.kms_recorridos.toLocaleString()}</div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Carga */}
                                                            <TableCell>
                                                                <div className="space-y-1 text-sm">
                                                                    <div>{ruta.peso_carga_kg.toLocaleString()} kg</div>
                                                                    <div>${ruta.costo_por_kg}/kg</div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Ingresos */}
                                                            <TableCell>
                                                                <div className="space-y-1">
                                                                    <div className="font-semibold text-green-600">
                                                                        {formatCurrency(ruta.ingreso_total)}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        ${ruta.ingreso_por_km.toFixed(2)}/km
                                                                    </div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Combustible */}
                                                            <TableCell>
                                                                <div className="space-y-1 text-sm">
                                                                    <div className="flex items-center">
                                                                        <Fuel className="h-3 w-3 mr-1" />
                                                                        {ruta.estacion_combustible}
                                                                    </div>
                                                                    <div>{ruta.tipo_combustible}</div>
                                                                    <div>${ruta.precio_por_galon}/gal</div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Gastos */}
                                                            <TableCell>
                                                                <div className="space-y-1 text-sm">
                                                                    <div>Comb: {formatCurrency(ruta.total_combustible)}</div>
                                                                    <div>Peajes: {formatCurrency(ruta.gasto_peajes)}</div>
                                                                    <div className="font-semibold">Total: {formatCurrency(ruta.gasto_total)}</div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Rendimiento */}
                                                            <TableCell>
                                                                <div className="space-y-1 text-sm">
                                                                    <div className="flex items-center">
                                                                        <BarChart3 className="h-3 w-3 mr-1" />
                                                                        {ruta.recorrido_por_galon.toFixed(1)} km/gal
                                                                    </div>
                                                                    <div>Vol: {ruta.volumen_combustible_gal.toFixed(1)} gal</div>
                                                                </div>
                                                            </TableCell>

                                                            {/* Acciones */}
                                                            <TableCell>
                                                                <div className="flex space-x-1">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleViewRuta(ruta)}
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEditRuta(ruta)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (window.confirm("¿Seguro que deseas eliminar esta ruta?")) {
                                                                                deleteRutaMutation.mutate(ruta.id)
                                                                            }
                                                                        }}
                                                                        disabled={deleteRutaMutation.isPending}
                                                                    >
                                                                        {deleteRutaMutation.isPending ? (
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                        ) : (
                                                                            <X className="h-4 w-4 text-red-600" />
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
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

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
            </main>
        </div>
    )
}