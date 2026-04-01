// User Types
export type UserRole = 'owner' | 'tenant' | 'admin';

export interface User {
  id: string;
  username: string;
  email?: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  idNumber?: string; // CMND/CCCD
  gender?: 'male' | 'female' | 'other';
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Room Types
export interface Room {
  id: string;
  roomNumber: string;
  area: number; // m²
  floor: number;
  status: 'available' | 'occupied' | 'maintenance';
  price: number; // giá thuê/tháng
  description?: string;
  createdAt: Date;
}

// Tenant Types
export interface Tenant {
  id: string;
  userId: string;
  roomId: string;
  startDate: Date;
  currentRoom?: Room;
  currentUser?: User;
}

// Contract Types
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

// Service Types
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

// Utility Reading Types (Điện nước)
export interface UtilityReading {
  id: string;
  roomId: string;
  electricityReading: number; // kWh
  waterReading: number; // m³
  readingDate: Date;
  notes?: string;
}

// Bill Types
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

// Payment Types
export interface Payment {
  id: string;
  billId: string;
  tenantId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'transfer' | 'card';
  status: 'pending' | 'confirmed' | 'failed';
  notes?: string;
}

// Notification Types
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

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
