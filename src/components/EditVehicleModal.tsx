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
import { Loader2 } from "lucide-react"
import { Vehicle, CreateVehicleRequest } from "@/types/vehicles-types"
import { useCreateVehicle, useUpdateVehicle } from "@/hooks/use-vehicle"
import { CommonInfoService } from "@/services/api/common-info-service"

interface EditVehicleModalProps {
    vehicle: Vehicle | null
    onSave: (vehicle: Vehicle) => void
    onClose: () => void
    isOpen: boolean
}

export default function EditVehicleModal({ vehicle, onSave, onClose, isOpen }: EditVehicleModalProps) {
    const [formData, setFormData] = useState<Partial<CreateVehicleRequest>>({})
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
                const svc = new CommonInfoService()
                const [types, brands, models] = await Promise.all([
                    svc.getVehicleTypes(),   // instance method
                    svc.getVehicleBrands(),
                    svc.getVehicleModels(),
                ])
                setCommonInfo({
                    vehicleTypes: types,
                    vehicleBrands: brands,
                    vehicleModels: models
                })
            } catch (error) {
                console.error('Error loading common info:', error)
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
                year: vehicle.year.toString(),
                maxLoadCapacity: vehicle.maxLoadCapacity.toString(),
                vehicleState: vehicle.vehicleState,
                maintenanceData: {
                    maintenanceCycle: vehicle.maintenanceData.maintenanceCycle,
                    initialKm: vehicle.maintenanceData.initialKm,
                }
            })
        } else {
            // Valores por defecto para nuevo vehículo
            setFormData({
                type: "",
                brand: "",
                model: "",
                licensePlate: "",
                serialNumber: "",
                color: "",
                year: new Date().getFullYear().toString(),
                maxLoadCapacity: "0",
                vehicleState: "Disponible",
                maintenanceData: {
                    maintenanceCycle: 10000,
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
        if (!formData.vehicleState?.trim()) {
            newErrors.vehicleState = "El estado del vehículo es requerido"
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
            // Preparar datos para la API (convertir strings a números donde sea necesario)
            const apiData: CreateVehicleRequest = {
                type: formData.type!,
                brand: formData.brand!,
                model: formData.model!,
                licensePlate: formData.licensePlate!,
                serialNumber: formData.serialNumber!,
                color: formData.color!,
                year: formData.year!,
                maxLoadCapacity: formData.maxLoadCapacity!,
                vehicleState: formData.vehicleState!,
                maintenanceData: formData.maintenanceData!
            }

            if (vehicle?.id) {
                // Actualizar vehículo existente
                const updatedVehicle = await updateVehicleMutation.mutateAsync({
                    id: vehicle.id,
                    data: apiData
                })
                onSave(updatedVehicle)
            } else {
                // Crear nuevo vehículo
                const newVehicle = await createVehicleMutation.mutateAsync(apiData)
                onSave(newVehicle)
            }
        } catch (error) {
            // Error ya manejado por los hooks, solo log para debugging
            console.error('Error en el formulario:', error)
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
                                    <SelectValue placeholder={
                                        !formData.brand ? "Selecciona una marca primero" : "Seleccionar modelo"
                                    } />
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

                        {/* Estado del Vehículo */}
                        <div className="space-y-2">
                            <Label htmlFor="vehicleState">Estado *</Label>
                            <Select
                                value={formData.vehicleState || ""}
                                onValueChange={(value) => handleInputChange("vehicleState", value)}
                                disabled={updateVehicleMutation.isPending}
                            >
                                <SelectTrigger className={errors.vehicleState ? "border-red-500" : ""}>
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Disponible">Disponible</SelectItem>
                                    <SelectItem value="En Mantenimiento">En Mantenimiento</SelectItem>
                                    <SelectItem value="En Uso">En Uso</SelectItem>
                                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.vehicleState && <p className="text-sm text-red-500">{errors.vehicleState}</p>}
                        </div>

                        {/* Ciclo de Mantenimiento */}
                        <div className="space-y-2">
                            <Label htmlFor="maintenanceCycle">Ciclo de Mantenimiento (km)</Label>
                            <Input
                                id="maintenanceCycle"
                                type="number"
                                value={formData.maintenanceData?.maintenanceCycle || ""}
                                onChange={(e) => handleInputChange("maintenanceData.maintenanceCycle", e.target.value)}
                                placeholder="5000"
                                min="0"
                                disabled={updateVehicleMutation.isPending}
                            />
                        </div>

                        {/* Kilometraje Inicial */}
                        <div className="space-y-2">
                            <Label htmlFor="initialKm">Kilometraje Inicial</Label>
                            <Input
                                id="initialKm"
                                type="number"
                                value={formData.maintenanceData?.initialKm || ""}
                                onChange={(e) => handleInputChange("maintenanceData.initialKm", e.target.value)}
                                placeholder="0"
                                min="0"
                                disabled={updateVehicleMutation.isPending}
                            />
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Resumen del Vehículo</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-blue-800">Tipo:</span>
                                <span className="ml-2 text-blue-900">{formData.type || "No especificado"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Marca/Modelo:</span>
                                <span className="ml-2 text-blue-900">{formData.brand} {formData.model}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Placa:</span>
                                <span className="ml-2 text-blue-900 font-semibold">{formData.licensePlate || "No asignada"}</span>
                            </div>
                            <div>
                                <span className="font-medium text-blue-800">Estado:</span>
                                <span className="ml-2 text-blue-900">{formData.vehicleState || "No especificado"}</span>
                            </div>
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