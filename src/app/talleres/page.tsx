"use client"

import { useState } from "react"
//import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Filter, Eye, Edit, Truck, Wrench, Phone, Mail, MapPin, User, Building, Loader2, X } from "lucide-react"
import Link from "next/link"
import EditTallerModal from "@/components/EditTallerModal"

// Importar los hooks y store
import { useFilteredTalleres, useToggleTallerStatus } from "@/hooks/use-talleres"
import { useTallerStore } from "@/store/taller-store"
import { Taller } from "@/types/taller"


export default function TalleresPage() {
  const [editingTaller, setEditingTaller] = useState<Taller | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Usar los hooks de React Query y Zustand
  const { talleres, isLoading, error, filters } = useFilteredTalleres()
  const { setFilters, clearFilters, stats } = useTallerStore()
  const toggleStatusMutation = useToggleTallerStatus()



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


  const handleEditTaller = (taller: Taller) => {
    setEditingTaller(taller)
    setIsEditModalOpen(true)
  }

  const handleSaveTaller = (updatedTaller: Taller) => {
    // La lógica de guardado se maneja en el modal con React Query
    setIsEditModalOpen(false)
    setEditingTaller(null)
  }

  const handleCloseModal = () => {
    setIsEditModalOpen(false)
    setEditingTaller(null)
  }

  const handleToggleStatus = (taller: Taller) => {
    toggleStatusMutation.mutate({
      id: taller.id,
      activo: !taller.activo
    })
  }

  // Filtros disponibles
  const especialidadesDisponibles = [
    "Motor", "Transmisión", "Frenos", "Suspensión", "Eléctrico", 
    "Aire Acondicionado", "Diagnóstico", "Carrocería", "Pintura", 
    "Soldadura", "Llantas", "Alineación", "Balanceo", "Motor Diesel", 
    "Inyección", "Turbo"
  ]

if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error.message}</p>
            <Button 
              className="mt-4 w-full" 
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Taller
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Talleres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.total || 0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.activos || 0
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Calificación Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {isLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      stats?.calificacionPromedio.toFixed(1) || "0.0"
                    )}
                  </div>
                  {!isLoading && <Wrench className="h-5 w-5 fill-yellow-400 text-yellow-400 ml-1" />}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Especialidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    stats?.totalEspecialidades || 0
                  )}
                </div>
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
                
                {/* Filtros y búsqueda */}
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Buscar talleres..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({ searchTerm: e.target.value })}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  <Select
                    value={filters.activo?.toString() || "all"}
                    onValueChange={(value) => 
                      setFilters({ activo: value === "all" ? undefined : value === "true" })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="true">Activos</SelectItem>
                      <SelectItem value="false">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.especialidad || "all"}
                    onValueChange={(value) => 
                      setFilters({ especialidad: value === "all" ? undefined : value })
                    }
                  >
                    <SelectTrigger className="w-44">
                      <SelectValue placeholder="Especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {especialidadesDisponibles.map((esp) => (
                        <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {(filters.searchTerm || filters.activo !== undefined || filters.especialidad) && (
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Cargando talleres...</span>
                </div>
              ) : (
                <>
                  {talleres.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No se encontraron talleres
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {filters.searchTerm || filters.activo !== undefined || filters.especialidad
                          ? "Intenta ajustar los filtros de búsqueda"
                          : "Comienza agregando tu primer taller"
                        }
                      </p>
                      {!(filters.searchTerm || filters.activo !== undefined || filters.especialidad) && (
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Taller
                        </Button>
                      )}
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
                        {talleres.map((taller) => (
                          <TableRow key={taller.id}>
                            <TableCell className="font-medium">{taller.numero_taller}</TableCell>
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
                                  <div className="text-xs text-gray-500 font-mono">{taller.telefono_contacto}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {(taller.especialidades ?? []).slice(0, 2).map((especialidad, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {especialidad}
                                  </Badge>
                                ))}
                                {(taller.especialidades ?? []).length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{(taller.especialidades ?? []).length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getCalificacionStars(taller.calificacion)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Badge className={getActivoBadge(taller.activo)}>
                                  {taller.activo ? "Activo" : "Inactivo"}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStatus(taller)}
                                  disabled={toggleStatusMutation.isLoading}
                                  className="text-xs"
                                >
                                  {toggleStatusMutation.isLoading ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : taller.activo ? (
                                    "Desactivar"
                                  ) : (
                                    "Activar"
                                  )}
                                </Button>
                              </div>
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
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {isEditModalOpen && editingTaller && (
          <EditTallerModal 
            taller={editingTaller} 
            onSave={handleSaveTaller} 
            onClose={handleCloseModal} 
          />
        )}
      </main>
    </div>
  )
}