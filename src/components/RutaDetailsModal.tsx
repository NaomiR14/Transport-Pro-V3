"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Truck,
    User,
    MapPin,
    Calendar,
    Fuel,
    DollarSign,
    BarChart3,
    X,
    Gauge,
    Weight,
    Receipt,
    TrendingUp,
    Navigation,
    Zap,
    Clock,
    FileText
} from "lucide-react"
import { RutaViaje } from "@/types/ruta-viaje-types"

interface RutaDetailsModalProps {
    ruta: RutaViaje | null
    isOpen: boolean
    onClose: () => void
}

export default function RutaDetailsModal({ ruta, isOpen, onClose }: RutaDetailsModalProps) {
    if (!ruta) return null

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getEstadoVehiculoConfig = (estado: string) => {
        const config = {
            'activo': { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
            'inactivo': { color: 'bg-slate-500', text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
            'mantenimiento': { color: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' }
        }
        return config[estado as keyof typeof config] || config.inactivo
    }

    const gananciaNeta = ruta.ingreso_total - ruta.gasto_total
    const margenGanancia = (gananciaNeta / ruta.ingreso_total) * 100
    const eficienciaCombustible = ruta.recorrido_por_galon
    const eficienciaPercent = Math.min((eficienciaCombustible / 25) * 100, 100) // Asumiendo 25 km/gal como máximo

    // Calcular duración del viaje
    const fechaSalida = new Date(ruta.fecha_salida)
    const fechaLlegada = new Date(ruta.fecha_llegada)
    const duracionDias = Math.ceil((fechaLlegada.getTime() - fechaSalida.getTime()) / (1000 * 60 * 60 * 24))

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Navigation className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold text-gray-900">
                                    Ruta #{ruta.id}
                                </DialogTitle>
                                <DialogDescription className="text-lg font-semibold text-gray-600">
                                    {ruta.origen} → {ruta.destino}
                                </DialogDescription>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Tarjetas de Resumen Rápido */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Ingresos</p>
                                        <p className="text-2xl font-bold text-blue-900">{formatCurrency(ruta.ingreso_total)}</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600">Gastos</p>
                                        <p className="text-2xl font-bold text-red-900">{formatCurrency(ruta.gasto_total)}</p>
                                    </div>
                                    <Receipt className="h-8 w-8 text-red-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Ganancia Neta</p>
                                        <p className={`text-2xl font-bold ${gananciaNeta >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                                            {formatCurrency(gananciaNeta)}
                                        </p>
                                    </div>
                                    <TrendingUp className={`h-8 w-8 ${gananciaNeta >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600">Distancia</p>
                                        <p className="text-2xl font-bold text-purple-900">{ruta.kms_recorridos} km</p>
                                    </div>
                                    <Gauge className="h-8 w-8 text-purple-500" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Información de la Ruta */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                                    Información del Viaje
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Vehículo</p>
                                        <div className="flex items-center space-x-2">
                                            <Truck className="h-4 w-4 text-gray-400" />
                                            <span className="font-semibold">{ruta.placa_vehiculo}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Estado</p>
                                        <Badge
                                            variant="secondary"
                                            className={getEstadoVehiculoConfig(ruta.estado_vehiculo).bg + " " + getEstadoVehiculoConfig(ruta.estado_vehiculo).text}
                                        >
                                            {ruta.estado_vehiculo.charAt(0).toUpperCase() + ruta.estado_vehiculo.slice(1)}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Conductor</p>
                                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="font-semibold">{ruta.conductor}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Fecha Salida</p>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{formatDate(ruta.fecha_salida)}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-500">Fecha Llegada</p>
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{formatDate(ruta.fecha_llegada)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-500">Duración del Viaje</p>
                                    <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                                        <Clock className="h-4 w-4 text-blue-500" />
                                        <span className="font-semibold text-blue-700">{duracionDias} día{duracionDias !== 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Kilometraje y Rendimiento */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                    <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                                    Rendimiento y Métricas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-600">Eficiencia de Combustible</span>
                                        <span className="font-semibold">{ruta.recorrido_por_galon.toFixed(1)} km/gal</span>
                                    </div>
                                    <Progress value={eficienciaPercent} className="h-2" />
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Baja</span>
                                        <span>Óptima</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-600">KM Inicial</p>
                                        <p className="font-mono font-semibold">{ruta.kms_inicial.toLocaleString()}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-600">KM Final</p>
                                        <p className="font-mono font-semibold">{ruta.kms_final.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-green-800">KM Recorridos</span>
                                        <span className="text-xl font-bold text-green-900">{ruta.kms_recorridos.toLocaleString()} km</span>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-gray-600">Ingreso por Kilómetro</p>
                                    <p className="text-lg font-bold text-blue-600">{formatCurrency(ruta.ingreso_por_km)}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Detalles de Carga */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                    <Weight className="h-5 w-5 mr-2 text-orange-600" />
                                    Detalles de Carga
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Peso de Carga</p>
                                        <div className="flex items-center space-x-2">
                                            <Weight className="h-4 w-4 text-orange-500" />
                                            <span className="text-lg font-bold text-orange-700">{ruta.peso_carga_kg.toLocaleString()} kg</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Costo por KG</p>
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(ruta.costo_por_kg)}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-orange-600">INGRESO TOTAL POR CARGA</p>
                                        <p className="text-2xl font-bold text-orange-900">{formatCurrency(ruta.ingreso_total)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Combustible */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                    <Fuel className="h-5 w-5 mr-2 text-purple-600" />
                                    Información de Combustible
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Estación</p>
                                        <p className="font-semibold">{ruta.estacion_combustible}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Tipo</p>
                                        <Badge variant="outline" className="text-purple-700 border-purple-300">
                                            {ruta.tipo_combustible}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Precio/Galón</p>
                                        <p className="font-semibold">{formatCurrency(ruta.precio_por_galon)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Volumen</p>
                                        <p className="font-semibold">{ruta.volumen_combustible_gal.toFixed(1)} gal</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-purple-800">Total Combustible</span>
                                        <span className="text-xl font-bold text-purple-900">{formatCurrency(ruta.total_combustible)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gastos Detallados y Resumen Financiero */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gastos Detallados */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                    <Receipt className="h-5 w-5 mr-2 text-red-600" />
                                    Desglose de Gastos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { label: 'Combustible', value: ruta.total_combustible, icon: Fuel },
                                    { label: 'Peajes', value: ruta.gasto_peajes, icon: DollarSign },
                                    { label: 'Comidas', value: ruta.gasto_comidas, icon: Receipt },
                                    { label: 'Otros Gastos', value: ruta.otros_gastos, icon: FileText },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-red-100 rounded-lg">
                                                <item.icon className="h-4 w-4 text-red-600" />
                                            </div>
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="font-semibold text-red-700">{formatCurrency(item.value)}</span>
                                    </div>
                                ))}

                                <Separator />

                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <span className="font-bold text-red-800">TOTAL GASTOS</span>
                                    <span className="text-xl font-bold text-red-900">{formatCurrency(ruta.gasto_total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Resumen Financiero */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                    <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                                    Resumen Financiero
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="font-semibold text-blue-800">Ingresos Totales</span>
                                        <span className="text-lg font-bold text-blue-900">{formatCurrency(ruta.ingreso_total)}</span>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                        <span className="font-semibold text-red-800">Gastos Totales</span>
                                        <span className="text-lg font-bold text-red-900">{formatCurrency(ruta.gasto_total)}</span>
                                    </div>

                                    <Separator />

                                    <div className={`p-4 rounded-lg ${gananciaNeta >= 0
                                            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200'
                                            : 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200'
                                        }`}>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-600">GANANCIA NETA</p>
                                            <p className={`text-3xl font-bold ${gananciaNeta >= 0 ? 'text-emerald-900' : 'text-red-900'
                                                }`}>
                                                {formatCurrency(gananciaNeta)}
                                            </p>
                                            <p className={`text-sm font-semibold ${gananciaNeta >= 0 ? 'text-emerald-700' : 'text-red-700'
                                                }`}>
                                                Margen: {margenGanancia.toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <Badge
                                        variant={gananciaNeta >= 0 ? "default" : "destructive"}
                                        className="text-sm px-4 py-2"
                                    >
                                        <Zap className="h-4 w-4 mr-1" />
                                        {gananciaNeta >= 0 ? 'Viaje Rentable' : 'Viaje No Rentable'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Observaciones */}
                    {ruta.observaciones && (
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-lg">
                                    <FileText className="h-5 w-5 mr-2 text-gray-600" />
                                    Observaciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-lg border">
                                    <p className="text-gray-700 leading-relaxed">{ruta.observaciones}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}