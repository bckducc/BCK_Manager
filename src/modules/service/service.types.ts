export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: 'month' | 'unit' | 'kwh' | 'm3';
  type: 'optional' | 'required';
  createdAt: Date;
}

export interface TenantService {
  id: string;
  tenantId: string;
  serviceId: string;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'inactive';
  service?: Service;
}
