"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Loader2, Gauge, AlertTriangle, Shield } from "lucide-react"
import { 
    type Vehicle, 
    type CreateVehicleRequest,
    type UpdateVehicleRequest,
    useCreateVehicle, 
    useUpdateVehicle 
} from "@/features/vehiculos"
import { commonInfoService } from "@/lib/common-info-service"

interface EditVehicleModalProps {
    vehicle: Vehicle | null
    onSave: (vehicle: Vehicle) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditVehicleModal({ vehicle, onSave, onClose, isOpen }: EditVehicleModalProps) {
    const [formData, setFormData] = useState<Partial<CreateVehicleRequest | UpdateVehicleRequest>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [commonInfo, setCommonInfo] = useState({
        vehicleTypes: [] as { id: number; type: string }[],
        vehicleBrands: [] as { id: number; name: string }[],
        vehicleModels: [] as { id: number; brandId: number; name: string }[],
    })

    // Hook de React Query para vehículos
    const createVehicleMutation = useCreateVehicle()
    const updateVehicleMutation = useUpdateVehicle()
    //const { filters } = useVehicleStore()

    // Cargar información común al abrir el modal
    useEffect(() => {
        const loadCommonInfo = async () => {
            try {
                console.log('[EditVehicleModal] Cargando CommonInfo...');
                const [types, brands, models] = await Promise.all([
                    commonInfoService.getVehicleTypes(),
                    commonInfoService.getVehicleBrands(),
                    commonInfoService.getVehicleModels(),
                ])
                console.log('[EditVehicleModal] CommonInfo cargado:', { 
                    types: types?.length || 0, 
                    brands: brands?.length || 0, 
                    models: models?.length || 0,
                    typesData: types,
                    brandsData: brands,
                    modelsData: models
                });
                setCommonInfo({
                    vehicleTypes: types || [],
                    vehicleBrands: brands || [],
                    vehicleModels: models || []
                })
            } catch (error) {
                console.error('[EditVehicleModal] Error loading common info:', error)
                // Intentar cargar datos vacíos para que el formulario no falle
                setCommonInfo({
                    vehicleTypes: [],
                    vehicleBrands: [],
                    vehicleModels: []
                })
            }
        }

        if (isOpen) {
            loadCommonInfo()
        }
    }, [isOpen])

    // Inicializar formData cuando cambia el vehículo o se abre el modal
    useEffect(() => {
        if (vehicle) {
            // Para edición, usar los datos existentes del vehículo
            setFormData({
                type: vehicle.type,
                brand: vehicle.brand,
                model: vehicle.model,
                licensePlate: vehicle.licensePlate,
                serialNumber: vehicle.serialNumber,
                color: vehicle.color,
                year: vehicle.year,
                maxLoadCapacity: vehicle.maxLoadCapacity,
                // vehicleState NO se incluye - se usa el calculado
                maintenanceData: {
                    maintenanceCycle: vehicle.maintenanceData.maintenanceCycle || 5000,
                    initialKm: vehicle.maintenanceData.initialKm || 0,
                }
            })
        } else {
            // Valores por defecto para nuevo vehículo (sin vehicleState)
            setFormData({
                type: "",
                brand: "",
                model: "",
                licensePlate: "",
                serialNumber: "",
                color: "",
                year: new Date().getFullYear(),
                maxLoadCapacity: 0,
                // vehicleState NO se incluye en creación, será "activo" por defecto
                maintenanceData: {
                    maintenanceCycle: 5000,  // Valor por defecto
                    initialKm: 0,
                }
            })
        }
    }, [vehicle, isOpen])

    // Función mejorada para manejar cambios en campos anidados
    const handleInputChange = (field: string, value: string | number) => {
        setFormData((prev) => {
            // Si el campo contiene un punto, es un campo anidado
            if (field.includes('.')) {
                const [parent, child] = field.split('.')
                
                if (parent === 'maintenanceData' && prev.maintenanceData) {
                    return {
                        ...prev,
                        maintenanceData: {
                            ...prev.maintenanceData,
                            [child]: value
                        }
                    }
                }
            }
            
            // Campo normal
            return {
                ...prev,
                [field]: value,
            }
        })

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }))
        }

        // Si cambia la marca, limpiar el modelo seleccionado
        if (field === 'brand') {
            setFormData(prev => ({
                ...prev,
                model: ""
            }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.type?.trim()) {
            newErrors.type = "El tipo de vehículo es requerido"
        }
        if (!formData.brand?.trim()) {
            newErrors.brand = "La marca es requerida"
        }
        if (!formData.model?.trim()) {
            newErrors.model = "El modelo es requerido"
        }
        if (!formData.licensePlate?.trim()) {
            newErrors.licensePlate = "La placa es requerida"
        }
        if (!formData.serialNumber?.trim()) {
            newErrors.serialNumber = "El número de serie es requerido"
        }
        if (!formData.color?.trim()) {
            newErrors.color = "El color es requerido"
        }
        if (!formData.year || isNaN(Number(formData.year)) || Number(formData.year) < 1900 || Number(formData.year) > new Date().getFullYear() + 1) {
            newErrors.year = "El año debe ser válido"
        }
        if (!formData.maxLoadCapacity || isNaN(Number(formData.maxLoadCapacity)) || Number(formData.maxLoadCapacity) < 0) {
            newErrors.maxLoadCapacity = "La capacidad máxima de carga debe ser un número válido"
        }
        // vehicleState ya no existe - se usa solo el calculado
        // Validar campos de mantenimiento (requeridos)
        if (!formData.maintenanceData?.maintenanceCycle || formData.maintenanceData.maintenanceCycle <= 0) {
            newErrors.maintenanceCycle = "El ciclo de mantenimiento es requerido"
        }
        if (formData.maintenanceData?.initialKm === undefined || formData.maintenanceData.initialKm < 0) {
            newErrors.initialKm = "El kilometraje inicial es requerido"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log('[EditVehicleModal] Submit iniciado, formData:', formData);

        // Prevenir doble submit
        if (createVehicleMutation.isPending || updateVehicleMutation.isPending) {
            console.log('[EditVehicleModal] Ya hay una operación en curso, ignorando submit');
            return;
        }

        if (!validateForm()) {
            console.error('[EditVehicleModal] Validación fallida, errores:', errors);
            return
        }

        console.log('[EditVehicleModal] Validación exitosa, preparando datos...');

        try {
            if (vehicle?.id) {
                // Actualizar vehículo existente - incluye vehicleState
                const updateData: UpdateVehicleRequest = {
                    type: formData.type!,
                    brand: formData.brand!,
                    model: formData.model!,
                    licensePlate: formData.licensePlate!,
                    serialNumber: formData.serialNumber!,
                    color: formData.color!,
                    year: Number(formData.year!),
                    maxLoadCapacity: Number(formData.maxLoadCapacity!),
                    // vehicleState no se incluye - siempre calculado
                    maintenanceData: {
                        maintenanceCycle: Number(formData.maintenanceData!.maintenanceCycle!),
                        initialKm: Number(formData.maintenanceData!.initialKm!),
                    }
                }
                console.log('[EditVehicleModal] Actualizando vehículo...', updateData);
                const updatedVehicle = await updateVehicleMutation.mutateAsync({
                    id: vehicle.id,
                    data: updateData
                })
                console.log('[EditVehicleModal] Vehículo actualizado:', updatedVehicle);
                onSave(updatedVehicle)
            } else {
                // Crear nuevo vehículo - NO incluye vehicleState (será "activo" por defecto)
                const createData: CreateVehicleRequest = {
                    type: formData.type!,
                    brand: formData.brand!,
                    model: formData.model!,
                    licensePlate: formData.licensePlate!,
                    serialNumber: formData.serialNumber!,
                    color: formData.color!,
                    year: Number(formData.year!),
                    maxLoadCapacity: Number(formData.maxLoadCapacity!),
                    maintenanceData: {
                        maintenanceCycle: Number(formData.maintenanceData!.maintenanceCycle!),
                        initialKm: Number(formData.maintenanceData!.initialKm!),
                    }
                }
                console.log('[EditVehicleModal] Creando nuevo vehículo...', createData);
                const newVehicle = await createVehicleMutation.mutateAsync(createData)
                console.log('[EditVehicleModal] Vehículo creado:', newVehicle);
                onSave(newVehicle)
            }
        } catch (error) {
            // Error ya manejado por los hooks, solo log para debugging
            console.error('[EditVehicleModal] Error en el formulario:', error)
        }
    }

    // Filtrar modelos por marca seleccionada
    const filteredModels = commonInfo.vehicleModels.filter(
        model => model.brandId === commonInfo.vehicleBrands.find(brand => brand.name === formData.brand)?.id
    )

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={() => !updateVehicleMutation.isPending && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {vehicle ? "Editar Vehículo" : "Crear Nuevo Vehículo"}
                    </DialogTitle>
                    <DialogDescription>
                        {vehicle ? `Modifica la información del vehículo ${formData.licensePlate}` : "Completa la información del nuevo vehículo"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tipo de Vehículo */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Vehículo *</Label>
                            <Select
                                value={formData.type || ""}
                                onValueChange={(value) => handleInputChange("type", value)}
                                disabled={updateVehicleMutation.isPending}
                            >
                                <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonInfo.vehicleTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.type}>
                                            {type.type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>

                        {/* Marca */}
                        <div className="space-y-2">
                            <Label htmlFor="brand">Marca *</Label>
                            <Select
                                value={formData.brand || ""}
                                onValueChange={(value) => handleInputChange("brand", value)}
                                disabled={updateVehicleMutation.isPending}
                            >
                                <SelectTrigger className={errors.brand ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar marca" />
                                </SelectTrigger>
                                <SelectContent>
                                    {commonInfo.vehicleBrands.map((brand) => (
                                        <SelectItem key={brand.id} value={brand.name}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.brand && <p className="text-sm text-red-500">{errors.brand}</p>}
                        </div>

                        {/* Modelo */}
                        <div className="space-y-2">
                            <Label htmlFor="model">Modelo *</Label>
                            <Select
                                value={formData.model || ""}
                                onValueChange={(value) => handleInputChange("model", value)}
                                disabled={updateVehicleMutation.isPending || !formData.brand}
                            >
                                <SelectTrigger className={errors.model ? "border-red-500" : ""}>
                                    <SelectValue placeholder={!formData.brand ? "Selecciona marca" : "Seleccionar modelo"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {filteredModels.map((model) => (
                                        <SelectItem key={model.id} value={model.name}>
                                            {model.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                        </div>

                        {/* Placa */}
                        <div className="space-y-2">
                            <Label htmlFor="licensePlate">Placa *</Label>
                            <Input
                                id="licensePlate"
                                value={formData.licensePlate || ""}
                                onChange={(e) => handleInputChange("licensePlate", e.target.value.toUpperCase())}
                                className={errors.licensePlate ? "border-red-500" : ""}
                                placeholder="ABC-123"
                                disabled={updateVehicleMutation.isPending}
                            />
                            {errors.licensePlate && <p className="text-sm text-red-500">{errors.licensePlate}</p>}
                        </div>

                        {/* Número de Serie */}
                        <div className="space-y-2">
                            <Label htmlFor="serialNumber">Número de Serie *</Label>
                            <Input
                                id="serialNumber"
                                value={formData.serialNumber || ""}
                                onChange={(e) => handleInputChange("serialNumber", e.target.value.toUpperCase())}
                                className={errors.serialNumber ? "border-red-500" : ""}
                                placeholder="VIN del vehículo"
                                disabled={updateVehicleMutation.isPending}
                            />
                            {errors.serialNumber && <p className="text-sm text-red-500">{errors.serialNumber}</p>}
                        </div>

                        {/* Color */}
                        <div className="space-y-2">
                            <Label htmlFor="color">Color *</Label>
                            <Input
                                id="color"
                                value={formData.color || ""}
                                onChange={(e) => handleInputChange("color", e.target.value)}
                                className={errors.color ? "border-red-500" : ""}
                                disabled={updateVehicleMutation.isPending}
                            />
                            {errors.color && <p className="text-sm text-red-500">{errors.color}</p>}
                        </div>

                        {/* Año */}
                        <div className="space-y-2">
                            <Label htmlFor="year">Año *</Label>
                            <Input
                                id="year"
                                type="number"
                                value={formData.year || ""}
                                onChange={(e) => handleInputChange("year", e.target.value)}
                                className={errors.year ? "border-red-500" : ""}
                                min="1900"
                                max={new Date().getFullYear() + 1}
                                disabled={updateVehicleMutation.isPending}
                            />
                            {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
                        </div>

                        {/* Capacidad Máxima de Carga */}
                        <div className="space-y-2">
                            <Label htmlFor="maxLoadCapacity">Capacidad Máxima (kg) *</Label>
                            <Input
                                id="maxLoadCapacity"
                                type="number"
                                value={formData.maxLoadCapacity || ""}
                                onChange={(e) => handleInputChange("maxLoadCapacity", e.target.value)}
                                className={errors.maxLoadCapacity ? "border-red-500" : ""}
                                min="0"
                                step="0.1"
                                disabled={updateVehicleMutation.isPending}
                            />
                            {errors.maxLoadCapacity && <p className="text-sm text-red-500">{errors.maxLoadCapacity}</p>}
                        </div>

                        {/* vehicleState eliminado - se usa solo el calculado */}

                        {/* Ciclo de Mantenimiento */}
                        <div className="space-y-2">
                            <Label htmlFor="maintenanceCycle">Ciclo de Mantenimiento (km) *</Label>
                            <Input
                                id="maintenanceCycle"
                                type="number"
                                value={formData.maintenanceData?.maintenanceCycle || ""}
                                onChange={(e) => handleInputChange("maintenanceData.maintenanceCycle", e.target.value)}
                                className={errors.maintenanceCycle ? "border-red-500" : ""}
                                placeholder="5000"
                                min="1"
                                disabled={updateVehicleMutation.isPending}
                            />
                            {errors.maintenanceCycle && <p className="text-sm text-red-500">{errors.maintenanceCycle}</p>}
                        </div>

                        {/* Kilometraje Inicial */}
                        <div className="space-y-2">
                            <Label htmlFor="initialKm">Kilometraje Inicial (km) *</Label>
                            <Input
                                id="initialKm"
                                type="number"
                                value={formData.maintenanceData?.initialKm !== undefined ? formData.maintenanceData.initialKm : ""}
                                onChange={(e) => handleInputChange("maintenanceData.initialKm", e.target.value)}
                                className={errors.initialKm ? "border-red-500" : ""}
                                placeholder="0"
                                min="0"
                                disabled={updateVehicleMutation.isPending}
                            />
                            {errors.initialKm && <p className="text-sm text-red-500">{errors.initialKm}</p>}
                        </div>
                    </div>

                    {/* Resumen del Vehículo */}
                    <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                            <Gauge className="h-5 w-5 mr-2 text-primary-blue" />
                            Resumen del Vehículo
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {/* Información Básica */}
                            <div>
                                <span className="font-medium text-slate-600 dark:text-slate-400">Tipo:</span>
                                <span className="ml-2 text-slate-900 dark:text-white">{formData.type || "No especificado"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-600 dark:text-slate-400">Marca/Modelo:</span>
                                <span className="ml-2 text-slate-900 dark:text-white">{formData.brand} {formData.model}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-600 dark:text-slate-400">Placa:</span>
                                <span className="ml-2 text-slate-900 dark:text-white font-mono font-bold">{formData.licensePlate || "No asignada"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-600 dark:text-slate-400">Estado Calculado:</span>
                                <span className="ml-2">
                                    {vehicle?.calculatedData?.estadoCalculado ? (
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            vehicle.calculatedData.estadoCalculado === 'Disponible' 
                                                ? 'bg-green-100 text-green-800'
                                                : vehicle.calculatedData.estadoCalculado === 'En Mantenimiento'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : vehicle.calculatedData.estadoCalculado === 'Seguro Vencido'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {vehicle.calculatedData.estadoCalculado}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Disponible
                                        </span>
                                    )}
                                </span>
                            </div>
                            
                            {/* Datos de Mantenimiento */}
                            <div className="col-span-full border-t border-slate-200 dark:border-slate-700 pt-3 mt-2">
                                <h5 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Información de Mantenimiento</h5>
                            </div>
                            <div>
                                <span className="font-medium text-slate-600 dark:text-slate-400">Ciclo de Mantenimiento:</span>
                                <span className="ml-2 text-slate-900 dark:text-white">
                                    {formData.maintenanceData?.maintenanceCycle?.toLocaleString() || "5,000"} km
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-slate-600 dark:text-slate-400">Kilometraje Inicial:</span>
                                <span className="ml-2 text-slate-900 dark:text-white">
                                    {formData.maintenanceData?.initialKm?.toLocaleString() || "0"} km
                                </span>
                            </div>
                            
                            {/* Campos Calculados - Solo en Edición */}
                            {vehicle?.calculatedData && (
                                <>
                                    <div>
                                        <span className="font-medium text-slate-600 dark:text-slate-400">Último Km Preventivo:</span>
                                        <span className="ml-2 text-slate-900 dark:text-white">
                                            {vehicle.calculatedData.ultimoKmPreventivo?.toLocaleString()} km
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-600 dark:text-slate-400">Último Km Odómetro:</span>
                                        <span className="ml-2 text-slate-900 dark:text-white">
                                            {vehicle.calculatedData.ultimoKmOdometro?.toLocaleString()} km
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-600 dark:text-slate-400">Kms Restantes:</span>
                                        <span className={`ml-2 font-semibold ${
                                            vehicle.calculatedData.kmsRestantesMantenimiento < 500 
                                                ? 'text-red-600' 
                                                : vehicle.calculatedData.kmsRestantesMantenimiento < 1000
                                                    ? 'text-yellow-600'
                                                    : 'text-green-600'
                                        }`}>
                                            {vehicle.calculatedData.kmsRestantesMantenimiento?.toLocaleString()} km
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-600 dark:text-slate-400">Alerta Mantenimiento:</span>
                                        <span className="ml-2">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                vehicle.calculatedData.alertaMantenimiento === 'Mantener' 
                                                    ? 'bg-red-100 text-red-800'
                                                    : vehicle.calculatedData.alertaMantenimiento === 'Falta poco'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                            }`}>
                                                {vehicle.calculatedData.alertaMantenimiento}
                                            </span>
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={updateVehicleMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateVehicleMutation.isPending}
                        >
                            {updateVehicleMutation.isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                vehicle ? "Guardar Cambios" : "Crear Vehículo"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}