import { describe, it, expect } from 'vitest'
import { calcularCamposDerivados, calcularTotales } from '../formulas'
import type { FlujoCajaMensual, FlujoCajaRow } from '../../types/flujo-caja.types'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Crea un FlujoCajaMensual con valores por defecto en 0 */
function mesBase(overrides: Partial<FlujoCajaMensual> = {}): FlujoCajaMensual {
  return {
    mes: 1,
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
    ...overrides,
  }
}

/** Crea un FlujoCajaRow completo (con campos derivados) para usar en calcularTotales */
function mesRow(overrides: Partial<FlujoCajaMensual> = {}): FlujoCajaRow {
  return calcularCamposDerivados(mesBase(overrides))
}

// ─── calcularCamposDerivados ─────────────────────────────────────────────────

describe('calcularCamposDerivados', () => {
  it('calcula egresos como suma de todas las categorías de gasto', () => {
    const raw = mesBase({
      combustible: 500,
      peajes: 100,
      comidas: 50,
      seguros: 200,
      impuestos: 150,
      multas: 75,
      mantenimiento: 300,
      gastos_personal: 1000,
      otros_egresos: 25,
    })

    const result = calcularCamposDerivados(raw)

    expect(result.egresos).toBe(500 + 100 + 50 + 200 + 150 + 75 + 300 + 1000 + 25) // 2400
  })

  it('calcula utilidad = ingresos - egresos', () => {
    const raw = mesBase({
      ingresos: 5000,
      combustible: 1000,
      gastos_personal: 1500,
    })

    const result = calcularCamposDerivados(raw)

    expect(result.utilidad).toBe(5000 - 2500) // 2500
  })

  it('calcula margen correctamente cuando hay ingresos', () => {
    const raw = mesBase({
      ingresos: 10000,
      combustible: 2000,
      gastos_personal: 3000,
    })

    const result = calcularCamposDerivados(raw)
    // egresos = 5000, utilidad = 5000, margen = (5000/10000)*100 = 50%
    expect(result.margen).toBeCloseTo(50, 5)
  })

  it('retorna margen = 0 cuando ingresos = 0 (evita división por cero)', () => {
    const raw = mesBase({ ingresos: 0, gastos_personal: 500 })

    const result = calcularCamposDerivados(raw)

    expect(result.margen).toBe(0)
  })

  it('calcula utilidad negativa cuando egresos > ingresos', () => {
    const raw = mesBase({
      ingresos: 1000,
      gastos_personal: 3000,
    })

    const result = calcularCamposDerivados(raw)

    expect(result.utilidad).toBe(-2000)
    expect(result.margen).toBeCloseTo(-200, 5)
  })

  it('retorna todos los campos en 0 cuando la entrada es todo ceros', () => {
    const raw = mesBase()

    const result = calcularCamposDerivados(raw)

    expect(result.egresos).toBe(0)
    expect(result.utilidad).toBe(0)
    expect(result.margen).toBe(0)
  })

  it('preserva los campos originales del mes en el resultado', () => {
    const raw = mesBase({ mes: 6, ingresos: 8000, combustible: 400 })

    const result = calcularCamposDerivados(raw)

    expect(result.mes).toBe(6)
    expect(result.ingresos).toBe(8000)
    expect(result.combustible).toBe(400)
  })

  it('calcula margen de 100% cuando todos los ingresos son utilidad', () => {
    const raw = mesBase({ ingresos: 5000 }) // sin egresos

    const result = calcularCamposDerivados(raw)

    expect(result.egresos).toBe(0)
    expect(result.utilidad).toBe(5000)
    expect(result.margen).toBe(100)
  })
})

// ─── calcularTotales ─────────────────────────────────────────────────────────

describe('calcularTotales', () => {
  it('suma correctamente los ingresos de todos los meses', () => {
    const meses = [
      mesRow({ ingresos: 1000 }),
      mesRow({ ingresos: 2000 }),
      mesRow({ ingresos: 3000 }),
    ]

    const totales = calcularTotales(meses)

    expect(totales.ingresos).toBe(6000)
  })

  it('suma correctamente cada categoría de egreso', () => {
    const meses = [
      mesRow({ combustible: 200, peajes: 50 }),
      mesRow({ combustible: 300, peajes: 75 }),
    ]

    const totales = calcularTotales(meses)

    expect(totales.combustible).toBe(500)
    expect(totales.peajes).toBe(125)
  })

  it('recalcula utilidad y margen sobre los totales anuales', () => {
    const meses = [
      mesRow({ ingresos: 5000, gastos_personal: 1000 }),
      mesRow({ ingresos: 5000, gastos_personal: 1000 }),
    ]

    const totales = calcularTotales(meses)

    // ingresos total = 10000, egresos total = 2000
    expect(totales.ingresos).toBe(10000)
    expect(totales.egresos).toBe(2000)
    expect(totales.utilidad).toBe(8000)
    expect(totales.margen).toBeCloseTo(80, 5)
  })

  it('retorna todos los campos en 0 con un array vacío', () => {
    const totales = calcularTotales([])

    expect(totales.ingresos).toBe(0)
    expect(totales.egresos).toBe(0)
    expect(totales.utilidad).toBe(0)
    expect(totales.margen).toBe(0)
  })

  it('con un solo mes retorna los mismos valores derivados que calcularCamposDerivados', () => {
    const raw = mesBase({ ingresos: 8000, combustible: 1200, gastos_personal: 2000 })
    const mesSolo = [calcularCamposDerivados(raw)]

    const totales = calcularTotales(mesSolo)
    const directo = calcularCamposDerivados(raw)

    expect(totales.egresos).toBe(directo.egresos)
    expect(totales.utilidad).toBe(directo.utilidad)
    expect(totales.margen).toBeCloseTo(directo.margen, 5)
  })

  it('maneja correctamente meses donde egresos > ingresos (pérdida)', () => {
    const meses = [
      mesRow({ ingresos: 1000, gastos_personal: 4000 }),
      mesRow({ ingresos: 500,  gastos_personal: 200 }),
    ]

    const totales = calcularTotales(meses)

    expect(totales.ingresos).toBe(1500)
    expect(totales.egresos).toBe(4200)
    expect(totales.utilidad).toBe(-2700)
    expect(totales.margen).toBeCloseTo(-180, 5)
  })

  it('suma correctamente las 9 categorías de egreso de 12 meses', () => {
    const meses = Array.from({ length: 12 }, (_, i) =>
      mesRow({
        mes: i + 1,
        ingresos: 10000,
        combustible: 100,
        peajes: 100,
        comidas: 100,
        seguros: 100,
        impuestos: 100,
        multas: 100,
        mantenimiento: 100,
        gastos_personal: 100,
        otros_egresos: 100,
      })
    )

    const totales = calcularTotales(meses)

    expect(totales.ingresos).toBe(120000)
    expect(totales.egresos).toBe(10800)     // 9 categorías × 100 × 12 meses
    expect(totales.utilidad).toBe(109200)
    expect(totales.margen).toBeCloseTo(91, 0)
  })
})
