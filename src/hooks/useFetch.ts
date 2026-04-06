import { useState, useCallback } from 'react';
import type { ApiResponse } from '../types';

interface UseFetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useFetch = <T = any>(
  fetchFn: () => Promise<ApiResponse<T>>
) => {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetchFn();
      if (response.success) {
        setState({ data: response.data || null, loading: false, error: null });
        return response.data;
      } else {
        const error = new Error(response.message || 'Request failed');
        setState({ data: null, loading: false, error });
        throw error;
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, [fetchFn]);

  return {
    ...state,
    execute,
  };
};
