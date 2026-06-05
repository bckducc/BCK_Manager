import type { ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000';
const pendingRequests = new Map<string, Promise<ApiResponse<unknown>>>();
const responseCache = new Map<string, { timestamp: number; response: ApiResponse<unknown> }>();
const CACHE_TTL_MS = 3000;

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export type { ApiResponse };

const buildRequestKey = (url: string, options: RequestOptions) => {
  const method = (options.method ?? 'GET').toUpperCase();
  const body = options.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiCall = async <T = Record<string, unknown>>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const method = (options.method ?? 'GET').toUpperCase();
  const cacheKey = buildRequestKey(url, options);
  const shouldDeduplicate = method === 'GET';

  if (shouldDeduplicate) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.response as ApiResponse<T>;
    }

    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey) as Promise<ApiResponse<T>>;
    }
  }

  const fetchPromise = (async () => {
    const retryDelays = [0, 1000, 2000];
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < retryDelays.length) {
      if (attempt > 0) {
        await sleep(retryDelays[attempt]);
      }

      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }

        if (!response.ok) {
          const errorMessage = data?.message || `HTTP Error ${response.status}`;
          if (response.status === 429 && attempt < retryDelays.length - 1) {
            attempt += 1;
            lastError = new Error(errorMessage);
            continue;
          }
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        if (error instanceof Error) {
          lastError = error;
        }
        if (attempt >= retryDelays.length - 1) {
          const errorMessage = lastError?.message || 'Unknown error occurred';
          console.error(`API call failed: ${endpoint}`, errorMessage);
          throw new Error(errorMessage);
        }
        attempt += 1;
      }
    }

    throw lastError || new Error('Unknown error occurred');
  })();

  if (shouldDeduplicate) {
    pendingRequests.set(cacheKey, fetchPromise as Promise<ApiResponse<unknown>>);
  }

  try {
    const result = await fetchPromise;
    if (shouldDeduplicate) {
      responseCache.set(cacheKey, { timestamp: Date.now(), response: result as ApiResponse<unknown> });
    }
    return result;
  } finally {
    if (shouldDeduplicate) {
      pendingRequests.delete(cacheKey);
    }
  }
};
