import { apiCall } from '../../services/apiClient';
import type { Tenant } from './tenant.types';
import type { User } from '../../types';

export const tenantService = {
  getDashboard: () => apiCall<{ profile: User; dashboard: Record<string, unknown> }>('/api/v1/tenants/dashboard', { method: 'GET' }),

  updateProfile: (data: Partial<User>) =>
    apiCall<User>('/api/v1/tenants/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getAll: () => apiCall<{ tenants: Tenant[] }>('/api/v1/tenants', { method: 'GET' }),

  getById: (id: string) => apiCall<Tenant>(`/api/v1/tenants/${id}`, { method: 'GET' }),

  create: (data: { username?: string; password?: string; name?: string; phone?: string; idNumber?: string; gender?: User['gender'] }) =>
    apiCall<Tenant>('/api/v1/tenants', {
      method: 'POST',
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        full_name: data.name,
        phone: data.phone,
        identity_card: data.idNumber,
        gender: data.gender,
      }),
    }),

  update: (id: string, data: Partial<Omit<Tenant, 'id' | 'currentRoom' | 'currentUser'>> & { name?: string; phone?: string; idNumber?: string; gender?: User['gender'] }) =>
    apiCall<Tenant>(`/api/v1/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        full_name: data.name,
        phone: data.phone,
        identity_card: data.idNumber,
        gender: data.gender,
      }),
    }),

  toggleStatus: (id: string) =>
    apiCall<{ id: string | number; is_active: boolean }>(`/api/v1/tenants/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({}),
    }),

  delete: (id: string) =>
    tenantService.toggleStatus(id),
};
