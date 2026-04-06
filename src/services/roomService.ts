import { apiCall } from './apiClient';

export const roomService = {
  getAll: () => apiCall<Record<string, unknown>>('/api/rooms/landlord/rooms', { method: 'GET' }),

  getById: (id: string) => apiCall<Record<string, unknown>>(`/api/rooms/${id}`, { method: 'GET' }),

  create: (data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    apiCall<Record<string, unknown>>(`/api/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<Record<string, unknown>>(`/api/rooms/${id}`, { method: 'DELETE' }),

  getAvailable: () => apiCall<Record<string, unknown>>('/api/rooms/available', { method: 'GET' }),
};
