import type { ApiResponse } from '../types';
import { requestQueue } from './requestQueue';

const API_BASE_URL = 'http://localhost:5000';
const pendingRequests = new Map<string, Promise<ApiResponse<unknown>>>();
const responseCache = new Map<string, { timestamp: number; response: ApiResponse<unknown> }>();
const CACHE_TTL_MS = 5000; // Increased from 3s to 5s
const rateLimitBackoff = new Map<string, number>(); // Track rate limit backoff per endpoint

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
    // Wrap GET requests in queue to prevent flooding
    const executeRequest = async () => {
      // Check if we're in a rate limit backoff period
      const endpointKey = endpoint.split('?')[0]; // Base endpoint without query params
      const backoffTime = rateLimitBackoff.get(endpointKey);
      if (backoffTime && Date.now() < backoffTime) {
        const waitTime = backoffTime - Date.now();
        console.warn(`Rate limit backoff active for ${endpoint}, waiting ${waitTime}ms`);
        await sleep(waitTime);
      }

      // Exponential backoff for retries: 3s, 8s, 20s, 60s
      const retryDelays = [0, 3000, 8000, 20000, 60000];
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
            
            // Handle rate limiting with exponential backoff
            if (response.status === 429) {
              const retryAfter = response.headers.get('Retry-After');
              const backoffMs = retryAfter ? parseInt(retryAfter) * 1000 : (3000 * Math.pow(2, attempt)); // exponential backoff
              const backoffUntil = Date.now() + backoffMs;
              
              rateLimitBackoff.set(endpointKey, backoffUntil);
              console.warn(`Rate limited on ${endpoint}. Backing off for ${backoffMs}ms (attempt ${attempt + 1}/${retryDelays.length})`);
              
              if (attempt < retryDelays.length - 1) {
                lastError = new Error(errorMessage);
                attempt += 1;
                continue;
              }
            }
            
            throw new Error(errorMessage);
          }

          // Clear rate limit backoff on success
          rateLimitBackoff.delete(endpointKey);
          return data;
        } catch (error) {
          if (error instanceof Error) {
            lastError = error;
          }
          if (attempt >= retryDelays.length - 1) {
            const errorMessage = lastError?.message || 'Unknown error occurred';
            console.error(`API call failed after ${retryDelays.length} attempts: ${endpoint}`, errorMessage);
            throw new Error(errorMessage);
          }
          attempt += 1;
        }
      }

      throw lastError || new Error('Unknown error occurred');
    };

    // Use request queue for GET requests to prevent flooding
    if (shouldDeduplicate) {
      return requestQueue.enqueue(executeRequest, cacheKey);
    } else {
      return executeRequest();
    }
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
