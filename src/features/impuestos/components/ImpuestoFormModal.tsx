"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { 
  type ImpuestoVehicular, 
  type CreateImpuestoRequest, 
  type UpdateImpuestoRequest,
  useCreateImpuesto, 
  useUpdateImpuesto 
} from "@/features/impuestos"

interface EditImpuestoModalProps {
    impuesto: ImpuestoVehicular | null
    onSave: (impuesto: ImpuestoVehicular) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditImpuestoModal({ impuesto, onSave, onClose, isOpen }: EditImpuestoModalProps) {
    const [formData, setFormData] = useState<Partial<CreateImpuestoRequest>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Hook de React Query para impuestos
    const createImpuestoMutation = useCreateImpuesto()
    const updateImpuestoMutation = useUpdateImpuesto()

    // Inicializar formData cuando cambia el impuesto o se abre el modal
    useEffect(() => {
        if (impuesto) {
            // Para edición, usar los datos existentes del impuesto
            setFormData({
                placa_vehiculo: impuesto.placa_vehiculo,
                tipo_impuesto: impuesto.tipo_impuesto,
                anio_impuesto: impuesto.anio_impuesto,
                impuesto_monto: impuesto.impuesto_monto,
                fecha_pago: impuesto.fecha_pago,
            })
        } else {
            // Valores por defecto para nuevo impuesto
            const currentYear = new Date().getFullYear()
            setFormData({
                placa_vehiculo: "",
                tipo_impuesto: "",
                anio_impuesto: currentYear,
                impuesto_monto: 0,
                fecha_pago: new Date().toISOString().split('T')[0], // Fecha actual
            })
        }
    }, [impuesto, isOpen])

    const handleInputChange = (field: keyof CreateImpuestoRequest, value: string | number) => {
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
        if (!formData.tipo_impuesto?.trim()) {
            newErrors.tipo_impuesto = "El tipo de impuesto es requerido"
        }
        if (!formData.anio_impuesto || formData.anio_impuesto < 2000 || formData.anio_impuesto > new Date().getFullYear() + 1) {
            newErrors.anio_impuesto = "El año del impuesto debe ser válido"
        }
        if (!formData.impuesto_monto || formData.impuesto_monto <= 0) {
            newErrors.impuesto_monto = "El monto del impuesto debe ser mayor a 0"
        }
        if (!formData.fecha_pago?.trim()) {
            newErrors.fecha_pago = "La fecha de pago es requerida"
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
            const apiData: CreateImpuestoRequest = {
                placa_vehiculo: formData.placa_vehiculo!,
                tipo_impuesto: formData.tipo_impuesto!,
                anio_impuesto: Number(formData.anio_impuesto),
                impuesto_monto: Number(formData.impuesto_monto),
                fecha_pago: formData.fecha_pago!,
            }

            const apiDataUpdate: UpdateImpuestoRequest = {
                placa_vehiculo: formData.placa_vehiculo!,
                tipo_impuesto: formData.tipo_impuesto!,
                anio_impuesto: Number(formData.anio_impuesto),
                impuesto_monto: Number(formData.impuesto_monto),
                fecha_pago: formData.fecha_pago!,
                estado_pago: impuesto?.estado_pago || "pendiente",
            }
            

            if (impuesto?.id) {
                // Actualizar impuesto existente
                const updatedImpuesto = await updateImpuestoMutation.mutateAsync({
                    id: impuesto.id,
                    data: apiDataUpdate
                })
                onSave(updatedImpuesto)
            } else {
                // Crear nuevo impuesto
                const newImpuesto = await createImpuestoMutation.mutateAsync(apiData)
                onSave(newImpuesto)
            }
        } catch (error) {
            // Error ya manejado por los hooks, solo log para debugging
            console.error('Error en el formulario:', error)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => !updateImpuestoMutation.isPending && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {impuesto ? "Editar Impuesto Vehicular" : "Crear Nuevo Impuesto Vehicular"}
                    </DialogTitle>
                    <DialogDescription>
                        {impuesto ? `Modifica la información del impuesto ${formData.tipo_impuesto}` : "Completa la información del nuevo impuesto vehicular"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Placa del Vehículo */}
                        <div className="space-y-2">
                            <Label htmlFor="placa_vehiculo">Placa del Vehículo *</Label>
                            <Input
                                id="placa_vehiculo"
                                value={formData.placa_vehiculo || ""}
                                onChange={(e) => handleInputChange("placa_vehiculo", e.target.value.toUpperCase())}
                                className={errors.placa_vehiculo ? "border-red-500" : ""}
                                placeholder="ABC-123-A"
                                disabled={updateImpuestoMutation.isPending}
                            />
                            {errors.placa_vehiculo && <p className="text-sm text-red-500">{errors.placa_vehiculo}</p>}
                        </div>

                        {/* Tipo de Impuesto */}
                        <div className="space-y-2">
                            <Label htmlFor="tipo_impuesto">Tipo de Impuesto *</Label>
                            <Select
                                value={formData.tipo_impuesto || ""}
                                onValueChange={(value) => handleInputChange("tipo_impuesto", value)}
                                disabled={updateImpuestoMutation.isPending}
                            >
                                <SelectTrigger className={errors.tipo_impuesto ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Tenencia">Tenencia</SelectItem>
                                    <SelectItem value="Verificación">Verificación</SelectItem>
                                    <SelectItem value="Refrendo">Refrendo</SelectItem>
                                    <SelectItem value="Derechos">Derechos</SelectItem>
                                    <SelectItem value="Multas">Multas</SelectItem>
                                    <SelectItem value="Otros">Otros</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipo_impuesto && <p className="text-sm text-red-500">{errors.tipo_impuesto}</p>}
                        </div>

                        {/* Año del Impuesto */}
                        <div className="space-y-2">
                            <Label htmlFor="anio_impuesto">Año del Impuesto *</Label>
                            <Input
                                id="anio_impuesto"
                                type="number"
                                value={formData.anio_impuesto || ""}
                                onChange={(e) => handleInputChange("anio_impuesto", e.target.value)}
                                className={errors.anio_impuesto ? "border-red-500" : ""}
                                placeholder="2024"
                                min="2000"
                                max={new Date().getFullYear() + 1}
                                disabled={updateImpuestoMutation.isPending}
                            />
                            {errors.anio_impuesto && <p className="text-sm text-red-500">{errors.anio_impuesto}</p>}
                        </div>

                        {/* Monto del Impuesto */}
                        <div className="space-y-2">
                            <Label htmlFor="impuesto_monto">Monto del Impuesto ($) *</Label>
                            <Input
                                id="impuesto_monto"
                                type="number"
                                value={formData.impuesto_monto || ""}
                                onChange={(e) => handleInputChange("impuesto_monto", e.target.value)}
                                className={errors.impuesto_monto ? "border-red-500" : ""}
                                placeholder="8500.00"
                                min="0"
                                step="0.01"
                                disabled={updateImpuestoMutation.isPending}
                            />
                            {errors.impuesto_monto && <p className="text-sm text-red-500">{errors.impuesto_monto}</p>}
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
                                disabled={updateImpuestoMutation.isPending}
                            />
                            {errors.fecha_pago && <p className="text-sm text-red-500">{errors.fecha_pago}</p>}
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Resumen del Impuesto</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-800">Vehículo:</span>
                                <span className="ml-2 text-blue-900 font-semibold">{formData.placa_vehiculo || "No especificado"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Tipo:</span>
                                <span className="ml-2 text-blue-900">{formData.tipo_impuesto || "No especificado"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Año:</span>
                                <span className="ml-2 text-blue-900">{formData.anio_impuesto || "No especificado"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Monto:</span>
                                <span className="ml-2 text-blue-900">${formData.impuesto_monto?.toLocaleString() || "0"}</span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={updateImpuestoMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateImpuestoMutation.isPending}
                        >
                            {updateImpuestoMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                impuesto ? "Guardar Cambios" : "Crear Impuesto"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}