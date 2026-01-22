import { SupabaseRepository } from '@/lib/supabase/repository';
import { SeguroVehiculo, CreateSeguroRequest, UpdateSeguroRequest, SeguroFilters } from '@/types/seguros-types';

export class SeguroService {
    private static repository = new SupabaseRepository<any>({
        tableName: 'seguros_vehiculos',
    });

    // Mapear de DB a Frontend (en este caso no hay cambios, ambos usan snake_case)
    private static mapFromDB(dbSeguro: any): SeguroVehiculo {
        return {
            id: dbSeguro.id,
            placa_vehiculo: dbSeguro.placa_vehiculo,
            aseguradora: dbSeguro.aseguradora,
            poliza_seguro: dbSeguro.poliza_seguro,
            fecha_inicio: dbSeguro.fecha_inicio,
            fecha_vencimiento: dbSeguro.fecha_vencimiento,
            importe_pagado: dbSeguro.importe_pagado,
            fecha_pago: dbSeguro.fecha_pago,
            estado_poliza: dbSeguro.estado_poliza as "vigente" | "vencida" | "por_vencer" | "cancelada",
        };
    }

    // Mapear de Frontend a DB
    private static mapToDB(seguro: CreateSeguroRequest | UpdateSeguroRequest): any {
        return {
            placa_vehiculo: seguro.placa_vehiculo,
            aseguradora: seguro.aseguradora,
            poliza_seguro: seguro.poliza_seguro,
            fecha_inicio: seguro.fecha_inicio,
            fecha_vencimiento: seguro.fecha_vencimiento,
            importe_pagado: seguro.importe_pagado,
            fecha_pago: seguro.fecha_pago,
            // NO enviar estado_poliza - se calcula automáticamente por trigger
        };
    }

    static async getSeguros(filters?: SeguroFilters): Promise<SeguroVehiculo[]> {
        try {
            let seguros: any[];

            if (filters?.searchTerm) {
                seguros = await this.repository.search(filters.searchTerm, [
                    'placa_vehiculo',
                    'aseguradora',
                    'poliza_seguro',
                ]);
            } else {
                const dbFilters: Record<string, unknown> = {};
                if (filters?.estado_poliza) {
                    dbFilters.estado_poliza = filters.estado_poliza;
                }
                seguros = await this.repository.getAll(dbFilters);
            }

            return seguros.map(s => this.mapFromDB(s));
        } catch (error) {
            throw error;
        }
    }

    static async getSeguroById(id: string): Promise<SeguroVehiculo> {
        try {
            const dbSeguro = await this.repository.getById(id);
            return this.mapFromDB(dbSeguro);
        } catch (error) {
            throw error;
        }
    }

    static async createSeguro(seguroData: CreateSeguroRequest): Promise<SeguroVehiculo> {
        try {
            const dbData = this.mapToDB(seguroData);
            const dbSeguro = await this.repository.create(dbData);
            return this.mapFromDB(dbSeguro);
        } catch (error) {
            throw error;
        }
    }

    static async updateSeguro(id: string, seguroData: UpdateSeguroRequest): Promise<SeguroVehiculo> {
        try {
            const dbData = this.mapToDB(seguroData);
            const dbSeguro = await this.repository.update(id, dbData);
            return this.mapFromDB(dbSeguro);
        } catch (error) {
            throw error;
        }
    }

    static async deleteSeguro(id: string): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions(seguros: SeguroVehiculo[]) {
        const estados = [...new Set(seguros.map(s => s.estado_poliza))].filter(Boolean);
        const aseguradoras = [...new Set(seguros.map(s => s.aseguradora))].filter(Boolean);

        return {
            estados,
            aseguradoras,
        };
    }
}
