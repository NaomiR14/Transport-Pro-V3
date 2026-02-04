// API Client types for HTTP requests and responses

export interface ApiError {
  status: number
  message: string
  data?: ErrorData
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  status: number
}

export interface RequestConfig extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined | null
}

export interface ErrorData {
  [key: string]: unknown
  message?: string
  error?: string
}
