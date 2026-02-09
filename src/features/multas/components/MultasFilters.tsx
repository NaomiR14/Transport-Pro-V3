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
import { useMultasStore } from '../hooks/use-multas'

export function MultasFilters() {
  const { filters, setFilters, clearFilters } = useMultasStore()
  
  const hasActiveFilters = !!(filters.searchTerm || filters.infraccion)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar multas..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        {/* Infraccion Filter */}
        <Select
          value={filters.infraccion || 'all'}
          onValueChange={(value) => setFilters({ infraccion: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Tipo de Infracción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las infracciones</SelectItem>
            <SelectItem value="Exceso de velocidad">Exceso de velocidad</SelectItem>
            <SelectItem value="No respetar señalamiento">No respetar señalamiento</SelectItem>
            <SelectItem value="Estacionamiento indebido">Estacionamiento indebido</SelectItem>
            <SelectItem value="Documentos vencidos">Documentos vencidos</SelectItem>
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
