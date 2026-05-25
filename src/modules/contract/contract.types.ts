import type { User } from '../../types';
import type { Room } from '../room/room.types';

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
  tenantName?: string;
  roomNumber?: string;
  tenant?: {
    id: string;
    userId: string;
    currentUser?: User;
  };
  room?: Room;
}
