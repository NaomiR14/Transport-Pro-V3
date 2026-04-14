import { createClient } from '@/lib/supabase/client'
import { ReporteConductorRaw, ReporteConductorRow } from '../types/reporte-conductores.types'
import { calcularIndicadoresConductor } from '../utils/formulas'

export class ReporteConductoresService {
  /**
   * Obtener reporte de conductores para un año y mes opcional.
   * Si mes es undefined → todo el año.
   */
  static async getReporte(
    anio: number,
    mes?: number,
  ): Promise<ReporteConductorRow[]> {
    const client = createClient()

    const params: Record<string, unknown> = { p_anio: anio }
    if (mes) params.p_mes = mes

    const { data, error } = await client.rpc('get_reporte_conductores', params)

    if (error) {
      throw new Error(`Error al obtener reporte de conductores: ${error.message}`)
    }

    const rawData = (data || []) as ReporteConductorRaw[]

    return rawData.map((raw) => {
      const normalized: ReporteConductorRaw = {
        documento_identidad: raw.documento_identidad,
        nombre_conductor:    raw.nombre_conductor,
        nro_viajes:          Number(raw.nro_viajes)      || 0,
        kms_recorridos:      Number(raw.kms_recorridos)  || 0,
        carga_kg:            Number(raw.carga_kg)        || 0,
        ingresos:            Number(raw.ingresos)        || 0,
        nro_multas:          Number(raw.nro_multas)      || 0,
        gastos_multas:       Number(raw.gastos_multas)   || 0,
      }
      return calcularIndicadoresConductor(normalized)
    })
  }
}
