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
import { Plus, Search, Eye, Edit, Truck, Receipt, Calendar, DollarSign, Loader2, X } from "lucide-react"
import Link from "next/link"
import EditImpuestoModal from "@/components/EditImpuestoModal"

// Importar los hooks y store
import { useDeleteImpuesto, useFilteredImpuestos, useImpuestosStats, useImpuestoFilterOptions } from "@/hooks/use-impuestos-vehiculares"
import { useImpuestoStore } from "@/store/impuesto-vehicular-store"
import { ImpuestoVehicular } from "@/types/impuesto-vehicular-types"

export default function ImpuestosVehicularesPage() {
    const [editingImpuesto, setEditingImpuesto] = useState<ImpuestoVehicular | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks de React Query y Zustand
    const { impuestos, isLoading, error, filters } = useFilteredImpuestos()
    const { setFilters, clearFilters } = useImpuestoStore()
    const { data: stats } = useImpuestosStats()
    const filterOptions = useImpuestoFilterOptions()
    const deleteImpuestoMutation = useDeleteImpuesto()

    const getEstadoPagoBadge = (estado: string) => {
        const estadoConfig = {
            'pagado': { color: 'bg-green-100 text-green-800', icon: '✅' },
            'pendiente': { color: 'bg-yellow-100 text-yellow-800', icon: '⏳' },
            'vencido': { color: 'bg-red-100 text-red-800', icon: '❌' }
        }

        const config = estadoConfig[estado as keyof typeof estadoConfig] || { color: 'bg-gray-100 text-gray-800', icon: '❓' }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </span>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX')
    }

    const handleCreateImpuesto = () => {
        setEditingImpuesto(null)
        setIsEditModalOpen(true)
    }

    const handleEditImpuesto = (impuesto: ImpuestoVehicular) => {
        setEditingImpuesto(impuesto)
        setIsEditModalOpen(true)
    }

    const handleSaveImpuesto = (savedImpuesto: ImpuestoVehicular) => {
        console.log('Impuesto guardado recibido en page:', savedImpuesto)
        setIsEditModalOpen(false)
        setEditingImpuesto(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingImpuesto(null)
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
                            <Receipt className="h-8 w-8 text-indigo-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Impuestos Vehiculares</h1>
                        </div>
                        <Button onClick={handleCreateImpuesto}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Impuesto
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Impuestos</CardTitle>
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
                                <CardTitle className="text-sm font-medium">Pagados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.pagados || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.pendientes || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        formatCurrency(stats?.total_pagado || 0)
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Gestión de Impuestos Vehiculares</CardTitle>
                                    <CardDescription>Administra los impuestos y contribuciones de la flota vehicular</CardDescription>
                                </div>

                                {/* Filtros y búsqueda */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                        <Input
                                            placeholder="Buscar impuestos..."
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
                                            <SelectValue placeholder="Placa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las placas</SelectItem>
                                            {filterOptions.placas.map((placa) => (
                                                <SelectItem key={placa} value={placa}>{placa}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={filters.estado_pago || "all"}
                                        onValueChange={(value) =>
                                            setFilters({ estado_pago: value === "all" ? undefined : value })
                                        }
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los estados</SelectItem>
                                            {filterOptions.estados.map((estado) => (
                                                <SelectItem key={estado} value={estado}>
                                                    {estado.charAt(0).toUpperCase() + estado.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {(filters.searchTerm || filters.placa_vehiculo || filters.estado_pago) && (
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
                                    <span className="ml-2">Cargando impuestos...</span>
                                </div>
                            ) : (
                                <>
                                    {impuestos.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No se encontraron impuestos
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {filters.searchTerm || filters.placa_vehiculo || filters.estado_pago
                                                    ? "Intenta ajustar los filtros de búsqueda"
                                                    : "Comienza agregando tu primer impuesto vehicular"
                                                }
                                            </p>
                                            {!(filters.searchTerm || filters.placa_vehiculo || filters.estado_pago) && (
                                                <Button onClick={handleCreateImpuesto}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agregar Impuesto
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-20">ID</TableHead>
                                                        <TableHead>Placa Vehículo</TableHead>
                                                        <TableHead>Tipo Impuesto</TableHead>
                                                        <TableHead>Año Impuesto</TableHead>
                                                        <TableHead>Impuesto ($)</TableHead>
                                                        <TableHead>Fecha de Pago</TableHead>
                                                        <TableHead>Estado</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {impuestos.map((impuesto) => (
                                                        <TableRow key={impuesto.id}>
                                                            <TableCell className="font-medium">{impuesto.id}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Truck className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-mono font-semibold">{impuesto.placa_vehiculo}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{impuesto.tipo_impuesto}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    <span>{impuesto.anio_impuesto}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-semibold">{formatCurrency(impuesto.impuesto_monto)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    <span>{formatDate(impuesto.fecha_pago)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{getEstadoPagoBadge(impuesto.estado_pago)}</TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-1">
                                                                    <Button variant="outline" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEditImpuesto(impuesto)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (window.confirm("¿Seguro que deseas eliminar este impuesto?")) {
                                                                                deleteImpuestoMutation.mutate(impuesto.id)
                                                                            }
                                                                        }}
                                                                        disabled={deleteImpuestoMutation.isPending}
                                                                    >
                                                                        {deleteImpuestoMutation.isPending ? (
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
                    <EditImpuestoModal
                        impuesto={editingImpuesto}
                        onSave={handleSaveImpuesto}
                        onClose={handleCloseModal}
                        isOpen={isEditModalOpen}
                    />
                )}
            </main>
        </div>
    )
}