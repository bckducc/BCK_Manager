export interface Contract {
  id: string;
  tenantId: string;
  roomId: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: 'active' | 'expired' | 'terminated';
  terms?: string;
  createdAt: Date;
}
