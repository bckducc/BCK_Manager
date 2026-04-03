import { apiCall } from './apiClient';

export const tenantService = {
  getAll: () => apiCall<Record<string, unknown>>('/api/tenants', { method: 'GET' }),

  getById: (id: string) => apiCall<Record<string, unknown>>(`/api/tenants/${id}`, { method: 'GET' }),

  create: (data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>(`/api/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<Record<string, unknown>>(`/api/tenants/${id}`, { method: 'DELETE' }),
};
