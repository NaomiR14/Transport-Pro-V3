// ...existing code...
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, DollarSign, Settings, Wrench } from "lucide-react"
import { 
  type MantenimientoVehiculo, 
  type CreateMantenimientoVehiculoRequest 
} from "@/features/mantenimiento"
import { commonInfoService } from "@/services/api/common-info-service"

// Definir interfaces locales basadas en lo que devuelve CommonInfoService
interface MaintenanceType {
    id: number
    name: string
    nombre?: string
}

interface MaintenancePlan {
    id: number
    name: string
}

interface EditMantenimientoVehiculoModalProps {
    mantenimiento: MantenimientoVehiculo | null
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: CreateMantenimientoVehiculoRequest) => void
    isLoading?: boolean
}

export default function EditMantenimientoVehiculoModal({
    mantenimiento,
    isOpen,
    onClose,
    onSubmit,
    isLoading = false,
}: EditMantenimientoVehiculoModalProps) {
    const [formData, setFormData] = useState<CreateMantenimientoVehiculoRequest>({
        placaVehiculo: "",
        taller: "",
        fechaEntrada: "",
        tipo: "",
        kilometraje: 0,
        paqueteMantenimiento: "",
        causas: "",
        costoTotal: 0,
        fechaPago: null,
        observaciones: "",
    })

    const [maintenanceTypes, setMaintenanceTypes] = useState<MaintenanceType[]>([])
    const [maintenancePlans, setMaintenancePlans] = useState<MaintenancePlan[]>([])
    const [isLoadingCommonInfo, setIsLoadingCommonInfo] = useState(false)

    // Cargar datos del CommonInfoService
    useEffect(() => {
        const loadCommonInfo = async () => {
            setIsLoadingCommonInfo(true)
            try {
                const [types, plans] = await Promise.all([
                    commonInfoService.getMaintenanceTypes(),
                    commonInfoService.getMaintenancePlans()
                ])
                // Normalizar respuesta: algunos endpoints pueden devolver 'name' o 'nombre'
                const normalizedTypes = (types as unknown as Array<{ id: number; name?: string; nombre?: string }>)
                    .map((t) => ({
                        id: t.id,
                        name: t.name ?? t.nombre ?? "",
                    }))

                setMaintenanceTypes(normalizedTypes)
                setMaintenancePlans(plans as MaintenancePlan[])
            } catch (error) {
                console.error("Error loading common info:", error)
                // Fallback data en caso de error
                setMaintenanceTypes([
                    { id: 1, name: "Preventivo" },
                    { id: 2, name: "Correctivo" }
                ])
                setMaintenancePlans([
                    { id: 1, name: "Mantenimiento 15K" },
                    { id: 2, name: "Mantenimiento 30K" },
                    { id: 3, name: "Mantenimiento 45K" },
                    { id: 4, name: "Mantenimiento 60K" },
                    { id: 5, name: "Reparación Frenos" },
                    { id: 6, name: "Reparación Motor" }
                ])
            } finally {
                setIsLoadingCommonInfo(false)
            }
        }

        if (isOpen) {
            loadCommonInfo()
        }
    }, [isOpen])

    useEffect(() => {
        if (mantenimiento) {
            setFormData({
                placaVehiculo: mantenimiento.placaVehiculo,
                taller: mantenimiento.taller,
                fechaEntrada: mantenimiento.fechaEntrada,
                tipo: mantenimiento.tipo,
                kilometraje: mantenimiento.kilometraje,
                paqueteMantenimiento: mantenimiento.paqueteMantenimiento,
                causas: mantenimiento.causas,
                costoTotal: mantenimiento.costoTotal,
                fechaPago: mantenimiento.fechaPago,
                observaciones: mantenimiento.observaciones,
            })
        } else {
            setFormData({
                placaVehiculo: "",
                taller: "",
                fechaEntrada: new Date().toISOString().split("T")[0],
                tipo: "",
                kilometraje: 0,
                paqueteMantenimiento: "",
                causas: "",
                costoTotal: 0,
                fechaPago: null,
                observaciones: "",
            })
        }
    }, [mantenimiento, isOpen])

    const handleInputChange = (field: keyof CreateMantenimientoVehiculoRequest, value: string | number | null) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        } as CreateMantenimientoVehiculoRequest))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const getEstadoBadge = (estado: string) => {
        const variants: Record<string, string> = {
            Completado: "bg-green-100 text-green-800",
            "En Proceso": "bg-blue-100 text-blue-800",
            "Pendiente Pago": "bg-yellow-100 text-yellow-800",
        }
        return variants[estado] || "bg-gray-100 text-gray-800"
    }

    const vehiculosDisponibles = ["ABC-123", "DEF-456", "GHI-789", "JKL-012", "MNO-345"]
    const talleresDisponibles = ["Taller Central", "AutoServicio Norte", "Mecánica Express", "Taller Sur"]

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wrench className="h-5 w-5" />
                        {mantenimiento ? "Editar Mantenimiento" : "Nuevo Mantenimiento"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información General */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Información General
                            </CardTitle>
                            <CardDescription>Datos básicos del mantenimiento del vehículo</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="placaVehiculo">Placa del Vehículo *</Label>
                                <Select
                                    value={formData.placaVehiculo}
                                    onValueChange={(value) => handleInputChange("placaVehiculo", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar vehículo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehiculosDisponibles.map((placa) => (
                                            <SelectItem key={placa} value={placa}>
                                                {placa}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taller">Taller *</Label>
                                <Select value={formData.taller} onValueChange={(value) => handleInputChange("taller", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar taller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {talleresDisponibles.map((taller) => (
                                            <SelectItem key={taller} value={taller}>
                                                {taller}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fechaEntrada">Fecha de Entrada *</Label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="fechaEntrada"
                                        type="date"
                                        value={formData.fechaEntrada}
                                        onChange={(e) => handleInputChange("fechaEntrada", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tipo">Tipo de Mantenimiento *</Label>
                                <Select
                                    value={formData.tipo}
                                    onValueChange={(value) => handleInputChange("tipo", value)}
                                    disabled={isLoadingCommonInfo}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={
                                            isLoadingCommonInfo ? "Cargando tipos..." : "Seleccionar tipo"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maintenanceTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.name}>
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="kilometraje">Kilometraje del Odómetro *</Label>
                                <Input
                                    id="kilometraje"
                                    type="number"
                                    value={formData.kilometraje}
                                    onChange={(e) => handleInputChange("kilometraje", Number.parseInt(e.target.value) || 0)}
                                    placeholder="Ej: 45000"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detalles del Mantenimiento */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wrench className="h-4 w-4" />
                                Detalles del Mantenimiento
                            </CardTitle>
                            <CardDescription>Información específica sobre el trabajo realizado</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="paqueteMantenimiento">Paquete de Mantenimiento *</Label>
                                <Select
                                    value={formData.paqueteMantenimiento}
                                    onValueChange={(value) => handleInputChange("paqueteMantenimiento", value)}
                                    disabled={isLoadingCommonInfo}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={
                                            isLoadingCommonInfo ? "Cargando paquetes..." : "Seleccionar paquete"
                                        } />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maintenancePlans.map((plan) => (
                                            <SelectItem key={plan.id} value={plan.name}>
                                                {plan.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="causas">Causas del Mantenimiento *</Label>
                                <Textarea
                                    id="causas"
                                    value={formData.causas}
                                    onChange={(e) => handleInputChange("causas", e.target.value)}
                                    placeholder="Describir las causas que motivaron el mantenimiento..."
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="observaciones">Observaciones</Label>
                                <Textarea
                                    id="observaciones"
                                    value={formData.observaciones}
                                    onChange={(e) => handleInputChange("observaciones", e.target.value)}
                                    placeholder="Observaciones adicionales sobre el mantenimiento..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información Financiera */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Información Financiera
                            </CardTitle>
                            <CardDescription>Costos y estado de pago del mantenimiento</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="costoTotal">Costo Total ($) *</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="costoTotal"
                                        type="number"
                                        step="0.01"
                                        value={formData.costoTotal}
                                        onChange={(e) => handleInputChange("costoTotal", Number.parseFloat(e.target.value) || 0)}
                                        className="pl-10"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fechaPago">Fecha de Pago</Label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="fechaPago"
                                        type="date"
                                        value={formData.fechaPago || ""}
                                        onChange={(e) => handleInputChange("fechaPago", e.target.value || null)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {mantenimiento && (
                                <div className="space-y-2">
                                    <Label>Estado Actual</Label>
                                    <div className="pt-2">
                                        <Badge className={getEstadoBadge(mantenimiento.estado)}>{mantenimiento.estado}</Badge>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Separator />

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-4">
                        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isLoading || isLoadingCommonInfo}>
                            {isLoading ? "Procesando..." : mantenimiento ? "Actualizar" : "Crear"} Mantenimiento
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
// ...existing code...