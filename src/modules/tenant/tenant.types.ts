import type { Room } from '../room/room.types';
import type { User } from '../../types';

export interface Tenant {
  id: string;
  userId: string;
  roomId: string;
  startDate: Date;
  currentRoom?: Room;
  currentUser?: User;
}
