import { SupabaseRepository } from '@/lib/supabase/repository';
import { ImpuestoVehicular, CreateImpuestoRequest, UpdateImpuestoRequest, ImpuestoFilters } from '../types/impuestos.types';


export class ImpuestoVehicularService {
    private static repository = new SupabaseRepository<any>({
        tableName: 'impuestos_vehiculares',
    });

    // Mapear de DB a Frontend (mismo formato snake_case)
    private static mapFromDB(dbImpuesto: any): ImpuestoVehicular {
        return {
            id: dbImpuesto.id,
            placa_vehiculo: dbImpuesto.placa_vehiculo,
            tipo_impuesto: dbImpuesto.tipo_impuesto,
            anio_impuesto: dbImpuesto.anio_impuesto,
            impuesto_monto: dbImpuesto.impuesto_monto,
            fecha_pago: dbImpuesto.fecha_pago,
            estado_pago: dbImpuesto.estado_pago as "pagado" | "pendiente" | "vencido",
        };
    }

    // Mapear de Frontend a DB
    private static mapToDB(impuesto: CreateImpuestoRequest | UpdateImpuestoRequest): any {
        return {
            placa_vehiculo: impuesto.placa_vehiculo,
            tipo_impuesto: impuesto.tipo_impuesto,
            anio_impuesto: impuesto.anio_impuesto,
            impuesto_monto: impuesto.impuesto_monto,
            fecha_pago: impuesto.fecha_pago,
            estado_pago: impuesto.estado_pago,
        };
    }
    static async getImpuestos(filters?: ImpuestoFilters): Promise<ImpuestoVehicular[]> {
        try {
            let impuestos: any[];

            if (filters?.searchTerm) {
                impuestos = await this.repository.search(filters.searchTerm, [
                    'placa_vehiculo',
                    'tipo_impuesto',
                ]);
            } else {
                const dbFilters: Record<string, unknown> = {};
                if (filters?.placa_vehiculo) {
                    dbFilters.placa_vehiculo = filters.placa_vehiculo;
                }
                if (filters?.estado_pago) {
                    dbFilters.estado_pago = filters.estado_pago;
                }
                impuestos = await this.repository.getAll(dbFilters);
            }

            return impuestos.map(i => this.mapFromDB(i));
        } catch (error) {
            throw error;
        }
    }

    static async getImpuestoById(id: string): Promise<ImpuestoVehicular> {
        try {
            const dbImpuesto = await this.repository.getById(id);
            return this.mapFromDB(dbImpuesto);
        } catch (error) {
            throw error;
        }
    }

    static async createImpuesto(impuestoData: CreateImpuestoRequest): Promise<ImpuestoVehicular> {
        try {
            const dbData = this.mapToDB(impuestoData);
            const dbImpuesto = await this.repository.create(dbData);
            return this.mapFromDB(dbImpuesto);
        } catch (error) {
            throw error;
        }
    }

    static async updateImpuesto(id: string, impuestoData: UpdateImpuestoRequest): Promise<ImpuestoVehicular> {
        try {
            const dbData = this.mapToDB(impuestoData);
            const dbImpuesto = await this.repository.update(id, dbData);
            return this.mapFromDB(dbImpuesto);
        } catch (error) {
            throw error;
        }
    }

    static async deleteImpuesto(id: string): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions(impuestos: ImpuestoVehicular[]) {
        const estados = ['pagado', 'pendiente', 'vencido'];
        const tiposImpuesto = [...new Set(impuestos.map(s => s.tipo_impuesto))].filter(Boolean);
        const placas = [...new Set(impuestos.map(s => s.placa_vehiculo))].filter(Boolean);
        const anios = [...new Set(impuestos.map(s => s.anio_impuesto))].sort((a, b) => b - a);

        return {
            estados,
            tiposImpuesto,
            placas,
            anios,
        };
    }
}