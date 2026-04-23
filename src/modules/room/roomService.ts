import { apiCall } from '../../services/apiClient';
import type { Room } from './room.types';

export const roomService = {
  getAll: () => apiCall<{ rooms: Room[] }>('/api/rooms/landlord/rooms', { method: 'GET' }),

  getById: (id: string) => apiCall<Room>(`/api/rooms/${id}`, { method: 'GET' }),

  create: (data: Omit<Room, 'id' | 'created_at' | 'updated_at'>) =>
    apiCall<Room>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>>) =>
    apiCall<Room>(`/api/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/rooms/${id}`, { method: 'DELETE' }),

  getAvailable: () => apiCall<{ rooms: Room[] }>('/api/rooms/available', { method: 'GET' }),
};
