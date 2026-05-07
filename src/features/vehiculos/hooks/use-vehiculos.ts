// src/features/vehiculos/hooks/use-vehiculos.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePlanLimites } from "@/features/pagos";
import { toast } from "sonner";
import { useEffect } from "react";
import { vehicleService } from "../services/vehiculo-service";
import { useVehicleStore, calculateStats } from "../store/vehiculo-store";
import {
    CreateVehicleRequest,
    VehicleFilters,
} from "../types/vehiculo.types";

// Query keys
const QUERY_KEYS = {
    vehicles: ["vehicles"] as const,
    list: (filters?: VehicleFilters) =>
        [...QUERY_KEYS.vehicles, "list", filters] as const,
    detail: (id: string) => [...QUERY_KEYS.vehicles, "detail", id] as const,
    stats: () => [...QUERY_KEYS.vehicles, "stats"] as const,
    search: (term: string) => [...QUERY_KEYS.vehicles, "search", term] as const,
};

// Hook para listar vehículos con sincronización automática del store
export function useVehicles(filters?: VehicleFilters) {
    const { setVehicles, setLoading, setError } = useVehicleStore();

    const query = useQuery({
        queryKey: QUERY_KEYS.list(filters),
        queryFn: () => vehicleService.getVehicles(filters),
        staleTime: 30 * 1000, // 30 segundos - reduce cache para evitar problemas entre páginas
    })

    // Auto-sync con store
    useEffect(() => {
        if (query.data) {
            setVehicles(query.data);
            setError(null);
        }
        if (query.error) {
            setError(query.error.message);
        }
        setLoading(query.isLoading);
    }, [
        query.data,
        query.error,
        query.isLoading,
        setVehicles,
        setError,
        setLoading,
    ]);

    return query;
}


// Hook para crear vehículo
export function useCreateVehicle() {
    const queryClient = useQueryClient();
    const { addVehicle } = useVehicleStore();

    return useMutation({
        mutationFn: (data: CreateVehicleRequest) => vehicleService.createVehicle(data),
        onSuccess: (newVehicle) => {
            console.log("🟢 CREATE HOOK - Vehículo creado:", newVehicle)
            addVehicle(newVehicle);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
            toast.success("Vehículo creado exitosamente");
        },
        onError: (error: Error) => {
            console.error("🔴 CREATE HOOK - Error:", error)
            toast.error(error.message || "Error al crear vehículo");
        },
    });
}

// Hook para actualizar vehículo
export function useUpdateVehicle() {
    const queryClient = useQueryClient();
    const { updateVehicle } = useVehicleStore();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: import('../types/vehiculo.types').UpdateVehicleRequest }) => {
            console.log('🟡 UPDATE HOOK - Iniciando actualización:', { id, data });
            return vehicleService.updateVehicle(id, data);
        },
        onSuccess: (updatedVehicle) => {
            console.log('🟢 UPDATE HOOK - Vehículo actualizado:', updatedVehicle);
            updateVehicle(updatedVehicle);
            queryClient.setQueryData(
                QUERY_KEYS.detail(updatedVehicle.id),
                updatedVehicle
            );
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
            toast.success("Vehículo actualizado exitosamente");
        },
        onError: (error: Error) => {
            console.error('🔴 UPDATE HOOK - Error:', error);
            toast.error(error.message || "Error al actualizar vehículo");
        },
    });
}

// Hook para eliminar vehículo
export function useDeleteVehicle() {
    const queryClient = useQueryClient();
    const { removeVehicle } = useVehicleStore();

    return useMutation({
        mutationFn: (id: string) => {
            console.log('🟡 DELETE HOOK - Iniciando eliminación, ID:', id);
            return vehicleService.deleteVehicle(id);
        },
        onSuccess: (_, vehicleId) => {
            console.log('🟢 DELETE HOOK - Vehículo eliminado, ID:', vehicleId);
            removeVehicle(vehicleId);
            queryClient.removeQueries({ queryKey: QUERY_KEYS.detail(vehicleId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.vehicles });
            toast.success("Vehículo eliminado exitosamente");
        },
        onError: (error: Error) => {
            console.error('🔴 DELETE HOOK - Error:', error);
            toast.error(error.message || "Error al eliminar vehículo");
        },
    });
}

// Hook para estadísticas calculadas localmente
export function useVehiclesStats() {
    const { vehicles } = useVehicleStore()
    const stats = vehicles.length > 0 ? calculateStats(vehicles) : { total: 0, available: 0, inMaintenance: 0, requierenMantenimiento: 0 }
    return { data: stats }
}




// Hook combinado para filtros del store
export function useFilteredVehicles() {
    const { filters, getFilteredVehicles } = useVehicleStore();
    const { data: vehicles, isLoading, error } = useVehicles(filters);

    return {
        vehicles: getFilteredVehicles(),
        allVehicles: vehicles || [],
        isLoading,
        error: error?.message || null,
        filters,
    };
}

// Hook para opciones de filtro
export function useVehicleFilterOptions() {
    const { vehicles } = useVehicleStore()
    const { data: allVehicles } = useVehicles()

    const vehiclesToUse = allVehicles || vehicles

    const types = [...new Set(vehiclesToUse.map(v => v.type))].filter(Boolean);
    const brands = [...new Set(vehiclesToUse.map(v => v.brand))].filter(Boolean);
    const states = [...new Set(vehiclesToUse.map(v => v.calculatedData?.estadoCalculado))].filter(Boolean);
    const years = [...new Set(vehiclesToUse.map(v => v.year))].sort((a, b) => Number(b) - Number(a));

    return {
        types,
        brands,
        states,
        years,
    };
}

// Hook para contar vehículos actuales
export function useVehiculosCount() {
    return useQuery({
        queryKey: [...QUERY_KEYS.vehicles, 'count'] as const,
        queryFn: () => vehicleService.getCount(),
        staleTime: 30 * 1000,
    })
}

// Hook que indica si se alcanzó el límite del plan
export function useLimiteVehiculos() {
    const { data: count = 0 } = useVehiculosCount()
    const { maxVehiculos } = usePlanLimites()

    return {
        actual: count,
        maximo: maxVehiculos,
        alcanzado: maxVehiculos !== null && count >= maxVehiculos,
        ilimitado: maxVehiculos === null,
    }
}
