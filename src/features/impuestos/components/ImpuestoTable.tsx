import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2, Calendar, DollarSign, Receipt, Car, Loader2 } from 'lucide-react'
import { ImpuestoVehicular } from '../types/impuestos.types'

interface ImpuestoTableProps {
  impuestos: ImpuestoVehicular[]
  loading?: boolean
  onEdit: (impuesto: ImpuestoVehicular) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function ImpuestoTable({ 
  impuestos, 
  loading = false, 
  onEdit, 
  onDelete,
  isDeleting = false 
}: ImpuestoTableProps) {
  const getEstadoPagoBadge = (estado: string) => {
    const stateConfig = {
      'pagado': 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text',
      'pendiente': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
      'vencido': 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text',
    }

    const estadoIcon = {
      'pagado': '✅',
      'pendiente': '⏳',
      'vencido': '❌'
    }

    return (
      <Badge className={`${stateConfig[estado as keyof typeof stateConfig] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
        {estadoIcon[estado as keyof typeof estadoIcon]} {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">Cargando impuestos...</span>
      </div>
    )
  }

  if (impuestos.length === 0) {
    return (
      <div className="text-center py-12">
        <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No se encontraron impuestos
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          No hay impuestos registrados con los filtros aplicados
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
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Año</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Fecha Vencimiento</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Monto</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {impuestos.map((impuesto) => (
            <TableRow 
              key={impuesto.id} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {impuesto.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-slate-500" />
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {impuesto.placa_vehiculo}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">{impuesto.tipo_impuesto}</span>
                </div>
              </TableCell>
              <TableCell className="text-slate-700 dark:text-slate-300">
                {impuesto.anio_impuesto}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {formatDate(impuesto.fecha_pago)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(impuesto.impuesto_monto)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getEstadoPagoBadge(impuesto.estado_pago)}
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
                    onClick={() => onEdit(impuesto)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(impuesto.id)}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 hover:bg-error-bg dark:hover:bg-error-bg/20"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-error-text dark:text-error-text" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-error-text dark:text-error-text" />
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
