import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, X, Loader2, User, Phone, Mail, MapPin, IdCard, Star, Calendar } from "lucide-react"
import { Conductor } from "../types/conductor.types"

interface ConductorTableProps {
  conductores: Conductor[]
  loading?: boolean
  onEdit: (conductor: Conductor) => void
  onDelete: (conductorId: string) => void
  isDeleting?: boolean
}

export function ConductorTable({ 
  conductores, 
  loading = false, 
  onEdit, 
  onDelete,
  isDeleting = false 
}: ConductorTableProps) {
  const getEstadoLicenciaBadge = (estado: string) => {
    const estadoConfig = {
      'vigente': { 
        color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', 
        icon: '✅' 
      },
      'por_vencer': { 
        color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', 
        icon: '⚠️' 
      },
      'vencida': { 
        color: 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text', 
        icon: '❌' 
      }
    }

    const config = estadoConfig[estado as keyof typeof estadoConfig] || { 
      color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', 
      icon: '❓' 
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
      </span>
    )
  }

  const getEstadoBadge = (activo: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        activo 
          ? 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text' 
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
      }`}>
        {activo ? '✅ Activo' : '❌ Inactivo'}
      </span>
    )
  }

  const getCalificacionStars = (calificacion: number = 0) => {
    const fullStars = Math.floor(calificacion)
    const hasHalfStar = calificacion % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
        ))}
        {hasHalfStar && <Star className="h-4 w-4 fill-amber-500/50 text-amber-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {calificacion.toFixed(1)}
        </span>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-3 text-slate-600 dark:text-slate-400">
          Cargando conductores...
        </span>
      </div>
    )
  }

  if (conductores.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <User className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No se encontraron conductores
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          No hay conductores registrados con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-20">
              ID
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Documento
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Nombre
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              N° Licencia
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Dirección
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Teléfono
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Calificación
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Email
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Estado
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Vencimiento Lic.
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Estado Lic.
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conductores.map((conductor) => (
            <TableRow 
              key={conductor.id} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {conductor.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <IdCard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="font-mono text-sm text-slate-900 dark:text-white">
                    {conductor.documento_identidad}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {conductor.nombre_conductor}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-slate-900 dark:text-white">
                {conductor.numero_licencia}
              </TableCell>
              <TableCell>
                <div className="flex items-start space-x-2 max-w-xs">
                  <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {conductor.direccion}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="font-mono text-sm text-slate-900 dark:text-white">
                    {conductor.telefono}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getCalificacionStars(conductor.calificacion)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-primary-blue hover:text-primary-purple hover:underline cursor-pointer transition-colors duration-150">
                    {conductor.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getEstadoBadge(conductor.activo)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-start">
                  <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {formatDate(conductor.fecha_vencimiento_licencia)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getEstadoLicenciaBadge(conductor.estado_licencia)}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(conductor)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("¿Seguro que deseas eliminar este conductor?")) {
                        onDelete(conductor.id)
                      }
                    }}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 hover:bg-error-bg dark:hover:bg-error-bg/20"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 text-error-text dark:text-error-text" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
