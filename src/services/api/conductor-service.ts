import { SupabaseRepository } from '@/lib/supabase/repository';
import { Conductor, CreateConductorRequest, UpdateConductorRequest, ConductorFilters } from '@/types/conductor-types';


export class ConductorService {
    private static repository = new SupabaseRepository<any>({
        tableName: 'conductores',
    });

    // Mapear de snake_case (DB) a camelCase (Frontend)
    private static mapFromDB(dbConductor: any): Conductor {
        return {
            id: dbConductor.id,
            documento_identidad: dbConductor.documento_identidad,
            nombre_conductor: dbConductor.nombre_conductor,
            numero_licencia: dbConductor.numero_licencia,
            direccion: dbConductor.direccion,
            telefono: dbConductor.telefono,
            calificacion: dbConductor.calificacion,
            email: dbConductor.email,
            activo: dbConductor.activo,
            fecha_vencimiento_licencia: dbConductor.fecha_vencimiento_licencia,
            estado_licencia: dbConductor.estado_licencia,
        };
    }

    // Mapear de camelCase (Frontend) a snake_case (DB)
    private static mapToDB(conductor: CreateConductorRequest | UpdateConductorRequest): any {
        return {
            documento_identidad: conductor.documento_identidad,
            nombre_conductor: conductor.nombre_conductor,
            numero_licencia: conductor.numero_licencia,
            direccion: conductor.direccion,
            telefono: conductor.telefono,
            calificacion: conductor.calificacion,
            email: conductor.email,
            activo: conductor.activo,
            fecha_vencimiento_licencia: conductor.fecha_vencimiento_licencia,
            // NO enviar estado_licencia - se calcula automáticamente por trigger
        };
    }

    static async getConductores(filters?: ConductorFilters): Promise<Conductor[]> {
        try {
            let conductores: any[];

            if (filters?.searchTerm) {
                conductores = await this.repository.search(filters.searchTerm, [
                    'documento_identidad',
                    'nombre_conductor',
                    'numero_licencia',
                    'email',
                ]);
            } else {
                const dbFilters: Record<string, unknown> = {};
                if (filters?.estado_licencia) {
                    dbFilters.estado_licencia = filters.estado_licencia;
                }
                if (filters?.activo !== undefined) {
                    dbFilters.activo = filters.activo;
                }
                conductores = await this.repository.getAll(dbFilters);
            }

            return conductores.map(c => this.mapFromDB(c));
        } catch (error) {
            throw error;
        }
    }

    static async getConductorById(id: string): Promise<Conductor> {
        try {
            const dbConductor = await this.repository.getById(id);
            return this.mapFromDB(dbConductor);
        } catch (error) {
            throw error;
        }
    }

    static async createConductor(conductorData: CreateConductorRequest): Promise<Conductor> {
        try {
            const dbData = this.mapToDB(conductorData);
            const dbConductor = await this.repository.create(dbData);
            return this.mapFromDB(dbConductor);
        } catch (error) {
            throw error;
        }
    }

    static async updateConductor(id: string, conductorData: UpdateConductorRequest): Promise<Conductor> {
        try {
            const dbData = this.mapToDB(conductorData);
            const dbConductor = await this.repository.update(id, dbData);
            return this.mapFromDB(dbConductor);
        } catch (error) {
            throw error;
        }
    }

    static async deleteConductor(id: string): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions() {
        const estadosLicencia = ['vigente', 'por_vencer', 'vencida'];
        const calificaciones = [1, 2, 3, 4, 5];

        return {
            estadosLicencia,
            calificaciones,
        };
    }
}