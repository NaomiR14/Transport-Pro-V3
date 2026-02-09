import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Edit, Trash2, Calendar, Shield, Car, Building, Loader2 } from 'lucide-react'
import { SeguroVehiculo } from '../types/seguros.types'

interface SeguroTableProps {
  seguros: SeguroVehiculo[]
  loading?: boolean
  onEdit: (seguro: SeguroVehiculo) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function SeguroTable({ 
  seguros, 
  loading = false, 
  onEdit, 
  onDelete,
  isDeleting = false 
}: SeguroTableProps) {
  const getEstadoPolizaBadge = (estado: string) => {
    const stateConfig = {
      'vigente': 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text',
      'por_vencer': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
      'vencida': 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text',
      'cancelada': 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
    }

    const estadoIcon = {
      'vigente': '✅',
      'por_vencer': '⚠️',
      'vencida': '❌',
      'cancelada': '🚫'
    }

    return (
      <Badge className={`${stateConfig[estado as keyof typeof stateConfig] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
        {estadoIcon[estado as keyof typeof estadoIcon]} {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
      </Badge>
    )
  }

  const getDiasRestantesBadge = (dias: number | undefined) => {
    if (dias === undefined || dias === null) {
      return <span className="text-slate-500 dark:text-slate-400 font-medium">-- No calculado</span>
    }
    if (dias > 30) {
      return <span className="text-green-600 dark:text-green-400 font-medium">✅ {dias} días</span>
    } else if (dias > 7) {
      return <span className="text-yellow-600 dark:text-yellow-400 font-medium">⚠️ {dias} días</span>
    } else if (dias > 0) {
      return <span className="text-orange-600 dark:text-orange-400 font-medium">🚨 {dias} días</span>
    } else {
      return <span className="text-red-600 dark:text-red-400 font-medium">❌ Vencida</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">Cargando seguros...</span>
      </div>
    )
  }

  if (seguros.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No se encontraron seguros
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          No hay seguros registrados con los filtros aplicados
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
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Aseguradora</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">N° Póliza</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Inicio</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Vencimiento</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Días Restantes</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Estado</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {seguros.map((seguro) => (
            <TableRow 
              key={seguro.id} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {seguro.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-slate-500" />
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {seguro.placa_vehiculo}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">{seguro.aseguradora}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm text-slate-700 dark:text-slate-300">
                {seguro.poliza_seguro}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {formatDate(seguro.fecha_inicio)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 dark:text-slate-400">
                    {formatDate(seguro.fecha_vencimiento)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getDiasRestantesBadge(seguro.dias_restantes)}
              </TableCell>
              <TableCell>
                {getEstadoPolizaBadge(seguro.estado_poliza)}
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
                    onClick={() => onEdit(seguro)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(seguro.id)}
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
