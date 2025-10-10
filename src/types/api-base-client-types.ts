export interface ApiError {
    status: number;
    message: string;
    data?: unknown;
}

export interface ApiResponse<T = unknown> {
    data?: T;
    error?: ApiError;
    status: number;
}

export interface RequestConfig extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
    [key: string]: string | number | boolean | undefined;
}

// Interface para la estructura esperada de errorData
export interface ErrorData {
    message?: string;
    error?: string;
    [key: string]: unknown;
}