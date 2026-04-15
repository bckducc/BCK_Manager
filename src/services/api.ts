<<<<<<< HEAD
export { apiCall, type ApiResponse } from './apiClient';
export { authService } from './authService';
export { roomService } from './roomService';
export { tenantService } from './tenantService';
export { billService } from './billService';
export { contractService } from './contractService';

export const authApi = undefined;
export const roomsApi = undefined;
export const tenantsApi = undefined;
=======
/**
 * API Client for Backend Communication
 * Automatically attaches JWT token to all requests
 */

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

/**
 * Make API call with automatic token attachment
 */
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

    // Handle authentication errors
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

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Login user
   */
  login: (username: string, password: string) =>
    apiCall<any>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  /**
   * Get current user info
   */
  getMe: () => apiCall<any>('/api/auth/me', { method: 'GET' }),

  /**
   * Logout
   */
  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
};

/**
 * Rooms API (for future use)
 */
export const roomsApi = {
  /**
   * Get all rooms
   */
  getAll: () => apiCall<any>('/api/rooms', { method: 'GET' }),

  /**
   * Get room by ID
   */
  getById: (id: string) => apiCall<any>(`/api/rooms/${id}`, { method: 'GET' }),

  /**
   * Create new room
   */
  create: (data: any) =>
    apiCall<any>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update room
   */
  update: (id: string, data: any) =>
    apiCall<any>(`/api/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete room
   */
  delete: (id: string) =>
    apiCall<any>(`/api/rooms/${id}`, { method: 'DELETE' }),
};

/**
 * Tenants API (for future use)
 */
export const tenantsApi = {
  /**
   * Get all tenants
   */
  getAll: () => apiCall<any>('/api/tenants', { method: 'GET' }),

  /**
   * Get tenant by ID
   */
  getById: (id: string) => apiCall<any>(`/api/tenants/${id}`, { method: 'GET' }),

  /**
   * Create new tenant
   */
  create: (data: any) =>
    apiCall<any>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Update tenant
   */
  update: (id: string, data: any) =>
    apiCall<any>(`/api/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  /**
   * Delete tenant
   */
  delete: (id: string) =>
    apiCall<any>(`/api/tenants/${id}`, { method: 'DELETE' }),
};

export default {
  apiCall,
  authApi,
  roomsApi,
  tenantsApi,
};


// /**
//  * Hàm fetch cơ bản với xử lý errors
//  */
// async function fetchAPI<T>(
//   endpoint: string,
//   options: RequestInit = {}
// ): Promise<T> {
//   const token = localStorage.getItem('token');
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     ...(options.headers instanceof Object ? options.headers as Record<string, string> : {}),
//   };

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(error.message || 'API Error');
//   }

//   return response.json();
// }

// /**
//  * Auth API
//  */
// export const authApi = {
//   login: (email: string, password: string) =>
//     fetchAPI<ApiResponse<{ user: any; token: string }>>('/auth/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     }),
// };

// /**
//  * Room API
//  */
// export const roomApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/rooms?page=${page}&pageSize=${pageSize}`),
//   getById: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/rooms/${id}`),
//   create: (data: any) =>
//     fetchAPI<ApiResponse<any>>('/rooms', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//   update: (id: string, data: any) =>
//     fetchAPI<ApiResponse<any>>(`/rooms/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     }),
//   delete: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/rooms/${id}`, {
//       method: 'DELETE',
//     }),
// };

// /**
//  * Tenant API
//  */
// export const tenantApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/tenants?page=${page}&pageSize=${pageSize}`),
//   getById: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/tenants/${id}`),
//   create: (data: any) =>
//     fetchAPI<ApiResponse<any>>('/tenants', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//   update: (id: string, data: any) =>
//     fetchAPI<ApiResponse<any>>(`/tenants/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     }),
//   delete: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/tenants/${id}`, {
//       method: 'DELETE',
//     }),
// };

// /**
//  * Contract API
//  */
// export const contractApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/contracts?page=${page}&pageSize=${pageSize}`),
//   getById: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/contracts/${id}`),
//   create: (data: any) =>
//     fetchAPI<ApiResponse<any>>('/contracts', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//   update: (id: string, data: any) =>
//     fetchAPI<ApiResponse<any>>(`/contracts/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     }),
//   delete: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/contracts/${id}`, {
//       method: 'DELETE',
//     }),
// };

// /**
//  * Service API
//  */
// export const serviceApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/services?page=${page}&pageSize=${pageSize}`),
//   getById: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/services/${id}`),
//   create: (data: any) =>
//     fetchAPI<ApiResponse<any>>('/services', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//   update: (id: string, data: any) =>
//     fetchAPI<ApiResponse<any>>(`/services/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     }),
//   delete: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/services/${id}`, {
//       method: 'DELETE',
//     }),
// };

// /**
//  * Utility Reading API
//  */
// export const utilityApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/utilities?page=${page}&pageSize=${pageSize}`),
//   getById: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/utilities/${id}`),
//   create: (data: any) =>
//     fetchAPI<ApiResponse<any>>('/utilities', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//   update: (id: string, data: any) =>
//     fetchAPI<ApiResponse<any>>(`/utilities/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     }),
//   delete: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/utilities/${id}`, {
//       method: 'DELETE',
//     }),
// };

// /**
//  * Bill API
//  */
// export const billApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/bills?page=${page}&pageSize=${pageSize}`),
//   getById: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/bills/${id}`),
//   create: (data: any) =>
//     fetchAPI<ApiResponse<any>>('/bills', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//   update: (id: string, data: any) =>
//     fetchAPI<ApiResponse<any>>(`/bills/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify(data),
//     }),
//   delete: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/bills/${id}`, {
//       method: 'DELETE',
//     }),
// };

// /**
//  * Payment API
//  */
// export const paymentApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/payments?page=${page}&pageSize=${pageSize}`),
//   getById: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/payments/${id}`),
//   create: (data: any) =>
//     fetchAPI<ApiResponse<any>>('/payments', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     }),
//   confirm: (id: string) =>
//     fetchAPI<ApiResponse<any>>(`/payments/${id}/confirm`, {
//       method: 'POST',
//     }),
// };

// /**
//  * Notification API
//  */
// export const notificationApi = {
//   getAll: (page = 1, pageSize = 10) =>
//     fetchAPI<PaginatedResponse<any>>(`/notifications?page=${page}&pageSize=${pageSize}`),
//   markAsRead: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/notifications/${id}/read`, {
//       method: 'POST',
//     }),
//   delete: (id: string) =>
//     fetchAPI<ApiResponse<void>>(`/notifications/${id}`, {
//       method: 'DELETE',
//     }),
// };
>>>>>>> parent of d713dd8 (update lại các file liên quan)
