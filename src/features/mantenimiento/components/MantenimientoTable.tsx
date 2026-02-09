import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Calendar, Wrench, Car, Building, DollarSign, Loader2 } from 'lucide-react'
import { MantenimientoVehiculo } from '../types/mantenimiento.types'

interface MantenimientoTableProps {
  mantenimientos: MantenimientoVehiculo[]
  loading?: boolean
  onEdit: (mantenimiento: MantenimientoVehiculo) => void
  isDeleting?: boolean
}

export function MantenimientoTable({ 
  mantenimientos, 
  loading = false, 
  onEdit,
  isDeleting = false 
}: MantenimientoTableProps) {
  const getTipoBadge = (tipo: string) => {
    const typeConfig = {
      'Preventivo': 'bg-info-bg text-info-text dark:bg-info-bg/20 dark:text-info-text',
      'Correctivo': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
    }

    return (
      <Badge className={`${typeConfig[tipo as keyof typeof typeConfig] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
        {tipo}
      </Badge>
    )
  }

  const getEstadoBadge = (estado: string) => {
    const statusConfig = {
      'Completado': 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text',
      'En Proceso': 'bg-info-bg text-info-text dark:bg-info-bg/20 dark:text-info-text',
      'Pendiente Pago': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
    }

    return (
      <Badge className={`${statusConfig[estado as keyof typeof statusConfig] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
        {estado}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">Cargando mantenimientos...</span>
      </div>
    )
  }

  if (mantenimientos.length === 0) {
    return (
      <div className="text-center py-12">
        <Wrench className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No se encontraron mantenimientos
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          No hay mantenimientos registrados con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">ID</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Vehículo</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Tipo</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Descripción</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Taller</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Fecha</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Costo</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mantenimientos.map((mantenimiento) => (
            <TableRow 
              key={mantenimiento.id} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {mantenimiento.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-slate-500" />
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {mantenimiento.placaVehiculo}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getTipoBadge(mantenimiento.tipo)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {mantenimiento.paqueteMantenimiento}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {mantenimiento.taller}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {formatDate(mantenimiento.fechaEntrada)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(mantenimiento.costoTotal)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getEstadoBadge(mantenimiento.estado)}
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
                    onClick={() => onEdit(mantenimiento)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
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
