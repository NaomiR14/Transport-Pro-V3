// src/app/multas-conductores/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Eye, Edit, Trash2, Truck, AlertTriangle, Calendar, User, CreditCard, Loader2 } from "lucide-react"
import Link from "next/link"
import { MultaFormModal as EditMultasConductoresModal } from "@/features/multas"
import { 
  useFilteredMultasConductores, 
  useCreateMultaConductor, 
  useUpdateMultaConductor, 
  useDeleteMultaConductor,
  type MultaConductor
} from "@/features/multas"
import { commonInfoService } from "@/lib/common-info-service"
import { TrafficTicketType } from "@/types/common-info-types"

// Función auxiliar para limpiar y validar infracciones
const limpiarInfracciones = (infracciones: TrafficTicketType[]): TrafficTicketType[] => {
    return infracciones
        .filter(infraccion =>
            infraccion &&
            infraccion.id &&
            infraccion.type &&
            typeof infraccion.type === 'string' &&
            infraccion.type.trim() !== ''
        )
        .map(infraccion => ({
            ...infraccion,
            type: infraccion.type.trim()
        }))
        .filter(infraccion => infraccion.type.length > 0)
}

// Datos de fallback en caso de que la API falle o no devuelva datos válidos
const infraccionesFallback: TrafficTicketType[] = [
    { id: 1, type: "Exceso de velocidad" },
    { id: 2, type: "No respetar señalamiento" },
    { id: 3, type: "Estacionamiento indebido" },
    { id: 4, type: "Circular sin verificación" },
    { id: 5, type: "Documentos vencidos" },
    { id: 6, type: "No portar licencia" },
    { id: 7, type: "Circular en carril exclusivo" },
    { id: 8, type: "No respetar semáforo" }
]

export default function MultasConductoresPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [infraccionFilter, setInfraccionFilter] = useState("")
    const [editingMulta, setEditingMulta] = useState<MultaConductor | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [tiposInfraccion, setTiposInfraccion] = useState<TrafficTicketType[]>(infraccionesFallback)

    // Obtener datos del store y hooks
    const { multas, allMultas, isLoading, error } = useFilteredMultasConductores()
    const createMultaMutation = useCreateMultaConductor()
    const updateMultaMutation = useUpdateMultaConductor()
    const deleteMultaMutation = useDeleteMultaConductor()

    // Cargar tipos de infracción al montar el componente
    useEffect(() => {
        const loadCommonInfo = async () => {
            try {
                const infracciones = await commonInfoService.getTrafficTicketTypes()

                // Limpiar y validar las infracciones
                const infraccionesLimpias = limpiarInfracciones(infracciones)

                // Si no hay infracciones válidas, usar datos de fallback
                if (infraccionesLimpias.length === 0) {
                    console.warn('No se encontraron infracciones válidas, usando datos de fallback')
                    setTiposInfraccion(infraccionesFallback)
                } else {
                    console.log('Infracciones cargadas:', infraccionesLimpias)
                    setTiposInfraccion(infraccionesLimpias)
                }
            } catch (error) {
                console.error('Error loading traffic ticket types:', error)
                // En caso de error, usar datos de fallback
                setTiposInfraccion(infraccionesFallback)
            }
        }

        loadCommonInfo()
    }, [])

    // Aplicar filtros locales adicionales
    const filteredMultas = multas.filter((multa) => {
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            return (
                multa.numero_viaje.toString().includes(searchLower) ||
                multa.placa_vehiculo.toLowerCase().includes(searchLower) ||
                multa.conductor.toLowerCase().includes(searchLower) ||
                multa.infraccion.toLowerCase().includes(searchLower) ||
                multa.observaciones.toLowerCase().includes(searchLower)
            )
        }
        return true
    }).filter((multa) => {
        if (infraccionFilter) {
            return multa.infraccion === infraccionFilter
        }
        return true
    })

    const getEstadoPagoBadge = (estado: string) => {
        const variants = {
            pagado: "bg-green-100 text-green-800",
            pendiente: "bg-yellow-100 text-yellow-800",
            parcial: "bg-blue-100 text-blue-800",
            vencido: "bg-red-100 text-red-800",
        }
        return variants[estado as keyof typeof variants] || "bg-gray-100 text-gray-800"
    }

    const getEstadoPagoText = (estado: string) => {
        const texts = {
            pagado: "Pagado",
            pendiente: "Pendiente",
            parcial: "Parcial",
            vencido: "Vencido",
        }
        return texts[estado as keyof typeof texts] || estado
    }

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    const calcularPorcentajePago = (importePagado: number, importeMulta: number) => {
        return importeMulta > 0 ? (importePagado / importeMulta) * 100 : 0
    }

    const handleCreateMulta = () => {
        setEditingMulta(null)
        setIsEditModalOpen(true)
    }

    const handleEditMulta = (multa: MultaConductor) => {
        setEditingMulta(multa)
        setIsEditModalOpen(true)
    }

    const handleSaveMulta = (updatedMulta: MultaConductor) => {
        console.log("Guardando multa:", updatedMulta)
        
        if (editingMulta) {
            // Update existente
            updateMultaMutation.mutate(
                { id: editingMulta.id, data: updatedMulta },
                {
                    onSuccess: () => {
                        setIsEditModalOpen(false)
                        setEditingMulta(null)
                    }
                }
            )
        } else {
            // Crear nueva
            createMultaMutation.mutate(updatedMulta, {
                onSuccess: () => {
                    setIsEditModalOpen(false)
                    setEditingMulta(null)
                }
            })
        }
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

    // Calcular estadísticas
    const totalMultas = allMultas.length
    const multasPagadas = allMultas.filter((m) => m.estado_pago === "pagado").length
    const multasPendientes = allMultas.filter((m) => m.estado_pago === "pendiente").length
    const multasVencidas = allMultas.filter((m) => m.estado_pago === "vencido").length
    const multasParciales = allMultas.filter((m) => m.estado_pago === "parcial").length
    const totalImporteMultas = allMultas.reduce((sum, m) => sum + m.importe_multa, 0)
    const totalImportePagado = allMultas.reduce((sum, m) => sum + m.importe_pagado, 0)
    const totalDebe = allMultas.reduce((sum, m) => sum + m.debe, 0)
    const porcentajeCumplimiento = totalMultas > 0 ? (multasPagadas / totalMultas) * 100 : 0

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
                            <AlertTriangle className="h-8 w-8 text-amber-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Multas de Conductores</h1>
                        </div>
                        <Button onClick={handleCreateMulta}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Multa
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Cards de Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Multas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalMultas}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Pagadas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">{multasPagadas}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{multasPendientes}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">{multasVencidas}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">Total Debe</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">${totalDebe.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabla Principal */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Gestión de Multas de Conductores</CardTitle>
                                    <CardDescription>Administra las multas e infracciones de tránsito de los conductores</CardDescription>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="relative">
                                        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                                        <Input
                                            placeholder="Buscar multas..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 w-64"
                                        />
                                    </div>
                                    <Select value={infraccionFilter} onValueChange={setInfraccionFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Filtrar por infracción" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las infracciones</SelectItem>
                                            {tiposInfraccion.map((infraccion) => (
                                                <SelectItem
                                                    key={infraccion.id}
                                                    value={infraccion.type}
                                                >
                                                    {infraccion.type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Más Filtros
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                                        <p className="mt-2 text-gray-600">Cargando multas...</p>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-600">
                                    Error al cargar las multas: {error}
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fecha</TableHead>
                                            <TableHead>Número de Viaje</TableHead>
                                            <TableHead>Placa Vehículo</TableHead>
                                            <TableHead>Conductor</TableHead>
                                            <TableHead>Infracción</TableHead>
                                            <TableHead>Importe Multa</TableHead>
                                            <TableHead>Importe Pagado</TableHead>
                                            <TableHead>Debe</TableHead>
                                            <TableHead>Estado de Pago</TableHead>
                                            <TableHead>Observaciones</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredMultas.map((multa) => {
                                            const porcentajePago = calcularPorcentajePago(multa.importe_pagado, multa.importe_multa)
                                            return (
                                                <TableRow key={multa.id}>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            <span className="font-medium">{formatearFecha(multa.fecha)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                                            {multa.numero_viaje}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-mono font-medium">{multa.placa_vehiculo}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <User className="h-4 w-4 text-gray-500" />
                                                            <span className="font-medium">{multa.conductor}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                            <span className="text-sm">{multa.infraccion}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="font-semibold text-red-600">${multa.importe_multa.toLocaleString()}</div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="font-semibold text-green-600">
                                                                ${multa.importe_pagado.toLocaleString()}
                                                            </div>
                                                            {multa.importe_multa > 0 && (
                                                                <div className="text-xs text-gray-500">{porcentajePago.toFixed(1)}% pagado</div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className={`font-semibold ${multa.debe > 0 ? "text-red-600" : "text-gray-500"}`}>
                                                                ${multa.debe.toLocaleString()}
                                                            </div>
                                                            {multa.debe > 0 && (
                                                                <div className="flex items-center space-x-1">
                                                                    <CreditCard className="h-3 w-3 text-red-500" />
                                                                    <span className="text-xs text-red-500">Pendiente</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getEstadoPagoBadge(multa.estado_pago)}>
                                                            {getEstadoPagoText(multa.estado_pago)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-xs">
                                                            <p className="text-sm text-gray-600 truncate" title={multa.observaciones}>
                                                                {multa.observaciones}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-1">
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                onClick={() => handleEditMulta(multa)}
                                                                disabled={updateMultaMutation.isPending}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                onClick={() => handleDeleteMulta(multa.id)}
                                                                disabled={deleteMultaMutation.isPending}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Resumen Financiero</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Multas:</span>
                                        <span className="font-semibold text-red-600">${totalImporteMultas.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Pagado:</span>
                                        <span className="font-semibold text-green-600">${totalImportePagado.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-sm font-medium">Total Debe:</span>
                                        <span className="font-bold text-red-600">${totalDebe.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estado de Pagos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Pagadas:</span>
                                        <span className="font-semibold text-green-600">{multasPagadas}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Pendientes:</span>
                                        <span className="font-semibold text-yellow-600">{multasPendientes}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Parciales:</span>
                                        <span className="font-semibold text-blue-600">{multasParciales}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Vencidas:</span>
                                        <span className="font-semibold text-red-600">{multasVencidas}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Porcentaje de Cumplimiento</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Cumplimiento:</span>
                                        <span className="font-semibold text-green-600">
                                            {porcentajeCumplimiento.toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{
                                                width: `${porcentajeCumplimiento}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {multasPagadas} de {totalMultas} multas completamente pagadas
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Modal de Edición */}
                {isEditModalOpen && (
                    <EditMultasConductoresModal
                        multa={editingMulta}
                        onSave={handleSaveMulta}
                        onClose={handleCloseModal}
                        isOpen={isEditModalOpen}
                    />
                )}
            </main>
        </div>
    )
}