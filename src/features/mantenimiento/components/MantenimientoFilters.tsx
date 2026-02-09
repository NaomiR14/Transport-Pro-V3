import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { useMantenimientoVehiculoStore } from '../hooks/use-mantenimiento'

export function MantenimientoFilters() {
  const { filters, setFilters, clearFilters } = useMantenimientoVehiculoStore()
  
  const hasActiveFilters = !!(filters.searchTerm || filters.tipo || filters.estado)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar mantenimientos..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        {/* Tipo Filter */}
        <Select
          value={filters.tipo || 'all'}
          onValueChange={(value) => setFilters({ tipo: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Preventivo">Preventivo</SelectItem>
            <SelectItem value="Correctivo">Correctivo</SelectItem>
          </SelectContent>
        </Select>

        {/* Estado Filter */}
        <Select
          value={filters.estado || 'all'}
          onValueChange={(value) => setFilters({ estado: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Completado">Completado</SelectItem>
            <SelectItem value="En Proceso">En Proceso</SelectItem>
            <SelectItem value="Pendiente Pago">Pendiente Pago</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={clearFilters} 
            size="sm"
            className="border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        )}
      </div>
    </div>
  )
}
