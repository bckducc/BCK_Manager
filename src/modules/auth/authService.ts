import { apiCall } from '../../services/apiClient';
import type { User } from '../../types';

export const authService = {
  login: (username: string, password: string) =>
    apiCall<{ user: User; token: string }>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => apiCall<{ user: User }>('/api/v1/auth/me', { method: 'GET' }),

  logout: () => apiCall<{ success: boolean }>('/api/auth/logout', { method: 'POST' }),
};
