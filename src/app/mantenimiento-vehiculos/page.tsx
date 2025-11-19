"use client"

import { useState } from "react"
import Link from "next/link"
import {
    Truck,
    Settings,
    Plus,
    Search,
    Edit,
    Calendar,
    Wrench,
    CheckCircle,
    Clock,
    DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { EditMantenimientoVehiculoModal } from "@/components/EditMantenimientoVehiculoModal"
import { useFilteredMantenimientos, useCreateMantenimiento, useUpdateMantenimiento } from "@/hooks/use-mantenimiento-vehiculos"
import { MantenimientoVehiculo, CreateMantenimientoVehiculoRequest } from "@/types/mantenimiento-vehiculos-types"
import { useMantenimientoVehiculoStore } from "@/store/mantenimiento-vehiculos-store"


export default function MantenimientoVehiculosPage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedMantenimiento, setSelectedMantenimiento] = useState<MantenimientoVehiculo | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterTipo, setFilterTipo] = useState("all")
    const [filterEstado, setFilterEstado] = useState("all")

    const { mantenimientos, stats, isLoading } = useFilteredMantenimientos()
    const { setFilters } = useMantenimientoVehiculoStore()
    const createMantenimiento = useCreateMantenimiento()
    const updateMantenimiento = useUpdateMantenimiento()

    // Aplicar filtros
    const applyFilters = () => {
        setFilters({
            searchTerm: searchTerm || undefined,
            tipo: filterTipo !== "all" ? filterTipo : undefined,
            estado: filterEstado !== "all" ? filterEstado : undefined,
        })
    }

    // Handler para editar/crear mantenimiento
    const handleEditMantenimiento = (mantenimiento: MantenimientoVehiculo | null) => {
        setSelectedMantenimiento(mantenimiento)
        setIsEditModalOpen(true)
    }

    // Handler para enviar formulario
    const handleSubmitMantenimiento = (data: CreateMantenimientoVehiculoRequest) => {
        if (selectedMantenimiento) {
            // Actualizar mantenimiento existente
            updateMantenimiento.mutate({
                id: selectedMantenimiento.id.toString(),
                data
            })
        } else {
            // Crear nuevo mantenimiento
            createMantenimiento.mutate(data)
        }
    }

    // Función para obtener clase del badge de tipo
    const getTipoBadge = (tipo: string) => {
        const variants: Record<string, string> = {
            Preventivo: "bg-blue-100 text-blue-800",
            Correctivo: "bg-orange-100 text-orange-800",
        }
        return variants[tipo] || "bg-gray-100 text-gray-800"
    }

    // Función para obtener clase del badge de estado
    const getEstadoBadge = (estado: string) => {
        const variants: Record<string, string> = {
            Completado: "bg-green-100 text-green-800",
            "En Proceso": "bg-blue-100 text-blue-800",
            "Pendiente Pago": "bg-yellow-100 text-yellow-800",
        }
        return variants[estado] || "bg-gray-100 text-gray-800"
    }

    // Aplicar filtros cuando cambien los valores
    useState(() => {
        applyFilters()
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Settings className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Cargando mantenimientos...</p>
                </div>
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
                                <Truck className="h-8 w-8 text-blue-600 mr-3" />
                                <span className="text-xl font-semibold text-gray-900">Sistema de Transporte</span>
                            </Link>
                            <div className="flex items-center">
                                <Settings className="h-6 w-6 text-gray-600 mr-2" />
                                <h1 className="text-2xl font-bold text-gray-900">Mantenimiento de Vehículos</h1>
                            </div>
                        </div>
                        <Button onClick={() => handleEditMantenimiento(null)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Mantenimiento
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Mantenimientos</CardTitle>
                            <Wrench className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
                            <p className="text-xs text-muted-foreground">Registros totales</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completados</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats?.completados || 0}</div>
                            <Progress
                                value={stats ? (stats.completados / stats.total) * 100 : 0}
                                className="mt-2"
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
                            <Clock className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats?.enProceso || 0}</div>
                            <p className="text-xs text-muted-foreground">Actualmente en taller</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Costo Pendiente</CardTitle>
                            <DollarSign className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                ${(stats?.costoPendiente || 0).toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.pendientePago || 0} pagos pendientes
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros y búsqueda */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Filtros de Búsqueda</CardTitle>
                        <CardDescription>Buscar y filtrar registros de mantenimiento</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Buscar por placa, taller o paquete..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value)
                                            applyFilters()
                                        }}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Select
                                value={filterTipo}
                                onValueChange={(value) => {
                                    setFilterTipo(value)
                                    applyFilters()
                                }}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Tipo de mantenimiento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    <SelectItem value="Preventivo">Preventivo</SelectItem>
                                    <SelectItem value="Correctivo">Correctivo</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filterEstado}
                                onValueChange={(value) => {
                                    setFilterEstado(value)
                                    applyFilters()
                                }}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="Completado">Completado</SelectItem>
                                    <SelectItem value="En Proceso">En Proceso</SelectItem>
                                    <SelectItem value="Pendiente Pago">Pendiente Pago</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabla de mantenimientos */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registros de Mantenimiento</CardTitle>
                        <CardDescription>
                            Mostrando {mantenimientos.length} registros
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Placa</TableHead>
                                        <TableHead>Taller</TableHead>
                                        <TableHead>Fechas</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Kilometraje</TableHead>
                                        <TableHead>Paquete</TableHead>
                                        <TableHead>Costo</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mantenimientos.map((mantenimiento) => (
                                        <TableRow key={mantenimiento.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center">
                                                    <Truck className="h-4 w-4 mr-2 text-gray-500" />
                                                    {mantenimiento.placaVehiculo}
                                                </div>
                                            </TableCell>
                                            <TableCell>{mantenimiento.taller}</TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Calendar className="h-3 w-3 mr-1 text-green-600" />
                                                        <span className="text-green-600">Entrada: {mantenimiento.fechaEntrada}</span>
                                                    </div>
                                                    {mantenimiento.fechaSalida && (
                                                        <div className="flex items-center text-sm">
                                                            <Calendar className="h-3 w-3 mr-1 text-blue-600" />
                                                            <span className="text-blue-600">Salida: {mantenimiento.fechaSalida}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getTipoBadge(mantenimiento.tipo)}>
                                                    {mantenimiento.tipo}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center">
                                                    <Settings className="h-4 w-4 mr-1 text-gray-500" />
                                                    {mantenimiento.kilometraje.toLocaleString()} km
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-32">
                                                    <div className="font-medium text-sm">{mantenimiento.paqueteMantenimiento}</div>
                                                    <div className="text-xs text-gray-500 truncate" title={mantenimiento.causas}>
                                                        {mantenimiento.causas}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="font-medium">${mantenimiento.costoTotal.toFixed(2)}</div>
                                                    {mantenimiento.fechaPago ? (
                                                        <div className="text-xs text-green-600">Pagado: {mantenimiento.fechaPago}</div>
                                                    ) : (
                                                        <div className="text-xs text-red-600">Pendiente</div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getEstadoBadge(mantenimiento.estado)}>
                                                    {mantenimiento.estado}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditMantenimiento(mantenimiento)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Modal de edición */}
            <EditMantenimientoVehiculoModal
                mantenimiento={selectedMantenimiento}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedMantenimiento(null)
                }}
                onSubmit={handleSubmitMantenimiento}
            />
        </div>
    )
}