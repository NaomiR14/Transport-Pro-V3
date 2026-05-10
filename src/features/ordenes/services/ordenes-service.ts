import { SupabaseRepository } from '@/lib/supabase/repository';
import { getEmpresaId } from '@/lib/supabase/get-empresa-id';
import { Orden, CreateOrdenRequest, UpdateOrdenRequest, OrdenFilters } from '../types/ordenes.types';

export class OrdenService {
    // Vista para lectura (incluye datos de conductor, ruta, estado sugerido)
    private static repository = new SupabaseRepository<Orden>({
        tableName: 'ordenes_with_details',
    });

    // Tabla base para escritura (create, update, delete)
    private static baseRepository = new SupabaseRepository<Orden>({
        tableName: 'ordenes',
    });

    // Mapear para CREATE/UPDATE: solo campos de la tabla base
    private static mapToDB(data: CreateOrdenRequest | UpdateOrdenRequest): Record<string, unknown> {
        const mapped: Record<string, unknown> = {};

        // numero_orden es generado por trigger en INSERT; solo se mapea en UPDATE si se pasa explícitamente
        if ('numero_orden' in data && (data as UpdateOrdenRequest).numero_orden !== undefined) {
            mapped.numero_orden = (data as UpdateOrdenRequest).numero_orden;
        }
        if ('placa_vehiculo' in data && data.placa_vehiculo !== undefined) {
            mapped.placa_vehiculo = data.placa_vehiculo;
        }
        if ('ruta_viaje_id' in data && data.ruta_viaje_id !== undefined) {
            mapped.ruta_viaje_id = data.ruta_viaje_id;
        }
        if ('estado' in data && data.estado !== undefined) {
            mapped.estado = data.estado;
        }
        if ('carta_porte' in data) {
            mapped.carta_porte = data.carta_porte ?? null;
        }

        return mapped;
    }

    static async getOrdenes(filters?: OrdenFilters): Promise<Orden[]> {
        try {
            const client = this.repository.getClient();

            let query = client
                .from('ordenes_with_details')
                .select('*');

            // Filtro de búsqueda por texto
            if (filters?.searchTerm) {
                query = query.or(
                    `numero_orden.ilike.%${filters.searchTerm}%,placa_vehiculo.ilike.%${filters.searchTerm}%,nombre_conductor.ilike.%${filters.searchTerm}%,origen.ilike.%${filters.searchTerm}%,destino.ilike.%${filters.searchTerm}%,carta_porte.ilike.%${filters.searchTerm}%`
                );
            }

            // Filtro por estado
            if (filters?.estado) {
                query = query.eq('estado', filters.estado);
            }

            // Filtro por vehículo
            if (filters?.placa_vehiculo) {
                query = query.eq('placa_vehiculo', filters.placa_vehiculo);
            }

            query = query.order('numero_orden', { ascending: true });

            const { data, error } = await query;

            if (error) {
                console.error('[OrdenService] Error en getOrdenes:', error);
                throw new Error(`Error al obtener órdenes: ${error.message}`);
            }

            return (data || []) as Orden[];
        } catch (error) {
            console.error('[OrdenService] Exception en getOrdenes:', error);
            throw error;
        }
    }

    static async getOrdenById(id: string): Promise<Orden> {
        try {
            const client = this.repository.getClient();

            const { data, error } = await client
                .from('ordenes_with_details')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(`Error al obtener orden: ${error.message}`);
            }

            if (!data) {
                throw new Error('Orden no encontrada');
            }

            return data as Orden;
        } catch (error) {
            throw error;
        }
    }

    static async createOrden(ordenData: CreateOrdenRequest): Promise<Orden> {
        try {
            const dbData = this.mapToDB(ordenData);
            dbData.empresa_id = await getEmpresaId();
            const created = await this.baseRepository.create(dbData as Partial<Orden>);
            // Leer desde la vista para obtener datos completos
            return await this.getOrdenById(created.id);
        } catch (error) {
            throw error;
        }
    }

    static async updateOrden(id: string, ordenData: UpdateOrdenRequest): Promise<Orden> {
        try {
            const dbData = this.mapToDB(ordenData);
            await this.baseRepository.update(id, dbData as Partial<Orden>);
            // Leer desde la vista para obtener datos completos
            return await this.getOrdenById(id);
        } catch (error) {
            throw error;
        }
    }

    static async deleteOrden(id: string): Promise<void> {
        try {
            await this.baseRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // Opciones de filtro derivadas de los datos
    static getFilterOptions(ordenes: Orden[]) {
        const placas = [...new Set(ordenes.map(o => o.placa_vehiculo))].filter(Boolean);
        const estados = [...new Set(ordenes.map(o => o.estado))].filter(Boolean);

        return {
            placas,
            estados,
        };
    }
}
