import { SupabaseRepository } from '@/lib/supabase/repository';
import { 
  Taller, 
  CreateTallerRequest,
  TallerFilters, 
} from '../types/talleres.types';

export class TalleresService {
  private repository: SupabaseRepository<any>;

  constructor() {
    this.repository = new SupabaseRepository<any>({
      tableName: 'talleres',
    });
  }

  // Mapear de snake_case (DB) a camelCase (Frontend)
  private mapFromDB(dbTaller: any): Taller {
    return {
      id: dbTaller.id,
      name: dbTaller.name,
      address: dbTaller.address,
      phoneNumber: dbTaller.phone_number,
      email: dbTaller.email,
      contactPerson: dbTaller.contact_person,
      openHours: dbTaller.open_hours,
      notes: dbTaller.notes,
      rate: dbTaller.rate,
    };
  }

  // Mapear de camelCase (Frontend) a snake_case (DB)
  private mapToDB(taller: CreateTallerRequest): any {
    return {
      name: taller.name,
      address: taller.address,
      phone_number: taller.phoneNumber,
      email: taller.email,
      contact_person: taller.contactPerson,
      open_hours: taller.openHours,
      notes: taller.notes,
      rate: taller.rate,
    };
  }

  // Obtener todos los talleres con filtros opcionales
  async getTalleres(filters?: TallerFilters): Promise<Taller[]> {
    try {
      let talleres: any[];

      if (filters?.searchTerm) {
        // Buscar por término en múltiples columnas
        talleres = await this.repository.search(filters.searchTerm, [
          'name',
          'address',
          'contact_person',
          'email',
        ]);
      } else {
        talleres = await this.repository.getAll();
      }

      // Filtrar por calificación mínima si se especifica
      let result = talleres.map(t => this.mapFromDB(t));
      if (filters?.calificacionMinima) {
        result = result.filter(t => t.rate >= filters.calificacionMinima!);
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un taller específico por ID
  async getTaller(id: string): Promise<Taller> {
    try {
      const dbTaller = await this.repository.getById(id);
      return this.mapFromDB(dbTaller);
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo taller
  async createTaller(data: CreateTallerRequest): Promise<Taller> {
    try {
      const dbData = this.mapToDB(data);
      const dbTaller = await this.repository.create(dbData);
      return this.mapFromDB(dbTaller);
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un taller existente
  async updateTaller(id: string, data: CreateTallerRequest): Promise<Taller> {
    try {
      const dbData = this.mapToDB(data);
      const dbTaller = await this.repository.update(id, dbData);
      return this.mapFromDB(dbTaller);
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un taller
  async deleteTaller(id: string): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // Buscar talleres por término
  async search(term: string): Promise<Taller[]> {
    try {
      const talleres = await this.repository.search(term, [
        'name',
        'address',
        'contact_person',
        'email',
        'notes',
      ]);
      return talleres.map(t => this.mapFromDB(t));
    } catch (error) {
      throw error;
    }
  }
}

// Instancia singleton para usar en toda la aplicación
export const talleresService = new TalleresService();
