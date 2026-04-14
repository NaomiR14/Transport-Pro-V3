import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, X, Loader2, Package, Truck, User, MapPin, FileText, ArrowRight } from "lucide-react"
import { Orden, EstadoOrden } from "../types/ordenes.types"

interface OrdenesTableProps {
  ordenes: Orden[]
  loading?: boolean
  onEdit: (orden: Orden) => void
  onDelete: (ordenId: string) => void
  isDeleting?: boolean
}

const estadoConfig: Record<EstadoOrden, { color: string; label: string; icon: string }> = {
  pendiente: {
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    label: 'Pendiente',
    icon: '⏳',
  },
  transito: {
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    label: 'En Tránsito',
    icon: '🚛',
  },
  entregado: {
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    label: 'Entregado',
    icon: '✅',
  },
}

export function OrdenesTable({
  ordenes,
  loading = false,
  onEdit,
  onDelete,
  isDeleting = false,
}: OrdenesTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—'
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-3 text-slate-600 dark:text-slate-400">
          Cargando órdenes...
        </span>
      </div>
    )
  }

  if (ordenes.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Package className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No se encontraron órdenes
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          No hay órdenes registradas con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Nº Orden</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Vehículo / Conductor</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Ruta</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Carta Porte</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Fecha Creación</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.map((orden) => {
            const config = estadoConfig[orden.estado] || estadoConfig.pendiente
            const estadoDifiere = orden.estado_sugerido && orden.estado !== orden.estado_sugerido

            return (
              <TableRow
                key={orden.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                {/* Nº Orden */}
                <TableCell className="font-mono font-semibold text-slate-900 dark:text-white">
                  {orden.numero_orden}
                </TableCell>

                {/* Vehículo + Conductor */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 mr-1.5 text-slate-500 dark:text-slate-400" />
                      <span className="font-mono text-sm font-medium text-slate-900 dark:text-white">
                        {orden.placa_vehiculo}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-3.5 w-3.5 mr-1.5 text-slate-400 dark:text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {orden.nombre_conductor || 'Sin conductor'}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Ruta */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" />
                      <span className="text-slate-900 dark:text-white font-medium">
                        {orden.origen || '—'}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      {orden.destino || '—'}
                    </div>
                    {orden.fecha_salida && (
                      <div className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(orden.fecha_salida)} — {formatDate(orden.fecha_llegada)}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <div className="space-y-1.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                      {config.icon} {config.label}
                    </span>
                    {estadoDifiere && orden.estado_sugerido && (
                      <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                        Sugerido: {estadoConfig[orden.estado_sugerido]?.label}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Carta Porte */}
                <TableCell>
                  {orden.carta_porte ? (
                    <div className="flex items-center text-sm text-slate-900 dark:text-white">
                      <FileText className="h-3.5 w-3.5 mr-1 text-slate-500 dark:text-slate-400" />
                      {orden.carta_porte}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                  )}
                </TableCell>

                {/* Fecha Creación */}
                <TableCell className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(orden.created_at)}
                </TableCell>

                {/* Acciones */}
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(orden)}
                      className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (window.confirm("¿Seguro que deseas eliminar esta orden?")) {
                          onDelete(orden.id)
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
