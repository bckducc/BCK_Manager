export interface Notification {
  id: string;
  userId: string;
  type: 'payment' | 'maintenance' | 'contract' | 'announcement';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedId?: string; // ID của bill, room, contract, etc.
}
