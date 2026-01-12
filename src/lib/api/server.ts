import { cookies } from 'next/headers';
import { env, serverEnv } from '@/config/env';
import { ApiRequestOptions } from './types';
import { handleApiError } from './error-handler';

async function request<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, cache = 'no-store', next } = options;

  const url = `${serverEnv.API_BASE_URL}${endpoint}`;

  // Get auth token from cookies
  const cookieStore = await cookies();
  const authToken = cookieStore.get(env.AUTH_COOKIE_NAME)?.value;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Cookie: `${env.AUTH_COOKIE_NAME}=${authToken}` }),
      ...headers,
    },
    cache,
    next,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    await handleApiError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();
  
  if (json && typeof json === 'object' && 'success' in json) {
    if (json.success && 'data' in json) {
      return json.data as T;
    }
  }
  
  return json as T;
}

export const apiServer = {
  get: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
