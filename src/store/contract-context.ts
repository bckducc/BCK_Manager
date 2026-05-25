import { createContext, useContext } from 'react';
import type { Contract } from '../modules/contract/contract.types';

export interface ContractContextType {
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => Promise<void>;
  updateContract: (id: string, contract: Partial<Omit<Contract, 'id' | 'createdAt'>>) => Promise<void>;
  deleteContract: (id: string) => Promise<void>;
  fetchContracts: () => Promise<void>;
}

export const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const useContract = (): ContractContextType => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within ContractProvider');
  }
  return context;
};
