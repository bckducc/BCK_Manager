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
  landlord_id?: string | number;
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

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
