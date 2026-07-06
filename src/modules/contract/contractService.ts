import { apiCall } from '../../services/apiClient';
import type { ApiResponse } from '../../types';
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

type BackendContract = Partial<Contract> & {
  id: string | number;
  tenant_id?: string | number;
  room_id?: string | number;
  contract_code?: string;
  start_date?: string;
  end_date?: string;
  monthly_rent?: string | number;
  monthlyRent?: string | number;
  deposit_amount?: string | number;
  signed_date?: string;
  created_at?: string;
  tenant_name?: string;
  tenant_phone?: string;
  room_number?: string;
  room_price?: string | number;
  landlord_name?: string;
  landlord_phone?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  area?: string | number;
  floor?: string | number;
  description?: string;
};

const toNumber = (value: unknown) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

export const toContract = (contract: BackendContract): Contract => ({
  ...contract,
  id: String(contract.id),
  tenantId: String(contract.tenant_id ?? contract.tenantId ?? ''),
  roomId: String(contract.room_id ?? contract.roomId ?? ''),
  contract_code: contract.contract_code ?? contract.contract_code ?? '',
  startDate: new Date(contract.start_date ?? contract.startDate ?? ''),
  endDate: new Date(contract.end_date ?? contract.endDate ?? ''),
  price: toNumber(contract.monthly_rent ?? contract.monthlyRent ?? contract.room_price ?? contract.price),
  monthlyRent: toNumber(contract.monthly_rent ?? contract.monthlyRent ?? contract.room_price ?? contract.price),
  depositAmount: toNumber(contract.deposit_amount ?? contract.depositAmount),
  signedDate: contract.signed_date ? new Date(contract.signed_date) : contract.signedDate,
  status: (contract.status ?? 'active') as Contract['status'],
  terms: contract.terms,
  createdAt: new Date(contract.created_at ?? contract.createdAt ?? ''),
  tenantName: contract.tenant_name ?? contract.tenantName,
  tenantPhone: contract.tenant_phone ?? contract.tenantPhone,
  roomNumber: contract.room_number ?? contract.roomNumber,
  floor: contract.floor === undefined ? undefined : toNumber(contract.floor),
  room: {
    id: contract.room_id ?? contract.roomId,
    room_number: contract.room_number,
    area: toNumber(contract.area),
    floor: toNumber(contract.floor),
    status: 'rented',
    price: toNumber(contract.room_price ?? contract.monthly_rent ?? contract.monthlyRent ?? contract.price),
    description: contract.description,
  },
});

const mapContractListResponse = (response: ApiResponse<BackendContract[]>): ApiResponse<Contract[]> => ({
  ...response,
  data: Array.isArray(response.data) ? response.data.map(toContract) : [],
});

const mapContractDetailResponse = (response: ApiResponse<BackendContract>): ApiResponse<Contract> => ({
  ...response,
  data: response.data ? toContract(response.data) : undefined,
});

export const contractService = {
  getAll: async (filters: ContractFilters = {}) => {
    const response = await apiCall<BackendContract[]>(`/api/v1/contracts${buildQuery(filters)}`, { method: 'GET' });
    return mapContractListResponse(response);
  },

  getById: async (id: string) => {
    const response = await apiCall<BackendContract>(`/api/v1/contracts/${id}`, { method: 'GET' });
    return mapContractDetailResponse(response);
  },

  getMyContract: async () => {
    const response = await apiCall<BackendContract>('/api/v1/contracts/my/contract', { method: 'GET' });
    return mapContractDetailResponse(response);
  },

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
