import {
  ApiError,
  ApiResponse,
  RequestConfig,
  PaginationParams,
  FilterParams,
  ErrorData
} from '../../types/api-base-client-types';

export class ApiClient {
  private baseURL: string;
  private defaultConfig: RequestInit;

  constructor(baseURL: string, defaultConfig: RequestInit = {}) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remover slash final
    this.defaultConfig = {
      headers: {
        'Content-Type': 'application/json',
        ...defaultConfig.headers,
      },
      ...defaultConfig,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      timeout = 30000,
      retries = 3,
      retryDelay = 1000,
      ...requestConfig
    } = config;

    const url = `${this.baseURL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    console.log('🔍 [API Client] Making request to:', url);
    console.log('🔍 [API Client] Base URL:', this.baseURL);
    console.log('🔍 [API Client] Full URL:', url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let lastError: ApiError | undefined;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          ...this.defaultConfig,
          ...requestConfig,
          headers: {
            ...this.defaultConfig.headers,
            ...requestConfig.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = await this.handleErrorResponse(response);
          throw error;
        }

        const data = await this.parseResponse<T>(response);
        return {
          data,
          status: response.status,
        };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          lastError = {
            status: 408,
            message: 'La petición tardó demasiado tiempo',
          };
          break;
        }

        if (error && typeof error === 'object' && 'status' in error) {
          lastError = error as ApiError;
        } else {
          lastError = {
            status: 500,
            message: error instanceof Error ? error.message : 'Error de conexión',
          };
        }

        // No reintentar en ciertos errores
        if (this.shouldNotRetry(lastError)) {
          break;
        }

        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt));
        }
      }
    }

    clearTimeout(timeoutId);
    return {
      error: lastError,
      status: lastError?.status || 500,
    };
  }

  private async handleErrorResponse(response: Response): Promise<ApiError> {
    let errorData: ErrorData = {};

    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        errorData = (await response.json()) as ErrorData;
      } else {
        const text = await response.text();
        errorData = { message: text };
      }
    } catch {
      // Si no se puede parsear, usar mensaje por defecto
      errorData = {};
    }

    // Función helper para obtener el mensaje de error de forma segura
    const getErrorMessage = (data: ErrorData): string => {
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;

      // Buscar cualquier propiedad que pueda contener un mensaje
      for (const key in data) {
        if (typeof data[key] === 'string' &&
          (key.toLowerCase().includes('message') || key.toLowerCase().includes('error'))) {
          return data[key] as string;
        }
      }

      return 'Error desconocido';
    };

    let message = getErrorMessage(errorData);

    switch (response.status) {
      case 400:
        message = message || 'Datos inválidos';
        break;
      case 401:
        message = 'No autorizado. Por favor inicia sesión';
        break;
      case 403:
        message = 'No tienes permisos para esta acción';
        break;
      case 404:
        message = 'Recurso no encontrado';
        break;
      case 409:
        message = message || 'Conflicto con datos existentes';
        break;
      case 422:
        message = 'Error de validación';
        break;
      case 500:
        message = 'Error interno del servidor';
        break;
      case 503:
        message = 'Servicio no disponible';
        break;
      default:
        message = message || `Error HTTP ${response.status}`;
    }

    const apiError: ApiError = {
      status: response.status,
      message,
      data: errorData
    };

    return apiError;
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }

    if (contentType?.includes('text/')) {
      return response.text() as unknown as T;
    }

    return response.blob() as unknown as T;
  }

  private shouldNotRetry(error: ApiError): boolean {
    return error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private buildQueryString(params: Record<string, unknown>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  }

  // Métodos HTTP públicos
  async get<T>(
    endpoint: string,
    params?: FilterParams & PaginationParams,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.makeRequest<T>(url, {
      method: 'GET',
      ...config,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json', // ← Asegurar este header
        ...config?.headers,
      },
      ...config,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const requestConfig: RequestConfig = {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config?.headers,
      },
      ...config,
    };

    console.log('🔍 [API Client] PUT Request config:', {
      endpoint,
      headers: requestConfig.headers,
      hasBody: !!data
    });

    return this.makeRequest<T>(endpoint, requestConfig);
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const requestConfig: RequestConfig = {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config?.headers,
      },
      ...config,
    };

    return this.makeRequest<T>(endpoint, requestConfig);
  }
  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...config?.headers,
      },
      ...config,
    });
  }

  // Métodos para archivos
  async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // Crear headers sin Content-Type para FormData
    const { headers, ...restConfig } = config || {};
    const uploadHeaders: Record<string, string> = { ...(headers as Record<string, string> ?? {}) };
    if (uploadHeaders['Content-Type']) {
      delete uploadHeaders['Content-Type'];
    }

    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: uploadHeaders,
      ...restConfig,
    });
  }

  async downloadFile(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: RequestConfig
  ): Promise<ApiResponse<Blob>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.makeRequest<Blob>(url, {
      method: 'GET',
      ...config,
    });
  }
}

// Cliente principal de la aplicación
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = new ApiClient(API_BASE_URL, {
  headers: {
    'Accept': 'application/json',
  },
});

// Función helper para crear clientes específicos
export function createApiClient(baseURL: string, config?: RequestInit) {
  return new ApiClient(baseURL, config);
}