import { createClient } from '@/lib/supabase/client'
import { ReporteGeneralAnual, ReporteGeneralMensual } from '../types/reporte-general.types'
import { calcularIndicadores, calcularTotalesReporte } from '../utils/formulas'

export class ReporteGeneralService {
  /**
   * Obtener el reporte general anual para un año dado y placa opcional.
   * Si no se pasa placa (o se pasa undefined), retorna datos de toda la flota.
   */
  static async getReporteAnual(
    anio: number,
    placa?: string,
  ): Promise<ReporteGeneralAnual> {
    const client = createClient()

    const params: Record<string, unknown> = { p_anio: anio }
    if (placa) params.p_placa = placa

    const { data, error } = await client.rpc('get_reporte_general', params)

    if (error) {
      throw new Error(`Error al obtener reporte general: ${error.message}`)
    }

    const rawData = (data || []) as ReporteGeneralMensual[]

    // Normalizar valores numéricos (Supabase puede devolver strings para NUMERIC/BIGINT)
    const meses = rawData.map((raw) => {
      const normalized: ReporteGeneralMensual = {
        mes:              Number(raw.mes)              || 0,
        nro_viajes:       Number(raw.nro_viajes)       || 0,
        kms_recorridos:   Number(raw.kms_recorridos)   || 0,
        ingresos:         Number(raw.ingresos)         || 0,
        gastos:           Number(raw.gastos)           || 0,
        combustible_gal:  Number(raw.combustible_gal)  || 0,
        carga_kg:         Number(raw.carga_kg)         || 0,
        mant_preventivos: Number(raw.mant_preventivos) || 0,
        mant_correctivos: Number(raw.mant_correctivos) || 0,
      }
      return calcularIndicadores(normalized)
    })

    const totales = calcularTotalesReporte(meses)

    return { anio, placa: placa ?? null, meses, totales }
  }

  /**
   * Obtener todas las placas de la flota para el selector de filtro.
   */
  static async getPlacas(): Promise<string[]> {
    const client = createClient()

    const { data, error } = await client
      .from('vehicles')
      .select('license_plate')
      .order('license_plate', { ascending: true })

    if (error) {
      throw new Error(`Error al obtener placas: ${error.message}`)
    }

    return (data ?? []).map((v) => v.license_plate as string)
  }
}
