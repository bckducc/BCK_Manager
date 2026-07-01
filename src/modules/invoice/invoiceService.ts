import { apiCall, apiText } from '../../services/apiClient';
import type { ApiResponse } from '../../types';
import type { Invoice, InvoicePayment, InvoiceStatus, PaymentMethod } from './invoice.types';

type BackendInvoice = Partial<Omit<Invoice, 'status'>> & {
  id: string | number;
  room_id?: string | number;
  tenant_id?: string | number;
  contract_id: string | number;
  month: string | number;
  year: string | number;
  status: InvoiceStatus;
};

type BackendPayment = Partial<Omit<InvoicePayment, 'payment_method'>> & {
  id: string | number;
  invoice_id: string | number;
  amount: string | number;
  payment_method?: PaymentMethod;
};

export type InvoiceFilters = {
  search?: string;
  status?: InvoiceStatus | '';
  month?: number | '';
  year?: number | '';
  roomId?: string;
  page?: number;
  limit?: number;
};

export type GenerateInvoicePayload = {
  contract_id?: string | number;
  tenant_id?: string | number;
  month: number;
  year: number;
  other_fees?: number;
  discount?: number;
  due_date?: string;
};

export type GenerateInvoiceResult = {
  created: Invoice[];
  skipped: Array<{
    contract_id: number;
    room_id: number;
    room_number?: string;
    reason: string;
  }>;
  warnings: Array<{
    contract_id: number;
    room_id: number;
    room_number?: string;
    message: string;
  }>;
  created_count: number;
  skipped_count: number;
  warning_count: number;
};

export type InvoicePreview = {
  contract_id: number;
  tenant_id: number;
  room_id: number;
  room_number?: string;
  tenant_name?: string;
  month: number;
  year: number;
  room_fee: number;
  service_fee: number;
  electric_fee: number;
  water_fee: number;
  other_fees: number;
  discount: number;
  total_amount: number;
  final_amount: number;
  due_date?: string;
  existing_invoice_id?: number | null;
  warning?: string | null;
};

export type InvoiceListData = {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
};

export type InvoicePaymentPayload = {
  amount?: number;
  payment_date?: string;
  payment_method?: PaymentMethod;
  transaction_code?: string;
  note?: string;
};

export type InvoicePaymentData = {
  payments: InvoicePayment[];
  total_paid: number;
  remaining_balance: number;
  invoice_total: number;
};

const toNumber = (value: string | number | undefined | null) => {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const toInvoice = (invoice: BackendInvoice): Invoice => ({
  id: toNumber(invoice.id),
  contract_id: toNumber(invoice.contract_id),
  month: toNumber(invoice.month),
  year: toNumber(invoice.year),
  room_number: invoice.room_number || '',
  room_fee: toNumber(invoice.room_fee),
  service_fee: toNumber(invoice.service_fee),
  electric_fee: toNumber(invoice.electric_fee),
  water_fee: toNumber(invoice.water_fee),
  other_fees: toNumber(invoice.other_fees),
  discount: toNumber(invoice.discount),
  total_amount: toNumber(invoice.total_amount),
  final_amount: toNumber(invoice.final_amount),
  due_date: invoice.due_date,
  status: invoice.status,
  tenant_name: invoice.tenant_name,
  tenant_phone: invoice.tenant_phone,
  landlord_name: invoice.landlord_name,
  landlord_phone: invoice.landlord_phone,
  bank_name: invoice.bank_name,
  bank_account_number: invoice.bank_account_number,
  bank_account_name: invoice.bank_account_name,
  contract_status: invoice.contract_status,
  created_at: invoice.created_at,
  updated_at: invoice.updated_at,
});

const toPayment = (payment: BackendPayment): InvoicePayment => ({
  id: toNumber(payment.id),
  invoice_id: toNumber(payment.invoice_id),
  amount: toNumber(payment.amount),
  payment_date: payment.payment_date || '',
  payment_method: payment.payment_method || 'cash',
  transaction_code: payment.transaction_code,
  note: payment.note,
  received_by: payment.received_by === undefined ? null : toNumber(payment.received_by),
  receiver_name: payment.receiver_name,
  created_at: payment.created_at,
});

const buildQuery = (filters: InvoiceFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.status) params.set('status', filters.status);
  if (filters.month) params.set('month', String(filters.month));
  if (filters.year) params.set('year', String(filters.year));
  if (filters.roomId) params.set('room_id', filters.roomId);
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 100));

  const query = params.toString();
  return query ? `?${query}` : '';
};

const toInvoiceListResponse = (
  response: ApiResponse<BackendInvoice[]> & { total?: unknown; page?: unknown; limit?: unknown }
): ApiResponse<InvoiceListData> => ({
  ...response,
  data: {
    invoices: getInvoiceRows(response).map(toInvoice),
    total: toNumber((response.total ?? (response.data as Record<string, unknown> | undefined)?.total) as string | number | undefined),
    page: toNumber((response.page ?? (response.data as Record<string, unknown> | undefined)?.page) as string | number | undefined) || 1,
    limit: toNumber((response.limit ?? (response.data as Record<string, unknown> | undefined)?.limit) as string | number | undefined) || 100,
  },
});

const getInvoiceRows = (
  response: ApiResponse<BackendInvoice[]> & { total?: unknown; page?: unknown; limit?: unknown }
) => {
  if (Array.isArray(response.data)) return response.data;

  const dataObject = response.data as Record<string, unknown> | undefined;
  if (Array.isArray(dataObject?.invoices)) return dataObject.invoices as BackendInvoice[];
  if (Array.isArray(dataObject?.items)) return dataObject.items as BackendInvoice[];
  if (Array.isArray(dataObject?.data)) return dataObject.data as BackendInvoice[];

  return [];
};

export const invoiceService = {
  getAll: async (filters: InvoiceFilters = {}) => {
    const response = await apiCall<BackendInvoice[]>(`/api/v1/invoices${buildQuery(filters)}`, {
      method: 'GET',
    });

    return toInvoiceListResponse(response);
  },

  getMyInvoices: async (filters: InvoiceFilters = {}) => {
    const response = await apiCall<BackendInvoice[]>(`/api/v1/invoices/my/invoices${buildQuery(filters)}`, {
      method: 'GET',
    });

    return toInvoiceListResponse(response);
  },

  getById: async (id: string) => {
    const response = await apiCall<BackendInvoice>(`/api/v1/invoices/${id}`, { method: 'GET' });

    return {
      ...response,
      data: response.data ? toInvoice(response.data) : undefined,
    };
  },

  getMyInvoiceById: async (id: string) => {
    const response = await apiCall<BackendInvoice>(`/api/v1/invoices/my/invoices/${id}`, { method: 'GET' });

    return {
      ...response,
      data: response.data ? toInvoice(response.data) : undefined,
    };
  },

  generate: async (payload: GenerateInvoicePayload) => {
    const response = await apiCall<{
      created?: BackendInvoice[];
      skipped?: GenerateInvoiceResult['skipped'];
      warnings?: GenerateInvoiceResult['warnings'];
      created_count?: number;
      skipped_count?: number;
      warning_count?: number;
    }>('/api/v1/invoices/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      ...response,
      data: {
        created: Array.isArray(response.data?.created) ? response.data.created.map(toInvoice) : [],
        skipped: response.data?.skipped ?? [],
        warnings: response.data?.warnings ?? [],
        created_count: toNumber(response.data?.created_count),
        skipped_count: toNumber(response.data?.skipped_count),
        warning_count: toNumber(response.data?.warning_count),
      },
    };
  },

  preview: async (payload: GenerateInvoicePayload) => {
    const response = await apiCall<InvoicePreview>('/api/v1/invoices/preview', {
      method: 'POST',
      body: JSON.stringify(payload),
      skipInvalidate: true,
    });

    return {
      ...response,
      data: response.data ? {
        ...response.data,
        room_fee: toNumber(response.data.room_fee),
        service_fee: toNumber(response.data.service_fee),
        electric_fee: toNumber(response.data.electric_fee),
        water_fee: toNumber(response.data.water_fee),
        other_fees: toNumber(response.data.other_fees),
        discount: toNumber(response.data.discount),
        total_amount: toNumber(response.data.total_amount),
        final_amount: toNumber(response.data.final_amount),
      } : undefined,
    };
  },

  recordPayment: (id: string, data: InvoicePaymentPayload) =>
    apiCall(`/api/v1/invoices/${id}/payments`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getPayments: async (id: string) => {
    const response = await apiCall<{
      payments?: BackendPayment[];
      total_paid?: string | number;
      remaining_balance?: string | number;
      invoice_total?: string | number;
    }>(`/api/v1/invoices/${id}/payments`, { method: 'GET' });

    return {
      ...response,
      data: {
        payments: Array.isArray(response.data?.payments) ? response.data.payments.map(toPayment) : [],
        total_paid: toNumber(response.data?.total_paid),
        remaining_balance: toNumber(response.data?.remaining_balance),
        invoice_total: toNumber(response.data?.invoice_total),
      },
    };
  },

  confirmPayment: (id: string, data: InvoicePaymentPayload = {}) =>
    apiCall<{
      id: string | number;
      status: InvoiceStatus;
      payment_id: string | number;
      total_paid: string | number;
      remaining_balance: string | number;
    }>(`/api/v1/invoices/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  exportText: (id: string) => apiText(`/api/v1/invoices/${id}/export`),
};
