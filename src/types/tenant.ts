import type { Room } from './room';
import type { User } from './user';

export interface Tenant {
  id: string;
  userId: string;
  roomId: string;
  startDate: Date;
  currentRoom?: Room;
  currentUser?: User;
}
