export interface BillService {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface UtilityCharge {
  type: 'electricity' | 'water';
  previousReading: number;
  currentReading: number;
  usage: number;
  pricePerUnit: number;
  amount: number;
}

export interface Bill {
  id: string;
  tenantId: string;
  roomId: string;
  month: number;
  year: number;
  roomPrice: number;
  serviceCharges: BillService[];
  utilityCharges: UtilityCharge[];
  totalAmount: number;
  status: 'draft' | 'issued' | 'paid' | 'overdue';
  issuedDate: Date;
  dueDate: Date;
  paidDate?: Date;
}
