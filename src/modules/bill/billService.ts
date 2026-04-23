import { apiCall } from '../../services/apiClient';
import type { Bill } from './bill.types';

export const billService = {
  getAll: () => apiCall<{ bills: Bill[] }>('/api/v1/bills', { method: 'GET' }),

  getById: (id: string) => apiCall<Bill>(`/api/v1/bills/${id}`, { method: 'GET' }),

  create: (data: Omit<Bill, 'id' | 'issuedDate' | 'dueDate' | 'paidDate'>) =>
    apiCall<Bill>('/api/v1/bills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Omit<Bill, 'id' | 'issuedDate' | 'dueDate' | 'paidDate'>>) =>
    apiCall<Bill>(`/api/v1/bills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/v1/bills/${id}`, { method: 'DELETE' }),
};
