import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Tenant, User } from '../types';
import { tenantService } from '../modules/tenant/tenantService';

interface TenantContextType {
  tenants: Tenant[];
  users: User[];
  loading: boolean;
  error: string | null;
  addTenant: (tenant: Omit<Tenant, 'id' | 'userId'>, user: Omit<User, 'id' | 'createdAt' | 'role'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  getTenantById: (id: string) => Tenant | undefined;
  fetchTenants: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTenant = useCallback((tenant: Omit<Tenant, 'id' | 'userId'>, user: Omit<User, 'id' | 'createdAt' | 'role'>) => {
    const newTenantId = `tenant_${Date.now()}`;
    const newUserId = `user_${Date.now()}`;

    const newUser: User = {
      id: newUserId,
      ...user,
      role: 'tenant',
      createdAt: new Date(),
    };

    const newTenant: Tenant = {
      id: newTenantId,
      userId: newUserId,
      roomId: tenant.roomId,
      startDate: tenant.startDate,
    };

    setUsers((prev) => [...prev, newUser]);
    setTenants((prev) => [...prev, newTenant]);

    // Lưu vào localStorage
    localStorage.setItem('tenants', JSON.stringify([...tenants, newTenant]));
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
  }, [tenants, users]);

  const updateTenant = useCallback((id: string, updates: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((tenant) => (tenant.id === id ? { ...tenant, ...updates } : tenant))
    );
  }, []);

  const deleteTenant = useCallback((id: string) => {
    const tenant = tenants.find((t) => t.id === id);
    if (tenant) {
      setUsers((prev) => prev.filter((u) => u.id !== tenant.userId));
    }
    setTenants((prev) => prev.filter((t) => t.id !== id));
  }, [tenants]);

  const getTenantById = useCallback((id: string) => {
    return tenants.find((t) => t.id === id);
  }, [tenants]);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tenantService.getAll();
      
      let tenantsList: Tenant[] = [];
      let usersList: User[] = [];
      
      if (response.data && Array.isArray(response.data)) {
        tenantsList = response.data.map((item: any) => {
          // Create user object from tenant data
          const user: User = {
            id: String(item.user_id),
            username: item.username || 'N/A',
            name: item.full_name || 'N/A',
            phone: item.phone || undefined,
            idNumber: item.identity_card || undefined,
            gender: item.gender || 'other',
            role: 'tenant',
            createdAt: new Date(item.created_at),
          };
          
          if (!usersList.find(u => u.id === user.id)) {
            usersList.push(user);
          }

          // Create tenant object
          const tenant: Tenant = {
            id: String(item.id || item.user_id),
            userId: String(item.user_id),
            roomId: String(item.room_id || '0'),
            startDate: new Date(),
            currentUser: user,
            currentRoom: item.room_id && item.room_id !== 0 ? {
              id: String(item.room_id),
              roomNumber: String(item.room_number),
              type: 'standard',
              area: 0,
              price: 0,
              landlordId: '',
              status: 'occupied',
              createdAt: new Date(),
            } : undefined,
          };
          
          return tenant;
        });
      }
      
      setTenants(tenantsList);
      setUsers(usersList);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch tenants';
      setError(errorMsg);
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return (
    <TenantContext.Provider value={{ tenants, users, loading, error, addTenant, updateTenant, deleteTenant, getTenantById, fetchTenants }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
};
