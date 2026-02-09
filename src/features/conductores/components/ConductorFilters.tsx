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
import { useConductorStore } from '../hooks/use-conductores'

export function ConductorFilters() {
  const { filters, setFilters, clearFilters } = useConductorStore()

  const estadosLicencia = ['vigente', 'por_vencer', 'vencida']
  const hasActiveFilters = !!(filters.searchTerm || filters.estado_licencia || filters.activo !== undefined)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar conductores..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        {/* Estado Licencia Filter */}
        <Select
          value={filters.estado_licencia || 'all'}
          onValueChange={(value) => setFilters({ estado_licencia: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Estado Licencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {estadosLicencia.map((estado) => (
              <SelectItem key={estado} value={estado}>
                {estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Estado Filter */}
        <Select
          value={filters.activo === undefined ? 'all' : filters.activo.toString()}
          onValueChange={(value) => setFilters({ activo: value === 'all' ? undefined : value === 'true' })}
        >
          <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Activos</SelectItem>
            <SelectItem value="false">Inactivos</SelectItem>
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
