import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Edit, X, Loader2, Gauge, Car } from "lucide-react"
import { Vehicle } from "../types/vehiculo.types"

interface VehiculosTableProps {
  vehicles: Vehicle[]
  loading?: boolean
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicleId: string) => void
  isDeleting?: boolean
}

export function VehiculosTable({ 
  vehicles, 
  loading = false, 
  onEdit, 
  onDelete,
  isDeleting = false 
}: VehiculosTableProps) {
  const getMaintenanceStatusBadge = (status: string) => {
    const statusConfig = {
      'Al día': { 
        color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', 
        icon: '✅' 
      },
      'Próximo': { 
        color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', 
        icon: '⚠️' 
      },
      'Urgente': { 
        color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400', 
        icon: '🚨' 
      },
      'Vencido': { 
        color: 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text', 
        icon: '❌' 
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', 
      icon: '❓'
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon} {status}
      </span>
    )
  }

  const getVehicleStateBadge = (state: string) => {
    const stateConfig = {
      'Disponible': 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text',
      'En Mantenimiento': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
      'En Uso': 'bg-info-bg text-info-text dark:bg-info-bg/20 dark:text-info-text',
      'Inactivo': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
    }

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        stateConfig[state as keyof typeof stateConfig] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
      }`}>
        {state}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-3 text-slate-600 dark:text-slate-400">
          Cargando vehículos...
        </span>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Car className="h-10 w-10 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          No se encontraron vehículos
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
          No hay vehículos registrados con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              ID
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Tipo
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Marca
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Modelo
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Placa
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Color
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Año
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Estado
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Km Actual
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Estado Mnto
            </TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow 
              key={vehicle.id} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {vehicle.id}
              </TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">
                {vehicle.type}
              </TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">
                {vehicle.brand}
              </TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">
                {vehicle.model}
              </TableCell>
              <TableCell className="font-mono font-bold text-slate-900 dark:text-white">
                {vehicle.licensePlate}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: vehicle.color?.toLowerCase() }}
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    {vehicle.color}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">
                {vehicle.year}
              </TableCell>
              <TableCell>
                {getVehicleStateBadge(vehicle.vehicleState)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2 justify-start">
                  <Gauge className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {vehicle.maintenanceData.currentKm || 0}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getMaintenanceStatusBadge(vehicle.maintenanceData.maintenanceStatus || "Al día")}
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
                    onClick={() => onEdit(vehicle)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("¿Seguro que deseas eliminar este vehículo?")) {
                        onDelete(vehicle.id)
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
