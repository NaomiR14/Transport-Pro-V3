import { FlujoCajaMensual, FlujoCajaRow } from '../types/flujo-caja.types'

/**
 * Calcula los campos derivados (egresos, utilidad, margen) a partir
 * de los datos mensuales crudos. Función pura, sin efectos secundarios.
 */
export function calcularCamposDerivados(raw: FlujoCajaMensual): FlujoCajaRow {
  const egresos =
    raw.gastos_personal +
    raw.seguros +
    raw.impuestos +
    raw.multas +
    raw.mantenimiento +
    raw.combustible +
    raw.peajes +
    raw.comidas +
    raw.otros_egresos

  const utilidad = raw.ingresos - egresos
  const margen = raw.ingresos > 0 ? (utilidad / raw.ingresos) * 100 : 0

  return { ...raw, egresos, utilidad, margen }
}

/**
 * Suma los valores de todos los meses y recalcula los campos derivados
 * sobre el total anual. Función pura, sin efectos secundarios.
 */
export function calcularTotales(meses: FlujoCajaRow[]): FlujoCajaRow {
  const totales: FlujoCajaMensual = {
    mes: 0,
    ingresos: 0,
    combustible: 0,
    peajes: 0,
    comidas: 0,
    seguros: 0,
    impuestos: 0,
    multas: 0,
    mantenimiento: 0,
    gastos_personal: 0,
    otros_egresos: 0,
  }

  for (const m of meses) {
    totales.ingresos += m.ingresos
    totales.combustible += m.combustible
    totales.peajes += m.peajes
    totales.comidas += m.comidas
    totales.seguros += m.seguros
    totales.impuestos += m.impuestos
    totales.multas += m.multas
    totales.mantenimiento += m.mantenimiento
    totales.gastos_personal += m.gastos_personal
    totales.otros_egresos += m.otros_egresos
  }

  return calcularCamposDerivados(totales)
}
