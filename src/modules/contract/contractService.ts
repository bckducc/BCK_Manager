import { apiCall } from '../../services/apiClient';
import type { Contract } from './contract.types';

const serializeDate = (value: unknown): string | unknown => {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  return value;
};

const serializeContract = (data: Omit<Contract, 'id' | 'createdAt'>) => {
  return JSON.stringify({
    ...data,
    startDate: serializeDate(data.startDate),
    endDate: serializeDate(data.endDate),
  });
};

const serializePartialContract = (data: Partial<Omit<Contract, 'id' | 'createdAt'>>) => {
  return JSON.stringify({
    ...data,
    startDate: data.startDate ? serializeDate(data.startDate) : undefined,
    endDate: data.endDate ? serializeDate(data.endDate) : undefined,
  });
};

export const contractService = {
  getAll: () => apiCall<{ contracts: Contract[] }>('/api/v1/contracts', { method: 'GET' }),

  getById: (id: string) => apiCall<Contract>(`/api/v1/contracts/${id}`, { method: 'GET' }),

  create: (data: Omit<Contract, 'id' | 'createdAt'>) =>
    apiCall<Contract>('/api/v1/contracts', {
      method: 'POST',
      body: serializeContract(data),
    }),

  update: (id: string, data: Partial<Omit<Contract, 'id' | 'createdAt'>>) =>
    apiCall<Contract>(`/api/v1/contracts/${id}`, {
      method: 'PUT',
      body: serializePartialContract(data),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/v1/contracts/${id}`, { method: 'DELETE' }),
};
