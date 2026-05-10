"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, X, Loader2, Gauge, Shield } from "lucide-react"
import { type Vehicle } from "../types/vehiculo.types"

interface VehiculosTableProps {
    vehicles: Vehicle[]
    onEdit: (vehicle: Vehicle) => void
    onDelete: (vehicleId: string) => void
    isDeleting: boolean
}

export function VehiculosTable({ vehicles, onEdit, onDelete, isDeleting }: VehiculosTableProps) {
    
    // Badge para alerta de mantenimiento (campos calculados)
    const getMaintenanceAlertBadge = (alert: string) => {
        const alertConfig = {
            'Al día': { color: 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text', icon: '✅' },
            'Falta poco': { color: 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text', icon: '⚠️' },
            'Mantener': { color: 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text', icon: '🚨' },
            'En Mantenimiento': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: '🔧' },
            'Sin Ciclo': { color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: '➖' }
        }

        const config = alertConfig[alert as keyof typeof alertConfig] || {
            color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', icon: '❓'
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.icon} {alert}
            </span>
        )
    }

    // Badge para estado calculado del vehículo
    const getCalculatedStateBadge = (state: string) => {
        const stateConfig = {
            'Disponible': 'bg-success-bg text-success-text dark:bg-success-bg/20 dark:text-success-text',
            'En Mantenimiento': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            'Seguro Vencido': 'bg-error-bg text-error-text dark:bg-error-bg/20 dark:text-error-text',
            'Seguro Por Vencer': 'bg-warning-bg text-warning-text dark:bg-warning-bg/20 dark:text-warning-text',
            'Inactivo': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
        }

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${stateConfig[state as keyof typeof stateConfig] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'}`}>
                {state}
            </span>
        )
    }

    // Badge para estado del seguro
    const getInsuranceStateBadge = (estado: string) => {
        const config: Record<string, { color: string; label: string }> = {
            'vigente': { color: 'bg-success-bg text-success-text', label: 'Vigente' },
            'por_vencer': { color: 'bg-warning-bg text-warning-text', label: 'Por vencer' },
            'vencida': { color: 'bg-error-bg text-error-text', label: 'Vencido' },
            'sin_seguro': { color: 'bg-gray-100 text-gray-600', label: 'Sin seguro' },
        }
        const { color, label } = config[estado] || config['sin_seguro']
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                <Shield className="h-3 w-3 mr-1" />
                {label}
            </span>
        )
    }

    const handleDeleteClick = (vehicleId: string, licensePlate: string) => {
        if (window.confirm(`¿Seguro que deseas eliminar el vehículo ${licensePlate}?`)) {
            onDelete(vehicleId)
        }
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <Table>
                <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/80 dark:to-slate-800/50">
                    <TableRow className="hover:bg-transparent border-b border-slate-200 dark:border-slate-700">
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400 w-10">#</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Placa</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Tipo</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Marca/Modelo</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Año</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Estado</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Km Odómetro</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Km Restantes</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Alerta Mnto</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Seguro</TableHead>
                        <TableHead className="font-bold uppercase text-xs tracking-wider text-slate-600 dark:text-slate-400">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.map((vehicle, index) => (
                        <TableRow
                            key={vehicle.id}
                            className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 even:bg-slate-50/40 dark:even:bg-slate-800/20 transition-colors duration-150 border-b border-slate-100 dark:border-slate-800 last:border-0"
                        >
                            {/* Número */}
                            <TableCell className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                {index + 1}
                            </TableCell>
                            {/* Placa */}
                            <TableCell className="font-mono font-bold text-slate-900 dark:text-white">
                                {vehicle.licensePlate}
                            </TableCell>
                            {/* Tipo */}
                            <TableCell className="text-slate-900 dark:text-white">{vehicle.type}</TableCell>
                            {/* Marca/Modelo */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900 dark:text-white">{vehicle.brand}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{vehicle.model}</span>
                                </div>
                            </TableCell>
                            {/* Año */}
                            <TableCell className="text-slate-900 dark:text-white">{vehicle.year}</TableCell>
                            {/* Estado Calculado */}
                            <TableCell>
                                {getCalculatedStateBadge(vehicle.calculatedData?.estadoCalculado || 'Disponible')}
                            </TableCell>
                            {/* Km Odómetro (calculado desde rutas) */}
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Gauge className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                    <span className="text-slate-900 dark:text-white font-medium">
                                        {(vehicle.calculatedData?.ultimoKmOdometro || 0).toLocaleString()}
                                    </span>
                                </div>
                            </TableCell>
                            {/* Km Restantes para Mantenimiento */}
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className={`font-medium ${
                                        (vehicle.calculatedData?.kmsRestantesMantenimiento || 0) < 500 
                                            ? 'text-error-text' 
                                            : (vehicle.calculatedData?.kmsRestantesMantenimiento || 0) < 1000 
                                                ? 'text-warning-text' 
                                                : 'text-slate-900 dark:text-white'
                                    }`}>
                                        {(vehicle.calculatedData?.kmsRestantesMantenimiento || 0).toLocaleString()} km
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {vehicle.calculatedData?.porcentajeCicloUsado || 0}% usado
                                    </span>
                                </div>
                            </TableCell>
                            {/* Alerta de Mantenimiento */}
                            <TableCell>
                                {getMaintenanceAlertBadge(vehicle.calculatedData?.alertaMantenimiento || 'Al día')}
                            </TableCell>
                            {/* Estado del Seguro */}
                            <TableCell>
                                {getInsuranceStateBadge(vehicle.calculatedData?.estadoSeguro || 'sin_seguro')}
                            </TableCell>
                            {/* Acciones */}
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
                                        onClick={() => onEdit(vehicle)}
                                        className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
                                    >
                                        <Edit className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(vehicle.id, vehicle.licensePlate)}
                                        disabled={isDeleting}
                                        className="h-8 w-8 p-0 hover:bg-error-bg dark:hover:bg-error-bg/20"
                                    >
                                        {isDeleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <X className="h-4 w-4 text-error-text dark:text-error-text" />
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