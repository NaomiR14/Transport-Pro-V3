export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      conductores: {
        Row: {
          activo: boolean | null
          calificacion: number | null
          created_at: string | null
          direccion: string
          documento_identidad: string
          email: string
          estado_licencia: string
          fecha_vencimiento_licencia: string
          id: string
          nombre_conductor: string
          numero_licencia: string
          telefono: string
          updated_at: string | null
        }
        Insert: {
          activo?: boolean | null
          calificacion?: number | null
          created_at?: string | null
          direccion: string
          documento_identidad: string
          email: string
          estado_licencia?: string
          fecha_vencimiento_licencia: string
          id?: string
          nombre_conductor: string
          numero_licencia: string
          telefono: string
          updated_at?: string | null
        }
        Update: {
          activo?: boolean | null
          calificacion?: number | null
          created_at?: string | null
          direccion?: string
          documento_identidad?: string
          email?: string
          estado_licencia?: string
          fecha_vencimiento_licencia?: string
          id?: string
          nombre_conductor?: string
          numero_licencia?: string
          telefono?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      impuestos_vehiculares: {
        Row: {
          anio_impuesto: number
          created_at: string | null
          estado_pago: string
          fecha_pago: string
          id: string
          impuesto_monto: number
          placa_vehiculo: string
          tipo_impuesto: string
          updated_at: string | null
        }
        Insert: {
          anio_impuesto: number
          created_at?: string | null
          estado_pago?: string
          fecha_pago: string
          id?: string
          impuesto_monto: number
          placa_vehiculo: string
          tipo_impuesto: string
          updated_at?: string | null
        }
        Update: {
          anio_impuesto?: number
          created_at?: string | null
          estado_pago?: string
          fecha_pago?: string
          id?: string
          impuesto_monto?: number
          placa_vehiculo?: string
          tipo_impuesto?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle_impuesto"
            columns: ["placa_vehiculo"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["license_plate"]
          },
        ]
      }
      mantenimientos_vehiculos: {
        Row: {
          causas: string
          costo_total: number
          created_at: string | null
          estado: string
          fecha_entrada: string
          fecha_pago: string | null
          fecha_salida: string | null
          id: number
          kilometraje: number
          observaciones: string | null
          paquete_mantenimiento: string
          placa_vehiculo: string
          taller: string
          tipo: string
          updated_at: string | null
        }
        Insert: {
          causas: string
          costo_total: number
          created_at?: string | null
          estado?: string
          fecha_entrada: string
          fecha_pago?: string | null
          fecha_salida?: string | null
          id?: number
          kilometraje: number
          observaciones?: string | null
          paquete_mantenimiento: string
          placa_vehiculo: string
          taller: string
          tipo: string
          updated_at?: string | null
        }
        Update: {
          causas?: string
          costo_total?: number
          created_at?: string | null
          estado?: string
          fecha_entrada?: string
          fecha_pago?: string | null
          fecha_salida?: string | null
          id?: number
          kilometraje?: number
          observaciones?: string | null
          paquete_mantenimiento?: string
          placa_vehiculo?: string
          taller?: string
          tipo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_taller"
            columns: ["taller"]
            isOneToOne: false
            referencedRelation: "talleres"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "fk_vehicle_mantenimiento"
            columns: ["placa_vehiculo"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["license_plate"]
          },
        ]
      }
      multas_conductores: {
        Row: {
          conductor: string
          created_at: string | null
          debe: number | null
          estado_pago: string
          fecha: string
          id: string
          importe_multa: number
          importe_pagado: number | null
          infraccion: string
          numero_viaje: number
          observaciones: string | null
          placa_vehiculo: string
          updated_at: string | null
        }
        Insert: {
          conductor: string
          created_at?: string | null
          debe?: number | null
          estado_pago?: string
          fecha: string
          id?: string
          importe_multa: number
          importe_pagado?: number | null
          infraccion: string
          numero_viaje: number
          observaciones?: string | null
          placa_vehiculo: string
          updated_at?: string | null
        }
        Update: {
          conductor?: string
          created_at?: string | null
          debe?: number | null
          estado_pago?: string
          fecha?: string
          id?: string
          importe_multa?: number
          importe_pagado?: number | null
          infraccion?: string
          numero_viaje?: number
          observaciones?: string | null
          placa_vehiculo?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle_multa"
            columns: ["placa_vehiculo"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["license_plate"]
          },
        ]
      }
      profiles: {
        Row: {
          apellido: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          id: string
          nombre: string | null
          phone: string | null
          position: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          id: string
          nombre?: string | null
          phone?: string | null
          position?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          nombre?: string | null
          phone?: string | null
          position?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      rutas_viajes: {
        Row: {
          conductor: string
          costo_por_kg: number
          created_at: string | null
          destino: string
          estacion_combustible: string
          fecha_llegada: string
          fecha_salida: string
          gasto_comidas: number | null
          gasto_peajes: number | null
          gasto_total: number | null
          id: string
          ingreso_por_km: number | null
          ingreso_total: number | null
          kms_final: number
          kms_inicial: number
          kms_recorridos: number | null
          observaciones: string | null
          origen: string
          otros_gastos: number | null
          peso_carga_kg: number
          placa_vehiculo: string
          precio_por_galon: number
          recorrido_por_galon: number | null
          tipo_combustible: string
          total_combustible: number | null
          updated_at: string | null
          volumen_combustible_gal: number
        }
        Insert: {
          conductor: string
          costo_por_kg: number
          created_at?: string | null
          destino: string
          estacion_combustible: string
          fecha_llegada: string
          fecha_salida: string
          gasto_comidas?: number | null
          gasto_peajes?: number | null
          gasto_total?: number | null
          id?: string
          ingreso_por_km?: number | null
          ingreso_total?: number | null
          kms_final: number
          kms_inicial: number
          kms_recorridos?: number | null
          observaciones?: string | null
          origen: string
          otros_gastos?: number | null
          peso_carga_kg: number
          placa_vehiculo: string
          precio_por_galon: number
          recorrido_por_galon?: number | null
          tipo_combustible: string
          total_combustible?: number | null
          updated_at?: string | null
          volumen_combustible_gal: number
        }
        Update: {
          conductor?: string
          costo_por_kg?: number
          created_at?: string | null
          destino?: string
          estacion_combustible?: string
          fecha_llegada?: string
          fecha_salida?: string
          gasto_comidas?: number | null
          gasto_peajes?: number | null
          gasto_total?: number | null
          id?: string
          ingreso_por_km?: number | null
          ingreso_total?: number | null
          kms_final?: number
          kms_inicial?: number
          kms_recorridos?: number | null
          observaciones?: string | null
          origen?: string
          otros_gastos?: number | null
          peso_carga_kg?: number
          placa_vehiculo?: string
          precio_por_galon?: number
          recorrido_por_galon?: number | null
          tipo_combustible?: string
          total_combustible?: number | null
          updated_at?: string | null
          volumen_combustible_gal?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle"
            columns: ["placa_vehiculo"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["license_plate"]
          },
        ]
      }
      seguros_vehiculos: {
        Row: {
          aseguradora: string
          created_at: string | null
          estado_poliza: string
          fecha_inicio: string
          fecha_pago: string
          fecha_vencimiento: string
          id: string
          importe_pagado: number
          placa_vehiculo: string
          poliza_seguro: string
          updated_at: string | null
        }
        Insert: {
          aseguradora: string
          created_at?: string | null
          estado_poliza?: string
          fecha_inicio: string
          fecha_pago: string
          fecha_vencimiento: string
          id?: string
          importe_pagado: number
          placa_vehiculo: string
          poliza_seguro: string
          updated_at?: string | null
        }
        Update: {
          aseguradora?: string
          created_at?: string | null
          estado_poliza?: string
          fecha_inicio?: string
          fecha_pago?: string
          fecha_vencimiento?: string
          id?: string
          importe_pagado?: number
          placa_vehiculo?: string
          poliza_seguro?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle_seguro"
            columns: ["placa_vehiculo"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["license_plate"]
          },
        ]
      }
      talleres: {
        Row: {
          address: string
          contact_person: string
          created_at: string | null
          email: string
          id: string
          name: string
          notes: string | null
          open_hours: string
          phone_number: string
          rate: number | null
          updated_at: string | null
        }
        Insert: {
          address: string
          contact_person: string
          created_at?: string | null
          email: string
          id?: string
          name: string
          notes?: string | null
          open_hours: string
          phone_number: string
          rate?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          contact_person?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          open_hours?: string
          phone_number?: string
          rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string
          color: string
          created_at: string | null
          id: string
          license_plate: string
          maintenance_data: Json | null
          max_load_capacity: string
          model: string
          serial_number: string
          type: string
          updated_at: string | null
          vehicle_state: string
          year: string
        }
        Insert: {
          brand: string
          color: string
          created_at?: string | null
          id?: string
          license_plate: string
          maintenance_data?: Json | null
          max_load_capacity: string
          model: string
          serial_number: string
          type: string
          updated_at?: string | null
          vehicle_state: string
          year: string
        }
        Update: {
          brand?: string
          color?: string
          created_at?: string | null
          id?: string
          license_plate?: string
          maintenance_data?: Json | null
          max_load_capacity?: string
          model?: string
          serial_number?: string
          type?: string
          updated_at?: string | null
          vehicle_state?: string
          year?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
