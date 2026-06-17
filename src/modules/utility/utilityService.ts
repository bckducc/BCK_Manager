import { apiCall } from '../../services/apiClient';

export interface UtilityReading {
  id: string | number;
  contractId?: string | number;
  roomId: string | number;
  roomNumber?: string;
  floor?: string | number;
  month: number;
  year: number;
  electricOld: number;
  electricNew: number;
  electricPrice: number;
  waterOld: number;
  waterNew: number;
  waterPrice: number;
  recordedDate?: string;
  note?: string;
}

export interface RecordUtilityReadingPayload {
  roomId: string;
  month: number;
  year: number;
  electricOld: number;
  electricNew: number;
  electricPrice: number;
  waterOld: number;
  waterNew: number;
  waterPrice: number;
  recordedDate?: string;
  note?: string;
}

type BackendUtilityReading = {
  id: string | number;
  contract_id?: string | number;
  room_id: string | number;
  room_number?: string;
  floor?: string | number;
  month: number | string;
  year: number | string;
  electric_old: number | string;
  electric_new: number | string;
  electric_price: number | string;
  water_old: number | string;
  water_new: number | string;
  water_price: number | string;
  recorded_date?: string;
  note?: string;
};

const toNumber = (value: number | string | undefined) => Number(value ?? 0);

const toReading = (reading: BackendUtilityReading): UtilityReading => ({
  id: reading.id,
  contractId: reading.contract_id,
  roomId: reading.room_id,
  roomNumber: reading.room_number,
  floor: reading.floor,
  month: toNumber(reading.month),
  year: toNumber(reading.year),
  electricOld: toNumber(reading.electric_old),
  electricNew: toNumber(reading.electric_new),
  electricPrice: toNumber(reading.electric_price),
  waterOld: toNumber(reading.water_old),
  waterNew: toNumber(reading.water_new),
  waterPrice: toNumber(reading.water_price),
  recordedDate: reading.recorded_date,
  note: reading.note,
});

const toRecordPayload = (data: RecordUtilityReadingPayload) =>
  JSON.stringify({
    room_id: data.roomId,
    month: data.month,
    year: data.year,
    electric_old: data.electricOld,
    electric_new: data.electricNew,
    electric_price: data.electricPrice,
    water_old: data.waterOld,
    water_new: data.waterNew,
    water_price: data.waterPrice,
    recorded_date: data.recordedDate,
    note: data.note,
  });

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const utilityService = {
  recordReading: async (data: RecordUtilityReadingPayload) => {
    const response = await apiCall<BackendUtilityReading>('/api/v1/utilities', {
      method: 'POST',
      body: toRecordPayload(data),
    });

    return {
      ...response,
      data: response.data ? toReading(response.data) : undefined,
    };
  },

  getReading: async (roomId: string, month: number, year: number) => {
    const response = await apiCall<BackendUtilityReading[]>(
      `/api/v1/utilities/room/${roomId}`,
      { method: 'GET' }
    );
    const reading = Array.isArray(response.data)
      ? response.data.find((item) => toNumber(item.month) === month && toNumber(item.year) === year)
      : undefined;

    return {
      ...response,
      data: reading ? toReading(reading) : undefined,
    };
  },

  getRoomReadings: async (roomId: string) => {
    const response = await apiCall<BackendUtilityReading[]>(`/api/v1/utilities/room/${roomId}`, {
      method: 'GET',
    });

    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(toReading) : [],
    };
  },

  listReadings: async (filters: { roomId?: string; month?: number; year?: number; limit?: number } = {}) => {
    const response = await apiCall<BackendUtilityReading[]>(
      `/api/v1/utilities${buildQuery({
        room_id: filters.roomId,
        month: filters.month,
        year: filters.year,
        limit: filters.limit ?? 1000,
      })}`,
      { method: 'GET' }
    );

    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(toReading) : [],
    };
  },

  listMyReadings: async (filters: { month?: number; year?: number; contractId?: string; limit?: number } = {}) => {
    const response = await apiCall<BackendUtilityReading[]>(
      `/api/v1/utilities/my/readings${buildQuery({
        contract_id: filters.contractId,
        month: filters.month,
        year: filters.year,
        limit: filters.limit ?? 100,
      })}`,
      { method: 'GET' }
    );

    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(toReading) : [],
    };
  },

  deleteReading: (roomId: string, month: number, year: number) =>
    apiCall<{ success: boolean }>(
      `/api/v1/utilities${buildQuery({ room_id: roomId, month, year })}`,
      { method: 'DELETE' }
    ),
};
