const API_BASE_URL = 'http://localhost:5000';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: T;
  [key: string]: any;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const apiCall = async <T = any>(
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

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (response.status === 401) {
      // Token expired, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return data;
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    throw error;
  }
};

export const authApi = {
  login: (username: string, password: string) =>
    apiCall<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => apiCall<any>('/api/auth/me', { method: 'GET' }),

  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
};

export const roomsApi = {
  getAll: () => apiCall<any>('/api/rooms', { method: 'GET' }),

  getById: (id: string) => apiCall<any>(`/api/rooms/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiCall<any>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/api/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<any>(`/api/rooms/${id}`, { method: 'DELETE' }),
};

export const tenantsApi = {
  getAll: () => apiCall<any>('/api/tenants', { method: 'GET' }),

  getById: (id: string) => apiCall<any>(`/api/tenants/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiCall<any>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/api/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<any>(`/api/tenants/${id}`, { method: 'DELETE' }),
};

export default {
  apiCall,
  authApi,
  roomsApi,
  tenantsApi,
};