"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, MapPin, TrendingUp, DollarSign } from "lucide-react"
import { 
  type RutaViaje, 
  type CreateRutaViajeRequest,
  useCreateRuta, 
  useUpdateRuta 
} from "@/features/rutas"
import { commonInfoService } from "@/lib/common-info-service"
import { useVehicles } from "@/features/vehiculos"
import { useConductores } from "@/features/conductores"

interface EditRutaViajeModalProps {
    ruta: RutaViaje | null
    onSave: (ruta: RutaViaje) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditRutaViajeModal({ ruta, onSave, onClose, isOpen }: EditRutaViajeModalProps) {
    const [formData, setFormData] = useState<Partial<CreateRutaViajeRequest>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [commonInfo, setCommonInfo] = useState({
        fuelTypes: [] as { id: number; type: string }[],
        fuelStations: [] as { id: number; name: string }[],
    })

    // Hooks de React Query
    const createRutaMutation = useCreateRuta()
    const updateRutaMutation = useUpdateRuta()
    
    // Obtener vehículos y conductores disponibles
    const { data: vehicles } = useVehicles()
    const { data: conductores } = useConductores()
    const vehiculosDisponibles = vehicles?.map(v => v.licensePlate) || []
    const conductoresDisponibles = conductores?.map(c => ({
        documento: c.documento_identidad,
        nombre: c.nombre_conductor
    })) || []

    // Cargar información común al abrir el modal
    useEffect(() => {
        const loadCommonInfo = async () => {
            try {
                const [fuelTypes, fuelStations] = await Promise.all([
                    commonInfoService.getFuelTypes(),
                    commonInfoService.getFuelStations(),
                ])
                setCommonInfo({
                    fuelTypes: fuelTypes,
                    fuelStations: fuelStations,
                })
            } catch (error) {
                console.error('Error loading common info:', error)
            }
        }

        if (isOpen) {
            loadCommonInfo()
        }
    }, [isOpen])

    // Inicializar formData cuando cambia la ruta o se abre el modal
    useEffect(() => {
        if (ruta) {
            // Para edición, usar los datos existentes de la ruta
            setFormData({
                fecha_salida: ruta.fecha_salida.split('T')[0],
                fecha_llegada: ruta.fecha_llegada.split('T')[0],
                placa_vehiculo: ruta.placa_vehiculo,
                conductor: ruta.conductor,
                origen: ruta.origen,
                destino: ruta.destino,
                kms_inicial: ruta.kms_inicial,
                kms_final: ruta.kms_final,
                peso_carga_kg: ruta.peso_carga_kg,
                costo_por_kg: ruta.costo_por_kg,
                estacion_combustible: ruta.estacion_combustible,
                tipo_combustible: ruta.tipo_combustible,
                precio_por_galon: ruta.precio_por_galon,
                total_combustible: ruta.total_combustible,
                gasto_peajes: ruta.gasto_peajes,
                gasto_comidas: ruta.gasto_comidas,
                otros_gastos: ruta.otros_gastos,
                observaciones: ruta.observaciones,
            })
        } else {
            // Valores por defecto para nueva ruta
            const today = new Date().toISOString().split('T')[0]
            setFormData({
                fecha_salida: today,
                fecha_llegada: today,
                placa_vehiculo: "",
                conductor: "",
                origen: "",
                destino: "",
                kms_inicial: 0,
                kms_final: 0,
                peso_carga_kg: 0,
                costo_por_kg: 0,
                estacion_combustible: "",
                tipo_combustible: "",
                precio_por_galon: 0,
                total_combustible: 0,
                gasto_peajes: 0,
                gasto_comidas: 0,
                otros_gastos: 0,
                observaciones: "",
            })
        }
    }, [ruta, isOpen])

    const handleInputChange = (field: keyof CreateRutaViajeRequest, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.fecha_salida?.toString().trim()) {
            newErrors.fecha_salida = "La fecha de salida es requerida"
        }
        if (!formData.fecha_llegada?.toString().trim()) {
            newErrors.fecha_llegada = "La fecha de llegada es requerida"
        }
        if (!formData.placa_vehiculo?.trim()) {
            newErrors.placa_vehiculo = "La placa del vehículo es requerida"
        }
        if (!formData.conductor?.trim()) {
            newErrors.conductor = "El conductor es requerido"
        }
        if (!formData.origen?.trim()) {
            newErrors.origen = "El origen es requerido"
        }
        if (!formData.destino?.trim()) {
            newErrors.destino = "El destino es requerido"
        }
        if (formData.kms_inicial === undefined || formData.kms_inicial < 0) {
            newErrors.kms_inicial = "El kilometraje inicial debe ser mayor o igual a 0"
        }
        if (formData.kms_final === undefined || formData.kms_final < 0) {
            newErrors.kms_final = "El kilometraje final debe ser mayor o igual a 0"
        }
        if (formData.kms_final !== undefined && formData.kms_inicial !== undefined && formData.kms_final <= formData.kms_inicial) {
            newErrors.kms_final = "El kilometraje final debe ser mayor al inicial"
        }
        if (formData.peso_carga_kg === undefined || formData.peso_carga_kg < 0) {
            newErrors.peso_carga_kg = "El peso de la carga debe ser mayor o igual a 0"
        }
        if (formData.costo_por_kg === undefined || formData.costo_por_kg < 0) {
            newErrors.costo_por_kg = "El costo por kg debe ser mayor o igual a 0"
        }
        if (!formData.estacion_combustible?.trim()) {
            newErrors.estacion_combustible = "La estación de combustible es requerida"
        }
        if (!formData.tipo_combustible?.trim()) {
            newErrors.tipo_combustible = "El tipo de combustible es requerido"
        }
        if (formData.precio_por_galon === undefined || formData.precio_por_galon <= 0) {
            newErrors.precio_por_galon = "El precio por galón debe ser mayor a 0"
        }
        if (formData.total_combustible === undefined || formData.total_combustible < 0) {
            newErrors.total_combustible = "El total de combustible debe ser mayor o igual a 0"
        }
        if (formData.gasto_peajes === undefined || formData.gasto_peajes < 0) {
            newErrors.gasto_peajes = "El gasto en peajes debe ser mayor o igual a 0"
        }
        if (formData.gasto_comidas === undefined || formData.gasto_comidas < 0) {
            newErrors.gasto_comidas = "El gasto en comidas debe ser mayor o igual a 0"
        }
        if (formData.otros_gastos === undefined || formData.otros_gastos < 0) {
            newErrors.otros_gastos = "Los otros gastos deben ser mayor o igual a 0"
        }

        // Validar fechas
        if (formData.fecha_salida && formData.fecha_llegada) {
            const fechaSalida = new Date(formData.fecha_salida)
            const fechaLlegada = new Date(formData.fecha_llegada)
            if (fechaLlegada < fechaSalida) {
                newErrors.fecha_llegada = "La fecha de llegada debe ser posterior a la fecha de salida"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            // Preparar datos para la API
            // Note: volumen_combustible_gal is now calculated by the database from total_combustible
            const apiData: CreateRutaViajeRequest = {
                fecha_salida: formData.fecha_salida!,
                fecha_llegada: formData.fecha_llegada!,
                placa_vehiculo: formData.placa_vehiculo!,
                conductor: formData.conductor!,
                origen: formData.origen!,
                destino: formData.destino!,
                kms_inicial: Number(formData.kms_inicial),
                kms_final: Number(formData.kms_final),
                peso_carga_kg: Number(formData.peso_carga_kg),
                costo_por_kg: Number(formData.costo_por_kg),
                estacion_combustible: formData.estacion_combustible!,
                tipo_combustible: formData.tipo_combustible!,
                precio_por_galon: Number(formData.precio_por_galon),
                total_combustible: Number(formData.total_combustible),
                gasto_peajes: Number(formData.gasto_peajes),
                gasto_comidas: Number(formData.gasto_comidas),
                otros_gastos: Number(formData.otros_gastos),
                observaciones: formData.observaciones || "",
            }

            if (ruta?.id) {
                // Actualizar ruta existente
                const updatedRuta = await updateRutaMutation.mutateAsync({
                    id: ruta.id,
                    data: apiData
                })
                onSave(updatedRuta)
            } else {
                // Crear nueva ruta
                const newRuta = await createRutaMutation.mutateAsync(apiData)
                onSave(newRuta)
            }
        } catch (error) {
            // Error ya manejado por los hooks, solo log para debugging
            console.error('Error en el formulario:', error)
        }
    }

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => !updateRutaMutation.isPending && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {ruta ? "Editar Ruta de Viaje" : "Crear Nueva Ruta de Viaje"}
                    </DialogTitle>
                    <DialogDescription>
                        {ruta ? `Modifica la información de la ruta ${ruta.origen} - ${ruta.destino}` : "Completa la información de la nueva ruta de viaje"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Fecha Salida */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha_salida">Fecha de Salida *</Label>
                            <Input
                                id="fecha_salida"
                                type="date"
                                value={formData.fecha_salida || ""}
                                onChange={(e) => handleInputChange("fecha_salida", e.target.value)}
                                className={errors.fecha_salida ? "border-red-500" : ""}
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.fecha_salida && <p className="text-sm text-red-500">{errors.fecha_salida}</p>}
                        </div>

                        {/* Fecha Llegada */}
                        <div className="space-y-2">
                            <Label htmlFor="fecha_llegada">Fecha de Llegada *</Label>
                            <Input
                                id="fecha_llegada"
                                type="date"
                                value={formData.fecha_llegada || ""}
                                onChange={(e) => handleInputChange("fecha_llegada", e.target.value)}
                                className={errors.fecha_llegada ? "border-red-500" : ""}
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.fecha_llegada && <p className="text-sm text-red-500">{errors.fecha_llegada}</p>}
                        </div>

                        {/* Placa Vehículo */}
                        <div className="space-y-2">
                            <Label htmlFor="placa_vehiculo">Vehículo *</Label>
                            <Select
                                value={formData.placa_vehiculo || ""}
                                onValueChange={(value) => handleInputChange("placa_vehiculo", value)}
                                disabled={updateRutaMutation.isPending}
                            >
                                <SelectTrigger className={errors.placa_vehiculo ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar vehículo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vehiculosDisponibles.map((vehiculo) => (
                                        <SelectItem key={vehiculo} value={vehiculo}>
                                            {vehiculo}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.placa_vehiculo && <p className="text-sm text-red-500">{errors.placa_vehiculo}</p>}
                        </div>

                        {/* Conductor */}
                        <div className="space-y-2">
                            <Label htmlFor="conductor">Conductor *</Label>
                            <Select
                                value={formData.conductor || ""}
                                onValueChange={(value) => handleInputChange("conductor", value)}
                                disabled={updateRutaMutation.isPending}
                            >
                                <SelectTrigger className={errors.conductor ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar conductor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {conductoresDisponibles.map((conductor) => (
                                        <SelectItem key={conductor.documento} value={conductor.documento}>
                                            {conductor.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.conductor && <p className="text-sm text-red-500">{errors.conductor}</p>}
                        </div>

                        {/* Origen */}
                        <div className="space-y-2">
                            <Label htmlFor="origen">Origen *</Label>
                            <Input
                                id="origen"
                                value={formData.origen || ""}
                                onChange={(e) => handleInputChange("origen", e.target.value)}
                                className={errors.origen ? "border-red-500" : ""}
                                placeholder="Ciudad de origen"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.origen && <p className="text-sm text-red-500">{errors.origen}</p>}
                        </div>

                        {/* Destino */}
                        <div className="space-y-2">
                            <Label htmlFor="destino">Destino *</Label>
                            <Input
                                id="destino"
                                value={formData.destino || ""}
                                onChange={(e) => handleInputChange("destino", e.target.value)}
                                className={errors.destino ? "border-red-500" : ""}
                                placeholder="Ciudad de destino"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.destino && <p className="text-sm text-red-500">{errors.destino}</p>}
                        </div>

                        {/* KM Inicial */}
                        <div className="space-y-2">
                            <Label htmlFor="kms_inicial">Kilometraje Inicial *</Label>
                            <Input
                                id="kms_inicial"
                                type="number"
                                value={formData.kms_inicial || ""}
                                onChange={(e) => handleInputChange("kms_inicial", e.target.value)}
                                className={errors.kms_inicial ? "border-red-500" : ""}
                                placeholder="0"
                                min="0"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.kms_inicial && <p className="text-sm text-red-500">{errors.kms_inicial}</p>}
                        </div>

                        {/* KM Final */}
                        <div className="space-y-2">
                            <Label htmlFor="kms_final">Kilometraje Final *</Label>
                            <Input
                                id="kms_final"
                                type="number"
                                value={formData.kms_final || ""}
                                onChange={(e) => handleInputChange("kms_final", e.target.value)}
                                className={errors.kms_final ? "border-red-500" : ""}
                                placeholder="0"
                                min="0"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.kms_final && <p className="text-sm text-red-500">{errors.kms_final}</p>}
                        </div>

                        {/* Peso Carga */}
                        <div className="space-y-2">
                            <Label htmlFor="peso_carga_kg">Peso de Carga (kg) *</Label>
                            <Input
                                id="peso_carga_kg"
                                type="number"
                                value={formData.peso_carga_kg || ""}
                                onChange={(e) => handleInputChange("peso_carga_kg", e.target.value)}
                                className={errors.peso_carga_kg ? "border-red-500" : ""}
                                placeholder="0"
                                min="0"
                                step="0.1"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.peso_carga_kg && <p className="text-sm text-red-500">{errors.peso_carga_kg}</p>}
                        </div>

                        {/* Costo por KG */}
                        <div className="space-y-2">
                            <Label htmlFor="costo_por_kg">Costo por KG ($) *</Label>
                            <Input
                                id="costo_por_kg"
                                type="number"
                                value={formData.costo_por_kg || ""}
                                onChange={(e) => handleInputChange("costo_por_kg", e.target.value)}
                                className={errors.costo_por_kg ? "border-red-500" : ""}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.costo_por_kg && <p className="text-sm text-red-500">{errors.costo_por_kg}</p>}
                        </div>

                        {/* Estación Combustible */}
                        <div className="space-y-2">
                            <Label htmlFor="estacion_combustible">Estación de Combustible *</Label>
                            <Select
                                value={formData.estacion_combustible || ""}
                                onValueChange={(value) => handleInputChange("estacion_combustible", value)}
                                disabled={updateRutaMutation.isPending}
                            >
                                <SelectTrigger className={errors.estacion_combustible ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar estación" />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonInfo.fuelStations.map((station) => (
                                        <SelectItem key={station.id} value={station.name}>
                                            {station.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.estacion_combustible && <p className="text-sm text-red-500">{errors.estacion_combustible}</p>}
                        </div>

                        {/* Tipo Combustible */}
                        <div className="space-y-2">
                            <Label htmlFor="tipo_combustible">Tipo de Combustible *</Label>
                            <Select
                                value={formData.tipo_combustible || ""}
                                onValueChange={(value) => handleInputChange("tipo_combustible", value)}
                                disabled={updateRutaMutation.isPending}
                            >
                                <SelectTrigger className={errors.tipo_combustible ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonInfo.fuelTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.type}>
                                            {type.type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tipo_combustible && <p className="text-sm text-red-500">{errors.tipo_combustible}</p>}
                        </div>

                        {/* Precio por Galón */}
                        <div className="space-y-2">
                            <Label htmlFor="precio_por_galon">Precio por Galón ($) *</Label>
                            <Input
                                id="precio_por_galon"
                                type="number"
                                value={formData.precio_por_galon || ""}
                                onChange={(e) => handleInputChange("precio_por_galon", e.target.value)}
                                className={errors.precio_por_galon ? "border-red-500" : ""}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.precio_por_galon && <p className="text-sm text-red-500">{errors.precio_por_galon}</p>}
                        </div>

                        {/* Total Combustible */}
                        <div className="space-y-2">
                            <Label htmlFor="total_combustible">Total Gastado en Combustible ($) *</Label>
                            <Input
                                id="total_combustible"
                                type="number"
                                value={formData.total_combustible || ""}
                                onChange={(e) => handleInputChange("total_combustible", e.target.value)}
                                className={errors.total_combustible ? "border-red-500" : ""}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.total_combustible && <p className="text-sm text-red-500">{errors.total_combustible}</p>}
                        </div>

                        {/* Gasto Peajes */}
                        <div className="space-y-2">
                            <Label htmlFor="gasto_peajes">Gasto en Peajes ($) *</Label>
                            <Input
                                id="gasto_peajes"
                                type="number"
                                value={formData.gasto_peajes || ""}
                                onChange={(e) => handleInputChange("gasto_peajes", e.target.value)}
                                className={errors.gasto_peajes ? "border-red-500" : ""}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.gasto_peajes && <p className="text-sm text-red-500">{errors.gasto_peajes}</p>}
                        </div>

                        {/* Gasto Comidas */}
                        <div className="space-y-2">
                            <Label htmlFor="gasto_comidas">Gasto en Comidas ($) *</Label>
                            <Input
                                id="gasto_comidas"
                                type="number"
                                value={formData.gasto_comidas || ""}
                                onChange={(e) => handleInputChange("gasto_comidas", e.target.value)}
                                className={errors.gasto_comidas ? "border-red-500" : ""}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.gasto_comidas && <p className="text-sm text-red-500">{errors.gasto_comidas}</p>}
                        </div>

                        {/* Otros Gastos */}
                        <div className="space-y-2">
                            <Label htmlFor="otros_gastos">Otros Gastos ($) *</Label>
                            <Input
                                id="otros_gastos"
                                type="number"
                                value={formData.otros_gastos || ""}
                                onChange={(e) => handleInputChange("otros_gastos", e.target.value)}
                                className={errors.otros_gastos ? "border-red-500" : ""}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={updateRutaMutation.isPending}
                            />
                            {errors.otros_gastos && <p className="text-sm text-red-500">{errors.otros_gastos}</p>}
                        </div>

                        {/* Observaciones */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="observaciones">Observaciones</Label>
                            <Textarea
                                id="observaciones"
                                value={formData.observaciones || ""}
                                onChange={(e) => handleInputChange("observaciones", e.target.value)}
                                placeholder="Notas adicionales sobre la ruta..."
                                rows={3}
                                disabled={updateRutaMutation.isPending}
                            />
                        </div>
                    </div>

                    {/* Resumen de la Ruta */}
                    {ruta && (
                        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2 text-primary-blue" />
                                Resumen de la Ruta
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                {/* Información Básica */}
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Ruta:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">{ruta.origen} → {ruta.destino}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Vehículo:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white font-mono">{ruta.placa_vehiculo}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Estado Vehículo:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">{ruta.estado_vehiculo_calculado || 'N/A'}</span>
                                </div>
                                
                                {/* Campos Calculados por la BD */}
                                <div className="col-span-full border-t border-slate-200 dark:border-slate-700 pt-3 mt-2">
                                    <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Cálculos Automáticos (Base de Datos)</h5>
                                </div>
                                
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Kms Recorridos:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white font-semibold">{ruta.kms_recorridos?.toLocaleString() || 0} km</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Ingreso Total:</span>
                                    <span className="ml-2 text-green-600 font-semibold">${ruta.ingreso_total?.toLocaleString() || 0}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Gasto Total:</span>
                                    <span className="ml-2 text-red-600 font-semibold">${ruta.gasto_total?.toLocaleString() || 0}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Volumen Combustible:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">{ruta.volumen_combustible_gal?.toFixed(1) || 0} gal</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Rendimiento:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">{ruta.recorrido_por_galon?.toFixed(1) || 0} km/gal</span>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">Ingreso por Km:</span>
                                    <span className="ml-2 text-slate-900 dark:text-white">${ruta.ingreso_por_km?.toFixed(2) || 0}/km</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={updateRutaMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateRutaMutation.isPending}
                        >
                            {updateRutaMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                ruta ? "Guardar Cambios" : "Crear Ruta"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
