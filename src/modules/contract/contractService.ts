import { apiCall } from '../../services/apiClient';
import type { Contract } from './contract.types';

export const contractService = {
  getAll: () => apiCall<{ contracts: Contract[] }>('/api/v1/contracts', { method: 'GET' }),

  getById: (id: string) => apiCall<Contract>(`/api/v1/contracts/${id}`, { method: 'GET' }),

  create: (data: Omit<Contract, 'id' | 'createdAt'>) =>
    apiCall<Contract>('/api/v1/contracts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Contract, 'id' | 'createdAt'>>) =>
    apiCall<Contract>(`/api/v1/contracts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/v1/contracts/${id}`, { method: 'DELETE' }),
};
