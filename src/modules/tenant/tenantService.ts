import { apiCall } from '../../services/apiClient';
import type { Tenant } from './tenant.types';
import type { User } from '../../types';

export const tenantService = {
  getDashboard: () => apiCall<{ profile: User; dashboard: Record<string, unknown> }>('/api/v1/tenant/dashboard', { method: 'GET' }),

  updateProfile: (data: Partial<User>) =>
    apiCall<User>('/api/v1/tenant/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAll: () => apiCall<{ tenants: Tenant[] }>('/api/list', { method: 'GET' }),

  getById: (id: string) => apiCall<Tenant>(`/api/tenants/${id}`, { method: 'GET' }),

  create: (data: Omit<Tenant, 'id' | 'currentRoom' | 'currentUser'>) =>
    apiCall<Tenant>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Tenant, 'id' | 'currentRoom' | 'currentUser'>>) =>
    apiCall<Tenant>(`/api/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/tenants/${id}`, { method: 'DELETE' }),
};
