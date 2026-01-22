import { SupabaseRepository } from '@/lib/supabase/repository';
import {
    MultaConductor,
    CreateMultaConductorRequest,
    UpdateMultaConductorRequest,
    MultaConductorFilters,
    MultaConductorStats
} from '@/types/multas-conductores-types'

// Datos mock eliminados - ahora usamos Supabase

export class MultasConductoresService {
    private static repository = new SupabaseRepository<MultaConductor>({
        tableName: 'multas_conductores',
    });

    // Mapear para CREATE/UPDATE: NO enviar 'debe' (GENERATED) ni 'estado_pago' (trigger)
    private static mapToDB(multa: CreateMultaConductorRequest | UpdateMultaConductorRequest): Partial<MultaConductor> {
        return {
            fecha: multa.fecha,
            numero_viaje: multa.numero_viaje,
            placa_vehiculo: multa.placa_vehiculo,
            conductor: multa.conductor,
            infraccion: multa.infraccion,
            importe_multa: multa.importe_multa,
            importe_pagado: multa.importe_pagado,
            observaciones: multa.observaciones,
            // NO enviar: debe (GENERATED), estado_pago (trigger)
        };
    }

    async getMultas(filters?: MultaConductorFilters): Promise<MultaConductor[]> {
        try {
            let multas: MultaConductor[];

            if (filters?.searchTerm) {
                multas = await MultasConductoresService.repository.search(filters.searchTerm, [
                    'conductor',
                    'placa_vehiculo',
                    'infraccion',
                    'observaciones',
                ]);
            } else {
                const dbFilters: Record<string, unknown> = {};
                if (filters?.infraccion) {
                    dbFilters.infraccion = filters.infraccion;
                }
                multas = await MultasConductoresService.repository.getAll(dbFilters);
            }

            return multas;
        } catch (error) {
            throw error;
        }
    }

    // getMockMultas eliminado - ahora usamos Supabase

    async getMultaById(id: string): Promise<MultaConductor> {
        try {
            return await MultasConductoresService.repository.getById(id);
        } catch (error) {
            throw error;
        }
    }

    async createMulta(data: CreateMultaConductorRequest): Promise<MultaConductor> {
        try {
            const dbData = MultasConductoresService.mapToDB(data);
            return await MultasConductoresService.repository.create(dbData);
        } catch (error) {
            throw error;
        }
    }

    async updateMulta(id: string, data: UpdateMultaConductorRequest): Promise<MultaConductor> {
        try {
            const dbData = MultasConductoresService.mapToDB(data);
            return await MultasConductoresService.repository.update(id, dbData);
        } catch (error) {
            throw error;
        }
    }

    async deleteMulta(id: string): Promise<void> {
        try {
            await MultasConductoresService.repository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async getStats(): Promise<MultaConductorStats> {
        try {
            // Obtener todas las multas para calcular estadísticas
            const multas = await MultasConductoresService.repository.getAll();

            const totalMultas = multas.length;
            const totalPagado = multas.reduce((sum, multa) => sum + multa.importe_pagado, 0);
            const totalDebe = multas.reduce((sum, multa) => sum + multa.debe, 0);
            const multasPagadas = multas.filter(m => m.estado_pago === 'pagado').length;
            const multasPendientes = multas.filter(m => m.estado_pago === 'pendiente').length;
            const multasVencidas = multas.filter(m => m.estado_pago === 'vencido').length;
            const multasParciales = multas.filter(m => m.estado_pago === 'parcial').length;
            const porcentajeCumplimiento = totalMultas > 0 ? (multasPagadas / totalMultas) * 100 : 0;

            return {
                totalMultas,
                totalPagado,
                totalDebe,
                multasPagadas,
                multasPendientes,
                multasVencidas,
                multasParciales,
                porcentajeCumplimiento
            };
        } catch (error) {
            throw error;
        }
    }

    // Método helper para validación client-side (el trigger de DB también lo calcula)
    private calcularEstadoPago(importePagado: number, importeMulta: number): "pagado" | "pendiente" | "parcial" | "vencido" {
        if (importePagado >= importeMulta) {
            return "pagado"
        } else if (importePagado > 0) {
            return "parcial"
        } else {
            return "pendiente"
        }
        // Nota: El estado "vencido" se determinaría por lógica de fechas en el backend
    }
}

export const multasConductoresService = new MultasConductoresService()