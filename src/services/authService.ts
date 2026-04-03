import { apiCall, type ApiResponse } from './apiClient';

export const authService = {
  login: (username: string, password: string) =>
    apiCall<Record<string, unknown>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMe: () => apiCall<Record<string, unknown>>('/api/auth/me', { method: 'GET' }),

  logout: () => apiCall('/api/auth/logout', { method: 'POST' }),
};
