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
import { VehicleFilters } from '../types/vehiculo.types'

interface VehiculoFiltersProps {
  filters: VehicleFilters
  onFiltersChange: (filters: Partial<VehicleFilters>) => void
  onClearFilters: () => void
  typeOptions: string[]
  brandOptions: string[]
  stateOptions: string[]
}

export function VehiculoFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  typeOptions,
  brandOptions,
  stateOptions,
}: VehiculoFiltersProps) {
  const hasActiveFilters = !!(
    filters.searchTerm ||
    filters.type ||
    filters.brand ||
    filters.vehicleState ||
    filters.yearMin ||
    filters.yearMax
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Buscar vehículos..."
          value={filters.searchTerm || ''}
          onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
          className="pl-10 w-64 bg-gray-50 dark:bg-gray-800"
        />
      </div>

      {/* Type Filter */}
      <Select
        value={filters.type !== undefined ? String(filters.type) : 'all'}
        onValueChange={(value) => onFiltersChange({ type: value === 'all' ? undefined : value })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          {typeOptions.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Brand Filter */}
      <Select
        value={filters.brand !== undefined ? String(filters.brand) : 'all'}
        onValueChange={(value) => onFiltersChange({ brand: value === 'all' ? undefined : value })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las marcas</SelectItem>
          {brandOptions.map((brand) => (
            <SelectItem key={brand} value={brand}>
              {brand}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* State Filter */}
      <Select
        value={filters.vehicleState !== undefined ? String(filters.vehicleState) : 'all'}
        onValueChange={(value) =>
          onFiltersChange({ vehicleState: value === 'all' ? undefined : value })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          {stateOptions.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} size="sm">
          <X className="h-4 w-4 mr-2" />
          Limpiar
        </Button>
      )}
    </div>
  )
}
