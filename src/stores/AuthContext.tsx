import type { ReactNode } from 'react';
import { createContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType } from '../types';
import { authService } from '../services';

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

<<<<<<< HEAD
      if (!response.user || !response.token) {
        throw new Error('Dữ liệu từ server không hợp lệ');
      }

      const backendRole = (response.user as Record<string, unknown>).role as string;
      const mappedRole = backendRole === 'landlord' ? 'owner' : (backendRole as 'owner' | 'tenant' | 'admin');
      
=======
      const data = await response.json();

      // Check for API errors
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Validate user data
      if (!data.user || !data.token) {
        throw new Error('Dữ liệu từ server không hợp lệ');
      }

      // Map API response to User type
>>>>>>> parent of d713dd8 (update lại các file liên quan)
      const user: User = {
        id: String((response.user as Record<string, unknown>).id),
        username: (response.user as Record<string, unknown>).username as string,
        name: ((response.user as Record<string, unknown>).name as string) || 'User',
        role: mappedRole || 'owner',
        phone: (response.user as Record<string, unknown>).phone as string,
        idNumber: (response.user as Record<string, unknown>).idNumber as string,
        gender: ((response.user as Record<string, unknown>).gender as 'male' | 'female' | 'other' | undefined),
        landlord_id: (response.user as Record<string, unknown>).landlord_id as string | number,
        createdAt: new Date((response.user as Record<string, unknown>).createdAt as string),
      };

      // Save to state and localStorage
      setUser(user);
      setToken(response.token);
      localStorage.setItem('user', JSON.stringify(user));
<<<<<<< HEAD
      localStorage.setItem('token', response.token);
      
      return user;
    } catch (error) {
      const errorMessage = (error as Error)?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
=======
      localStorage.setItem('token', data.token);
    } catch (error: any) {
      // Clear timeout if still pending
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Handle different error types
      const errorMessage = 
        error?.name === 'AbortError' 
          ? 'Kết nối timeout. Vui lòng kiểm tra kết nối mạng.'
          : error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
>>>>>>> parent of d713dd8 (update lại các file liên quan)
      
      console.error('Login error:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
<<<<<<< HEAD
=======
      // Final cleanup
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
>>>>>>> parent of d713dd8 (update lại các file liên quan)
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // Validate token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !user) { 
      authService.getMe()
        .then((data) => {
          if (data.success && data.user) {
            const backendRole = (data.user as Record<string, unknown>).role as string;
            const mappedRole = backendRole === 'landlord' ? 'owner' : (backendRole as 'owner' | 'tenant' | 'admin');
            
            const user: User = {
              id: String((data.user as Record<string, unknown>).id),
              username: (data.user as Record<string, unknown>).username as string,
              name: ((data.user as Record<string, unknown>).name as string) || '',
              role: mappedRole || 'owner',
              phone: (data.user as Record<string, unknown>).phone as string,
              idNumber: (data.user as Record<string, unknown>).idNumber as string,
              gender: ((data.user as Record<string, unknown>).gender as 'male' | 'female' | 'other' | undefined),
              landlord_id: (data.user as Record<string, unknown>).landlord_id as string | number,
              createdAt: new Date((data.user as Record<string, unknown>).createdAt as string),
            };
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
          } else {
            // Token invalid, clear it
            logout();
          }
        })
        .catch((error) => {
          console.error('Token validation failed:', error);
          logout();
        });
    }
  }, [user, logout]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
