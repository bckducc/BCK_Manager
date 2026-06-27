import type { User } from '../../types';
import type { Room } from '../room/room.types';

export interface Contract {
  id: string;
  tenantId: string;
  roomId: string;
  contract_code: string;
  startDate: Date;
  endDate: Date;
  price: number;
  monthlyRent?: number;
  depositAmount?: number;
  signedDate?: Date;
  status: 'active' | 'expired' | 'terminated';
  terms?: string;
  createdAt: Date;
  tenantName?: string;
  tenantPhone?: string;
  roomNumber?: string;
  floor?: number;
  tenant?: {
    id: string;
    userId: string;
    currentUser?: User;
  };
  room?: Room;
}
