/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { Tenant, User } from '../types';
import { tenantService } from '../modules/tenant/tenantService';

const parseDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
};

interface TenantContextType {
  tenants: Tenant[];
  users: User[];
  loading: boolean;
  error: string | null;
  addTenant: (tenant: Omit<Tenant, 'id' | 'userId'>, userData: { username: string; password: string; name: string; phone?: string; idNumber?: string; gender?: User['gender'] }) => Promise<void>;
  updateTenant: (id: string, tenant: Partial<Tenant> & { name?: string; phone?: string; idNumber?: string; gender?: User['gender'] }) => Promise<void>;
  deleteTenant: (id: string) => Promise<void>;
  getTenantById: (id: string) => Tenant | undefined;
  fetchTenants: (force?: boolean) => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 2000;

  const fetchTenants = useCallback(async (force = false) => {
    if (isFetchingRef.current) {
      return;
    }
    
    const now = Date.now();
    if (!force && now - lastFetchRef.current < MIN_FETCH_INTERVAL) {
      return;
    }
    lastFetchRef.current = now;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await tenantService.getAll();
      
      let tenantsList: Tenant[] = [];
      const usersList: User[] = [];
      
      const responseData = response.data as Record<string, unknown> | unknown[];
      const data = Array.isArray(responseData) ? responseData : ((responseData as Record<string, unknown>)?.tenants as unknown[] || []);
      
      if (Array.isArray(data)) {
        tenantsList = (data as Array<Record<string, unknown>>).map((item: Record<string, unknown>) => {
          const user: User = {
            id: String(item.user_id || item.userId || ''),
            username: (item.username as string | undefined) || 'N/A',
            name: ((item.full_name || item.name) as string | undefined) || 'N/A',
            phone: (item.phone as string | undefined),
            idNumber: ((item.identity_card || item.idNumber) as string | undefined),
            gender: ((item.gender as string | undefined) || 'other') as 'male' | 'female' | 'other',
            role: 'tenant',
            isActive: Boolean(item.is_active ?? item.isActive ?? true),
            createdAt: parseDate(item.created_at || item.createdAt),
          };
          
          if (user.id && !usersList.find(u => u.id === user.id)) {
            usersList.push(user);
          }

          const tenant: Tenant = {
            id: String(item.id || item.user_id || item.userId || ''),
            userId: String(item.user_id || item.userId || ''),
            roomId: String(item.room_id || item.roomId || ''),
            startDate: parseDate(item.start_date || item.startDate),
            currentUser: user,
            currentRoom: item.room_id || item.roomId ? {
              id: String(item.room_id || item.roomId || ''),
              roomNumber: String(item.room_number || item.roomNumber || ''),
              area: (item.area as number | undefined) || 0,
              floor: (item.floor as number | undefined) || 0,
              price: (item.price as number | undefined) || 0,
              status: ((item.status as string | undefined) || 'available') as 'available' | 'rented' | 'maintenance',
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
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  const addTenant = useCallback(async (_tenant: Omit<Tenant, 'id' | 'userId'>, userData: { username: string; password: string; name: string; phone?: string; idNumber?: string; gender?: User['gender'] }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tenantService.create({
        username: userData.username,
        password: userData.password,
        name: userData.name,
        phone: userData.phone,
        idNumber: userData.idNumber,
        gender: userData.gender,
      });
      
      if (response.success) {
        await fetchTenants(true);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create tenant';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTenants]);

  const updateTenant = useCallback(async (id: string, updates: Partial<Tenant> & { name?: string; phone?: string; idNumber?: string; gender?: User['gender'] }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tenantService.update(id, updates);
      
      if (response.success) {
        setTenants((prev) =>
          prev.map((tenant) => (
            tenant.id === id || tenant.userId === id
              ? {
                  ...tenant,
                  currentUser: tenant.currentUser
                    ? {
                        ...tenant.currentUser,
                        name: updates.name ?? tenant.currentUser.name,
                        phone: updates.phone ?? tenant.currentUser.phone,
                        idNumber: updates.idNumber ?? tenant.currentUser.idNumber,
                        gender: updates.gender ?? tenant.currentUser.gender,
                      }
                    : tenant.currentUser,
                }
              : tenant
          ))
        );
        await fetchTenants(true);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update tenant';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTenants]);

  const deleteTenant = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await tenantService.delete(id);
      
      if (response.success) {
        const isActive = Boolean(response.data?.is_active);
        setUsers((prev) =>
          prev.map((user) => (user.id === id ? { ...user, isActive } : user))
        );
        setTenants((prev) =>
          prev.map((tenant) => (
            tenant.id === id || tenant.userId === id
              ? {
                  ...tenant,
                  currentUser: tenant.currentUser ? { ...tenant.currentUser, isActive } : tenant.currentUser,
                }
              : tenant
          ))
        );
        await fetchTenants(true);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete tenant';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTenants]);

  const getTenantById = useCallback((id: string) => {
    return tenants.find((t) => t.id === id);
  }, [tenants]);

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

export default TenantProvider;
