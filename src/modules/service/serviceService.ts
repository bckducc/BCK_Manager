import { apiCall } from '../../services/apiClient';
import type { RoomService, Service } from './service.types';

type BackendService = {
  id: string | number;
  service_name: string;
  price: number | string;
  unit: Service['unit'] | null;
  is_optional: boolean | number | string;
  created_at?: string;
};

type BackendRoomService = {
  id: string | number;
  room_id: string | number;
  service_id: string | number;
  quantity: number | string;
  applied_date?: string;
  service_name: string;
  price: number | string;
  unit: Service['unit'] | null;
  is_optional: boolean | number | string;
};

type ServicePayload = Pick<Service, 'name' | 'price' | 'unit' | 'type'>;
type AssignRoomServicePayload = {
  roomId: string;
  serviceId: string;
  quantity?: number;
  appliedDate?: string;
};
type UpdateRoomServicePayload = {
  quantity?: number;
  appliedDate?: string;
};

const isOptionalService = (value: BackendService['is_optional']) => (
  value === true || value === 1 || value === '1' || value === 'true'
);

const toService = (service: BackendService): Service => ({
  id: service.id,
  name: service.service_name,
  description: '',
  price: Number(service.price),
  unit: (service.unit ?? 'month') as Service['unit'],
  type: isOptionalService(service.is_optional) ? 'optional' : 'required',
  createdAt: service.created_at ? new Date(service.created_at) : new Date(),
});

const toBackendPayload = (service: Partial<ServicePayload>) => {
  const payload: {
    service_name?: string;
    price?: number;
    unit?: Service['unit'];
    is_optional?: boolean;
  } = {};

  if (service.name !== undefined) payload.service_name = service.name;
  if (service.price !== undefined) payload.price = service.price;
  if (service.unit !== undefined) payload.unit = service.unit;
  if (service.type !== undefined) payload.is_optional = service.type === 'optional';

  return JSON.stringify(payload);
};

const toRoomService = (roomService: BackendRoomService): RoomService => ({
  id: roomService.id,
  roomId: roomService.room_id,
  serviceId: roomService.service_id,
  quantity: Number(roomService.quantity),
  appliedDate: roomService.applied_date ? new Date(roomService.applied_date) : new Date(),
  service: toService({
    id: roomService.service_id,
    service_name: roomService.service_name,
    price: roomService.price,
    unit: roomService.unit,
    is_optional: roomService.is_optional,
  }),
});

const toAssignRoomServicePayload = (data: AssignRoomServicePayload) =>
  JSON.stringify({
    room_id: data.roomId,
    service_id: data.serviceId,
    quantity: data.quantity,
    applied_date: data.appliedDate,
  });

const toUpdateRoomServicePayload = (data: UpdateRoomServicePayload) =>
  JSON.stringify({
    quantity: data.quantity,
    applied_date: data.appliedDate,
  });

export const serviceService = {
  getAll: async () => {
    const response = await apiCall<BackendService[]>('/api/v1/services', { method: 'GET' });

    return {
      ...response,
      data: {
        services: Array.isArray(response.data) ? response.data.map(toService) : [],
      },
    };
  },

  getById: async (id: string) => {
    const response = await apiCall<BackendService>(`/api/v1/services/${id}`, { method: 'GET' });

    return {
      ...response,
      data: response.data ? toService(response.data) : undefined,
    };
  },

  create: async (data: ServicePayload) => {
    const response = await apiCall<BackendService>('/api/v1/services', {
      method: 'POST',
      body: toBackendPayload(data),
    });

    return {
      ...response,
      data: response.data ? toService(response.data) : undefined,
    };
  },

  update: async (id: string, data: Partial<ServicePayload>) => {
    const response = await apiCall<BackendService>(`/api/v1/services/${id}`, {
      method: 'PUT',
      body: toBackendPayload(data),
    });

    return {
      ...response,
      data: response.data ? toService(response.data) : undefined,
    };
  },

  delete: (id: string) =>
    apiCall<{ success: boolean }>(`/api/v1/services/${id}`, { method: 'DELETE' }),

  assignToRoom: async (data: AssignRoomServicePayload) => {
    const response = await apiCall<BackendRoomService>('/api/v1/services/room/assign', {
      method: 'POST',
      body: toAssignRoomServicePayload(data),
    });

    return {
      ...response,
      data: response.data ? toRoomService(response.data) : undefined,
    };
  },

  getByRoom: async (roomId: string) => {
    const response = await apiCall<BackendRoomService[]>(`/api/v1/services/room/${roomId}`, {
      method: 'GET',
    });

    return {
      ...response,
      data: {
        roomServices: Array.isArray(response.data) ? response.data.map(toRoomService) : [],
      },
    };
  },

  updateRoomService: async (
    roomId: string,
    serviceId: string,
    data: UpdateRoomServicePayload
  ) => {
    const response = await apiCall<BackendRoomService>(
      `/api/v1/services/room/${roomId}/${serviceId}`,
      {
        method: 'PUT',
        body: toUpdateRoomServicePayload(data),
      }
    );

    return {
      ...response,
      data: response.data ? toRoomService(response.data) : undefined,
    };
  },

  updateRoomServiceQuantity: async (roomId: string, serviceId: string, quantity: number) => {
    const response = await apiCall<BackendRoomService>(
      `/api/v1/services/room/${roomId}/${serviceId}/quantity`,
      {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }
    );

    return {
      ...response,
      data: response.data ? toRoomService(response.data) : undefined,
    };
  },

  removeFromRoom: (roomId: string, serviceId: string) =>
    apiCall<{ room_id: number; service_id: number }>(
      `/api/v1/services/room/${roomId}/${serviceId}`,
      { method: 'DELETE' }
    ),
};
