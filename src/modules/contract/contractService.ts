import { apiCall } from '../../services/apiClient';
import type { Contract } from './contract.types';

export type ContractFilters = {
  status?: string;
  tenantId?: string;
  roomId?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export type CreateContractPayload = {
  tenantId: string;
  roomId: string;
  contractCode?: string;
  startDate: Date | string;
  endDate: Date | string;
  depositAmount: number;
  monthlyRent: number;
  terms?: string;
  signedDate?: Date | string;
};

const serializeDate = (value: unknown): string | unknown => {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  return value;
};

const buildQuery = (filters: ContractFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) params.set('status', filters.status);
  if (filters.tenantId) params.set('tenant_id', filters.tenantId);
  if (filters.roomId) params.set('room_id', filters.roomId);
  if (filters.search) params.set('search', filters.search);
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 100));

  const query = params.toString();
  return query ? `?${query}` : '';
};

const serializeContract = (data: CreateContractPayload) => {
  return JSON.stringify({
    tenant_id: data.tenantId,
    room_id: data.roomId,
    contract_code: data.contractCode || undefined,
    start_date: serializeDate(data.startDate),
    end_date: serializeDate(data.endDate),
    deposit_amount: data.depositAmount,
    monthly_rent: data.monthlyRent,
    terms: data.terms || undefined,
    signed_date: data.signedDate ? serializeDate(data.signedDate) : undefined,
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
  getAll: (filters: ContractFilters = {}) =>
    apiCall<Contract[]>(`/api/v1/contracts${buildQuery(filters)}`, { method: 'GET' }),

  getById: (id: string) => apiCall<Contract>(`/api/v1/contracts/${id}`, { method: 'GET' }),

  create: (data: CreateContractPayload) =>
    apiCall<Contract>('/api/v1/contracts', {
      method: 'POST',
      body: serializeContract(data),
    }),

  update: (id: string, data: Partial<Omit<Contract, 'id' | 'createdAt'>>) =>
    apiCall<Contract>(`/api/v1/contracts/${id}`, {
      method: 'PUT',
      body: serializePartialContract(data),
    }),

  terminate: (id: string) =>
    apiCall<{ id: string | number; status: Contract['status'] }>(`/api/v1/contracts/${id}/terminate`, {
      method: 'PUT',
      body: JSON.stringify({}),
    }),

  delete: (id: string) =>
    apiCall<{ id: string | number; status: Contract['status'] }>(`/api/v1/contracts/${id}/terminate`, {
      method: 'PUT',
      body: JSON.stringify({}),
    }),
};
