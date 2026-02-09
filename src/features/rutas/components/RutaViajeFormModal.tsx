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
import { Loader2, MapPin, Car, Fuel, DollarSign } from "lucide-react"
import { 
  type RutaViaje, 
  type CreateRutaViajeRequest,
  useCreateRuta, 
  useUpdateRuta 
} from "@/features/rutas"
import { commonInfoService } from "@/lib/common-info-service"


interface EditRutaViajeModalProps {
    ruta: RutaViaje | null
    onSave: (ruta: RutaViaje) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditRutaViajeModal({ ruta, onSave, onClose, isOpen }: EditRutaViajeModalProps) {
    const [formData, setFormData] = useState<Partial<CreateRutaViajeRequest>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [vehiculos, setVehiculos] = useState<string[]>([])
    const [conductores, setConductores] = useState<{documento: string, nombre: string}[]>([])
    const [commonInfo, setCommonInfo] = useState({
        fuelTypes: [] as { id: number; type: string }[],
        fuelStations: [] as { id: number; name: string }[],
        })

    // Hook de React Query para rutas
    const createRutaMutation = useCreateRuta()
    const updateRutaMutation = useUpdateRuta()

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
                fecha_salida: ruta.fecha_salida,
                fecha_llegada: ruta.fecha_llegada,
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
                volumen_combustible_gal: ruta.volumen_combustible_gal,
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
                volumen_combustible_gal: 0,
                total_combustible: 0,
                gasto_peajes: 0,
                gasto_comidas: 0,
                otros_gastos: 0,
                observaciones: "",
            })
        }
    }, [ruta, isOpen])

    // Cargar datos de vehículos y conductores desde API
    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar vehículos reales
                const vehiclesResponse = await fetch('/api/vehicles')
                if (vehiclesResponse.ok) {
                    const vehiclesData = await vehiclesResponse.json()
                    setVehiculos(vehiclesData.map((v: any) => v.license_plate))
                }
                
                // Cargar conductores reales
                const conductoresResponse = await fetch('/api/conductores')
                if (conductoresResponse.ok) {
                    const conductoresData = await conductoresResponse.json()
                    const conductoresConDocs = conductoresData.map((c: any) => ({
                        documento: c.documento_identidad,
                        nombre: c.nombre_conductor
                    }))
                    setConductores(conductoresConDocs)
                }
            } catch (error) {
                console.error('Error loading data:', error)
            }
        }
        
        if (isOpen) {
            loadData()
        }
    }, [isOpen])

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

        if (!formData.fecha_salida?.trim()) {
            newErrors.fecha_salida = "La fecha de salida es requerida"
        }
        if (!formData.fecha_llegada?.trim()) {
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
        if (formData.volumen_combustible_gal === undefined || formData.volumen_combustible_gal <= 0) {
            newErrors.volumen_combustible_gal = "El volumen de combustible debe ser mayor a 0"
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
                volumen_combustible_gal: Number(formData.volumen_combustible_gal),
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

    // Calcular campos derivados para mostrar en preview
    const kmsRecorridos = formData.kms_final && formData.kms_inicial ? formData.kms_final - formData.kms_inicial : 0
    const ingresoTotal = formData.peso_carga_kg && formData.costo_por_kg ? formData.peso_carga_kg * formData.costo_por_kg : 0
    const gastoTotal = (formData.total_combustible || 0) + (formData.gasto_peajes || 0) + (formData.gasto_comidas || 0) + (formData.otros_gastos || 0)
    const gananciaNeta = ingresoTotal - gastoTotal
    const volumenCombustible = formData.volumen_combustible_gal || 0
    const rendimientoPorGalon = kmsRecorridos > 0 && volumenCombustible > 0 ? kmsRecorridos / volumenCombustible : 0
    const ingresoPorKm = kmsRecorridos > 0 ? ingresoTotal / kmsRecorridos : 0

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
                    {/* Información Básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <MapPin className="h-5 w-5 mr-2" />
                            Información de la Ruta
                        </h3>
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
                                        {vehiculos.map((vehiculo) => (
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
                                        {conductores.map((conductor) => (
                                            <SelectItem key={conductor.documento} value={conductor.documento}>
                                                {conductor.nombre} ({conductor.documento})
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
                        </div>
                    </div>

                    {/* Kilometraje y Carga */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <Car className="h-5 w-5 mr-2" />
                            Kilometraje y Carga
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                    </div>

                    {/* Combustible */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <Fuel className="h-5 w-5 mr-2" />
                            Combustible
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        {commonInfo?.fuelStations.map((station) => (
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
                                        {commonInfo?.fuelTypes.map((fuel) => (
                                            <SelectItem key={fuel.id} value={fuel.type}>
                                                {fuel.type}
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

                            {/* Volumen de Combustible */}
                            <div className="space-y-2">
                                <Label htmlFor="volumen_combustible_gal">Volumen de Combustible (gal) *</Label>
                                <Input
                                    id="volumen_combustible_gal"
                                    type="number"
                                    value={formData.volumen_combustible_gal || ""}
                                    onChange={(e) => handleInputChange("volumen_combustible_gal", e.target.value)}
                                    className={errors.volumen_combustible_gal ? "border-red-500" : ""}
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    disabled={updateRutaMutation.isPending}
                                />
                                {errors.volumen_combustible_gal && <p className="text-sm text-red-500">{errors.volumen_combustible_gal}</p>}
                            </div>

                            {/* Total Combustible */}
                            <div className="space-y-2">
                                <Label htmlFor="total_combustible">Total Combustible ($) *</Label>
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
                        </div>
                    </div>

                    {/* Gastos Adicionales */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <DollarSign className="h-5 w-5 mr-2" />
                            Gastos Adicionales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Gasto Peajes */}
                            <div className="space-y-2">
                                <Label htmlFor="gasto_peajes">Gasto en Peajes ($)</Label>
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
                                <Label htmlFor="gasto_comidas">Gasto en Comidas ($)</Label>
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
                                <Label htmlFor="otros_gastos">Otros Gastos ($)</Label>
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
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones</Label>
                        <Textarea
                            id="observaciones"
                            value={formData.observaciones || ""}
                            onChange={(e) => handleInputChange("observaciones", e.target.value)}
                            rows={3}
                            placeholder="Observaciones adicionales sobre el viaje..."
                            disabled={updateRutaMutation.isPending}
                        />
                    </div>

                    {/* Resumen de Cálculos */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-3">Resumen de Cálculos</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-800">KM Recorridos:</span>
                                <span className="ml-2 text-blue-900 font-semibold">{kmsRecorridos} km</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Ingreso Total:</span>
                                <span className="ml-2 text-blue-900 font-semibold">${ingresoTotal.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Gasto Total:</span>
                                <span className="ml-2 text-blue-900 font-semibold">${gastoTotal.toLocaleString()}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Ganancia Neta:</span>
                                <span className={`ml-2 font-semibold ${gananciaNeta >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    ${gananciaNeta.toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Rendimiento:</span>
                                <span className="ml-2 text-blue-900 font-semibold">{rendimientoPorGalon.toFixed(1)} km/gal</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Ingreso por KM:</span>
                                <span className="ml-2 text-blue-900 font-semibold">${ingresoPorKm.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

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