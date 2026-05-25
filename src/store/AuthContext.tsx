import type { ReactNode } from 'react';
import { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import type { User, UserRole, AuthContextType } from '../types';
import { authService } from '../modules/auth/authService';

const mapBackendRole = (backendRole: string): UserRole => {
  if (backendRole === 'landlord') return 'owner';
  if (backendRole === 'tenant') return 'tenant';
  if (backendRole === 'admin') return 'admin';
  return 'tenant'; 
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      if (!username || !password) {
        throw new Error('Vui lòng nhập tên tài khoản và mật khẩu');
      }

      const response = await authService.login(username, password);

      if (!response.success) {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }

      const userData = response.data?.user || (response as unknown as Record<string, unknown>).user;
      const tokenData = response.data?.token || (response as unknown as Record<string, unknown>).token;

      if (!userData || !tokenData) {
        console.error('Invalid response structure:', response);
        throw new Error('Dữ liệu từ server không hợp lệ');
      }
      
      const backendRole = (userData as Record<string, unknown>).role as string;
      const mappedRole = mapBackendRole(backendRole);
      
      const user: User = {
        id: (userData as Record<string, unknown>).id as string,
        username: (userData as Record<string, unknown>).username as string,
        name: ((userData as Record<string, unknown>).name as string) || 'User',
        role: mappedRole,
        phone: (userData as Record<string, unknown>).phone as string,
        idNumber: (userData as Record<string, unknown>).idNumber as string,
        gender: (userData as Record<string, unknown>).gender as 'male' | 'female' | 'other',
        landlord_id: (userData as Record<string, unknown>).landlord_id as string | number,
        createdAt: new Date((userData as Record<string, unknown>).createdAt as string),
      };

      setUser(user);
      setToken(tokenData as string);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', tokenData as string);
      
      console.log('Login state updated:', { user, token: tokenData });
      return user;
    } catch (error) {
      const errorMessage = (error as Error)?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      console.error('Login error:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) { 
      authService.getMe()
        .then((data) => {
          const userData = data.data?.user || (data as unknown as Record<string, unknown>).user;
          
          if (data.success && userData) {
            const backendRole = (userData as Record<string, unknown>).role as string;
            const mappedRole = mapBackendRole(backendRole);
            
            const user: User = {
              id: (userData as Record<string, unknown>).id as string,
              username: (userData as Record<string, unknown>).username as string,
              name: ((userData as Record<string, unknown>).name as string) || '',
              role: mappedRole,
              phone: (userData as Record<string, unknown>).phone as string,
              idNumber: (userData as Record<string, unknown>).idNumber as string,
              gender: (userData as Record<string, unknown>).gender as 'male' | 'female' | 'other',
              landlord_id: (userData as Record<string, unknown>).landlord_id as string | number,
              createdAt: new Date((userData as Record<string, unknown>).createdAt as string),
            };
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            logout();
          }
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          logout();
        });
    }
  }, [user, logout]);

  const isAuthenticated = !!user && !!token;
  
  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
  }), [user, token, isLoading, login, logout, isAuthenticated]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};