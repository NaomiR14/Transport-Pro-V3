"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Eye, Edit, Truck, Wrench, Phone, Mail, MapPin, User, Building } from "lucide-react"
import Link from "next/link"
import EditTallerModal from "@/components/EditTallerModal"
import axios from "axios"

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

// Función para obtener talleres
const fetchTalleres = async (): Promise<Taller[]> => {
  const { data } = await axios.get("http://localhost:5000/api/Workshops")
  return data
}

// Función para crear/actualizar taller
const saveTaller = async (taller: Taller): Promise<Taller> => {
  if (taller.id) {
    // Actualizar taller existente
    const { data } = await axios.put(`http://localhost:5000/api/Workshops/${taller.id}`, taller)
    return data
  } else {
    // Crear nuevo taller
    const { data } = await axios.post("http://localhost:5000/api/Workshops", taller)
    return data
  }
}

export default function MantenimientoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [editingTaller, setEditingTaller] = useState<Taller | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // Usar React Query para obtener los talleres
  const { data: talleres = [], isLoading, error, isError } = useQuery<Taller[], Error>({
    queryKey: ['talleres'],
    queryFn: fetchTalleres,
  })

  // Mutación para crear/actualizar talleres
  const mutation = useMutation<Taller, Error, Taller>({
    mutationFn: saveTaller,
    onSuccess: () => {
      // Invalidar la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['talleres'] })
      setIsEditModalOpen(false)
      setEditingTaller(null)
    },
    onError: (error) => {
      console.error("Error saving taller:", error)
    }
  })

  const getCalificacionStars = (calificacion: number = 0) => {
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

  const getActivoBadge = (activo: boolean = true) => {
    return activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const filteredTalleres = talleres.filter(
    (taller) =>
      (taller.numero_taller || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      taller.phoneNumber.includes(searchTerm) ||
      taller.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditTaller = (taller: Taller) => {
    setEditingTaller(taller)
    setIsEditModalOpen(true)
  }

  const handleSaveTaller = (updatedTaller: Taller) => {
    mutation.mutate(updatedTaller)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setEditingTaller(null)
  }

  // Calcular estadísticas
  const talleresActivos = talleres.filter((t) => t.activo !== false).length
  const talleresInactivos = talleres.filter((t) => t.activo === false).length
  const calificacionPromedio = talleres.reduce((sum, t) => sum + (t.calificacion || 0), 0) / talleres.length || 0
  const totalEspecialidades = [...new Set(talleres.flatMap((t) => t.especialidades || []))].length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Wrench className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando talleres...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md">
            <p className="font-medium">Error: {error.message}</p>
            <Button 
              onClick={() => queryClient.refetchQueries({ queryKey: ['talleres'] })} 
              className="mt-4"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
            <Button onClick={() => handleEditTaller({} as Taller)}>
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
              {filteredTalleres.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No se encontraron talleres</p>
                </div>
              ) : (
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
                      <TableRow key={taller.id}>
                        <TableCell className="font-medium">{taller.id || "N/A"}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{taller.name}</div>
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
                            <span className="text-sm">{taller.address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="font-mono text-sm">{taller.phoneNumber}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-blue-600 hover:underline cursor-pointer">{taller.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium text-sm">{taller.contactPerson}</div>
                              {taller.telefono_contacto && (
                                <div className="text-xs text-gray-500 font-mono">{taller.telefono_contacto}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(taller.especialidades || []).slice(0, 2).map((especialidad, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {especialidad}
                              </Badge>
                            ))}
                            {(taller.especialidades || []).length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{(taller.especialidades || []).length - 2}
                              </Badge>
                            )}
                            {(taller.especialidades || []).length === 0 && (
                              <span className="text-xs text-gray-500">No especificado</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getCalificacionStars(taller.calificacion)}</TableCell>
                        <TableCell>
                          <Badge className={getActivoBadge(taller.activo)}>
                            {taller.activo !== false ? "Activo" : "Inactivo"}
                          </Badge>
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
              )}
            </CardContent>
          </Card>
        </div>
        {isEditModalOpen && (
          <EditTallerModal 
            taller={editingTaller} 
            onSave={handleSaveTaller} 
            onClose={handleCloseModal}
            isSaving={mutation.isPending}
          />
        )}
      </main>
    </div>
  )
}