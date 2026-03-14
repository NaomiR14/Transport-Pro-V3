// src/components/EditMultasConductoresModal.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { 
  type MultaConductor, 
  type UpdateMultaConductorRequest,
  useCreateMultaConductor,
  useUpdateMultaConductor
} from "@/features/multas"
import { commonInfoService } from "@/lib/common-info-service"
import { TrafficTicketType } from "@/types/common-info-types"
import { useVehicles } from "@/features/vehiculos"
import { useConductores } from "@/features/conductores"

interface EditMultasConductoresModalProps {
    multa: MultaConductor | null
    onSave: (multa: MultaConductor) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditMultasConductoresModal({
    multa,
    onSave,
    onClose,
    isOpen
}: EditMultasConductoresModalProps) {
    const [formData, setFormData] = useState<UpdateMultaConductorRequest>({
        fecha: "",
        numero_viaje: 0,
        placa_vehiculo: "",
        conductor: "",
        infraccion: "",
        importe_multa: 0,
        importe_pagado: 0,
        observaciones: "",
        debe: 0,
        estado_pago: "pendiente",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [tiposInfraccion, setTiposInfraccion] = useState<TrafficTicketType[]>([])
    
    // Hooks de React Query
    const createMultaMutation = useCreateMultaConductor()
    const updateMultaMutation = useUpdateMultaConductor()
    
    // Obtener vehículos y conductores disponibles
    const { data: vehicles } = useVehicles()
    const { data: conductoresData } = useConductores()
    const vehiculosDisponibles = vehicles?.map(v => v.licensePlate) || []
    const conductoresDisponibles = conductoresData?.map(c => ({
        documento: c.documento_identidad,
        nombre: c.nombre_conductor
    })) || []

    // Cargar tipos de infracción y conductores al abrir el modal
    useEffect(() => {
        const loadCommonInfo = async () => {
            try {
                setIsLoading(true)
                const infracciones = await commonInfoService.getTrafficTicketTypes()
                // Filtrar infracciones que tengan type válido (no vacío)
                const infraccionesValidas = infracciones.filter(infraccion =>
                    infraccion.type && infraccion.type.trim() !== ''
                )
                setTiposInfraccion(infraccionesValidas)
            } catch (error) {
                console.error('Error loading common info:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (isOpen) {
            loadCommonInfo()
        }
    }, [isOpen])

    // Inicializar formData cuando cambia la multa o se abre el modal
    useEffect(() => {
        if (multa) {
            setFormData({
                fecha: multa.fecha,
                numero_viaje: multa.numero_viaje,
                placa_vehiculo: multa.placa_vehiculo,
                conductor: multa.conductor,
                infraccion: multa.infraccion,
                importe_multa: multa.importe_multa,
                importe_pagado: multa.importe_pagado,
                observaciones: multa.observaciones,
                debe: multa.debe,
                estado_pago: multa.estado_pago,
            })
        } else {
            // Valores por defecto para nueva multa
            const today = new Date().toISOString().split('T')[0]
            setFormData({
                fecha: today,
                numero_viaje: 0,
                placa_vehiculo: "",
                conductor: "",
                infraccion: "",
                importe_multa: 0,
                importe_pagado: 0,
                observaciones: "",
                debe: 0,
                estado_pago: "pendiente",
            })
        }
    }, [multa, isOpen])

    const handleInputChange = (field: keyof UpdateMultaConductorRequest, value: string | number) => {
        setFormData((prev) => {
            const newData = {
                ...prev,
                [field]: value,
            }

            return newData
        })

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

        if (!formData.fecha) {
            newErrors.fecha = "La fecha es requerida"
        }
        if (!formData.numero_viaje || formData.numero_viaje <= 0) {
            newErrors.numero_viaje = "El número de viaje es requerido y debe ser mayor a 0"
        }
        if (!formData.placa_vehiculo.trim()) {
            newErrors.placa_vehiculo = "La placa del vehículo es requerida"
        }
        if (!formData.conductor.trim()) {
            newErrors.conductor = "El conductor es requerido"
        }
        if (!formData.infraccion.trim()) {
            newErrors.infraccion = "La infracción es requerida"
        }
        if (formData.importe_multa <= 0) {
            newErrors.importe_multa = "El importe de la multa debe ser mayor a 0"
        }
        if (formData.importe_pagado < 0) {
            newErrors.importe_pagado = "El importe pagado no puede ser negativo"
        }
        if (formData.importe_pagado > formData.importe_multa) {
            newErrors.importe_pagado = "El importe pagado no puede ser mayor al importe de la multa"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        // Preparar datos para la API (sin campos calculados)
        const apiData = {
            fecha: formData.fecha!,
            numero_viaje: formData.numero_viaje!,
            placa_vehiculo: formData.placa_vehiculo!,
            conductor: formData.conductor!,
            infraccion: formData.infraccion!,
            importe_multa: formData.importe_multa!,
            importe_pagado: formData.importe_pagado!,
            observaciones: formData.observaciones || '',
        }

        if (multa?.id) {
            // Actualizar multa existente
            updateMultaMutation.mutate(
                { id: multa.id, data: apiData },
                {
                    onSuccess: () => {
                        onClose()
                    }
                }
            )
        } else {
            // Crear nueva multa
            createMultaMutation.mutate(apiData, {
                onSuccess: () => {
                    onClose()
                }
            })
        }
    }

    const calcularEstadoPago = (importePagado: number, importeMulta: number): "pagado" | "pendiente" | "parcial" | "vencido" => {
        if (importePagado >= importeMulta) {
            return "pagado"
        } else if (importePagado > 0) {
            return "parcial"
        } else {
            return "pendiente"
        }
    }

    const calcularDebe = () => {
        return Math.max(0, formData.importe_multa - formData.importe_pagado)
    }

    const calcularPorcentajePago = () => {
        return formData.importe_multa > 0 ? (formData.importe_pagado / formData.importe_multa) * 100 : 0
    }

    const getEstadoPagoCalculado = () => {
        return calcularEstadoPago(formData.importe_pagado, formData.importe_multa)
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

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{multa ? 'Editar' : 'Crear'} Multa de Conductor</DialogTitle>
                    <DialogDescription>
                        {multa 
                            ? `Modifica la información de la multa del conductor ${formData.conductor}`
                            : 'Ingresa la información de la nueva multa'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Información General */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha">Fecha *</Label>
                            <Input
                                id="fecha"
                                type="date"
                                value={formData.fecha}
                                onChange={(e) => handleInputChange("fecha", e.target.value)}
                                className={errors.fecha ? "border-red-500" : ""}
                            />
                            {errors.fecha && <p className="text-sm text-red-500">{errors.fecha}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="numero_viaje">Número de Viaje *</Label>
                            <Input
                                id="numero_viaje"
                                type="number"
                                value={formData.numero_viaje}
                                onChange={(e) => handleInputChange("numero_viaje", Number.parseInt(e.target.value) || 0)}
                                className={errors.numero_viaje ? "border-red-500" : ""}
                                min="1"
                            />
                            {errors.numero_viaje && <p className="text-sm text-red-500">{errors.numero_viaje}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="placa_vehiculo">Vehículo *</Label>
                            <Select
                                value={formData.placa_vehiculo}
                                onValueChange={(value) => handleInputChange("placa_vehiculo", value)}
                                disabled={isLoading}
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

                        <div className="space-y-2">
                            <Label htmlFor="conductor">Conductor *</Label>
                            <Select
                                value={formData.conductor}
                                onValueChange={(value) => handleInputChange("conductor", value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className={errors.conductor ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar conductor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {conductoresDisponibles.map((conductor) => (
                                        <SelectItem key={conductor.documento} value={conductor.documento}>
                                            {conductor.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.conductor && <p className="text-sm text-red-500">{errors.conductor}</p>}
                        </div>
                    </div>

                    {/* Infracción */}
                    <div className="space-y-2">
                        <Label htmlFor="infraccion">Infracción *</Label>
                            <Select
                                value={formData.infraccion}
                                onValueChange={(value) => handleInputChange("infraccion", value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger className={errors.infraccion ? "border-red-500" : ""}>
                                    <SelectValue placeholder={
                                        isLoading ? "Cargando infracciones..." : "Seleccionar infracción"
                                    } />
                                </SelectTrigger>
                                <SelectContent>
                                    {tiposInfraccion.map((infraccion) => (
                                        <SelectItem key={infraccion.id} value={infraccion.type}>
                                            {infraccion.type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.infraccion && <p className="text-sm text-red-500">{errors.infraccion}</p>}
                    </div>

                    {/* Información Financiera */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Información Financiera</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="importe_multa">Importe Multa ($) *</Label>
                                <Input
                                    id="importe_multa"
                                    type="number"
                                    value={formData.importe_multa}
                                    onChange={(e) => handleInputChange("importe_multa", Number.parseFloat(e.target.value) || 0)}
                                    className={errors.importe_multa ? "border-red-500" : ""}
                                    min="0"
                                    step="0.01"
                                />
                                {errors.importe_multa && <p className="text-sm text-red-500">{errors.importe_multa}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="importe_pagado">Importe Pagado ($)</Label>
                                <Input
                                    id="importe_pagado"
                                    type="number"
                                    value={formData.importe_pagado}
                                    onChange={(e) => handleInputChange("importe_pagado", Number.parseFloat(e.target.value) || 0)}
                                    className={errors.importe_pagado ? "border-red-500" : ""}
                                    min="0"
                                    max={formData.importe_multa}
                                    step="0.01"
                                />
                                {errors.importe_pagado && <p className="text-sm text-red-500">{errors.importe_pagado}</p>}
                            </div>

                        </div>

                        <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Debe:</span>
                                    <span className={`ml-2 font-semibold text-lg ${calcularDebe() > 0 ? "text-red-600" : "text-green-600"}`}>
                                        ${calcularDebe().toLocaleString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Estado de Pago:</span>
                                    <span
                                        className={`ml-2 font-semibold text-lg ${getEstadoPagoCalculado() === "pagado"
                                                ? "text-green-600"
                                                : getEstadoPagoCalculado() === "vencido"
                                                    ? "text-red-600"
                                                    : getEstadoPagoCalculado() === "parcial"
                                                        ? "text-blue-600"
                                                        : "text-yellow-600"
                                            }`}
                                    >
                                        {getEstadoPagoText(getEstadoPagoCalculado())}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Porcentaje Pagado:</span>
                                    <span className="ml-2 font-semibold text-blue-600">
                                        {calcularPorcentajePago().toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            value={formData.observaciones}
                            onChange={(e) => handleInputChange("observaciones", e.target.value)}
                            rows={3}
                            placeholder="Comentarios adicionales sobre la multa..."
                        />
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={onClose}
                            disabled={updateMultaMutation.isPending || createMultaMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            disabled={updateMultaMutation.isPending || createMultaMutation.isPending}
                        >
                            {(updateMultaMutation.isPending || createMultaMutation.isPending) ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                multa ? "Guardar Cambios" : "Crear Multa"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}