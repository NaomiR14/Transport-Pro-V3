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
import { Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, DollarSign, Settings, Wrench } from "lucide-react"
import { 
  type MantenimientoVehiculo, 
  type CreateMantenimientoVehiculoRequest,
  type UpdateMantenimientoVehiculoRequest,
  useUpdateMantenimiento,
  useCreateMantenimiento
} from "@/features/mantenimiento"
import { commonInfoService } from "@/lib/common-info-service"
import { set } from "date-fns"
import { useVehicles } from "@/features/vehiculos";
import { useTalleres } from "@/features/talleres"
import type { MaintenanceType, MaintenancePlan } from '@/types/common-info-types'

interface EditMantenimientoVehiculoModalProps {
    mantenimiento: MantenimientoVehiculo | null
    isOpen: boolean
    onClose: () => void
    onSave: (data: CreateMantenimientoVehiculoRequest) => void
}

export default function EditMantenimientoVehiculoModal({
    mantenimiento,
    isOpen,
    onClose,
    onSave,
}: EditMantenimientoVehiculoModalProps) {
    const { data: vehicles } = useVehicles(); 
     
    // Extraer solo las placas
    const vehiculosDisponibles = vehicles?.map(v => v.licensePlate) || [];

    const { data: talleres } = useTalleres();
    const talleresDisponibles = talleres?.map(t => t.name) || [];

    const [errors, setErrors] = useState<Record<string, string>>({})
    const createMantenimiento = useCreateMantenimiento()
    const updateMantenimiento = useUpdateMantenimiento()
    const [formData, setFormData] = useState<CreateMantenimientoVehiculoRequest>({
        placaVehiculo: "",
        taller: "",
        fechaEntrada: "",
        fechaSalida: "",
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
                
                console.log('[MantenimientoFormModal] Tipos de mantenimiento:', types)
                console.log('[MantenimientoFormModal] Planes de mantenimiento:', plans)

                setMaintenanceTypes(types)
                setMaintenancePlans(plans)
            } catch (error) {
                console.error("[MantenimientoFormModal] Error loading common info:", error)
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
                fechaSalida: mantenimiento.fechaSalida || "",
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
                fechaSalida: "",
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

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.placaVehiculo.trim()) {
            newErrors.placaVehiculo = "La placa del vehículo es obligatoria."
        }   
        if (!formData.taller.trim()) {
            newErrors.taller = "El taller es obligatorio."
        }
        if (!formData.fechaEntrada.trim()) {
            newErrors.fechaEntrada = "La fecha de entrada es obligatoria."
        }
        if (!formData.fechaSalida.trim()) {
            newErrors.fechaSalida = "La fecha de salida es obligatoria."
        }
        if (!formData.tipo.trim()) {
            newErrors.tipo = "El tipo de mantenimiento es obligatorio."
        }
        if (formData.kilometraje <= 0) {
            newErrors.kilometraje = "El kilometraje debe ser un número positivo."
        }
        if (!formData.paqueteMantenimiento.trim()) {
            newErrors.paqueteMantenimiento = "El paquete de mantenimiento es obligatorio."
        }
        if (!formData.causas.trim()) {
            newErrors.causas = "Las causas del mantenimiento son obligatorias."
        }
        if (formData.costoTotal < 0) {
            newErrors.costoTotal = "El costo total no puede ser negativo."
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        //Prevenir doble envío
        if (createMantenimiento.isPending  || updateMantenimiento.isPending) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        try {
        if (mantenimiento?.id) {
            const updated = await updateMantenimiento.mutateAsync({
                id: mantenimiento.id.toString(),
                data: formData
            })
            onSave(updated)
        } else {
            const created = await createMantenimiento.mutateAsync(formData)
            onSave(created)
            }
        onClose()
        } catch (error) {
        console.error(error)
        }
    }

    const getEstadoBadge = (estado: string) => {
        const variants: Record<string, string> = {
            Completado: "bg-green-100 text-green-800",
            "En Proceso": "bg-blue-100 text-blue-800",
            "Pendiente Pago": "bg-yellow-100 text-yellow-800",
        }
        return variants[estado] || "bg-gray-100 text-gray-800"
    }

    
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
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccionar taller" className="truncate" />
                                    </SelectTrigger>
                                    <SelectContent className="max-w-[400px]">
                                        {talleresDisponibles.map((taller) => (
                                            <SelectItem key={taller} value={taller} className="max-w-full">
                                                <span className="block truncate" title={taller}>
                                                    {taller}
                                                </span>
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
                                {errors.fechaEntrada && <p className="text-sm text-red-500">{errors.fechaEntrada}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fechaSalida">Fecha de Salida *</Label>
                                <div className="relative">
                                    <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="fechaSalida"
                                        type="date"
                                        value={formData.fechaSalida}
                                        onChange={(e) => handleInputChange("fechaSalida", e.target.value)}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                {errors.fechaSalida && <p className="text-sm text-red-500">{errors.fechaSalida}</p>}
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
                                        {maintenanceTypes
                                            .filter((type) => type.type && type.type.trim() !== "")
                                            .map((type) => (
                                                <SelectItem key={type.id} value={type.type}>
                                                    {type.type}
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
                                        {maintenancePlans
                                            .filter((plan) => plan.name && plan.name.trim() !== "")
                                            .map((plan) => (
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
                                        min="0"
                                        value={formData.costoTotal}
                                        onChange={(e) => handleInputChange("costoTotal", Number.parseFloat(e.target.value) || 0)}
                                        className="pl-10"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                {errors.costoTotal && <p className="text-sm text-red-500">{errors.costoTotal}</p>}
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
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose} 
                            disabled={createMantenimiento.isPending || updateMantenimiento.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={createMantenimiento.isPending || updateMantenimiento.isPending || isLoadingCommonInfo}
                        >
                            {(createMantenimiento.isPending || updateMantenimiento.isPending) 
                                ? "Procesando..." 
                                : mantenimiento ? "Actualizar" : "Crear"} Mantenimiento
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}