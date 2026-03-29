import { createClient } from '@/lib/supabase/client'
import {
  FlujoCajaMensual,
  FlujoCajaRow,
  FlujoCajaAnual,
  EgresoVario,
  UpsertEgresoVarioRequest,
} from '../types/flujo-caja.types'
import { calcularCamposDerivados, calcularTotales } from '../utils/formulas'

export class FlujoCajaService {
  /**
   * Obtener flujo de caja completo para un año usando la función RPC
   */
  static async getFlujoCajaAnual(anio: number): Promise<FlujoCajaAnual> {
    const client = createClient()

    const { data, error } = await client.rpc('get_flujo_caja_anual', {
      p_anio: anio,
    })

    if (error) {
      throw new Error(`Error al obtener flujo de caja: ${error.message}`)
    }

    const rawData = (data || []) as FlujoCajaMensual[]

    // Convertir valores a números (Supabase puede devolver strings para NUMERIC)
    const meses: FlujoCajaRow[] = rawData.map((raw) => {
      const numericRaw: FlujoCajaMensual = {
        mes: Number(raw.mes),
        ingresos: Number(raw.ingresos) || 0,
        combustible: Number(raw.combustible) || 0,
        peajes: Number(raw.peajes) || 0,
        comidas: Number(raw.comidas) || 0,
        seguros: Number(raw.seguros) || 0,
        impuestos: Number(raw.impuestos) || 0,
        multas: Number(raw.multas) || 0,
        mantenimiento: Number(raw.mantenimiento) || 0,
        gastos_personal: Number(raw.gastos_personal) || 0,
        otros_egresos: Number(raw.otros_egresos) || 0,
      }
      return calcularCamposDerivados(numericRaw)
    })

    const totales = calcularTotales(meses)

    return { anio, meses, totales }
  }

  /**
   * Obtener todos los egresos varios de un año
   */
  static async getEgresosVarios(anio: number): Promise<EgresoVario[]> {
    const client = createClient()

    const { data, error } = await client
      .from('egresos_varios')
      .select('*')
      .eq('anio', anio)
      .order('mes', { ascending: true })

    if (error) {
      throw new Error(`Error al obtener egresos varios: ${error.message}`)
    }

    return (data || []) as EgresoVario[]
  }

  /**
   * Crear o actualizar un egreso vario (upsert por anio+mes)
   */
  static async upsertEgresoVario(request: UpsertEgresoVarioRequest): Promise<EgresoVario> {
    const client = createClient()

    const { data, error } = await client
      .from('egresos_varios')
      .upsert(
        {
          anio: request.anio,
          mes: request.mes,
          gastos_personal: request.gastos_personal,
          otros_egresos: request.otros_egresos,
        },
        { onConflict: 'anio,mes' }
      )
      .select()
      .single()

    if (error) {
      throw new Error(`Error al guardar egreso: ${error.message}`)
    }

    return data as EgresoVario
  }
}
