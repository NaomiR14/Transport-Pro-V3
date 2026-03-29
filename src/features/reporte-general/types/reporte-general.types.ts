// Datos mensuales crudos retornados por la RPC get_reporte_general
export interface ReporteGeneralMensual {
  mes: number              // 1–12
  nro_viajes: number
  kms_recorridos: number
  ingresos: number
  gastos: number
  combustible_gal: number
  carga_kg: number
  mant_preventivos: number
  mant_correctivos: number
}

// Fila completa con todos los indicadores derivados
export interface ReporteGeneralRow extends ReporteGeneralMensual {
  // Datos principales derivados
  total_mantenimientos: number

  // Indicadores de Transporte
  km_por_galon: number      // kms / combustible_gal
  km_por_viaje: number      // kms / nro_viajes
  km_por_mant: number       // kms / total_mantenimientos
  carga_por_viaje: number   // carga_kg / nro_viajes

  // Indicadores Financieros
  ingreso_por_viaje: number // ingresos / nro_viajes
  gasto_por_viaje: number   // gastos / nro_viajes
  ingreso_por_km: number    // ingresos / kms_recorridos
  gasto_por_km: number      // gastos / kms_recorridos
  utilidad: number          // ingresos - gastos
  utilidad_por_viaje: number // utilidad / nro_viajes
  utilidad_por_km: number   // utilidad / kms_recorridos
  margen_bruto: number      // (utilidad / ingresos) * 100
}

// Resultado completo del reporte anual
export interface ReporteGeneralAnual {
  anio: number
  placa: string | null      // null = toda la flota
  meses: ReporteGeneralRow[] // 12 elementos (uno por mes)
  totales: ReporteGeneralRow // Totales anuales
}

// Nombres de meses en español (compartidos con flujo-caja)
export const MESES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const

export const MESES_CORTOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic',
] as const
