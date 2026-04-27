import { apiCall } from '../../services/apiClient';
import type { Room } from './room.types';

export const roomService = {
  getAll: () => apiCall<{ rooms: Room[] }>('/api/v1/rooms', { method: 'GET' }),

  getById: (id: string) => apiCall<Room>(`/api/v1/rooms/${id}`, { method: 'GET' }),

  create: (data: Omit<Room, 'id' | 'created_at' | 'updated_at'>) =>
    apiCall<Room>('/api/v1/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>>) =>
    apiCall<Room>(`/api/v1/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/v1/rooms/${id}`, { method: 'DELETE' }),

  getAvailable: () => apiCall<{ rooms: Room[] }>('/api/v1/rooms/available', { method: 'GET' }),
};
