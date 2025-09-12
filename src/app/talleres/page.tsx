"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Edit, Truck, Wrench, Phone, Mail, MapPin, User, Building } from "lucide-react"
import Link from "next/link"
import EditTallerModal from "@/components/EditTallerModal"

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

export default function MantenimientoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingTaller, setEditingTaller] = useState<Taller | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Mock data
  const talleres: Taller[] = [
    {
      taller_id: "1",
      numero_taller: "TALL-001",
      nombre_taller: "Servicios Automotrices García",
      direccion: "Av. Industrial 123, Col. Zona Industrial, Ciudad de México",
      telefono: "+52 55 1234-5678",
      correo: "servicios@garciaautomotriz.com",
      contacto_principal: "Ing. Roberto García Mendoza",
      telefono_contacto: "+52 55 1234-5679",
      especialidades: ["Motor", "Transmisión", "Frenos", "Suspensión"],
      activo: true,
      calificacion: 4.8,
      horario_atencion: "Lunes a Viernes 8:00 - 18:00, Sábados 8:00 - 14:00",
      sitio_web: "www.garciaautomotriz.com",
      notas: "Taller especializado en vehículos pesados",
    },
    {
      taller_id: "2",
      numero_taller: "TALL-002",
      nombre_taller: "Mantenimiento Integral López",
      direccion: "Calle Reforma 456, Col. Centro, Guadalajara, Jalisco",
      telefono: "+52 33 9876-5432",
      correo: "contacto@mantenimientolopez.com",
      contacto_principal: "Lic. María Elena López Ruiz",
      telefono_contacto: "+52 33 9876-5433",
      especialidades: ["Eléctrico", "Aire Acondicionado", "Diagnóstico"],
      activo: true,
      calificacion: 4.6,
      horario_atencion: "Lunes a Sábado 7:00 - 19:00",
      sitio_web: "www.mantenimientolopez.com",
      notas: "Servicio de emergencia 24/7",
    },
    {
      taller_id: "3",
      numero_taller: "TALL-003",
      nombre_taller: "Taller Mecánico Hernández",
      direccion: "Blvd. Díaz Ordaz 789, Col. Santa María, Monterrey, N.L.",
      telefono: "+52 81 5555-1234",
      correo: "info@tallerhernandez.com",
      contacto_principal: "Mtro. Carlos Hernández Vega",
      telefono_contacto: "+52 81 5555-1235",
      especialidades: ["Carrocería", "Pintura", "Soldadura"],
      activo: true,
      calificacion: 4.7,
      horario_atencion: "Lunes a Viernes 8:00 - 17:00",
      notas: "Especialistas en reparación de carrocería",
    },
    {
      taller_id: "4",
      numero_taller: "TALL-004",
      nombre_taller: "Centro de Servicio Automotriz Morales",
      direccion: "Av. Universidad 321, Col. Del Valle, Puebla, Puebla",
      telefono: "+52 22 3333-7890",
      correo: "servicio@moralesautomotriz.com",
      contacto_principal: "Ing. Ana Patricia Morales Silva",
      telefono_contacto: "+52 22 3333-7891",
      especialidades: ["Llantas", "Alineación", "Balanceo", "Suspensión"],
      activo: true,
      calificacion: 4.5,
      horario_atencion: "Lunes a Viernes 8:00 - 18:00, Sábados 8:00 - 13:00",
      sitio_web: "www.moralesautomotriz.com",
      notas: "Servicio express de llantas y alineación",
    },
    {
      taller_id: "5",
      numero_taller: "TALL-005",
      nombre_taller: "Diesel Service Rodríguez",
      direccion: "Calle Hidalgo 654, Col. Centro, Veracruz, Veracruz",
      telefono: "+52 22 9999-4567",
      correo: "diesel@rodriguezservice.com",
      contacto_principal: "Téc. Miguel Rodríguez Torres",
      telefono_contacto: "+52 22 9999-4568",
      especialidades: ["Motor Diesel", "Inyección", "Turbo"],
      activo: false,
      calificacion: 4.3,
      horario_atencion: "Lunes a Viernes 7:00 - 16:00",
      notas: "Temporalmente cerrado por remodelación",
    },
  ]

  const getCalificacionStars = (calificacion: number) => {
    const fullStars = Math.floor(calificacion)
    const hasHalfStar = calificacion % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Wrench key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Wrench className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Wrench key={i} className="h-4 w-4 text-gray-300" />
        ))}
        <span className="ml-2 text-sm font-medium">{calificacion.toFixed(1)}</span>
      </div>
    )
  }

  const getActivoBadge = (activo: boolean) => {
    return activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const filteredTalleres = talleres.filter(
    (taller) =>
      taller.numero_taller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.nombre_taller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.contacto_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.telefono.includes(searchTerm) ||
      taller.correo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditTaller = (taller: Taller) => {
    setEditingTaller(taller)
    setIsEditModalOpen(true)
  }

  const handleSaveTaller = (updatedTaller: Taller) => {
    console.log("Saving taller:", updatedTaller)
    setIsEditModalOpen(false)
    setEditingTaller(null)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setEditingTaller(null)
  }

  // Calculate statistics
  const talleresActivos = talleres.filter((t) => t.activo).length
  const talleresInactivos = talleres.filter((t) => !t.activo).length
  const calificacionPromedio = talleres.reduce((sum, t) => sum + t.calificacion, 0) / talleres.length || 0
  const totalEspecialidades = [...new Set(talleres.flatMap((t) => t.especialidades))].length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center mr-4">
                <Truck className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Volver al Dashboard</span>
              </Link>
              <Wrench className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Talleres de Mantenimiento</h1>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Taller
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Talleres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{talleres.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{talleresActivos}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-yellow-600">{calificacionPromedio.toFixed(1)}</div>
                  <Wrench className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{totalEspecialidades}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Talleres</CardTitle>
                  <CardDescription>Administra los talleres de mantenimiento y servicios automotrices</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Buscar talleres..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtros
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número Taller</TableHead>
                    <TableHead>Nombre del Taller</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Contacto Principal</TableHead>
                    <TableHead>Especialidades</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTalleres.map((taller) => (
                    <TableRow key={taller.taller_id}>
                      <TableCell className="font-medium">{taller.numero_taller}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{taller.nombre_taller}</div>
                            {taller.sitio_web && (
                              <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                                {taller.sitio_web}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start space-x-2 max-w-xs">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{taller.direccion}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="font-mono text-sm">{taller.telefono}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-blue-600 hover:underline cursor-pointer">{taller.correo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <div>
                            <div className="font-medium text-sm">{taller.contacto_principal}</div>
                            <div className="text-xs text-gray-500 font-mono">{taller.telefono_contacto}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {taller.especialidades.slice(0, 2).map((especialidad, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {especialidad}
                            </Badge>
                          ))}
                          {taller.especialidades.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{taller.especialidades.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getCalificacionStars(taller.calificacion)}</TableCell>
                      <TableCell>
                        <Badge className={getActivoBadge(taller.activo)}>{taller.activo ? "Activo" : "Inactivo"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEditTaller(taller)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {isEditModalOpen && editingTaller && (
          <EditTallerModal taller={editingTaller} onSave={handleSaveTaller} onClose={handleCloseModal} />
        )}
      </main>
    </div>
  )
}
