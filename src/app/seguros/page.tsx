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
import { Plus, Search, Eye, Edit, Truck, Shield, Calendar, DollarSign, Loader2, X } from "lucide-react"
import Link from "next/link"
import EditSeguroModal from "@/components/EditSeguroModal"

// Importar los hooks y store
import { useDeleteSeguro, useFilteredSeguros, useSegurosStats, useSeguroFilterOptions } from "@/hooks/use-seguros"
import { useSeguroStore } from "@/store/seguro-store"
import { SeguroVehiculo } from "@/types/seguros-types"

export default function SegurosPage() {
    const [editingSeguro, setEditingSeguro] = useState<SeguroVehiculo | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Usar los hooks de React Query y Zustand
    const { seguros, isLoading, error, filters } = useFilteredSeguros()
    const { setFilters, clearFilters } = useSeguroStore()
    const { data: stats } = useSegurosStats()
    const filterOptions = useSeguroFilterOptions()
    const deleteSeguroMutation = useDeleteSeguro()

    const getEstadoPolizaBadge = (estado: string) => {
        const estadoConfig = {
            'vigente': { color: 'bg-green-100 text-green-800', icon: '✅' },
            'por_vencer': { color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
            'vencida': { color: 'bg-red-100 text-red-800', icon: '❌' },
            'cancelada': { color: 'bg-gray-100 text-gray-800', icon: '🚫' }
        }

        const config = estadoConfig[estado as keyof typeof estadoConfig] || { color: 'bg-gray-100 text-gray-800', icon: '❓' }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
            </span>
        )
    }

    const getDiasRestantesBadge = (dias: number) => {
        if (dias > 30) {
            return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ {dias} días</span>
        } else if (dias > 7) {
            return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⚠️ {dias} días</span>
        } else if (dias > 0) {
            return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">🚨 {dias} días</span>
        } else {
            return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">❌ Vencida</span>
        }
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

    const handleCreateSeguro = () => {
        setEditingSeguro(null)
        setIsEditModalOpen(true)
    }

    const handleEditSeguro = (seguro: SeguroVehiculo) => {
        setEditingSeguro(seguro)
        setIsEditModalOpen(true)
    }

    const handleSaveSeguro = (savedSeguro: SeguroVehiculo) => {
        console.log('Seguro guardado recibido en page:', savedSeguro)
        setIsEditModalOpen(false)
        setEditingSeguro(null)
    }

    const handleCloseModal = () => {
        setIsEditModalOpen(false)
        setEditingSeguro(null)
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
                            <Shield className="h-8 w-8 text-indigo-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Seguros</h1>
                        </div>
                        <Button onClick={handleCreateSeguro}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Póliza
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
                                <CardTitle className="text-sm font-medium">Total Pólizas</CardTitle>
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
                                <CardTitle className="text-sm font-medium">Vigentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.vigentes || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.por_vencer || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {isLoading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        stats?.vencidas || 0
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Gestión de Pólizas de Seguro</CardTitle>
                                    <CardDescription>Administra las pólizas de seguro de la flota vehicular</CardDescription>
                                </div>

                                {/* Filtros y búsqueda */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                        <Input
                                            placeholder="Buscar pólizas..."
                                            value={filters.searchTerm || ''}
                                            onChange={(e) => setFilters({ searchTerm: e.target.value })}
                                            className="pl-10 w-64"
                                        />
                                    </div>

                                    <Select
                                        value={filters.estado_poliza || "all"}
                                        onValueChange={(value) =>
                                            setFilters({ estado_poliza: value === "all" ? undefined : value })
                                        }
                                    >
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los estados</SelectItem>
                                            {filterOptions.estados.map((estado) => (
                                                <SelectItem key={estado} value={estado}>
                                                    {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {(filters.searchTerm || filters.estado_poliza) && (
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
                                    <span className="ml-2">Cargando pólizas...</span>
                                </div>
                            ) : (
                                <>
                                    {seguros.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No se encontraron pólizas
                                            </h3>
                                            <p className="text-gray-500 mb-4">
                                                {filters.searchTerm || filters.estado_poliza
                                                    ? "Intenta ajustar los filtros de búsqueda"
                                                    : "Comienza agregando tu primera póliza de seguro"
                                                }
                                            </p>
                                            {!(filters.searchTerm || filters.estado_poliza) && (
                                                <Button onClick={handleCreateSeguro}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agregar Póliza
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
                                                        <TableHead>Aseguradora</TableHead>
                                                        <TableHead>Póliza Seguro</TableHead>
                                                        <TableHead>Fecha Inicio</TableHead>
                                                        <TableHead>Fecha Vencimiento</TableHead>
                                                        <TableHead>Importe Pagado</TableHead>
                                                        <TableHead>Fecha Pago</TableHead>
                                                        <TableHead>Estado Póliza</TableHead>
                                                        <TableHead>Días Restantes</TableHead>
                                                        <TableHead>Acciones</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {seguros.map((seguro) => (
                                                        <TableRow key={seguro.id}>
                                                            <TableCell className="font-medium">{seguro.id}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Truck className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-mono font-semibold">{seguro.placa_vehiculo}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{seguro.aseguradora}</TableCell>
                                                            <TableCell className="font-mono text-sm">{seguro.poliza_seguro}</TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    <span>{formatDate(seguro.fecha_inicio)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    <span>{formatDate(seguro.fecha_vencimiento)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <DollarSign className="h-4 w-4 text-gray-500" />
                                                                    <span className="font-semibold">{formatCurrency(seguro.importe_pagado)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex items-center space-x-2">
                                                                    <Calendar className="h-4 w-4 text-gray-500" />
                                                                    <span>{formatDate(seguro.fecha_pago)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{getEstadoPolizaBadge(seguro.estado_poliza)}</TableCell>
                                                            <TableCell>
                                                                {seguro.dias_restantes !== undefined ? getDiasRestantesBadge(seguro.dias_restantes) : "-"}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex space-x-1">
                                                                    <Button variant="outline" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleEditSeguro(seguro)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            if (window.confirm("¿Seguro que deseas eliminar esta póliza?")) {
                                                                                deleteSeguroMutation.mutate(seguro.id)
                                                                            }
                                                                        }}
                                                                        disabled={deleteSeguroMutation.isPending}
                                                                    >
                                                                        {deleteSeguroMutation.isPending ? (
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
                    <EditSeguroModal
                        seguro={editingSeguro}
                        onSave={handleSaveSeguro}
                        onClose={handleCloseModal}
                        isOpen={isEditModalOpen}
                    />
                )}
            </main>
        </div>
    )
}