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
import { useRutaViajeStore } from '../hooks/use-rutas'

export function RutasFilters() {
  const { filters, setFilters, clearFilters } = useRutaViajeStore()
  
  // Placeholder data - en producción vendría de filterOptions hook
  const placas = ['ABC-123', 'DEF-456', 'GHI-789']
  const conductores = ['Juan Pérez', 'María García', 'Carlos López']
  
  const hasActiveFilters = !!(filters.searchTerm || filters.placa_vehiculo || filters.conductor || filters.fecha_desde || filters.fecha_hasta)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar rutas..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
          />
        </div>

        {/* Vehículo Filter */}
        <Select
          value={filters.placa_vehiculo || 'all'}
          onValueChange={(value) => setFilters({ placa_vehiculo: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Vehículo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los vehículos</SelectItem>
            {placas.map((placa) => (
              <SelectItem key={placa} value={placa}>{placa}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Conductor Filter */}
        <Select
          value={filters.conductor || 'all'}
          onValueChange={(value) => setFilters({ conductor: value === 'all' ? undefined : value })}
        >
          <SelectTrigger className="w-40 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
            <SelectValue placeholder="Conductor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los conductores</SelectItem>
            {conductores.map((conductor) => (
              <SelectItem key={conductor} value={conductor}>{conductor}</SelectItem>
            ))}
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
