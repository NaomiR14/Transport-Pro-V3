import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Trash2, Building, MapPin, Phone, Mail, User, Star, Loader2 } from 'lucide-react'
import { Taller } from '../types/talleres.types'

interface TallerTableProps {
  talleres: Taller[]
  loading?: boolean
  onEdit: (taller: Taller) => void
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function TallerTable({ 
  talleres, 
  loading = false, 
  onEdit, 
  onDelete,
  isDeleting = false 
}: TallerTableProps) {
  const getCalificacionStars = (calificacion: number = 0) => {
    const fullStars = Math.floor(calificacion)
    const hasHalfStar = calificacion % 1 !== 0
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <Star className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        ))}
        <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          {calificacion.toFixed(1)}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-blue" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">Cargando talleres...</span>
      </div>
    )
  }

  if (talleres.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
          No se encontraron talleres
        </h3>
        <p className="text-slate-500 dark:text-slate-400">
          No hay talleres registrados con los filtros aplicados
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
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Nombre</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Dirección</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Teléfono</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Correo</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Contacto</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Calificación</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {talleres.map((taller) => (
            <TableRow 
              key={taller.id} 
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <TableCell className="font-medium text-slate-900 dark:text-white">
                {taller.id}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-slate-900 dark:text-white">
                    {taller.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-2 max-w-xs">
                  <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {taller.address}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <span className="font-mono text-sm text-slate-700 dark:text-slate-300">
                    {taller.phoneNumber}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {taller.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {taller.contactPerson}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                {getCalificacionStars(taller.rate)}
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
                    onClick={() => onEdit(taller)}
                    className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(taller.id)}
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
