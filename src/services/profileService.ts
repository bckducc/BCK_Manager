import { apiCall } from './apiClient';
import type { User } from '../types';

export type LandlordProfilePayload = {
  full_name: string;
  phone?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
};

export type BackendProfile = {
  id?: string | number;
  username?: string;
  role?: string;
  name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string | null;
  identity_card?: string | null;
  idNumber?: string | null;
  gender?: User['gender'] | null;
  landlord_id?: string | number | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_account_name?: string | null;
  createdAt?: string;
  created_at?: string;
};

export const toUser = (profile: BackendProfile, fallback?: User | null): User => ({
  id: String(profile.id ?? fallback?.id ?? ''),
  username: profile.username ?? fallback?.username ?? '',
  email: profile.email ?? fallback?.email,
  name: profile.name ?? profile.full_name ?? fallback?.name ?? '',
  role: fallback?.role ?? (profile.role === 'landlord' ? 'owner' : profile.role === 'tenant' ? 'tenant' : 'admin'),
  phone: profile.phone ?? fallback?.phone,
  address: profile.address ?? fallback?.address,
  idNumber: profile.idNumber ?? profile.identity_card ?? fallback?.idNumber,
  gender: profile.gender ?? fallback?.gender,
  landlord_id: profile.landlord_id ?? fallback?.landlord_id,
  bankName: profile.bank_name ?? fallback?.bankName,
  bankAccountNumber: profile.bank_account_number ?? fallback?.bankAccountNumber,
  bankAccountName: profile.bank_account_name ?? fallback?.bankAccountName,
  createdAt: profile.createdAt || profile.created_at ? new Date(profile.createdAt || profile.created_at || '') : fallback?.createdAt ?? new Date(),
});

export const profileService = {
  getMe: () => apiCall<{ user: BackendProfile }>('/api/v1/auth/me', { method: 'GET' }),

  updateLandlord: (data: LandlordProfilePayload) =>
    apiCall<BackendProfile>('/api/v1/landlord/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  updateTenant: (data: {
    full_name: string;
    phone?: string;
    identity_card?: string;
    gender?: User['gender'];
  }) =>
    apiCall<BackendProfile>('/api/v1/tenants/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
