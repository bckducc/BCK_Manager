import { apiCall } from './apiClient';
import type { User } from '../types';

export const authService = {
  login: (username: string, password: string) =>
    apiCall<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => apiCall<{ user: User }>('/api/auth/me', { method: 'GET' }),

  logout: () => apiCall<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
};
