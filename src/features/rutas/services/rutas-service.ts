import { SupabaseRepository } from '@/lib/supabase/repository';
import { RutaViaje, CreateRutaViajeRequest, UpdateRutaViajeRequest, RutaViajeFilters } from '../types/rutas.types';




export class RutaViajeService {
    private static repository = new SupabaseRepository<RutaViaje>({
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
            volumen_combustible_gal: ruta.total_combustible / ruta.precio_por_galon, // Calcular volumen
            gasto_peajes: ruta.gasto_peajes,
            gasto_comidas: ruta.gasto_comidas,
            otros_gastos: ruta.otros_gastos,
            observaciones: ruta.observaciones,
            // NO ENVIAR: kms_recorridos, ingreso_total, total_combustible, gasto_total, recorrido_por_galon, ingreso_por_km
            // Estos son GENERATED ALWAYS en la DB
        };
    }
    static async getRutas(filters?: RutaViajeFilters): Promise<RutaViaje[]> {
        try {
            // Usar query personalizada para hacer JOIN con vehicles y obtener estado_vehiculo
            const client = this.repository.getClient();
            
            let query = client
                .from('rutas_viajes')
                .select(`
                    *,
                    vehicles:placa_vehiculo(
                        vehicle_state
                    )
                `);

            // Aplicar filtros
            if (filters?.searchTerm) {
                query = query.or(`placa_vehiculo.ilike.%${filters.searchTerm}%,conductor.ilike.%${filters.searchTerm}%,origen.ilike.%${filters.searchTerm}%,destino.ilike.%${filters.searchTerm}%`);
            }
            if (filters?.placa_vehiculo) {
                query = query.eq('placa_vehiculo', filters.placa_vehiculo);
            }
            if (filters?.conductor) {
                query = query.eq('conductor', filters.conductor);
            }
            if (filters?.fecha_desde) {
                query = query.gte('fecha_salida', filters.fecha_desde);
            }
            if (filters?.fecha_hasta) {
                query = query.lte('fecha_salida', filters.fecha_hasta);
            }

            const { data, error } = await query;

            if (error) {
                console.error('[RutaViajeService] Error en getRutas:', error);
                throw new Error(`Error al obtener rutas: ${error.message}`);
            }

            // Transformar datos: aplanar vehicles.vehicle_state a estado_vehiculo
            const rutas = (data || []).map((row: any) => ({
                ...row,
                estado_vehiculo: row.vehicles?.vehicle_state || null,
                vehicles: undefined, // Eliminar el objeto anidado
            }));

            return rutas as RutaViaje[];
        } catch (error) {
            throw error;
        }
    }

    static async getRutaById(id: string): Promise<RutaViaje> {
        try {
            const client = this.repository.getClient();
            
            const { data, error } = await client
                .from('rutas_viajes')
                .select(`
                    *,
                    vehicles:placa_vehiculo(
                        vehicle_state
                    )
                `)
                .eq('id', id)
                .single();

            if (error) {
                throw new Error(`Error al obtener ruta: ${error.message}`);
            }

            if (!data) {
                throw new Error('Ruta no encontrada');
            }

            // Transformar datos
            const ruta = {
                ...data,
                estado_vehiculo: data.vehicles?.vehicle_state || null,
                vehicles: undefined,
            };

            return ruta as RutaViaje;
        } catch (error) {
            throw error;
        }
    }

    static async createRuta(rutaData: CreateRutaViajeRequest): Promise<RutaViaje> {
        try {
            const dbData = this.mapToDB(rutaData);
            return await this.repository.create(dbData);
        } catch (error) {
            throw error;
        }
    }

    static async updateRuta(id: string, rutaData: UpdateRutaViajeRequest): Promise<RutaViaje> {
        try {
            const dbData = this.mapToDB(rutaData);
            return await this.repository.update(id, dbData);
        } catch (error) {
            throw error;
        }
    }

    static async deleteRuta(id: string): Promise<void> {
        try {
            await this.repository.delete(id);
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