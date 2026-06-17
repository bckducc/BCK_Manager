import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Modal } from '../../components/common';
import { Table } from '../../components/Table';
import { Form, FormGroup, Input, Select } from '../../components/Forms/Form';
import { useFetch } from '../../hooks/useFetch';
import { roomService } from '../room/roomService';
import type { Room } from '../room/room.types';
import { serviceService } from './serviceService';
import type { ApiResponse } from '../../types';
import type { RoomService, Service } from './service.types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: stretch;

    > * {
      width: 100%;
    }
  }
`;

const Tabs = styled.div`
  display: inline-flex;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  overflow: hidden;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.text)};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;

  &:not(:last-child) {
    border-right: 1px solid ${theme.colors.border};
  }
`;

const AssignmentControls = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  button {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

type ActiveTab = 'services' | 'assignments';

const initialServiceForm = {
  name: '',
  price: '',
  unit: '',
  type: 'optional',
};

const initialAssignmentForm = {
  roomId: '',
  serviceId: '',
  quantity: '1',
  appliedDate: '',
};

const unitOptions = [
  { value: 'month', label: 'Tháng' },
  { value: 'time', label: 'Lần' },
  { value: 'vehicle', label: 'Xe' },
  { value: 'kwh', label: 'kWh' },
  { value: 'm3', label: 'm³' },
];

const unitLabels: Record<string, string> = {
  month: 'Tháng',
  time: 'Lần',
  vehicle: 'Xe',
  piece: 'Chiếc/Cái',
  kwh: 'kWh',
  m3: 'm³',
};

const typeLabels: Record<Service['type'], string> = {
  optional: 'Tùy chọn',
  required: 'Bắt buộc',
};

const formatCurrency = (value: unknown) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return String(value ?? '');
  return `${numericValue.toLocaleString('vi-VN')} đ`;
};

const formatDate = (value: Date) => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return '';
  return value.toLocaleDateString('vi-VN');
};

export const ServiceManagement = () => {
  const { data: serviceData, loading: loadingServices, error: serviceError, execute: loadServices } = useFetch(
    () => serviceService.getAll()
  );
  const { data: roomData, loading: loadingRooms, error: roomError, execute: loadRooms } = useFetch(
    () => roomService.getAll()
  );

  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [assignmentForm, setAssignmentForm] = useState(initialAssignmentForm);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [assignedServices, setAssignedServices] = useState<RoomService[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [assignmentError, setAssignmentError] = useState<Error | null>(null);

  const services = useMemo(() => {
    if (!serviceData) return [];
    if (Array.isArray(serviceData)) return serviceData as Service[];

    const dataObj = serviceData as Record<string, unknown>;
    return Array.isArray(dataObj.services) ? dataObj.services as Service[] : [];
  }, [serviceData]);

  const rooms = useMemo(() => {
    if (!roomData) return [];
    if (Array.isArray(roomData)) return roomData as Room[];

    const dataObj = roomData as Record<string, unknown>;
    return Array.isArray(dataObj.rooms) ? dataObj.rooms as Room[] : [];
  }, [roomData]);

  const selectedRoom = rooms.find((room) => String(room.id) === selectedRoomId);
  const assignedServiceIds = new Set(assignedServices.map((item) => String(item.serviceId)));
  const assignableServices = services.filter((service) => !assignedServiceIds.has(String(service.id)));

  const roomOptions = rooms
    .filter((room) => room.id !== undefined)
    .map((room) => ({
      value: String(room.id),
      label: `Phòng ${room.room_number || room.roomNumber || room.name || room.id}`,
    }));

  const serviceOptions = assignableServices.map((service) => ({
    value: String(service.id),
    label: `${service.name} - ${formatCurrency(service.price)}/${unitLabels[service.unit] || service.unit}`,
  }));

  const fetchAssignedServices = useCallback(async (roomId: string) => {
    if (!roomId) {
      setAssignedServices([]);
      return;
    }

    try {
      setLoadingAssignments(true);
      setAssignmentError(null);
      const response = await serviceService.getByRoom(roomId);
      const dataObj = response.data as Record<string, unknown> | undefined;
      setAssignedServices(Array.isArray(dataObj?.roomServices) ? dataObj.roomServices as RoomService[] : []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Không tải được dịch vụ đã gán');
      setAssignmentError(error);
      setAssignedServices([]);
    } finally {
      setLoadingAssignments(false);
    }
  }, []);

  useEffect(() => {
    if (!hasInitialized) {
      loadServices();
      loadRooms();
      setHasInitialized(true);
    }
  }, [hasInitialized, loadRooms, loadServices]);

  useEffect(() => {
    if (!selectedRoomId && rooms[0]?.id !== undefined) {
      setSelectedRoomId(String(rooms[0].id));
    }
  }, [rooms, selectedRoomId]);

  useEffect(() => {
    fetchAssignedServices(selectedRoomId);
  }, [fetchAssignedServices, selectedRoomId]);

  const resetServiceForm = () => {
    setEditingService(null);
    setServiceForm(initialServiceForm);
  };

  const openCreateServiceModal = () => {
    resetServiceForm();
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      price: String(service.price),
      unit: service.unit,
      type: service.type,
    });
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    resetServiceForm();
  };

  const openAssignmentModal = () => {
    setAssignmentForm({
      ...initialAssignmentForm,
      roomId: selectedRoomId,
      serviceId: serviceOptions[0]?.value || '',
    });
    setIsAssignmentModalOpen(true);
  };

  const closeAssignmentModal = () => {
    setIsAssignmentModalOpen(false);
    setAssignmentForm(initialAssignmentForm);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number(serviceForm.price);
    if (!serviceForm.name.trim() || !serviceForm.price || !serviceForm.unit || !serviceForm.type) {
      alert('Vui lòng nhập đầy đủ thông tin dịch vụ');
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      alert('Giá trị không hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      let response: ApiResponse<Service>;
      const payload = {
        name: serviceForm.name.trim(),
        price,
        unit: serviceForm.unit as Service['unit'],
        type: serviceForm.type as Service['type'],
      };

      if (editingService?.id) {
        response = await serviceService.update(String(editingService.id), payload);
      } else {
        response = await serviceService.create(payload);
      }

      if (!response.success) {
        throw new Error(response.message || 'Không lưu được dịch vụ');
      }

      await loadServices();
      await fetchAssignedServices(selectedRoomId);
      closeServiceModal();
      alert(editingService ? 'Cập nhật dịch vụ thành công' : 'Tạo dịch vụ thành công');
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không lưu được dịch vụ'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (service: Service) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dịch vụ "${service.name}"?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await serviceService.delete(String(service.id));
      if (!response.success) {
        throw new Error(response.message || 'Không xóa được dịch vụ');
      }

      await loadServices();
      await fetchAssignedServices(selectedRoomId);
      alert('Xóa dịch vụ thành công');
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không xóa được dịch vụ'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignService = async (e: React.FormEvent) => {
    e.preventDefault();

    const quantity = Number(assignmentForm.quantity);
    if (!assignmentForm.roomId || !assignmentForm.serviceId) {
      alert('Vui lòng chọn phòng và dịch vụ');
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      alert('Số lượng phải là số nguyên lớn hơn 0');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await serviceService.assignToRoom({
        roomId: assignmentForm.roomId,
        serviceId: assignmentForm.serviceId,
        quantity,
        appliedDate: assignmentForm.appliedDate || undefined,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không gán được dịch vụ');
      }

      setSelectedRoomId(assignmentForm.roomId);
      await fetchAssignedServices(assignmentForm.roomId);
      closeAssignmentModal();
      alert('Gán dịch vụ vào phòng thành công');
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không gán được dịch vụ'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromRoom = async (roomService: RoomService) => {
    if (!window.confirm(`Gỡ dịch vụ "${roomService.service?.name || roomService.serviceId}" khỏi phòng này?`)) {
      return;
    }

    const roomId = roomService.roomId ? String(roomService.roomId) : selectedRoomId;
    const serviceId = roomService.serviceId ? String(roomService.serviceId) : '';

    if (!roomId || !serviceId) {
      alert('Không xác định được phòng hoặc dịch vụ cần gỡ');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await serviceService.removeFromRoom(roomId, serviceId);
      if (!response.success) {
        throw new Error(response.message || 'Không gỡ được dịch vụ khỏi phòng');
      }

      await fetchAssignedServices(selectedRoomId);
      alert('Gỡ dịch vụ khỏi phòng thành công');
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không gỡ được dịch vụ khỏi phòng'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceColumns: TableColumn<Service>[] = [
    { key: 'name', title: 'Tên Dịch Vụ' },
    {
      key: 'price',
      title: 'Đơn Giá',
      render: (value) => formatCurrency(value),
    },
    {
      key: 'unit',
      title: 'Đơn Vị',
      render: (value) => unitLabels[String(value)] || String(value),
    },
    {
      key: 'type',
      title: 'Trạng Thái',
      render: (value) => typeLabels[value as Service['type']] || String(value),
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: (_, service) => (
        <ActionButtons>
          <Button onClick={() => openEditServiceModal(service)} disabled={isSubmitting}>
            Sửa
          </Button>
          <Button variant="danger" onClick={() => handleDeleteService(service)} disabled={isSubmitting}>
            Xóa
          </Button>
        </ActionButtons>
      ),
    },
  ];

  const assignmentColumns: TableColumn<RoomService>[] = [
    {
      key: 'serviceId',
      title: 'Dịch Vụ',
      render: (_, row) => row.service?.name || row.serviceId,
    },
    {
      key: 'price',
      title: 'Đơn Giá',
      render: (_, row) => formatCurrency(row.service?.price),
    },
    {
      key: 'unit',
      title: 'Đơn Vị',
      render: (_, row) => row.service?.unit ? unitLabels[row.service.unit] || row.service.unit : '',
    },
    { key: 'quantity', title: 'Số Lượng' },
    {
      key: 'appliedDate',
      title: 'Ngày Áp Dụng',
      render: (value) => formatDate(value as Date),
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: (_, row) => (
        <ActionButtons>
          <Button variant="danger" onClick={() => handleRemoveFromRoom(row)} disabled={isSubmitting}>
            Gỡ
          </Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header title="Quản Lý Dịch Vụ" />

        <Toolbar>
          <Tabs>
            <TabButton $active={activeTab === 'services'} onClick={() => setActiveTab('services')}>
              Dịch vụ
            </TabButton>
            <TabButton $active={activeTab === 'assignments'} onClick={() => setActiveTab('assignments')}>
              Gán vào phòng
            </TabButton>
          </Tabs>
            {activeTab === 'services' && (
              <Button onClick={openCreateServiceModal} disabled={isSubmitting}>
                + Thêm Dịch Vụ
              </Button>
            )}
        </Toolbar>

        {activeTab === 'services' && (
          <Card>
            {serviceError && <p style={{ color: 'red' }}>Lỗi: {serviceError.message}</p>}
            <Table
              columns={serviceColumns}
              data={services}
              loading={loadingServices}
              emptyText="Chưa có dịch vụ nào"
            />
          </Card>
        )}

        {activeTab === 'assignments' && (
          <Card>
            <AssignmentControls>
              <FormGroup label="Chọn Phòng">
                <Select
                  value={selectedRoomId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedRoomId(e.target.value)}
                  options={roomOptions}
                  placeholder="Chọn phòng..."
                  disabled={loadingRooms || isSubmitting}
                />
              </FormGroup>
              <Button
                onClick={openAssignmentModal}
                disabled={isSubmitting || !selectedRoomId || assignableServices.length === 0}
              >
                Gán Dịch Vụ
              </Button>
            </AssignmentControls>

            {roomError && <p style={{ color: 'red' }}>Lỗi tải phòng: {roomError.message}</p>}
            {assignmentError && <p style={{ color: 'red' }}>Lỗi tải dịch vụ phòng: {assignmentError.message}</p>}
            <Table
              columns={assignmentColumns}
              data={assignedServices}
              loading={loadingAssignments}
              emptyText={selectedRoom ? 'Phòng này chưa được gán dịch vụ nào' : 'Chọn phòng để xem dịch vụ'}
            />
          </Card>
        )}

        <Modal
          isOpen={isServiceModalOpen}
          title={editingService ? 'Cập Nhật Dịch Vụ' : 'Thêm Dịch Vụ'}
          onClose={closeServiceModal}
          onConfirm={() => {
            handleSaveService({ preventDefault: () => undefined } as React.FormEvent);
          }}
          confirmText={editingService ? 'Lưu' : 'Tạo'}
          cancelText="Hủy"
        >
          <Form onSubmit={handleSaveService}>
            <FormGroup label="Tên Dịch Vụ" required>
              <Input
                type="text"
                value={serviceForm.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                placeholder="Ví dụ: Internet, vệ sinh, gửi xe"
                disabled={isSubmitting}
              />
            </FormGroup>
            <FormGroup label="Đơn Giá" required>
              <Input
                type="number"
                value={serviceForm.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setServiceForm({ ...serviceForm, price: e.target.value })
                }
                min="0"
                disabled={isSubmitting}
              />
            </FormGroup>
            <FormGroup label="Đơn Vị" required>
              <Select
                value={serviceForm.unit}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setServiceForm({ ...serviceForm, unit: e.target.value })
                }
                options={unitOptions}
                placeholder="Chọn đơn vị..."
                disabled={isSubmitting}
              />
            </FormGroup>
            <FormGroup label="Loại Dịch Vụ" required>
              <Select
                value={serviceForm.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setServiceForm({ ...serviceForm, type: e.target.value })
                }
                options={[
                  { value: 'optional', label: 'Tùy chọn' },
                  { value: 'required', label: 'Bắt buộc' },
                ]}
                disabled={isSubmitting}
              />
            </FormGroup>
          </Form>
        </Modal>

        <Modal
          isOpen={isAssignmentModalOpen}
          title="Gán Dịch Vụ Vào Phòng"
          onClose={closeAssignmentModal}
          onConfirm={() => {
            handleAssignService({ preventDefault: () => undefined } as React.FormEvent);
          }}
          confirmText="Lưu"
          cancelText="Hủy"
        >
          <Form onSubmit={handleAssignService}>
            <FormGroup label="Phòng" required>
              <Select
                value={assignmentForm.roomId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAssignmentForm({ ...assignmentForm, roomId: e.target.value })
                }
                options={roomOptions}
                placeholder="Chọn phòng..."
                disabled
              />
            </FormGroup>
            <FormGroup label="Dịch Vụ" required>
              <Select
                value={assignmentForm.serviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAssignmentForm({ ...assignmentForm, serviceId: e.target.value })
                }
                options={serviceOptions}
                placeholder="Chọn dịch vụ..."
                disabled={isSubmitting}
              />
            </FormGroup>
            <FormGroup label="Số Lượng" required>
              <Input
                type="number"
                value={assignmentForm.quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAssignmentForm({ ...assignmentForm, quantity: e.target.value })
                }
                min="1"
                disabled={isSubmitting}
              />
            </FormGroup>
            <FormGroup label="Ngày Áp Dụng">
              <Input
                type="date"
                value={assignmentForm.appliedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAssignmentForm({ ...assignmentForm, appliedDate: e.target.value })
                }
                disabled={isSubmitting}
              />
            </FormGroup>
          </Form>
        </Modal>
      </Container>
    </PageWrapper>
  );
};
