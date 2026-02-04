import { createClient } from './client';
import { SupabaseClient } from '@supabase/supabase-js';

export interface RepositoryConfig {
  tableName: string;
  idField?: string; // Default: 'id'
}

export interface FilterOptions {
  [key: string]: unknown;
}

export class SupabaseRepository<T> {
  private tableName: string;
  private idField: string;
  private client: SupabaseClient;

  constructor(config: RepositoryConfig) {
    this.tableName = config.tableName;
    this.idField = config.idField || 'id';
    this.client = createClient();
  }

  /**
   * Obtener todos los registros con filtros opcionales
   */
  async getAll(filters?: FilterOptions): Promise<T[]> {
    try {
      console.log(`[SupabaseRepository] getAll - tabla: ${this.tableName}, filtros:`, filters);
      
      let query = this.client.from(this.tableName).select('*');

      // Aplicar filtros si existen
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string' && key === 'searchTerm') {
              // Para búsquedas de texto, no aplicar directamente
              // Se manejará en el servicio específico
              return;
            }
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query;

      if (error) {
        console.error(`[SupabaseRepository] ERROR en ${this.tableName}:`, {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Error al obtener registros de ${this.tableName}: ${error.message}`);
      }

      console.log(`[SupabaseRepository] ${this.tableName} - registros obtenidos:`, data?.length || 0);
      return (data as T[]) || [];
    } catch (error) {
      console.error(`[SupabaseRepository] EXCEPTION en getAll de ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Obtener un registro por ID
   */
  async getById(id: string): Promise<T> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select('*')
        .eq(this.idField, id)
        .single();

      if (error) {
        throw new Error(`Error al obtener registro de ${this.tableName}: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Registro no encontrado en ${this.tableName}`);
      }

      return data as T;
    } catch (error) {
      console.error(`Error en getById de ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo registro
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      console.log(`[SupabaseRepository] CREATE ${this.tableName} - INPUT:`, data);
      
      const { data: newData, error } = await this.client
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`[SupabaseRepository] CREATE ${this.tableName} - ERROR:`, {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Error al crear registro en ${this.tableName}: ${error.message}`);
      }

      if (!newData) {
        console.error(`[SupabaseRepository] CREATE ${this.tableName} - NO DATA`);
        throw new Error(`Error al crear registro en ${this.tableName}`);
      }

      console.log(`[SupabaseRepository] CREATE ${this.tableName} - SUCCESS:`, newData);
      return newData as T;
    } catch (error) {
      console.error(`[SupabaseRepository] CREATE ${this.tableName} - EXCEPTION:`, error);
      throw error;
    }
  }

  /**
   * Actualizar un registro existente
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      console.log(`[SupabaseRepository] UPDATE ${this.tableName} - ID:`, id);
      console.log(`[SupabaseRepository] UPDATE ${this.tableName} - INPUT:`, data);
      
      const { data: updatedData, error } = await this.client
        .from(this.tableName)
        .update(data)
        .eq(this.idField, id)
        .select()
        .single();

      if (error) {
        console.error(`[SupabaseRepository] UPDATE ${this.tableName} - ERROR:`, {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Error al actualizar registro en ${this.tableName}: ${error.message}`);
      }

      if (!updatedData) {
        console.error(`[SupabaseRepository] UPDATE ${this.tableName} - NO DATA`);
        throw new Error(`Error al actualizar registro en ${this.tableName}`);
      }

      console.log(`[SupabaseRepository] UPDATE ${this.tableName} - SUCCESS:`, updatedData);
      return updatedData as T;
    } catch (error) {
      console.error(`[SupabaseRepository] UPDATE ${this.tableName} - EXCEPTION:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un registro
   */
  async delete(id: string): Promise<void> {
    try {
      console.log(`[SupabaseRepository] DELETE ${this.tableName} - ID:`, id);
      
      const { error } = await this.client
        .from(this.tableName)
        .delete()
        .eq(this.idField, id);

      if (error) {
        console.error(`[SupabaseRepository] DELETE ${this.tableName} - ERROR:`, {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw new Error(`Error al eliminar registro de ${this.tableName}: ${error.message}`);
      }
      
      console.log(`[SupabaseRepository] DELETE ${this.tableName} - SUCCESS`);
    } catch (error) {
      console.error(`[SupabaseRepository] DELETE ${this.tableName} - EXCEPTION:`, error);
      throw error;
    }
  }

  /**
   * Buscar registros por término en columnas específicas
   */
  async search(term: string, columns: string[]): Promise<T[]> {
    try {
      if (!term || columns.length === 0) {
        return this.getAll();
      }

      let query = this.client.from(this.tableName).select('*');

      // Aplicar búsqueda con OR para cada columna
      const searchConditions = columns
        .map(col => `${col}.ilike.%${term}%`)
        .join(',');

      query = query.or(searchConditions);

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error al buscar en ${this.tableName}: ${error.message}`);
      }

      return (data as T[]) || [];
    } catch (error) {
      console.error(`Error en search de ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Contar registros con filtros opcionales
   */
  async count(filters?: FilterOptions): Promise<number> {
    try {
      let query = this.client
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });
      }

      const { count, error } = await query;

      if (error) {
        throw new Error(`Error al contar registros de ${this.tableName}: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error(`Error en count de ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Obtener cliente de Supabase para queries personalizadas
   */
  getClient(): SupabaseClient {
    return this.client;
  }
}
