import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Contract } from '../modules/contract/contract.types';
import type { User, UserRole } from '../types';
import type { Room } from '../modules/room/room.types';
import { ContractContext } from './contract-context';
import { contractService } from '../modules/contract/contractService';
import type { CreateContractPayload } from '../modules/contract/contractService';

const parseDate = (value: unknown): Date => {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') return new Date(value);
  return new Date();
};

const getString = (value: unknown, fallback: unknown = ''): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return typeof fallback === 'string' ? fallback : String(fallback || '');
};

const parsePrice = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]+/g, '');
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const getStatus = (value: unknown): 'active' | 'expired' | 'terminated' => {
  const normalized = typeof value === 'string' ? value.toLowerCase().trim() : '';
  if (normalized.includes('expired') || normalized.includes('hết hiệu lực') || normalized.includes('hết')) return 'expired';
  if (normalized.includes('terminated') || normalized.includes('chấm dứt')) return 'terminated';
  return 'active';
};

const parseTenantUser = (value: unknown) => {
  const user = value as Record<string, unknown> | undefined;
  if (!user) return undefined;

  return {
    id: getString(user.id || user.userId || user.user_id),
    username: getString(user.username || user.user_name || user.email || user.name),
    name: getString(user.name || user.fullName || user.full_name || user.username || user.user_name),
    role: (getString(user.role || user.user_role) as UserRole) || 'tenant',
    phone: getString(user.phone || user.phone_number || user.phoneNumber || '') || undefined,
    idNumber: getString(user.idNumber || user.id_number || '') || undefined,
    gender: (getString(user.gender || user.sex || '') as User['gender']) || undefined,
    createdAt: parseDate(user.createdAt || user.created_at),
  };
};

const parseTenant = (value: unknown) => {
  const tenant = value as Record<string, unknown> | undefined;
  if (!tenant) return undefined;

  return {
    id: getString(tenant.id || tenant.tenantId || tenant.tenant_id),
    userId: getString(tenant.userId || tenant.user_id),
    currentUser: parseTenantUser(tenant.currentUser || tenant.current_user || tenant.user || tenant.userData || tenant.user_data),
  };
};

const parseRoom = (value: unknown) => {
  const room = value as Record<string, unknown> | undefined;
  if (!room) return undefined;

  const roomStatus = getString(room.status || room.roomStatus || room.room_status);

  return {
    id: getString(room.id || room.roomId || room.room_id),
    roomNumber: getString(room.roomNumber || room.room_number || room.name || room.room_name || room.number || ''),
    area: typeof room.area === 'number' ? room.area : Number(room.area) || 0,
    floor: typeof room.floor === 'number' ? room.floor : Number(room.floor) || 0,
    status: (roomStatus as Room['status']) || 'available',
    price: parsePrice(room.price || room.roomPrice || room.room_price),
    description: getString(room.description || room.note || room.room_note || '' ) || undefined,
    room_number: room.room_number as string | undefined,
    created_at: room.created_at as Date | undefined,
    updated_at: room.updated_at as Date | undefined,
  };
};

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const lastFetchRef = useRef<number>(0);
  const MIN_FETCH_INTERVAL = 2000; // Minimum 2 seconds between fetches

  const fetchContracts = useCallback(async () => {
    if (isFetchingRef.current) {
      return;
    }
    
    // Throttle: only allow fetch every 2 seconds
    const now = Date.now();
    if (now - lastFetchRef.current < MIN_FETCH_INTERVAL) {
      return;
    }
    lastFetchRef.current = now;
    
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.getAll();
      
      const responseData = response.data ?? response;
      const payload = Array.isArray(responseData)
        ? responseData
        : (responseData as unknown as Record<string, unknown>);

      const data = Array.isArray(payload)
        ? payload
        : (payload.contracts as unknown[])
          || (payload.items as unknown[])
          || (payload.data as unknown[])
          || [];

      const contractsList = (data as Array<Record<string, unknown>>).map((item) => {
          const tenantData = item.tenant || item.Tenant || item.tenantData || item.user || item.tenant_data;
          const roomData = item.room || item.Room || item.roomData || item.room_data;

          const tenantName = getString(
            item.tenantName || item.tenant_name || item.tenantFullName || item.tenant_full_name ||
            item.name || item.fullName || item.full_name || item.username || ''
          );
          const roomNumber = getString(
            item.roomNumber || item.room_number || item.roomName || item.room_name || item.number || ''
          );

          const contract: Contract = {
            id: getString(item.id || item.contractId || item.contract_id),
            contract_code: getString(item.contractCode || item.contract_code || item.code || ''),
            tenantId: getString(item.tenantId || item.tenant_id),
            roomId: getString(item.roomId || item.room_id),
            startDate: parseDate(item.startDate || item.start_date),
            endDate: parseDate(item.endDate || item.end_date),
            price: parsePrice(item.monthly_rent || item.monthlyRent || item.roomPrice || item.room_price || item.rent || item.price),
            monthlyRent: parsePrice(item.monthly_rent || item.monthlyRent || item.roomPrice || item.room_price || item.rent || item.price),
            depositAmount: parsePrice(item.deposit_amount || item.depositAmount),
            signedDate: item.signed_date || item.signedDate ? parseDate(item.signed_date || item.signedDate) : undefined,
            status: getStatus(item.status || item.contractStatus || item.status_text || item.state),
            terms: getString(item.terms || item.description || item.note || '') || undefined,
            createdAt: parseDate(item.createdAt || item.created_at),
            tenantName: tenantName || undefined,
            tenantPhone: getString(item.tenant_phone || item.tenantPhone || '') || undefined,
            roomNumber: roomNumber || undefined,
            floor: typeof item.floor === 'number' ? item.floor : Number(item.floor) || undefined,
            tenant: parseTenant(tenantData),
            room: parseRoom(roomData),
          };
          return contract;
        });

        setContracts(contractsList);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch contracts';
      setError(errorMsg);
      console.error('Error fetching contracts:', err);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const addContract = useCallback(async (contract: CreateContractPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.create(contract);

      if (response.success && response.data) {
        setContracts((prev) => [...prev, response.data as Contract]);
        await fetchContracts();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create contract';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContracts]);

  const updateContract = useCallback(async (id: string, updates: Partial<Omit<Contract, 'id' | 'createdAt'>>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.update(id, updates);

      if (response.success) {
        setContracts((prev) =>
          prev.map((contract) => (contract.id === id ? { ...contract, ...updates } : contract))
        );
        await fetchContracts();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update contract';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContracts]);

  const deleteContract = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await contractService.terminate(id);

      if (response.success) {
        setContracts((prev) =>
          prev.map((contract) => (contract.id === id ? { ...contract, status: 'terminated' } : contract))
        );
        await fetchContracts();
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete contract';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchContracts]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        loading,
        error,
        addContract,
        updateContract,
        deleteContract,
        fetchContracts,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

