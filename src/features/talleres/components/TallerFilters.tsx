import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { useTallerStore } from '../hooks/use-talleres'

export function TallerFilters() {
  const { filters, setFilters, clearFilters } = useTallerStore()
  
  const hasActiveFilters = !!(filters.searchTerm)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <Input
            placeholder="Buscar talleres..."
            value={filters.searchTerm || ''}
            onChange={(e) => setFilters({ searchTerm: e.target.value })}
            className="pl-10 w-64 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-primary-blue"
          />
        </div>

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
