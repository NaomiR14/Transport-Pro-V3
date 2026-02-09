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
import { useImpuestoStore } from '../hooks/use-impuestos'

export function ImpuestoFilters() {
  const { filters, setFilters, clearFilters } = useImpuestoStore()
  
  const hasActiveFilters = !!(filters.searchTerm || filters.estado_pago || filters.tipo || filters.year)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar impuestos..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        {/* Estado Filter */}
        <Select
          value={filters.estado_pago || 'all'}
          onValueChange={(value) => setFilters({ estado_pago: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pagado">Pagado</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="vencido">Vencido</SelectItem>
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
