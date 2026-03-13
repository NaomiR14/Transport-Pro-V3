import { SupabaseRepository } from '@/lib/supabase/repository';
import { RutaViaje, CreateRutaViajeRequest, UpdateRutaViajeRequest, RutaViajeFilters } from '../types/rutas.types';




export class RutaViajeService {
    // Usar la vista con estado calculado del vehículo para lectura
    private static repository = new SupabaseRepository<RutaViaje>({
        tableName: 'rutas_viajes_with_vehicle_state',
    });
    
    // Usar la tabla base para escritura (create, update, delete)
    private static baseRepository = new SupabaseRepository<RutaViaje>({
        tableName: 'rutas_viajes',
    });

    // Mapear para CREATE/UPDATE: EXCLUIR campos GENERATED
    private static mapToDB(ruta: CreateRutaViajeRequest | UpdateRutaViajeRequest): Partial<RutaViaje> {
        return {
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
            total_combustible: ruta.total_combustible, // User input - DB calculates volumen_combustible_gal
            gasto_peajes: ruta.gasto_peajes,
            gasto_comidas: ruta.gasto_comidas,
            otros_gastos: ruta.otros_gastos,
            observaciones: ruta.observaciones,
            // NO ENVIAR: kms_recorridos, ingreso_total, volumen_combustible_gal, gasto_total, recorrido_por_galon, ingreso_por_km
            // Estos son GENERATED ALWAYS en la DB
        };
    }
    static async getRutas(filters?: RutaViajeFilters): Promise<RutaViaje[]> {
        try {
            console.log('[RutaViajeService] getRutas called with filters:', filters);
            
            const client = this.repository.getClient();
            
            console.log('[RutaViajeService] Querying view: rutas_viajes_with_vehicle_state');
            
            let query = client
                .from('rutas_viajes_with_vehicle_state')
                .select('*');

            // Aplicar filtros
            if (filters?.searchTerm) {
                console.log('[RutaViajeService] Applying searchTerm filter:', filters.searchTerm);
                query = query.or(`placa_vehiculo.ilike.%${filters.searchTerm}%,conductor.ilike.%${filters.searchTerm}%,origen.ilike.%${filters.searchTerm}%,destino.ilike.%${filters.searchTerm}%`);
            }
            if (filters?.placa_vehiculo) {
                console.log('[RutaViajeService] Applying placa_vehiculo filter:', filters.placa_vehiculo);
                query = query.eq('placa_vehiculo', filters.placa_vehiculo);
            }
            if (filters?.conductor) {
                console.log('[RutaViajeService] Applying conductor filter:', filters.conductor);
                query = query.eq('conductor', filters.conductor);
            }
            if (filters?.fecha_desde) {
                console.log('[RutaViajeService] Applying fecha_desde filter:', filters.fecha_desde);
                query = query.gte('fecha_salida', filters.fecha_desde);
            }
            if (filters?.fecha_hasta) {
                console.log('[RutaViajeService] Applying fecha_hasta filter:', filters.fecha_hasta);
                query = query.lte('fecha_salida', filters.fecha_hasta);
            }

            console.log('[RutaViajeService] Executing query...');
            const { data, error } = await query;

            if (error) {
                console.error('[RutaViajeService] Error en getRutas:', error);
                console.error('[RutaViajeService] Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw new Error(`Error al obtener rutas: ${error.message}`);
            }

            console.log('[RutaViajeService] Query successful. Records fetched:', data?.length || 0);
            if (data && data.length > 0) {
                console.log('[RutaViajeService] First record sample:', data[0]);
            }

            return (data || []) as RutaViaje[];
        } catch (error) {
            console.error('[RutaViajeService] Exception in getRutas:', error);
            throw error;
        }
    }

    static async getRutaById(id: string): Promise<RutaViaje> {
        try {
            const client = this.repository.getClient();
            
            const { data, error } = await client
                .from('rutas_viajes_with_vehicle_state')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(`Error al obtener ruta: ${error.message}`);
            }

            if (!data) {
                throw new Error('Ruta no encontrada');
            }

            return data as RutaViaje;
        } catch (error) {
            throw error;
        }
    }

    static async createRuta(rutaData: CreateRutaViajeRequest): Promise<RutaViaje> {
        try {
            const dbData = this.mapToDB(rutaData);
            const created = await this.baseRepository.create(dbData);
            // Leer desde la vista para obtener estado calculado del vehículo
            return await this.getRutaById(created.id);
        } catch (error) {
            throw error;
        }
    }

    static async updateRuta(id: string, rutaData: UpdateRutaViajeRequest): Promise<RutaViaje> {
        try {
            const dbData = this.mapToDB(rutaData);
            await this.baseRepository.update(id, dbData);
            // Leer desde la vista para obtener estado calculado del vehículo
            return await this.getRutaById(id);
        } catch (error) {
            throw error;
        }
    }

    static async deleteRuta(id: string): Promise<void> {
        try {
            await this.baseRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions(rutas: RutaViaje[]) {
        const placas = [...new Set(rutas.map(s => s.placa_vehiculo))].filter(Boolean);
        const conductores = [...new Set(rutas.map(s => s.conductor))].filter(Boolean);
        const origenes = [...new Set(rutas.map(s => s.origen))].filter(Boolean);
        const destinos = [...new Set(rutas.map(s => s.destino))].filter(Boolean);

        return {
            placas,
            conductores,
            origenes,
            destinos,
        };
    }

}