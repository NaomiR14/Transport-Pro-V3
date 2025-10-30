import { apiClient } from '@/services/api/api-base-client';
import { RutaViaje, CreateRutaViajeRequest, UpdateRutaViajeRequest, RutaViajeFilters } from '@/types/ruta-viaje-types';


// Datos mock para desarrollo
const mockRutas: RutaViaje[] = [
    {
        id: "1",
        fecha_salida: "2024-01-15",
        fecha_llegada: "2024-01-18",
        placa_vehiculo: "ABC-123-A",
        estado_vehiculo: "activo",
        conductor: "Juan Pérez García",
        origen: "Ciudad de México",
        destino: "Guadalajara",
        kms_inicial: 15000,
        kms_final: 15540,
        kms_recorridos: 540,
        peso_carga_kg: 2500,
        costo_por_kg: 12.5,
        ingreso_total: 31250,
        estacion_combustible: "Pecsa Benavides",
        tipo_combustible: "Diesel",
        precio_por_galon: 45.80,
        total_combustible: 1250.40,
        gasto_peajes: 850,
        gasto_comidas: 1200,
        otros_gastos: 350,
        gasto_total: 3650.40,
        volumen_combustible_gal: 27.3,
        recorrido_por_galon: 19.8,
        ingreso_por_km: 57.87,
        observaciones: "Viaje sin inconvenientes, clima favorable"
    },
    {
        id: "2",
        fecha_salida: "2024-01-20",
        fecha_llegada: "2024-01-22",
        placa_vehiculo: "XYZ-789-B",
        estado_vehiculo: "activo",
        conductor: "María López Hernández",
        origen: "Guadalajara",
        destino: "Monterrey",
        kms_inicial: 8920,
        kms_final: 9580,
        kms_recorridos: 660,
        peso_carga_kg: 1800,
        costo_por_kg: 15.0,
        ingreso_total: 27000,
        estacion_combustible: "Primax Javier Prado",
        tipo_combustible: "Premium",
        precio_por_galon: 52.30,
        total_combustible: 1569.00,
        gasto_peajes: 720,
        gasto_comidas: 980,
        otros_gastos: 220,
        gasto_total: 3489.00,
        volumen_combustible_gal: 30.0,
        recorrido_por_galon: 22.0,
        ingreso_por_km: 40.91,
        observaciones: "Tráfico pesado en salida de Guadalajara"
    },
    {
        id: "3",
        fecha_salida: "2024-01-25",
        fecha_llegada: "2024-01-26",
        placa_vehiculo: "DEF-456-C",
        estado_vehiculo: "mantenimiento",
        conductor: "Carlos Rodríguez Martínez",
        origen: "Monterrey",
        destino: "Puebla",
        kms_inicial: 12300,
        kms_final: 13020,
        kms_recorridos: 720,
        peso_carga_kg: 3200,
        costo_por_kg: 10.8,
        ingreso_total: 34560,
        estacion_combustible: "Repsol Limatambo",
        tipo_combustible: "Regular",
        precio_por_galon: 42.10,
        total_combustible: 1894.50,
        gasto_peajes: 1100,
        gasto_comidas: 1350,
        otros_gastos: 480,
        gasto_total: 4824.50,
        volumen_combustible_gal: 45.0,
        recorrido_por_galon: 16.0,
        ingreso_por_km: 48.0,
        observaciones: "Vehiculo reportó fallas menores, enviar a mantenimiento"
    }
];

const USE_MOCK = process.env.NODE_ENV === 'development';

export class RutaViajeService {
    static async getRutas(filters?: RutaViajeFilters): Promise<RutaViaje[]> {
        // Usar mock en desarrollo
        if (USE_MOCK) {
            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));

            let filteredRutas = [...mockRutas];

            // Aplicar filtros básicos
            if (filters?.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase();
                filteredRutas = filteredRutas.filter(ruta =>
                    ruta.placa_vehiculo.toLowerCase().includes(searchTerm) ||
                    ruta.conductor.toLowerCase().includes(searchTerm) ||
                    ruta.origen.toLowerCase().includes(searchTerm) ||
                    ruta.destino.toLowerCase().includes(searchTerm)
                );
            }

            if (filters?.placa_vehiculo) {
                filteredRutas = filteredRutas.filter(ruta =>
                    ruta.placa_vehiculo === filters.placa_vehiculo
                );
            }

            if (filters?.conductor) {
                filteredRutas = filteredRutas.filter(ruta =>
                    ruta.conductor === filters.conductor
                );
            }

            if (filters?.fecha_desde) {
                filteredRutas = filteredRutas.filter(ruta =>
                    ruta.fecha_salida >= filters.fecha_desde!
                );
            }

            if (filters?.fecha_hasta) {
                filteredRutas = filteredRutas.filter(ruta =>
                    ruta.fecha_salida <= filters.fecha_hasta!
                );
            }

            return filteredRutas;
        }

        // Usar API real en producción
        const response = await apiClient.get<RutaViaje[]>('/RutasdeViaje', filters);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data || [];
    }

    static async getRutaById(id: string): Promise<RutaViaje> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const ruta = mockRutas.find(s => s.id === id);
            if (!ruta) throw new Error('Ruta no encontrada');
            return ruta;
        }

        const response = await apiClient.get<RutaViaje>(`/RutasdeViaje/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async createRuta(rutaData: CreateRutaViajeRequest): Promise<RutaViaje> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));

            // Calcular campos derivados
            const kms_recorridos = rutaData.kms_final - rutaData.kms_inicial;
            const ingreso_total = rutaData.peso_carga_kg * rutaData.costo_por_kg;
            const gasto_total = rutaData.total_combustible + rutaData.gasto_peajes + rutaData.gasto_comidas + rutaData.otros_gastos;
            const volumen_combustible_gal = rutaData.total_combustible / rutaData.precio_por_galon;
            const recorrido_por_galon = kms_recorridos / volumen_combustible_gal;
            const ingreso_por_km = ingreso_total / kms_recorridos;

            const newRuta: RutaViaje = {
                id: Date.now().toString(),
                ...rutaData,
                estado_vehiculo: "activo",
                kms_recorridos,
                ingreso_total,
                gasto_total,
                volumen_combustible_gal,
                recorrido_por_galon,
                ingreso_por_km
            };
            mockRutas.push(newRuta);
            return newRuta;
        }

        const response = await apiClient.post<RutaViaje>('/RutasdeViaje', rutaData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async updateRuta(rutaData: UpdateRutaViajeRequest): Promise<RutaViaje> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const index = mockRutas.findIndex(s => s.id === rutaData.id);
            if (index === -1) throw new Error('Ruta no encontrada');

            // Recalcular campos derivados si se actualizan campos relacionados
            const existingRuta = mockRutas[index];
            const updatedData = {
                ...existingRuta,
                ...rutaData
            };

            // Recalcular si cambian campos base
            if (rutaData.kms_final !== undefined || rutaData.kms_inicial !== undefined) {
                updatedData.kms_recorridos = updatedData.kms_final - updatedData.kms_inicial;
            }

            if (rutaData.peso_carga_kg !== undefined || rutaData.costo_por_kg !== undefined) {
                updatedData.ingreso_total = updatedData.peso_carga_kg * updatedData.costo_por_kg;
            }

            if (rutaData.total_combustible !== undefined || rutaData.gasto_peajes !== undefined ||
                rutaData.gasto_comidas !== undefined || rutaData.otros_gastos !== undefined) {
                updatedData.gasto_total = updatedData.total_combustible + updatedData.gasto_peajes +
                    updatedData.gasto_comidas + updatedData.otros_gastos;
            }

            if (updatedData.total_combustible !== undefined || updatedData.precio_por_galon !== undefined) {
                updatedData.volumen_combustible_gal = updatedData.total_combustible / updatedData.precio_por_galon;
            }

            if (updatedData.kms_recorridos !== undefined && updatedData.volumen_combustible_gal !== undefined) {
                updatedData.recorrido_por_galon = updatedData.kms_recorridos / updatedData.volumen_combustible_gal;
            }

            if (updatedData.ingreso_total !== undefined && updatedData.kms_recorridos !== undefined) {
                updatedData.ingreso_por_km = updatedData.ingreso_total / updatedData.kms_recorridos;
            }

            mockRutas[index] = updatedData;
            return updatedData;
        }

        const response = await apiClient.put<RutaViaje>(`/RutasdeViaje/${rutaData.id}`, rutaData);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data!;
    }

    static async deleteRuta(id: string): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const index = mockRutas.findIndex(s => s.id === id);
            if (index === -1) throw new Error('Ruta no encontrada');
            mockRutas.splice(index, 1);
            return;
        }

        const response = await apiClient.delete(`/RutasdeViaje/${id}`);

        if (response.error) {
            throw new Error(response.error.message);
        }
    }

    // Método auxiliar para obtener opciones de filtro
    static getFilterOptions(rutas: RutaViaje[]) {
        const placas = [...new Set(rutas.map(s => s.placa_vehiculo))].filter(Boolean);
        const conductores = [...new Set(rutas.map(s => s.conductor))].filter(Boolean);
        const origenes = [...new Set(rutas.map(s => s.origen))].filter(Boolean);
        const destinos = [...new Set(rutas.map(s => s.destino))].filter(Boolean);

        return {
            placas,
            conductores,
            origenes,
            destinos,
        };
    }

}