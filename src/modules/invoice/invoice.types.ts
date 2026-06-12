export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'other';

export interface Invoice {
  id: number;
  contract_id: number;
  month: number;
  year: number;
  room_number: string;
  room_fee: number;
  service_fee: number;
  electric_fee: number;
  water_fee: number;
  other_fees: number;
  discount: number;
  total_amount: number;
  final_amount: number;
  due_date?: string;
  status: InvoiceStatus;
  tenant_name?: string;
  tenant_phone?: string;
  landlord_name?: string;
  landlord_phone?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  contract_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InvoicePayment {
  id: number;
  invoice_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  transaction_code?: string | null;
  note?: string | null;
  received_by?: number | null;
  receiver_name?: string;
  created_at?: string;
}
