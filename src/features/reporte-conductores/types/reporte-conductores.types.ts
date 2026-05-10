// Datos crudos retornados por la RPC get_reporte_conductores
export interface ReporteConductorRaw {
  documento_identidad: string
  nombre_conductor: string
  nro_viajes: number
  kms_recorridos: number
  carga_kg: number
  ingresos: number
  nro_multas: number
  gastos_multas: number
}

// Fila con indicadores derivados calculados en frontend
export interface ReporteConductorRow extends ReporteConductorRaw {
  km_por_viaje: number      // kms_recorridos / nro_viajes
  carga_por_km: number      // carga_kg / kms_recorridos
  carga_por_viaje: number   // carga_kg / nro_viajes
  ingreso_por_km: number    // ingresos / kms_recorridos
  ingreso_por_viaje: number // ingresos / nro_viajes
}

// Nombres de meses en español
export const MESES_NOMBRES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
] as const
