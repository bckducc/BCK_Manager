export interface Payment {
  id: string;
  billId: string;
  tenantId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'transfer' | 'card';
  status: 'pending' | 'confirmed' | 'failed';
  notes?: string;
}
