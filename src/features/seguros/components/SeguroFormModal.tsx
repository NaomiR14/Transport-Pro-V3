"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { 
  type SeguroVehiculo, 
  type CreateSeguroRequest,
  useCreateSeguro, 
  useUpdateSeguro 
} from "@/features/seguros"
import { useVehicles } from "@/features/vehiculos"

interface EditSeguroModalProps {
    seguro: SeguroVehiculo | null
    onSave: (seguro: SeguroVehiculo) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditSeguroModal({ seguro, onSave, onClose, isOpen }: EditSeguroModalProps) {
    const [formData, setFormData] = useState<Partial<CreateSeguroRequest>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Hook de React Query para seguros
    const createSeguroMutation = useCreateSeguro()
    const updateSeguroMutation = useUpdateSeguro()
    
    // Obtener vehículos disponibles
    const { data: vehicles } = useVehicles()
    const vehiculosDisponibles = vehicles?.map(v => v.licensePlate) || []

    // Inicializar formData cuando cambia el seguro o se abre el modal
    useEffect(() => {
        if (seguro) {
            // Para edición, usar los datos existentes del seguro
            setFormData({
                placa_vehiculo: seguro.placa_vehiculo,
                aseguradora: seguro.aseguradora,
                poliza_seguro: seguro.poliza_seguro,
                fecha_inicio: seguro.fecha_inicio,
                fecha_vencimiento: seguro.fecha_vencimiento,
                importe_pagado: seguro.importe_pagado,
                fecha_pago: seguro.fecha_pago,
            })
        } else {
            // Valores por defecto para nuevo seguro
            setFormData({
                placa_vehiculo: "",
                aseguradora: "",
                poliza_seguro: "",
                fecha_inicio: "",
                fecha_vencimiento: "",
                importe_pagado: 0,
                fecha_pago: "",
            })
        }
    }, [seguro, isOpen])

    const handleInputChange = (field: keyof CreateSeguroRequest, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.placa_vehiculo?.trim()) {
            newErrors.placa_vehiculo = "La placa del vehículo es requerida"
        }
        if (!formData.aseguradora?.trim()) {
            newErrors.aseguradora = "La aseguradora es requerida"
        }
        if (!formData.poliza_seguro?.trim()) {
            newErrors.poliza_seguro = "El número de póliza es requerido"
        }
        if (!formData.fecha_inicio?.trim()) {
            newErrors.fecha_inicio = "La fecha de inicio es requerida"
        }
        if (!formData.fecha_vencimiento?.trim()) {
            newErrors.fecha_vencimiento = "La fecha de vencimiento es requerida"
        }
        if (!formData.importe_pagado || formData.importe_pagado <= 0) {
            newErrors.importe_pagado = "El importe pagado debe ser mayor a 0"
        }
        if (!formData.fecha_pago?.trim()) {
            newErrors.fecha_pago = "La fecha de pago es requerida"
        }

        // Validar fechas
        if (formData.fecha_inicio && formData.fecha_vencimiento) {
            const fechaInicio = new Date(formData.fecha_inicio)
            const fechaVencimiento = new Date(formData.fecha_vencimiento)
            if (fechaVencimiento <= fechaInicio) {
                newErrors.fecha_vencimiento = "La fecha de vencimiento debe ser posterior a la fecha de inicio"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            // Preparar datos para la API
            const apiData: CreateSeguroRequest = {
                placa_vehiculo: formData.placa_vehiculo!,
                aseguradora: formData.aseguradora!,
                poliza_seguro: formData.poliza_seguro!,
                fecha_inicio: formData.fecha_inicio!,
                fecha_vencimiento: formData.fecha_vencimiento!,
                importe_pagado: Number(formData.importe_pagado),
                fecha_pago: formData.fecha_pago!,
            }

            if (seguro?.id) {
                // Actualizar seguro existente
                const updatedSeguro = await updateSeguroMutation.mutateAsync({
                    id: seguro.id,
                    data: apiData
                })
                onSave(updatedSeguro)
            } else {
                // Crear nuevo seguro
                const newSeguro = await createSeguroMutation.mutateAsync(apiData)
                onSave(newSeguro)
            }
        } catch (error) {
            // Error ya manejado por los hooks, solo log para debugging
            console.error('Error en el formulario:', error)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => !updateSeguroMutation.isPending && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {seguro ? "Editar Póliza de Seguro" : "Crear Nueva Póliza de Seguro"}
                    </DialogTitle>
                    <DialogDescription>
                        {seguro ? `Modifica la información de la póliza ${formData.poliza_seguro}` : "Completa la información de la nueva póliza de seguro"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Placa del Vehículo */}
                        <div className="space-y-2">
                            <Label htmlFor="placa_vehiculo">Placa del Vehículo *</Label>
                            <Select
                                value={formData.placa_vehiculo || ""}
                                onValueChange={(value) => handleInputChange("placa_vehiculo", value)}
                                disabled={updateSeguroMutation.isPending}
                            >
                                <SelectTrigger className={errors.placa_vehiculo ? "border-red-500" : ""}>
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
                            {errors.placa_vehiculo && <p className="text-sm text-red-500">{errors.placa_vehiculo}</p>}
                        </div>

                        {/* Aseguradora */}
                        <div className="space-y-2">
                            <Label htmlFor="aseguradora">Aseguradora *</Label>
                            <Input
                                id="aseguradora"
                                value={formData.aseguradora || ""}
                                onChange={(e) => handleInputChange("aseguradora", e.target.value)}
                                className={errors.aseguradora ? "border-red-500" : ""}
                                placeholder="Seguros Monterrey"
                                disabled={updateSeguroMutation.isPending}
                            />
                            {errors.aseguradora && <p className="text-sm text-red-500">{errors.aseguradora}</p>}
                        </div>

                        {/* Número de Póliza */}
                        <div className="space-y-2">
                            <Label htmlFor="poliza_seguro">Número de Póliza *</Label>
                            <Input
                                id="poliza_seguro"
                                value={formData.poliza_seguro || ""}
                                onChange={(e) => handleInputChange("poliza_seguro", e.target.value.toUpperCase())}
                                className={errors.poliza_seguro ? "border-red-500" : ""}
                                placeholder="POL-2024-001"
                                disabled={updateSeguroMutation.isPending}
                            />
                            {errors.poliza_seguro && <p className="text-sm text-red-500">{errors.poliza_seguro}</p>}
                        </div>

                        {/* Importe Pagado */}
                        <div className="space-y-2">
                            <Label htmlFor="importe_pagado">Importe Pagado *</Label>
                            <Input
                                id="importe_pagado"
                                type="number"
                                value={formData.importe_pagado || ""}
                                onChange={(e) => handleInputChange("importe_pagado", e.target.value)}
                                className={errors.importe_pagado ? "border-red-500" : ""}
                                placeholder="6700.00"
                                min="0"
                                step="0.01"
                                disabled={updateSeguroMutation.isPending}
                            />
                            {errors.importe_pagado && <p className="text-sm text-red-500">{errors.importe_pagado}</p>}
                        </div>

                        {/* Fecha de Inicio */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                            <Input
                                id="fecha_inicio"
                                type="date"
                                value={formData.fecha_inicio || ""}
                                onChange={(e) => handleInputChange("fecha_inicio", e.target.value)}
                                className={errors.fecha_inicio ? "border-red-500" : ""}
                                disabled={updateSeguroMutation.isPending}
                            />
                            {errors.fecha_inicio && <p className="text-sm text-red-500">{errors.fecha_inicio}</p>}
                        </div>

                        {/* Fecha de Vencimiento */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha_vencimiento">Fecha de Vencimiento *</Label>
                            <Input
                                id="fecha_vencimiento"
                                type="date"
                                value={formData.fecha_vencimiento || ""}
                                onChange={(e) => handleInputChange("fecha_vencimiento", e.target.value)}
                                className={errors.fecha_vencimiento ? "border-red-500" : ""}
                                disabled={updateSeguroMutation.isPending}
                            />
                            {errors.fecha_vencimiento && <p className="text-sm text-red-500">{errors.fecha_vencimiento}</p>}
                        </div>

                        {/* Fecha de Pago */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha_pago">Fecha de Pago *</Label>
                            <Input
                                id="fecha_pago"
                                type="date"
                                value={formData.fecha_pago || ""}
                                onChange={(e) => handleInputChange("fecha_pago", e.target.value)}
                                className={errors.fecha_pago ? "border-red-500" : ""}
                                disabled={updateSeguroMutation.isPending}
                            />
                            {errors.fecha_pago && <p className="text-sm text-red-500">{errors.fecha_pago}</p>}
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-slate-700">
                        <h4 className="font-semibold text-blue-900 dark:text-white mb-3">Resumen de la Póliza</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-800 dark:text-slate-300">Vehículo:</span>
                                <span className="ml-2 text-blue-900 dark:text-white font-semibold">{formData.placa_vehiculo || "No especificado"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800 dark:text-slate-300">Aseguradora:</span>
                                <span className="ml-2 text-blue-900 dark:text-white">{formData.aseguradora || "No especificada"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800 dark:text-slate-300">Póliza:</span>
                                <span className="ml-2 text-blue-900 dark:text-white">{formData.poliza_seguro || "No asignada"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800 dark:text-slate-300">Importe:</span>
                                <span className="ml-2 text-blue-900 dark:text-white">${formData.importe_pagado?.toLocaleString() || "0"}</span>
                            </div>
                        </div>
                        
                        {/* Campos calculados - Solo al editar */}
                        {seguro && (
                            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-slate-700">
                                <h5 className="font-semibold text-blue-900 dark:text-white mb-3 text-sm">Campos Calculados (Automáticos)</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-blue-800 dark:text-slate-300">Estado Calculado:</span>
                                        <Badge className={`ml-2 ${
                                            seguro.estado_calculado === 'Vigente' 
                                                ? 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text'
                                                : seguro.estado_calculado === 'Por Vencer'
                                                ? 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text'
                                                : 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text'
                                        }`}>
                                            {seguro.estado_calculado}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="font-medium text-blue-800 dark:text-slate-300">Días Restantes:</span>
                                        <Badge className={`ml-2 ${
                                            (seguro.dias_restantes ?? 0) > 30 
                                                ? 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text'
                                                : (seguro.dias_restantes ?? 0) > 0
                                                ? 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text'
                                                : 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text'
                                        }`}>
                                            {seguro.dias_restantes !== undefined 
                                                ? (seguro.dias_restantes > 30 ? `✅ ${seguro.dias_restantes} días` 
                                                    : seguro.dias_restantes > 0 ? `⚠️ ${seguro.dias_restantes} días` 
                                                    : '❌ Vencida')
                                                : 'No calculado'
                                            }
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={updateSeguroMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateSeguroMutation.isPending}
                        >
                            {updateSeguroMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                seguro ? "Guardar Cambios" : "Crear Póliza"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}