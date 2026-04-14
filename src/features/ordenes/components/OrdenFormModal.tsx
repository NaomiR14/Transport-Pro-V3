"use client"

import { useState, useEffect, useMemo, useRef } from "react"
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
    type Orden,
    type CreateOrdenRequest,
    type EstadoOrden,
    useCreateOrden,
    useUpdateOrden,
} from "@/features/ordenes"
import { useVehicles } from "@/features/vehiculos"
import { useRutas } from "@/features/rutas"

interface OrdenFormModalProps {
    orden: Orden | null
    onSave: (orden: Orden) => void
    onClose: () => void
    isOpen: boolean
}

export default function OrdenFormModal({ orden, onSave, onClose, isOpen }: OrdenFormModalProps) {
    const [formData, setFormData] = useState<Partial<CreateOrdenRequest>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const isUserRutaChange = useRef(false)

    const createOrdenMutation = useCreateOrden()
    const updateOrdenMutation = useUpdateOrden()

    // Obtener vehículos y rutas disponibles
    const { data: vehicles } = useVehicles()
    const { data: rutas } = useRutas()

    const vehiculosDisponibles = useMemo(() => {
        const plates = vehicles?.map(v => v.licensePlate).filter(Boolean) || []
        // Asegurar que la placa de la orden actual esté en las opciones
        if (orden?.placa_vehiculo && !plates.includes(orden.placa_vehiculo)) {
            plates.unshift(orden.placa_vehiculo)
        }
        return plates
    }, [vehicles, orden])
    const rutasDisponibles = useMemo(() => rutas?.map(r => ({
        id: r.id,
        label: `${r.origen} → ${r.destino} (${r.placa_vehiculo})`,
        placa_vehiculo: r.placa_vehiculo,
        conductor: r.nombre_conductor || r.conductor,
    })) || [], [rutas])

    const isSaving = createOrdenMutation.isPending || updateOrdenMutation.isPending

    // Inicializar formData
    useEffect(() => {
        isUserRutaChange.current = false
        if (orden) {
            setFormData({
                numero_orden: orden.numero_orden,
                placa_vehiculo: orden.placa_vehiculo,
                ruta_viaje_id: orden.ruta_viaje_id,
                estado: orden.estado,
                carta_porte: orden.carta_porte,
            })
        } else {
            setFormData({
                numero_orden: "",
                placa_vehiculo: "",
                ruta_viaje_id: "",
                estado: "pendiente",
                carta_porte: "",
            })
        }
        setErrors({})
    }, [orden, isOpen])

    // Auto-seleccionar vehículo solo cuando el USUARIO elige una ruta (no durante inicialización)
    useEffect(() => {
        if (isUserRutaChange.current && formData.ruta_viaje_id) {
            const selectedRuta = rutasDisponibles.find(r => r.id === formData.ruta_viaje_id)
            if (selectedRuta) {
                setFormData(prev => ({
                    ...prev,
                    placa_vehiculo: selectedRuta.placa_vehiculo,
                }))
            }
        }
    }, [formData.ruta_viaje_id, rutasDisponibles])

    const handleInputChange = (field: keyof CreateOrdenRequest, value: string) => {
        if (field === "ruta_viaje_id") {
            isUserRutaChange.current = true
        }
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.numero_orden?.trim()) {
            newErrors.numero_orden = "El número de orden es requerido"
        }
        if (!formData.placa_vehiculo?.trim()) {
            newErrors.placa_vehiculo = "El vehículo es requerido"
        }
        if (!formData.ruta_viaje_id?.trim()) {
            newErrors.ruta_viaje_id = "La ruta es requerida"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            const apiData: CreateOrdenRequest = {
                numero_orden: formData.numero_orden!,
                placa_vehiculo: formData.placa_vehiculo!,
                ruta_viaje_id: formData.ruta_viaje_id!,
                estado: (formData.estado as EstadoOrden) || "pendiente",
                carta_porte: formData.carta_porte?.trim() || null,
            }

            if (orden?.id) {
                const updatedOrden = await updateOrdenMutation.mutateAsync({
                    id: orden.id,
                    data: apiData,
                })
                onSave(updatedOrden)
            } else {
                const newOrden = await createOrdenMutation.mutateAsync(apiData)
                onSave(newOrden)
            }
        } catch (error) {
            console.error('Error en el formulario de orden:', error)
        }
    }

    // Info del conductor basada en la ruta seleccionada
    const selectedRutaInfo = rutasDisponibles.find(r => r.id === formData.ruta_viaje_id)

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => !isSaving && onClose()}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {orden ? "Editar Orden" : "Crear Nueva Orden"}
                    </DialogTitle>
                    <DialogDescription>
                        {orden
                            ? `Modifica la información de la orden ${orden.numero_orden}`
                            : "Completa la información de la nueva orden"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Número de Orden */}
                    <div className="space-y-2">
                        <Label htmlFor="numero_orden">Número de Orden *</Label>
                        <Input
                            id="numero_orden"
                            value={formData.numero_orden || ""}
                            onChange={(e) => handleInputChange("numero_orden", e.target.value)}
                            className={errors.numero_orden ? "border-red-500" : ""}
                            placeholder="ORD-001"
                            disabled={isSaving}
                        />
                        {errors.numero_orden && <p className="text-sm text-red-500">{errors.numero_orden}</p>}
                    </div>

                    {/* Ruta */}
                    <div className="space-y-2">
                        <Label htmlFor="ruta_viaje_id">Ruta Asignada *</Label>
                        <Select
                            value={formData.ruta_viaje_id || undefined}
                            onValueChange={(value) => handleInputChange("ruta_viaje_id", value)}
                            disabled={isSaving}
                        >
                            <SelectTrigger className={errors.ruta_viaje_id ? "border-red-500" : ""}>
                                <SelectValue placeholder="Seleccionar ruta" />
                            </SelectTrigger>
                            <SelectContent>
                                {rutasDisponibles.map((ruta) => (
                                    <SelectItem key={ruta.id} value={ruta.id}>
                                        {ruta.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.ruta_viaje_id && <p className="text-sm text-red-500">{errors.ruta_viaje_id}</p>}
                        {selectedRutaInfo && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Conductor: {selectedRutaInfo.conductor}
                            </p>
                        )}
                    </div>

                    {/* Vehículo */}
                    <div className="space-y-2">
                        <Label htmlFor="placa_vehiculo">Vehículo *</Label>
                        <Select
                            value={formData.placa_vehiculo || undefined}
                            onValueChange={(value) => handleInputChange("placa_vehiculo", value)}
                            disabled={isSaving}
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

                    {/* Estado */}
                    <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select
                            value={formData.estado || "pendiente"}
                            onValueChange={(value) => handleInputChange("estado", value)}
                            disabled={isSaving}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="transito">En Tránsito</SelectItem>
                                <SelectItem value="entregado">Entregado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Carta Porte */}
                    <div className="space-y-2">
                        <Label htmlFor="carta_porte">Carta Porte (opcional)</Label>
                        <Input
                            id="carta_porte"
                            value={formData.carta_porte || ""}
                            onChange={(e) => handleInputChange("carta_porte", e.target.value)}
                            placeholder="Número de carta porte"
                            disabled={isSaving}
                        />
                    </div>

                    <DialogFooter className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving}
                            className="bg-gradient-to-r from-blue-400 via-primary-blue to-blue-700 text-white font-semibold"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                orden ? "Guardar Cambios" : "Crear Orden"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
