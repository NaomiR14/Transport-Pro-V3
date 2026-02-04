import { SupabaseRepository } from '@/lib/supabase/repository';
import {
    MantenimientoVehiculo,
    CreateMantenimientoVehiculoRequest,
    UpdateMantenimientoVehiculoRequest,
    MantenimientoVehiculoFilters,
    MantenimientoVehiculoStats
} from '../types/mantenimiento.types'

export class MantenimientoVehiculoService {
    private static repository = new SupabaseRepository<any>({
        tableName: 'mantenimientos_vehiculos',
        idField: 'id',
    });

    // Mapear de snake_case (DB) a camelCase (Frontend)
    private static mapFromDB(dbMant: any): MantenimientoVehiculo {
        return {
            id: dbMant.id,
            placaVehiculo: dbMant.placa_vehiculo,
            taller: dbMant.taller,
            fechaEntrada: dbMant.fecha_entrada,
            fechaSalida: dbMant.fecha_salida,
            tipo: dbMant.tipo,
            kilometraje: dbMant.kilometraje,
            paqueteMantenimiento: dbMant.paquete_mantenimiento,
            causas: dbMant.causas,
            costoTotal: dbMant.costo_total,
            fechaPago: dbMant.fecha_pago,
            observaciones: dbMant.observaciones,
            estado: dbMant.estado,
        };
    }

    // Mapear de camelCase (Frontend) a snake_case (DB) - NO enviar 'estado' (trigger)
    private static mapToDB(mant: CreateMantenimientoVehiculoRequest | UpdateMantenimientoVehiculoRequest): any {
        return {
            placa_vehiculo: mant.placaVehiculo,
            taller: mant.taller,
            fecha_entrada: mant.fechaEntrada,
            tipo: mant.tipo,
            kilometraje: mant.kilometraje,
            paquete_mantenimiento: mant.paqueteMantenimiento,
            causas: mant.causas,
            costo_total: mant.costoTotal,
            fecha_pago: mant.fechaPago,
            observaciones: mant.observaciones,
            // NO enviar: estado (calculado por trigger automáticamente)
        };
    }

    async getMantenimientos(filters?: MantenimientoVehiculoFilters): Promise<MantenimientoVehiculo[]> {
        try {
            let mantenimientos: any[];

            if (filters?.searchTerm) {
                mantenimientos = await MantenimientoVehiculoService.repository.search(filters.searchTerm, [
                    'placa_vehiculo',
                    'taller',
                    'paquete_mantenimiento',
                    'causas',
                ]);
            } else {
                const dbFilters: Record<string, unknown> = {};
                if (filters?.tipo && filters.tipo !== 'all') {
                    dbFilters.tipo = filters.tipo;
                }
                if (filters?.estado && filters.estado !== 'all') {
                    dbFilters.estado = filters.estado;
                }
                mantenimientos = await MantenimientoVehiculoService.repository.getAll(dbFilters);
            }

            return mantenimientos.map(m => MantenimientoVehiculoService.mapFromDB(m));
        } catch (error) {
            throw error;
        }
    }

    async getMantenimientoById(id: string): Promise<MantenimientoVehiculo> {
        try {
            const dbMant = await MantenimientoVehiculoService.repository.getById(id);
            return MantenimientoVehiculoService.mapFromDB(dbMant);
        } catch (error) {
            throw error;
        }
    }

    async createMantenimiento(data: CreateMantenimientoVehiculoRequest): Promise<MantenimientoVehiculo> {
        try {
            const dbData = MantenimientoVehiculoService.mapToDB(data);
            const dbMant = await MantenimientoVehiculoService.repository.create(dbData);
            return MantenimientoVehiculoService.mapFromDB(dbMant);
        } catch (error) {
            throw error;
        }
    }

    async updateMantenimiento(id: string, data: UpdateMantenimientoVehiculoRequest): Promise<MantenimientoVehiculo> {
        try {
            const dbData = MantenimientoVehiculoService.mapToDB(data);
            const dbMant = await MantenimientoVehiculoService.repository.update(id, dbData);
            return MantenimientoVehiculoService.mapFromDB(dbMant);
        } catch (error) {
            throw error;
        }
    }

    async deleteMantenimiento(id: string): Promise<void> {
        try {
            await MantenimientoVehiculoService.repository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async getStats(): Promise<MantenimientoVehiculoStats> {
        try {
            const mantenimientosDB = await MantenimientoVehiculoService.repository.getAll();
            const mantenimientos = mantenimientosDB.map(m => MantenimientoVehiculoService.mapFromDB(m));

            const total = mantenimientos.length;
            const completados = mantenimientos.filter(m => m.estado === 'Completado').length;
            const enProceso = mantenimientos.filter(m => m.estado === 'En Proceso').length;
            const pendientePago = mantenimientos.filter(m => m.estado === 'Pendiente Pago').length;
            const costoPendiente = mantenimientos
                .filter(m => !m.fechaPago)
                .reduce((sum, m) => sum + m.costoTotal, 0);

            return {
                total,
                completados,
                enProceso,
                pendientePago,
                costoPendiente
            };
        } catch (error) {
            throw error;
        }
    }
}

export const mantenimientoVehiculoService = new MantenimientoVehiculoService()