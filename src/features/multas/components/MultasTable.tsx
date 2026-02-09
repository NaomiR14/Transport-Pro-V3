import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2, Calendar, CreditCard, AlertTriangle, User, Car, Loader2 } from 'lucide-react'
import { MultaConductor } from '../types/multas.types'

interface MultasTableProps {
  multas: MultaConductor[]
  loading?: boolean
  onEdit: (multa: MultaConductor) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function MultasTable({ 
  multas, 
  loading = false, 
  onEdit, 
  onDelete,
  isDeleting = false 
}: MultasTableProps) {
  const getEstadoPagoBadge = (estado: string) => {
    const stateConfig = {
      'pagado': 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text',
      'pendiente': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
      'parcial': 'bg-info-bg text-info-text dark:bg-info-bg/20 dark:text-info-text',
      'vencido': 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text',
    }

    return (
      <Badge className={`${stateConfig[estado as keyof typeof stateConfig] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </Badge>
    )
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatearMoneda = (cantidad: number) => {
    return `$${cantidad.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">Cargando multas...</span>
      </div>
    )
  }

  if (multas.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No se encontraron multas
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          No hay multas registradas con los filtros aplicados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">N° Viaje</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Placa</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Conductor</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Infracción</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Fecha</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Importe</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Pagado</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Debe</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {multas.map((multa) => (
            <TableRow 
              key={multa.id} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {multa.numero_viaje}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-slate-500" />
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {multa.placa_vehiculo}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-900 dark:text-white">{multa.conductor}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span className="text-slate-900 dark:text-white">{multa.infraccion}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">{formatearFecha(multa.fecha)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-500" />
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatearMoneda(multa.importe_multa)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {formatearMoneda(multa.importe_pagado)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {formatearMoneda(multa.debe)}
                </span>
              </TableCell>
              <TableCell>
                {getEstadoPagoBadge(multa.estado_pago)}
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
                    onClick={() => onEdit(multa)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(multa.id)}
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
