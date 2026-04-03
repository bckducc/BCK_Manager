import { apiCall } from './apiClient';

export const billService = {
  getAll: () => apiCall<Record<string, unknown>>('/api/bills', { method: 'GET' }),

  getById: (id: string) => apiCall<Record<string, unknown>>(`/api/bills/${id}`, { method: 'GET' }),

  create: (data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>('/api/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>(`/api/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<Record<string, unknown>>(`/api/bills/${id}`, { method: 'DELETE' }),
};
