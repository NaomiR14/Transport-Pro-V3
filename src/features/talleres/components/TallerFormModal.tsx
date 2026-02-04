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
import { Wrench, Loader2 } from "lucide-react"
import { 
  type Taller, 
  type CreateTallerRequest,
  useCreateTaller, 
  useUpdateTaller 
} from "@/features/talleres"

interface EditTallerModalProps {
  taller: Taller | null
  onSave: (taller: Taller) => void
  onClose: () => void
  isOpen: boolean
}

export default function EditTallerModal({ taller, onSave, onClose, isOpen }: EditTallerModalProps) {
  const [formData, setFormData] = useState<Partial<Taller>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Hook de React Query para actualizar taller
  const createTallerMutation = useCreateTaller()
  const updateTallerMutation = useUpdateTaller()


  useEffect(() => {
    if (taller) {
      setFormData(taller)
    } else {
      // Valores por defecto para nuevo taller
      setFormData({
        rate: 0,
        openHours: '',
        notes: ''
      })
    }
  }, [taller])

  const handleInputChange = (field: keyof Taller, value: string | number | boolean | string[]) => {
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

    if (!formData.name?.trim()) {
      newErrors.name = "El nombre del taller es requerido"
    }
    if (!formData.address?.trim()) {
      newErrors.address = "La dirección es requerida"
    }
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "El teléfono es requerido"
    }
    if (!formData.email?.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo no es válido"
    }
    if (!formData.contactPerson?.trim()) {
      newErrors.contactPerson = "El contacto principal es requerido"
    }
    if (
      formData.rate === undefined ||
      formData.rate < 0 ||
      formData.rate > 5
    ) {
      newErrors.rate = "La calificación debe estar entre 0 y 5"
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
      if (taller?.id) {
        // Crear objeto con solo los campos permitidos para actualizar
        const updateData: CreateTallerRequest = {
          name: formData.name!,
          address: formData.address!,
          phoneNumber: formData.phoneNumber!,
          email: formData.email!,
          contactPerson: formData.contactPerson!,
          openHours: formData.openHours || '',
          notes: formData.notes || '',
          rate: formData.rate || 0,
        }

        const updatedTaller = await updateTallerMutation.mutateAsync({
          id: taller.id,
          data: updateData
        })

        onSave(updatedTaller)
      } else {
        // Asegurar que todos los campos requeridos estén presentes
        const createData: CreateTallerRequest = {
          name: formData.name!,
          address: formData.address!,
          phoneNumber: formData.phoneNumber!,
          email: formData.email!,
          contactPerson: formData.contactPerson!,
          openHours: formData.openHours || '',
          notes: formData.notes || '',
          rate: formData.rate || 0,
        }
        console.log("🟢 MODAL - Datos para crear:", createData)
        const newTaller = await createTallerMutation.mutateAsync(createData)
        
        onSave(newTaller)
      }
    } catch (error) {
      // Error ya manejado por los hooks, solo log para debugging
      console.error('Error en el formulario:', error)
    }
  }

  const renderStarRating = () => {
    const calificacion = formData.rate || 0

    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleInputChange("rate", star)}
            className="focus:outline-none disabled:opacity-50"
            disabled={updateTallerMutation.isPending}
          >
            <Wrench
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
    <Dialog open={isOpen} onOpenChange={() => !updateTallerMutation.isPending && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {taller ? "Editar Taller de Mantenimiento" : "Crear Nuevo Taller"}
          </DialogTitle>
          <DialogDescription>
            {taller ? `Modifica la información del taller ${formData.id}` : "Completa la información del nuevo taller"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Nombre del Taller */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Taller *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
                disabled={updateTallerMutation.isPending}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Dirección - Span full width */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="address">Dirección *</Label>
              <Textarea
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
                rows={2}
                disabled={updateTallerMutation.isPending}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Información de Contacto */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className={errors.phoneNumber ? "border-red-500" : ""}
                placeholder="+52 55 1234-5678"
                disabled={updateTallerMutation.isPending}
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
                disabled={updateTallerMutation.isPending}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Contacto Principal */}
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contacto Principal *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ""}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className={errors.contactPerson ? "border-red-500" : ""}
                disabled={updateTallerMutation.isPending}
              />
              {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson}</p>}
            </div>
            {/* Horario de Atención */}
            <div className="space-y-2">
              <Label htmlFor="horario_atencion">Horario de Atención</Label>
              <Input
                id="horario_atencion"
                value={formData.openHours || ""}
                onChange={(e) => handleInputChange("openHours", e.target.value)}
                placeholder="Lunes a Viernes 8:00 - 18:00"
                disabled={updateTallerMutation.isPending}
              />
            </div>

            {/* Calificación y Estado */}
            <div className="space-y-2">
              <Label>Calificación</Label>
              {renderStarRating()}
              {errors.calificacion && <p className="text-sm text-red-500">{errors.rate}</p>}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas Adicionales</Label>
            <Textarea
              id="notas"
              value={formData.notes || ""}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
              placeholder="Información adicional sobre el taller..."
              disabled={updateTallerMutation.isPending}
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Resumen del Taller</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Calificación:</span>
                <span className="ml-2 text-blue-900 font-semibold">{formData.rate}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateTallerMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateTallerMutation.isPending}
            >
              {updateTallerMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                taller ? "Guardar Cambios" : "Crear Taller"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}