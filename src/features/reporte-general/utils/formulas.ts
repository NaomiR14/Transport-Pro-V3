import { ReporteGeneralMensual, ReporteGeneralRow } from '../types/reporte-general.types'

/** División segura: retorna 0 si el denominador es 0 */
function safeDiv(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return numerator / denominator
}

/**
 * Calcula todos los indicadores derivados a partir de los datos
 * mensuales crudos. Función pura, sin efectos secundarios.
 */
export function calcularIndicadores(raw: ReporteGeneralMensual): ReporteGeneralRow {
  const total_mantenimientos = raw.mant_preventivos + raw.mant_correctivos
  const utilidad = raw.ingresos - raw.gastos

  return {
    ...raw,
    total_mantenimientos,

    // Indicadores de Transporte
    km_por_galon:    safeDiv(raw.kms_recorridos, raw.combustible_gal),
    km_por_viaje:    safeDiv(raw.kms_recorridos, raw.nro_viajes),
    km_por_mant:     safeDiv(raw.kms_recorridos, total_mantenimientos),
    carga_por_viaje: safeDiv(raw.carga_kg,       raw.nro_viajes),

    // Indicadores Financieros
    ingreso_por_viaje: safeDiv(raw.ingresos, raw.nro_viajes),
    gasto_por_viaje:   safeDiv(raw.gastos,   raw.nro_viajes),
    ingreso_por_km:    safeDiv(raw.ingresos, raw.kms_recorridos),
    gasto_por_km:      safeDiv(raw.gastos,   raw.kms_recorridos),
    utilidad,
    utilidad_por_viaje: safeDiv(utilidad, raw.nro_viajes),
    utilidad_por_km:    safeDiv(utilidad, raw.kms_recorridos),
    margen_bruto:       safeDiv(utilidad, raw.ingresos) * 100,
  }
}

/**
 * Suma los valores de todos los meses y recalcula los indicadores
 * sobre el total anual. Función pura, sin efectos secundarios.
 */
export function calcularTotalesReporte(meses: ReporteGeneralRow[]): ReporteGeneralRow {
  const base: ReporteGeneralMensual = {
    mes: 0,
    nro_viajes: 0,
    kms_recorridos: 0,
    ingresos: 0,
    gastos: 0,
    combustible_gal: 0,
    carga_kg: 0,
    mant_preventivos: 0,
    mant_correctivos: 0,
  }

  for (const m of meses) {
    base.nro_viajes       += m.nro_viajes
    base.kms_recorridos   += m.kms_recorridos
    base.ingresos         += m.ingresos
    base.gastos           += m.gastos
    base.combustible_gal  += m.combustible_gal
    base.carga_kg         += m.carga_kg
    base.mant_preventivos += m.mant_preventivos
    base.mant_correctivos += m.mant_correctivos
  }

  return calcularIndicadores(base)
}
