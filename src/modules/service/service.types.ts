export type ServiceUnit = 'month' | 'time' | 'vehicle' | 'kwh' | 'm3' | 'piece';
export type ServiceType = 'required' | 'optional';

export interface Service {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  unit: ServiceUnit;
  type: ServiceType;
  createdAt: Date;
}

export interface RoomService {
  id: string | number;
  roomId: string | number;
  serviceId: string | number;
  quantity: number;
  appliedDate: Date;

  service?: Service;
}
