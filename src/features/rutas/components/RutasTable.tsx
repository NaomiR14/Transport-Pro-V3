import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, X, Loader2, Truck, Map, Calendar, User, Fuel, BarChart3 } from "lucide-react"
import { RutaViaje } from "../types/rutas.types"

interface RutasTableProps {
  rutas: RutaViaje[]
  loading?: boolean
  onView: (ruta: RutaViaje) => void
  onEdit: (ruta: RutaViaje) => void
  onDelete: (rutaId: string) => void
  isDeleting?: boolean
}

export function RutasTable({ 
  rutas, 
  loading = false, 
  onView,
  onEdit, 
  onDelete,
  isDeleting = false 
}: RutasTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  const getEstadoVehiculoBadge = (estado: string | null | undefined) => {
    if (!estado) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
          ❓ Desconocido
        </span>
      )
    }

    const estadoConfig = {
      'activo': { 
        color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', 
        icon: '✅' 
      },
      'inactivo': { 
        color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', 
        icon: '⏸️' 
      },
      'mantenimiento': { 
        color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', 
        icon: '🔧' 
      }
    }

    const config = estadoConfig[estado as keyof typeof estadoConfig] || { 
      color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', 
      icon: '❓' 
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-3 text-slate-600 dark:text-slate-400">
          Cargando rutas...
        </span>
      </div>
    )
  }

  if (rutas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Map className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No se encontraron rutas de viaje
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          No hay rutas registradas con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300 w-20">ID</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Fechas</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Vehículo</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Conductor</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Ruta</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Kilometraje</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Carga</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Ingresos</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Combustible</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Gastos</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Rendimiento</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rutas.map((ruta) => (
            <TableRow 
              key={ruta.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">{ruta.id}</TableCell>

              {/* Fechas */}
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-slate-900 dark:text-white">
                    <Calendar className="h-3 w-3 mr-1 text-slate-500 dark:text-slate-400" />
                    {formatDate(ruta.fecha_salida)}
                  </div>
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="h-3 w-3 mr-1 text-slate-400 dark:text-slate-500" />
                    {formatDate(ruta.fecha_llegada)}
                  </div>
                </div>
              </TableCell>

              {/* Vehículo */}
              <TableCell>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
                    <span className="font-mono text-sm text-slate-900 dark:text-white">
                      {ruta.placa_vehiculo}
                    </span>
                  </div>
                  {getEstadoVehiculoBadge(ruta.estado_vehiculo)}
                </div>
              </TableCell>

              {/* Conductor */}
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-900 dark:text-white">
                    {ruta.conductor}
                  </span>
                </div>
              </TableCell>

              {/* Ruta */}
              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {ruta.origen}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    → {ruta.destino}
                  </div>
                </div>
              </TableCell>

              {/* Kilometraje */}
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="text-slate-700 dark:text-slate-300">
                    Ini: {ruta.kms_inicial.toLocaleString()}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    Fin: {ruta.kms_final.toLocaleString()}
                  </div>
                  <div className="font-semibold text-primary-blue">
                    Rec: {ruta.kms_recorridos.toLocaleString()}
                  </div>
                </div>
              </TableCell>

              {/* Carga */}
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="text-slate-900 dark:text-white">
                    {ruta.peso_carga_kg.toLocaleString()} kg
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    ${ruta.costo_por_kg}/kg
                  </div>
                </div>
              </TableCell>

              {/* Ingresos */}
              <TableCell>
                <div className="space-y-1">
                  <div className="font-semibold text-success-text">
                    {formatCurrency(ruta.ingreso_total)}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    ${ruta.ingreso_por_km.toFixed(2)}/km
                  </div>
                </div>
              </TableCell>

              {/* Combustible */}
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-slate-900 dark:text-white">
                    <Fuel className="h-3 w-3 mr-1 text-slate-500 dark:text-slate-400" />
                    {ruta.estacion_combustible}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    {ruta.tipo_combustible}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    ${ruta.precio_por_galon}/gal
                  </div>
                </div>
              </TableCell>

              {/* Gastos */}
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="text-slate-700 dark:text-slate-300">
                    Comb: {formatCurrency(ruta.total_combustible)}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    Peajes: {formatCurrency(ruta.gasto_peajes)}
                  </div>
                  <div className="font-semibold text-error-text">
                    Total: {formatCurrency(ruta.gasto_total)}
                  </div>
                </div>
              </TableCell>

              {/* Rendimiento */}
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-primary-blue">
                    <BarChart3 className="h-3 w-3 mr-1 text-primary-blue" />
                    {ruta.recorrido_por_galon.toFixed(1)} km/gal
                  </div>
                  <div className="text-slate-700 dark:text-slate-300">
                    Vol: {ruta.volumen_combustible_gal.toFixed(1)} gal
                  </div>
                </div>
              </TableCell>

              {/* Acciones */}
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(ruta)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(ruta)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("¿Seguro que deseas eliminar esta ruta?")) {
                        onDelete(ruta.id)
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
