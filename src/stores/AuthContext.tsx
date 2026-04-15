import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      if (!username || !password) {
        throw new Error('Vui lòng nhập tên tài khoản và mật khẩu');
      }

      const controller = new AbortController();
      timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      if (!data.user || !data.token) {
        throw new Error('Dữ liệu từ server không hợp lệ');
      }

      const user: User = {
        id: String(data.user.id),
        username: data.user.username,
        email: data.user.email || '',
        name: data.user.name || 'User',
        role: 'owner', // Chủ nhà
        phone: data.user.phone,
        address: data.user.address,
        idNumber: data.user.idNumber,
        gender: data.user.gender,
        createdAt: new Date(data.user.createdAt),
      };

      setUser(user);
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', data.token);
    } catch (error: any) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const errorMessage = 
        error?.name === 'AbortError' 
          ? 'Kết nối timeout. Vui lòng kiểm tra kết nối mạng.'
          : error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      console.error('Login error:', error);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
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
      fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            const user: User = {
              id: String(data.user.id),
              username: data.user.username,
              email: data.user.email,
              name: data.user.name || '',
              role: 'owner',
              phone: data.user.phone,
              address: data.user.address,
              idNumber: data.user.idNumber,
              gender: data.user.gender,
              createdAt: new Date(data.user.createdAt),
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
