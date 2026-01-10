export type ApiError = {
  message: string;
  code?: string;
  statusCode: number;
  validationErrors?: Record<string, string[]>;
};

export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: ApiError };

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public validationErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}
