import { ReporteConductorRaw, ReporteConductorRow } from '../types/reporte-conductores.types'

/** División segura: retorna 0 si el denominador es 0 */
function safeDiv(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return numerator / denominator
}

/**
 * Calcula los indicadores derivados a partir de los datos crudos
 * de un conductor. Función pura, sin efectos secundarios.
 */
export function calcularIndicadoresConductor(raw: ReporteConductorRaw): ReporteConductorRow {
  return {
    ...raw,
    km_por_viaje:      safeDiv(raw.kms_recorridos, raw.nro_viajes),
    carga_por_km:      safeDiv(raw.carga_kg,       raw.kms_recorridos),
    carga_por_viaje:   safeDiv(raw.carga_kg,       raw.nro_viajes),
    ingreso_por_km:    safeDiv(raw.ingresos,       raw.kms_recorridos),
    ingreso_por_viaje: safeDiv(raw.ingresos,       raw.nro_viajes),
  }
}
