"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Switch } from "@/components/ui/switch"
import { Loader2, User, Star } from "lucide-react"
import { Conductor, CreateConductorRequest } from "@/types/conductor-types"
import { useCreateConductor, useUpdateConductor } from "@/hooks/use-conductores"

interface EditConductorModalProps {
    conductor: Conductor | null
    onSave: (conductor: Conductor) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditConductorModal({ conductor, onSave, onClose, isOpen }: EditConductorModalProps) {
    const [formData, setFormData] = useState<Partial<CreateConductorRequest>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Hook de React Query para conductores
    const createConductorMutation = useCreateConductor()
    const updateConductorMutation = useUpdateConductor()

    // Inicializar formData cuando cambia el conductor o se abre el modal
    useEffect(() => {
        if (conductor) {
            // Para edición, usar los datos existentes del conductor
            setFormData({
                documento_identidad: conductor.documento_identidad,
                nombre_conductor: conductor.nombre_conductor,
                numero_licencia: conductor.numero_licencia,
                direccion: conductor.direccion,
                telefono: conductor.telefono,
                calificacion: conductor.calificacion,
                email: conductor.email,
                activo: conductor.activo,
                fecha_vencimiento_licencia: conductor.fecha_vencimiento_licencia,
            })
        } else {
            // Valores por defecto para nuevo conductor
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);

            setFormData({
                documento_identidad: "",
                nombre_conductor: "",
                numero_licencia: "",
                direccion: "",
                telefono: "",
                calificacion: 3.0,
                email: "",
                activo: true,
                fecha_vencimiento_licencia: nextYear.toISOString().split('T')[0],
            })
        }
    }, [conductor, isOpen])

    const handleInputChange = (field: keyof CreateConductorRequest, value: string | number | boolean) => {
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

        if (!formData.documento_identidad?.trim()) {
            newErrors.documento_identidad = "El documento de identidad es requerido"
        }
        if (!formData.nombre_conductor?.trim()) {
            newErrors.nombre_conductor = "El nombre del conductor es requerido"
        }
        if (!formData.numero_licencia?.trim()) {
            newErrors.numero_licencia = "El número de licencia es requerido"
        }
        if (!formData.direccion?.trim()) {
            newErrors.direccion = "La dirección es requerida"
        }
        if (!formData.telefono?.trim()) {
            newErrors.telefono = "El teléfono es requerido"
        }
        if (!formData.email?.trim()) {
            newErrors.email = "El correo electrónico es requerido"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo no es válido"
        }
        if (formData.calificacion === undefined || formData.calificacion < 0 || formData.calificacion > 5) {
            newErrors.calificacion = "La calificación debe estar entre 0 y 5"
        }
        if (!formData.fecha_vencimiento_licencia?.trim()) {
            newErrors.fecha_vencimiento_licencia = "La fecha de vencimiento de licencia es requerida"
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
            const apiData: CreateConductorRequest = {
                documento_identidad: formData.documento_identidad!,
                nombre_conductor: formData.nombre_conductor!,
                numero_licencia: formData.numero_licencia!,
                direccion: formData.direccion!,
                telefono: formData.telefono!,
                calificacion: Number(formData.calificacion),
                email: formData.email!,
                activo: Boolean(formData.activo),
                fecha_vencimiento_licencia: formData.fecha_vencimiento_licencia!,
            }

            if (conductor?.id) {
                // Actualizar conductor existente
                const updatedConductor = await updateConductorMutation.mutateAsync({
                    id: conductor.id,
                    data: apiData
                })
                onSave(updatedConductor)
            } else {
                // Crear nuevo conductor
                const newConductor = await createConductorMutation.mutateAsync(apiData)
                onSave(newConductor)
            }
        } catch (error) {
            // Error ya manejado por los hooks, solo log para debugging
            console.error('Error en el formulario:', error)
        }
    }

    const renderStarRating = () => {
        const calificacion = formData.calificacion || 0

        return (
            <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => handleInputChange("calificacion", star)}
                        className="focus:outline-none disabled:opacity-50"
                        disabled={updateConductorMutation.isPending}
                    >
                        <Star
                            className={`h-6 w-6 ${star <= calificacion
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300 hover:text-yellow-400"
                                }`}
                        />
                    </button>
                ))}
                <span className="ml-2 text-sm font-medium">{calificacion.toFixed(1)}</span>
            </div>
        )
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => !updateConductorMutation.isPending && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {conductor ? "Editar Conductor" : "Crear Nuevo Conductor"}
                    </DialogTitle>
                    <DialogDescription>
                        {conductor ? `Modifica la información del conductor ${formData.nombre_conductor}` : "Completa la información del nuevo conductor"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Documento de Identidad */}
                        <div className="space-y-2">
                            <Label htmlFor="documento_identidad">Documento de Identidad *</Label>
                            <Input
                                id="documento_identidad"
                                value={formData.documento_identidad || ""}
                                onChange={(e) => handleInputChange("documento_identidad", e.target.value)}
                                className={errors.documento_identidad ? "border-red-500" : ""}
                                placeholder="12345678"
                                disabled={updateConductorMutation.isPending}
                            />
                            {errors.documento_identidad && <p className="text-sm text-red-500">{errors.documento_identidad}</p>}
                        </div>

                        {/* Nombre del Conductor */}
                        <div className="space-y-2">
                            <Label htmlFor="nombre_conductor">Nombre del Conductor *</Label>
                            <Input
                                id="nombre_conductor"
                                value={formData.nombre_conductor || ""}
                                onChange={(e) => handleInputChange("nombre_conductor", e.target.value)}
                                className={errors.nombre_conductor ? "border-red-500" : ""}
                                placeholder="Juan Pérez García"
                                disabled={updateConductorMutation.isPending}
                            />
                            {errors.nombre_conductor && <p className="text-sm text-red-500">{errors.nombre_conductor}</p>}
                        </div>

                        {/* Número de Licencia */}
                        <div className="space-y-2">
                            <Label htmlFor="numero_licencia">Número de Licencia *</Label>
                            <Input
                                id="numero_licencia"
                                value={formData.numero_licencia || ""}
                                onChange={(e) => handleInputChange("numero_licencia", e.target.value.toUpperCase())}
                                className={errors.numero_licencia ? "border-red-500" : ""}
                                placeholder="LIC-2024-001"
                                disabled={updateConductorMutation.isPending}
                            />
                            {errors.numero_licencia && <p className="text-sm text-red-500">{errors.numero_licencia}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono *</Label>
                            <Input
                                id="telefono"
                                value={formData.telefono || ""}
                                onChange={(e) => handleInputChange("telefono", e.target.value)}
                                className={errors.telefono ? "border-red-500" : ""}
                                placeholder="+52 55 1234-5678"
                                disabled={updateConductorMutation.isPending}
                            />
                            {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email || ""}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={errors.email ? "border-red-500" : ""}
                                placeholder="ejemplo@empresa.com"
                                disabled={updateConductorMutation.isPending}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        {/* Fecha Vencimiento Licencia */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha_vencimiento_licencia">Fecha Vencimiento Licencia *</Label>
                            <Input
                                id="fecha_vencimiento_licencia"
                                type="date"
                                value={formData.fecha_vencimiento_licencia || ""}
                                onChange={(e) => handleInputChange("fecha_vencimiento_licencia", e.target.value)}
                                className={errors.fecha_vencimiento_licencia ? "border-red-500" : ""}
                                disabled={updateConductorMutation.isPending}
                            />
                            {errors.fecha_vencimiento_licencia && <p className="text-sm text-red-500">{errors.fecha_vencimiento_licencia}</p>}
                        </div>

                        {/* Estado Activo */}
                        <div className="space-y-2">
                            <Label htmlFor="activo">Estado</Label>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="activo"
                                    checked={formData.activo || false}
                                    onCheckedChange={(checked) => handleInputChange("activo", checked)}
                                    disabled={updateConductorMutation.isPending}
                                />
                                <Label htmlFor="activo" className="cursor-pointer">
                                    {formData.activo ? "Activo" : "Inactivo"}
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Dirección - Span full width */}
                    <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección *</Label>
                        <Textarea
                            id="direccion"
                            value={formData.direccion || ""}
                            onChange={(e) => handleInputChange("direccion", e.target.value)}
                            className={errors.direccion ? "border-red-500" : ""}
                            rows={3}
                            placeholder="Av. Principal 123, Ciudad, Estado"
                            disabled={updateConductorMutation.isPending}
                        />
                        {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
                    </div>

                    {/* Calificación */}
                    <div className="space-y-2">
                        <Label>Calificación *</Label>
                        {renderStarRating()}
                        {errors.calificacion && <p className="text-sm text-red-500">{errors.calificacion}</p>}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Resumen del Conductor</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-800">Estado:</span>
                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${formData.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {formData.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Calificación:</span>
                                <span className="ml-2 text-blue-900 font-semibold">{formData.calificacion?.toFixed(1) || "0.0"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Licencia:</span>
                                <span className="ml-2 text-blue-900">{formData.numero_licencia || "No asignada"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Vencimiento:</span>
                                <span className="ml-2 text-blue-900">
                                    {formData.fecha_vencimiento_licencia ? new Date(formData.fecha_vencimiento_licencia).toLocaleDateString('es-MX') : "No especificada"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={updateConductorMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateConductorMutation.isPending}
                        >
                            {updateConductorMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                conductor ? "Guardar Cambios" : "Crear Conductor"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}