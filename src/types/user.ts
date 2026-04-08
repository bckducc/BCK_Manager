export type UserRole = 'owner' | 'tenant' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  phone?: string;
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
  login: (username: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}
