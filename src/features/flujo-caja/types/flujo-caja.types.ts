// Datos mensuales retornados por la función RPC get_flujo_caja_anual
export interface FlujoCajaMensual {
  mes: number // 1-12
  ingresos: number
  combustible: number
  peajes: number
  comidas: number
  seguros: number
  impuestos: number
  multas: number
  mantenimiento: number
  gastos_personal: number
  otros_egresos: number
}

// Fila completa con campos calculados para la tabla
export interface FlujoCajaRow extends FlujoCajaMensual {
  egresos: number   // SUM de todas las categorías de egreso
  utilidad: number   // ingresos - egresos
  margen: number     // utilidad / ingresos (0 si ingresos = 0)
}

// Datos completos del flujo de caja anual
export interface FlujoCajaAnual {
  anio: number
  meses: FlujoCajaRow[]  // 12 elementos, uno por mes
  totales: FlujoCajaRow  // Totales anuales
}

// Registro de egresos varios (tabla egresos_varios)
export interface EgresoVario {
  id: string
  anio: number
  mes: number
  gastos_personal: number
  otros_egresos: number
  created_at?: string
  updated_at?: string
}

export interface UpsertEgresoVarioRequest {
  anio: number
  mes: number
  gastos_personal: number
  otros_egresos: number
}

// Nombres de meses en español
export const MESES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
] as const

// Nombres cortos para el gráfico
export const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'
] as const
