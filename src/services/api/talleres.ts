// src/services/api/talleres.ts
import { Taller, CreateTallerRequest, UpdateTallerRequest } from '@/types/taller'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Configuración base para fetch con manejo de errores mejorado
const fetchWithConfig = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 segundos timeout

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorData: unknown = {}
      
      try {
        errorData = await response.json()
      } catch {
        // Si no puede parsear JSON, usar mensaje por defecto
      }

      // Crear error descriptivo basado en el status code
      let errorMessage =
        typeof errorData === 'object' && errorData !== null && 'message' in errorData
          ? (errorData as { message?: string }).message || 'Error desconocido'
          : 'Error desconocido'
      
      switch (response.status) {
        case 400:
          errorMessage =
            typeof errorData === 'object' && errorData !== null && 'message' in errorData
              ? (errorData as { message?: string }).message || 'Datos inválidos enviados al servidor'
              : 'Datos inválidos enviados al servidor'
          break
        case 401:
          errorMessage = 'No autorizado. Por favor inicia sesión'
          break
        case 403:
          errorMessage = 'No tienes permisos para realizar esta acción'
          break
        case 404:
          errorMessage = 'Recurso no encontrado'
          break
        case 409:
          errorMessage =
            typeof errorData === 'object' && errorData !== null && 'message' in errorData
              ? (errorData as { message?: string }).message || 'Conflicto con datos existentes'
              : 'Conflicto con datos existentes'
          break
        case 422:
          errorMessage = 'Error de validación en los datos'
          break
        case 500:
          errorMessage = 'Error interno del servidor. Intenta más tarde'
          break
        case 503:
          errorMessage = 'Servicio no disponible temporalmente'
          break
        default:
          errorMessage = `Error HTTP ${response.status}: ${errorMessage}`
      }

      const error = new Error(errorMessage)
      ;(error as Error & { status?: number; data?: unknown }).status = response.status
      ;(error as Error & { status?: number; data?: unknown }).data = errorData
      throw error
    }

    // Verificar si la respuesta tiene contenido JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text()
  } catch (error) {
    clearTimeout(timeoutId)
    
    // Manejar errores de red
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('La petición tardó demasiado tiempo. Verifica tu conexión')
      }
      if (error.message === 'Failed to fetch') {
        throw new Error('Error de conexión. Verifica tu internet')
      }
    }
    
    throw error
  }
}

// API endpoints para talleres
export const talleresApi = {
  // Obtener todos los talleres con filtros opcionales
  getTalleres: async (filters?: {
    searchTerm?: string
    activo?: boolean
    especialidad?: string
    calificacionMinima?: number
  }): Promise<Taller[]> => {
    const params = new URLSearchParams()
    
    if (filters?.searchTerm) params.set('q', filters.searchTerm)
    if (filters?.activo !== undefined) params.set('activo', filters.activo.toString())
    if (filters?.especialidad) params.set('especialidad', filters.especialidad)
    if (filters?.calificacionMinima !== undefined) {
      params.set('calificacionMinima', filters.calificacionMinima.toString())
    }

    const queryString = params.toString()
    const endpoint = queryString ? `/Workshops?${queryString}` : '/Workshops'
    
    return fetchWithConfig(endpoint)
  },

  // Obtener un taller específico por ID
  getTaller: async (id: string): Promise<Taller> => {
    if (!id || id.trim() === '') {
      throw new Error('ID de taller requerido')
    }
    return fetchWithConfig(`/Workshops/${encodeURIComponent(id)}`)
  },

  // Crear un nuevo taller
  createTaller: async (data: CreateTallerRequest): Promise<Taller> => {
    // Validaciones básicas del cliente
    if (!data.name?.trim()) {
      throw new Error('El nombre del taller es requerido')
    }
    if (!data.numero_taller?.trim()) {
      throw new Error('El número de taller es requerido')
    }
    if (!data.email?.trim() || !/\S+@\S+\.\S+/.test(data.email)) {
      throw new Error('Email válido es requerido')
    }

    return fetchWithConfig('/Workshops', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Actualizar un taller existente
  updateTaller: async (id: string, data: UpdateTallerRequest): Promise<Taller> => {
    if (!id || id.trim() === '') {
      throw new Error('ID de taller requerido')
    }

    // Validar email si se está actualizando
    if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      throw new Error('Email válido es requerido')
    }

    return fetchWithConfig(`/Workshops/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Actualización parcial de taller
  patchTaller: async (id: string, data: Partial<UpdateTallerRequest>): Promise<Taller> => {
    if (!id || id.trim() === '') {
      throw new Error('ID de taller requerido')
    }

    return fetchWithConfig(`/Workshops/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },

  // Eliminar un taller
  deleteTaller: async (id: string): Promise<void> => {
    if (!id || id.trim() === '') {
      throw new Error('ID de taller requerido')
    }

    return fetchWithConfig(`/talleres/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  },

  // Activar/desactivar taller
  toggleTallerStatus: async (id: string, activo: boolean): Promise<Taller> => {
    if (!id || id.trim() === '') {
      throw new Error('ID de taller requerido')
    }

    return fetchWithConfig(`/Workshops/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ activo }),
    })
  },

  // Buscar talleres (endpoint dedicado para búsqueda optimizada)
  searchTalleres: async (searchTerm: string): Promise<Taller[]> => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Término de búsqueda debe tener al menos 2 caracteres')
    }

    const params = new URLSearchParams({ q: searchTerm.trim() })
    return fetchWithConfig(`/Workshops/search?${params}`)
  },

  // Obtener talleres por especialidad
  getTalleresByEspecialidad: async (especialidad: string): Promise<Taller[]> => {
    if (!especialidad || especialidad.trim() === '') {
      throw new Error('Especialidad requerida')
    }

    const params = new URLSearchParams({ especialidad: especialidad.trim() })
    return fetchWithConfig(`/Workshops/especialidad?${params}`)
  },

  // Obtener talleres activos únicamente (útil para selectores)
  getActiveTablers: async (): Promise<Taller[]> => {
    return fetchWithConfig('/Workshops?activo=true')
  },

  // Obtener estadísticas de talleres
  getTalleresStats: async (): Promise<{
    total: number
    activos: number
    inactivos: number
    calificacionPromedio: number
    especialidades: string[]
  }> => {
    return fetchWithConfig('/Workshops/stats')
  },

  // Validar si un número de taller está disponible
  checkTallerNumber: async (numero_taller: string, excludeId?: string): Promise<{ available: boolean }> => {
    if (!numero_taller || numero_taller.trim() === '') {
      throw new Error('Número de taller requerido')
    }

    const params = new URLSearchParams({ numero_taller: numero_taller.trim() })
    if (excludeId) {
      params.set('excludeId', excludeId)
    }

    return fetchWithConfig(`/Workshops/check-number?${params}`)
  },

  // Obtener talleres cercanos por coordenadas (si implementas geolocalización)
  getNearbyTalleres: async (lat: number, lng: number, radius: number = 10): Promise<Taller[]> => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString()
    })

    return fetchWithConfig(`/Workshops/nearby?${params}`)
  },

  // Exportar talleres (CSV, Excel, etc.)
  exportTalleres: async (format: 'csv' | 'excel' = 'csv'): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/Workshops/export?format=${format}`, {
      method: 'GET',
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })

    if (!response.ok) {
      throw new Error('Error al exportar talleres')
    }

    return response.blob()
  },

  // Importar talleres desde archivo
  importTalleres: async (file: File): Promise<{ 
    imported: number
    errors: string[] 
    warnings: string[]
  }> => {
    const formData = new FormData()
    formData.append('file', file)

    return fetchWithConfig('/Workshops/import', {
      method: 'POST',
      // No establecer Content-Type para FormData
      headers: {},
      body: formData,
    })
  }
}

// Funciones de utilidad para trabajar con los datos
export const talleresUtils = {
  // Formatear datos de taller para mostrar
  formatTallerForDisplay: (taller: Taller) => ({
    ...taller,
    telefono: taller.phoneNumber.replace(/(\+52)\s?(\d{2})\s?(\d{4})-?(\d{4})/, '$1 $2 $3-$4'),
    especialidadesText: (taller.especialidades ?? []).join(', '),
    estadoText: taller.activo ? 'Activo' : 'Inactivo',
    calificacionStars: '★'.repeat(Math.floor(taller.calificacion ?? 0)) + 
                      '☆'.repeat(5 - Math.floor(taller.calificacion ?? 0))
  }),

  // Validar datos antes de enviar
  validateTallerData: (data: CreateTallerRequest | UpdateTallerRequest): string[] => {
    const errors: string[] = []

    if (!data.name?.trim()) errors.push('Nombre del taller es requerido')
    if (!data.address?.trim()) errors.push('Dirección es requerida')
    if (!data.phoneNumber?.trim()) errors.push('Teléfono es requerido')
    if (!data.email?.trim()) {
      errors.push('Correo es requerido')
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push('Correo debe tener formato válido')
    }
    if (!data.contactPerson?.trim()) errors.push('Contacto principal es requerido')
    if (!data.telefono_contacto?.trim()) errors.push('Teléfono de contacto es requerido')
    if (!data.horario_atencion?.trim()) errors.push('Horario de atención es requerido')
    
    if (data.calificacion !== undefined) {
      if (data.calificacion < 0 || data.calificacion > 5) {
        errors.push('Calificación debe estar entre 0 y 5')
      }
    }

    if (data.especialidades && data.especialidades.length === 0) {
      errors.push('Debe seleccionar al menos una especialidad')
    }

    return errors
  },

  // Preparar datos para envío a la API
  prepareTallerDataForApi: (
    data: Partial<CreateTallerRequest & UpdateTallerRequest>
  ): CreateTallerRequest | UpdateTallerRequest => ({
    ...data,
    phoneNumber: data.phoneNumber?.replace(/\D/g, ''), // Remover caracteres no numéricos
    telefono_contacto: data.telefono_contacto?.replace(/\D/g, ''),
    email: data.email?.toLowerCase().trim(),
    sitio_web: data.sitio_web?.replace(/^https?:\/\//, ''), // Remover protocolo
    calificacion: Number(data.calificacion) || 0,
  })
}