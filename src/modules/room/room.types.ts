export interface Room {
  id?: string | number;
  room_number?: string;
  roomNumber?: string;
  area: number; 
  floor: number;
  status: 'available' | 'rented' | 'maintenance';
  price: number;
  description?: string;
  landlord_id?: string | number;
  created_at?: Date;
  updated_at?: Date;
}
