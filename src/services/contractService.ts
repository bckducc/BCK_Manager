import { apiCall } from './apiClient';

export const contractService = {
  getAll: () => apiCall<any>('/api/contracts', { method: 'GET' }),

  getById: (id: string) => apiCall<any>(`/api/contracts/${id}`, { method: 'GET' }),

  create: (data: any) =>
    apiCall<any>('/api/contracts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiCall<any>(`/api/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<any>(`/api/contracts/${id}`, { method: 'DELETE' }),
};
