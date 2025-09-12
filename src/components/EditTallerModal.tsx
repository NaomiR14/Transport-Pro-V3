"use client"

import type React from "react"
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

interface Taller {
  taller_id: string
  numero_taller: string
  nombre_taller: string
  direccion: string
  telefono: string
  correo: string
  contacto_principal: string
  telefono_contacto: string
  especialidades: string[]
  activo: boolean
  calificacion: number
  horario_atencion: string
  sitio_web?: string
  notas?: string
}

interface EditTallerModalProps {
  taller: Taller
  onSave: (taller: Taller) => void
  onClose: () => void
}

export default function EditTallerModal({ taller, onSave, onClose }: EditTallerModalProps) {
  const [formData, setFormData] = useState<Taller>(taller)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState("")

  useEffect(() => {
    setFormData(taller)
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

    if (!formData.numero_taller.trim()) {
      newErrors.numero_taller = "El número de taller es requerido"
    }
    if (!formData.nombre_taller.trim()) {
      newErrors.nombre_taller = "El nombre del taller es requerido"
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida"
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido"
    }
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El correo no es válido"
    }
    if (!formData.contacto_principal.trim()) {
      newErrors.contacto_principal = "El contacto principal es requerido"
    }
    if (!formData.telefono_contacto.trim()) {
      newErrors.telefono_contacto = "El teléfono del contacto es requerido"
    }
    if (formData.calificacion < 0 || formData.calificacion > 5) {
      newErrors.calificacion = "La calificación debe estar entre 0 y 5"
    }
    if (!formData.horario_atencion.trim()) {
      newErrors.horario_atencion = "El horario de atención es requerido"
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
    if (nuevaEspecialidad && !formData.especialidades.includes(nuevaEspecialidad)) {
      handleInputChange("especialidades", [...formData.especialidades, nuevaEspecialidad])
      setNuevaEspecialidad("")
    }
  }

  const removerEspecialidad = (especialidad: string) => {
    handleInputChange(
      "especialidades",
      formData.especialidades.filter((e) => e !== especialidad),
    )
  }

  const renderStarRating = () => {
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
                star <= formData.calificacion
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-medium">{formData.calificacion.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Taller de Mantenimiento</DialogTitle>
          <DialogDescription>Modifica la información del taller {formData.numero_taller}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Información Básica */}
            <div className="space-y-2">
              <Label htmlFor="numero_taller">Número de Taller *</Label>
              <Input
                id="numero_taller"
                value={formData.numero_taller}
                onChange={(e) => handleInputChange("numero_taller", e.target.value)}
                className={errors.numero_taller ? "border-red-500" : ""}
              />
              {errors.numero_taller && <p className="text-sm text-red-500">{errors.numero_taller}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="nombre_taller">Nombre del Taller *</Label>
              <Input
                id="nombre_taller"
                value={formData.nombre_taller}
                onChange={(e) => handleInputChange("nombre_taller", e.target.value)}
                className={errors.nombre_taller ? "border-red-500" : ""}
              />
              {errors.nombre_taller && <p className="text-sm text-red-500">{errors.nombre_taller}</p>}
            </div>

            {/* Dirección - Span full width */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <Label htmlFor="direccion">Dirección *</Label>
              <Textarea
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion", e.target.value)}
                className={errors.direccion ? "border-red-500" : ""}
                rows={2}
              />
              {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
            </div>

            {/* Información de Contacto */}
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                className={errors.telefono ? "border-red-500" : ""}
                placeholder="+52 55 1234-5678"
              />
              {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="correo">Correo Electrónico *</Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) => handleInputChange("correo", e.target.value)}
                className={errors.correo ? "border-red-500" : ""}
              />
              {errors.correo && <p className="text-sm text-red-500">{errors.correo}</p>}
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
              <Label htmlFor="contacto_principal">Contacto Principal *</Label>
              <Input
                id="contacto_principal"
                value={formData.contacto_principal}
                onChange={(e) => handleInputChange("contacto_principal", e.target.value)}
                className={errors.contacto_principal ? "border-red-500" : ""}
              />
              {errors.contacto_principal && <p className="text-sm text-red-500">{errors.contacto_principal}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono_contacto">Teléfono del Contacto *</Label>
              <Input
                id="telefono_contacto"
                value={formData.telefono_contacto}
                onChange={(e) => handleInputChange("telefono_contacto", e.target.value)}
                className={errors.telefono_contacto ? "border-red-500" : ""}
                placeholder="+52 55 1234-5679"
              />
              {errors.telefono_contacto && <p className="text-sm text-red-500">{errors.telefono_contacto}</p>}
            </div>

            {/* Horario de Atención */}
            <div className="space-y-2">
              <Label htmlFor="horario_atencion">Horario de Atención *</Label>
              <Input
                id="horario_atencion"
                value={formData.horario_atencion}
                onChange={(e) => handleInputChange("horario_atencion", e.target.value)}
                className={errors.horario_atencion ? "border-red-500" : ""}
                placeholder="Lunes a Viernes 8:00 - 18:00"
              />
              {errors.horario_atencion && <p className="text-sm text-red-500">{errors.horario_atencion}</p>}
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
                value={formData.activo.toString()}
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
                      .filter((esp) => !formData.especialidades.includes(esp))
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
              {formData.especialidades.map((especialidad) => (
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
                <span className="ml-2 text-blue-900 font-semibold">{formData.especialidades.length}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
