"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Wrench, X } from "lucide-react"

// Nueva interfaz que coincide con el formato de la API
interface Taller {
  id: string
  name: string
  address: string
  phoneNumber: string
  email: string
  contactPerson: string
  // Campos opcionales que podrían no venir de la API
  numero_taller?: string
  telefono_contacto?: string
  especialidades?: string[]
  activo?: boolean
  calificacion?: number
  horario_atencion?: string
  sitio_web?: string
  notas?: string
}

interface EditTallerModalProps {
  taller: Taller | null
  onSave: (taller: Taller) => void
  onClose: () => void
  isSaving?: boolean
}

export default function EditTallerModal({ taller, onSave, onClose, isSaving = false }: EditTallerModalProps) {
  const [formData, setFormData] = useState<Taller>({
    id: "",
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    contactPerson: "",
    numero_taller: "",
    telefono_contacto: "",
    especialidades: [],
    activo: true,
    calificacion: 0,
    horario_atencion: "",
    sitio_web: "",
    notas: ""
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("")

  useEffect(() => {
    if (taller) {
      setFormData(taller)
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

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del taller es requerido"
    }
    if (!formData.address.trim()) {
      newErrors.address = "La dirección es requerida"
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "El teléfono es requerido"
    }
    if (!formData.email.trim()) {
      newErrors.email = "El correo es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo no es válido"
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "El contacto principal es requerido"
    }
    if (formData.calificacion && (formData.calificacion < 0 || formData.calificacion > 5)) {
      newErrors.calificacion = "La calificación debe estar entre 0 y 5"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  const especialidadesDisponibles = [
    "Motor",
    "Transmisión",
    "Frenos",
    "Suspensión",
    "Eléctrico",
    "Aire Acondicionado",
    "Diagnóstico",
    "Carrocería",
    "Pintura",
    "Soldadura",
    "Llantas",
    "Alineación",
    "Balanceo",
    "Motor Diesel",
    "Inyección",
    "Turbo",
    "Sistema de Escape",
    "Refrigeración",
    "Dirección",
    "Clutch",
  ]

  const agregarEspecialidad = () => {
    if (nuevaEspecialidad && !formData.especialidades?.includes(nuevaEspecialidad)) {
      handleInputChange("especialidades", [...(formData.especialidades || []), nuevaEspecialidad])
      setNuevaEspecialidad("")
    }
  }

  const removerEspecialidad = (especialidad: string) => {
    handleInputChange(
      "especialidades",
      (formData.especialidades || []).filter((e) => e !== especialidad),
    )
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
            className="focus:outline-none"
          >
            <Wrench
              className={`h-6 w-6 ${
                star <= calificacion
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

  if (!taller) return null

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formData.id ? "Editar Taller de Mantenimiento" : "Nuevo Taller de Mantenimiento"}
          </DialogTitle>
          <DialogDescription>
            {formData.id 
              ? `Modifica la información del taller ${formData.numero_taller || formData.name}` 
              : "Completa la información para agregar un nuevo taller"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Información Básica */}
            <div className="space-y-2">
              <Label htmlFor="numero_taller">Número de Taller</Label>
              <Input
                id="numero_taller"
                value={formData.numero_taller || ""}
                onChange={(e) => handleInputChange("numero_taller", e.target.value)}
                className={errors.numero_taller ? "border-red-500" : ""}
              />
              {errors.numero_taller && <p className="text-sm text-red-500">{errors.numero_taller}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nombre del Taller *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Dirección - Span full width */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="address">Dirección *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={errors.address ? "border-red-500" : ""}
                rows={2}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Información de Contacto */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Teléfono *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                className={errors.phoneNumber ? "border-red-500" : ""}
                placeholder="+1-555-1234"
              />
              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sitio_web">Sitio Web</Label>
              <Input
                id="sitio_web"
                value={formData.sitio_web || ""}
                onChange={(e) => handleInputChange("sitio_web", e.target.value)}
                placeholder="www.ejemplo.com"
              />
            </div>

            {/* Contacto Principal */}
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contacto Principal *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                className={errors.contactPerson ? "border-red-500" : ""}
              />
              {errors.contactPerson && <p className="text-sm text-red-500">{errors.contactPerson}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono_contacto">Teléfono del Contacto</Label>
              <Input
                id="telefono_contacto"
                value={formData.telefono_contacto || ""}
                onChange={(e) => handleInputChange("telefono_contacto", e.target.value)}
                placeholder="+1-555-5678"
              />
            </div>

            {/* Horario de Atención */}
            <div className="space-y-2">
              <Label htmlFor="horario_atencion">Horario de Atención</Label>
              <Input
                id="horario_atencion"
                value={formData.horario_atencion || ""}
                onChange={(e) => handleInputChange("horario_atencion", e.target.value)}
                placeholder="Lunes a Viernes 8:00 - 18:00"
              />
            </div>

            {/* Calificación y Estado */}
            <div className="space-y-2">
              <Label>Calificación</Label>
              {renderStarRating()}
              {errors.calificacion && <p className="text-sm text-red-500">{errors.calificacion}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="activo">Estado del Taller</Label>
              <Select
                value={formData.activo?.toString() || "true"}
                onValueChange={(value) => handleInputChange("activo", value === "true")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Especialidades */}
          <div className="space-y-4">
            <div>
              <Label>Especialidades</Label>
              <div className="flex space-x-2 mt-2">
                <Select value={nuevaEspecialidad} onValueChange={setNuevaEspecialidad}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Seleccionar especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidadesDisponibles
                      .filter((esp) => !formData.especialidades?.includes(esp))
                      .map((especialidad) => (
                        <SelectItem key={especialidad} value={especialidad}>
                          {especialidad}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={agregarEspecialidad} disabled={!nuevaEspecialidad}>
                  Agregar
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.especialidades?.map((especialidad) => (
                <Badge key={especialidad} variant="secondary" className="flex items-center space-x-1">
                  <span>{especialidad}</span>
                  <button
                    type="button"
                    onClick={() => removerEspecialidad(especialidad)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(!formData.especialidades || formData.especialidades.length === 0) && (
                <span className="text-sm text-gray-500">No hay especialidades seleccionadas</span>
              )}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notas">Notas Adicionales</Label>
            <Textarea
              id="notas"
              value={formData.notas || ""}
              onChange={(e) => handleInputChange("notas", e.target.value)}
              rows={3}
              placeholder="Información adicional sobre el taller..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Resumen del Taller</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">Estado:</span>
                <span className={`ml-2 font-semibold ${formData.activo ? "text-green-600" : "text-gray-600"}`}>
                  {formData.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div>
                <span className="font-medium text-blue-800">Especialidades:</span>
                <span className="ml-2 text-blue-900 font-semibold">{formData.especialidades?.length || 0}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}