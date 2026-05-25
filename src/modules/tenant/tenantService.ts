import { apiCall } from '../../services/apiClient';
import type { Tenant } from './tenant.types';
import type { User } from '../../types';

export const tenantService = {
  getDashboard: () => apiCall<{ profile: User; dashboard: Record<string, unknown> }>('/api/v1/tenant/dashboard', { method: 'GET' }),

  updateProfile: (data: Partial<User>) =>
    apiCall<User>('/api/v1/tenants/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAll: () => apiCall<{ tenants: Tenant[] }>('/api/v1/tenants', { method: 'GET' }),

  getById: (id: string) => apiCall<Tenant>(`/api/v1/tenants/${id}`, { method: 'GET' }),

  create: (data: { roomId: string; startDate: Date; username?: string; password?: string; name?: string; phone?: string; idNumber?: string; gender?: string }) =>
    apiCall<Tenant>('/api/v1/tenants', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        startDate: data.startDate instanceof Date ? data.startDate.toISOString().split('T')[0] : data.startDate,
      }),
    }),

  update: (id: string, data: Partial<Omit<Tenant, 'id' | 'currentRoom' | 'currentUser'>>) =>
    apiCall<Tenant>(`/api/v1/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...data,
        startDate: data.startDate instanceof Date ? data.startDate.toISOString().split('T')[0] : data.startDate,
      }),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/v1/tenants/${id}`, { method: 'DELETE' }),
};
