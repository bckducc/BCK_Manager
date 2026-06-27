import { apiCall } from './apiClient';
import type { Room } from '../modules/room/room.types';

export type RecentInvoice = {
  id: string | number;
  month: number;
  year: number;
  final_amount: string | number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  created_at?: string;
  due_date?: string;
  room_number?: string;
  tenant_name?: string;
};

export type LandlordDashboardData = {
  rooms: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
    list: Room[];
  };
  contracts: {
    active: number;
  };
  tenants: {
    total: number;
  };
  invoices: {
    unpaid_count: number;
    monthly_revenue: string | number;
    unpaid_amount: string | number;
  };
  recent_invoices: RecentInvoice[];
};

export const dashboardService = {
  getLandlord: () =>
    apiCall<LandlordDashboardData>('/api/v1/dashboard/landlord', {
      method: 'GET',
      skipCache: true,
    }),
};
