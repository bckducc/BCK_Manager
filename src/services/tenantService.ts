import { apiCall } from './apiClient';
import type { Tenant, User } from '../types';

export const tenantService = {
  getDashboard: () => apiCall<{ profile: User; dashboard: Record<string, unknown> }>('/api/v1/tenant/dashboard', { method: 'GET' }),

  updateProfile: (data: Partial<User>) =>
    apiCall<User>('/api/v1/tenant/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAll: () => apiCall<{ tenants: Tenant[] }>('/api/v1/tenants', { method: 'GET' }),

  getById: (id: string) => apiCall<Tenant>(`/api/v1/tenants/${id}`, { method: 'GET' }),

  create: (data: Omit<Tenant, 'id' | 'currentRoom' | 'currentUser'>) =>
    apiCall<Tenant>('/api/v1/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Tenant, 'id' | 'currentRoom' | 'currentUser'>>) =>
    apiCall<Tenant>(`/api/v1/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/v1/tenants/${id}`, { method: 'DELETE' }),
};
