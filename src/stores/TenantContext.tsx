import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Tenant, User } from '../types';

interface TenantContextType {
  tenants: Tenant[];
  users: User[];
  addTenant: (tenant: Omit<Tenant, 'id' | 'userId'>, user: Omit<User, 'id' | 'createdAt' | 'role'>) => void;
  updateTenant: (id: string, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  getTenantById: (id: string) => Tenant | undefined;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([]);

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

  return (
    <TenantContext.Provider value={{ tenants, users, addTenant, updateTenant, deleteTenant, getTenantById }}>
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
