import { useState, useEffect, useMemo } from 'react';
import { Pagination } from 'antd';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Modal } from '../../components/common';
import { Table } from '../../components/Table';
import { Form, FormGroup, Input, Select } from '../../components/Forms/Form';
import { useAuth } from '../auth/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { roomService } from './roomService';

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

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  button {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

const StatusSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(140px, 1fr));
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div<{ $tone?: 'available' | 'rented' | 'maintenance' }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-left: 4px solid
    ${({ $tone }) =>
      $tone === 'available'
        ? theme.colors.success
        : $tone === 'rented'
          ? theme.colors.warning
          : $tone === 'maintenance'
            ? theme.colors.danger
            : theme.colors.primary};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow.sm};
`;

const SummaryLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const SummaryValue = styled.div`
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  margin-top: ${theme.spacing.xs};
`;

export const RoomManagement = () => {
  const { isAuthenticated } = useAuth();
  const { data: responseData, loading, error, execute } = useFetch(() => roomService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Record<string, unknown>[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;
  const [hasInitialized, setHasInitialized] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    area: '',
    floor: '',
    price: '',
    status: '',
    description: '',
  });

  useEffect(() => {
    if (responseData) {
      const dataObj = responseData as Record<string, unknown>;
      
      if (dataObj.rooms && Array.isArray(dataObj.rooms)) {
        setRooms(dataObj.rooms);
      } 
      else if (Array.isArray(responseData)) {
        setRooms(responseData as Record<string, unknown>[]);
      }
      else {
        setRooms([]);
      }
    }
    // reset to first page when full list changes
    setCurrentPage(1);
  }, [responseData]);

  useEffect(() => {
    if (isAuthenticated && !hasInitialized) {
      execute();
      setHasInitialized(true);
    }
  }, [isAuthenticated, hasInitialized, execute]);

  const getRoomNumber = (room: Record<string, unknown>) => String(room.room_number || room.roomNumber || '').trim();

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    const roomNumber = formData.roomNumber.trim();
    const area = Number(formData.area);
    const floor = Number(formData.floor);
    const price = Number(formData.price);

    if (!roomNumber || !formData.area || !formData.floor || !formData.price || !formData.status) {
      alert('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    if (!Number.isFinite(area) || area <= 0) {
      alert('Diện tích phòng phải lớn hơn 0');
      return;
    }

    if (!Number.isFinite(floor) || floor < 0) {
      alert('Tầng phải là số không âm');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      alert('Giá thuê phải lớn hơn 0');
      return;
    }

    const duplicatedRoom = rooms.some((room) => {
      const isEditingSameRoom = editingRoom && String(room.id) === String(editingRoom.id);
      return !isEditingSameRoom && getRoomNumber(room).toLowerCase() === roomNumber.toLowerCase();
    });

    if (duplicatedRoom) {
      alert('Số phòng đã tồn tại');
      return;
    }

    setIsSubmitting(true);
    try {
      const roomPayload = {
        room_number: roomNumber,
        area,
        floor,
        price,
        status: formData.status as 'available' | 'rented' | 'maintenance',
        description: formData.description.trim(),
      };

      let response: { success?: boolean };

      if (editingRoom && 'id' in editingRoom) {
        response = await roomService.update(String(editingRoom.id), roomPayload);
      } else {
        response = await roomService.create(roomPayload);
      }

      if (response.success) {
        await execute();
        setIsModalOpen(false);
        setEditingRoom(null);
        setFormData({
          roomNumber: '',
          area: '',
          floor: '',
          price: '',
          status: '',
          description: '',
        });
        alert(editingRoom ? 'Cập nhật phòng thành công' : 'Tạo phòng thành công');
      }
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể lưu phòng'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditRoom = (room: Record<string, unknown>) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: String(room.room_number || ''),
      area: String(room.area || ''),
      floor: String(room.floor || ''),
      price: String(room.price || ''),
      status: String(room.status || ''),
      description: String(room.description || ''),
    });
    setIsModalOpen(true);
  };

  const handleDeleteRoom = async (room: Record<string, unknown>) => {
    if (String(room.status) === 'rented') {
      alert('Không thể xóa phòng đang có người thuê');
      return;
    }

    if (!window.confirm(`Bạn có chắc chắn muốn xóa phòng ${room.room_number}?`)) {
      return;
    }

    try {
      const response = await roomService.delete(String(room.id));
      if (response.success) {
        await execute();
        alert('Xóa phòng thành công');
      }
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể xóa phòng'}`);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      area: '',
      floor: '',
      price: '',
      status: '',
      description: '',
    });
  };

  const roomStats = rooms.reduce<{ total: number; available: number; rented: number; maintenance: number }>(
    (stats, room) => {
      const status = String(room.status || '');
      stats.total += 1;
      if (status === 'available') stats.available += 1;
      if (status === 'rented') stats.rented += 1;
      if (status === 'maintenance') stats.maintenance += 1;
      return stats;
    },
    { total: 0, available: 0, rented: 0, maintenance: 0 }
  );

  const totalPages = Math.max(1, Math.ceil(rooms.length / PAGE_SIZE));
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedRooms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return rooms.slice(start, start + PAGE_SIZE);
  }, [rooms, currentPage]);

  const columns: TableColumn<Record<string, unknown>>[] = [
    { key: 'room_number', title: 'Số Phòng' },
    { key: 'area', title: 'Diện Tích (m²)' },
    { key: 'floor', title: 'Tầng' },
    { key: 'price', title: 'Giá Thuê/Tháng', render: (val: unknown) => `${(val as number).toLocaleString()}đ` },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (val: unknown) => {
        const statusLabels: Record<string, string> = {
          available: 'Còn trống',
          rented: 'Đã cho thuê',
          maintenance: 'Bảo trì',
        };
        const statusStr = val as string;
        return <span style={{ color: statusStr === 'available' ? 'green' : statusStr === 'rented' ? 'orange' : 'red' }}>{statusLabels[statusStr] || statusStr}</span>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: (_, row) => (
        <ActionButtons>
          <Button onClick={() => handleEditRoom(row as Record<string, unknown>)}>Sửa</Button>
          <Button variant="danger" onClick={() => handleDeleteRoom(row as Record<string, unknown>)}>Xóa</Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header
        title="Quản Lý Phòng"
        actions={
          <Button onClick={() => setIsModalOpen(true)} disabled={loading}>
            + Thêm Phòng
          </Button>
        }
      />

      <StatusSummary>
        <SummaryItem>
          <SummaryLabel>Tổng số phòng</SummaryLabel>
          <SummaryValue>{roomStats.total}</SummaryValue>
        </SummaryItem>
        <SummaryItem $tone="available">
          <SummaryLabel>Còn trống</SummaryLabel>
          <SummaryValue>{roomStats.available}</SummaryValue>
        </SummaryItem>
        <SummaryItem $tone="rented">
          <SummaryLabel>Đã cho thuê</SummaryLabel>
          <SummaryValue>{roomStats.rented}</SummaryValue>
        </SummaryItem>
        <SummaryItem $tone="maintenance">
          <SummaryLabel>Bảo trì</SummaryLabel>
          <SummaryValue>{roomStats.maintenance}</SummaryValue>
        </SummaryItem>
      </StatusSummary>

      <Card>
        {error && <p style={{ color: 'red' }}>Lỗi: {String(error)}</p>}
        <Table columns={columns} data={pagedRooms as unknown as Record<string, string | number>[]} emptyText="Chưa có phòng nào" />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={rooms.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showQuickJumper
          />
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        title={editingRoom ? 'Cập Nhật Phòng' : 'Thêm Phòng Mới'}
        onClose={handleCloseModal}
        onConfirm={() => {
          handleAddRoom({ preventDefault: () => {} } as React.FormEvent);
        }}
        confirmText={editingRoom ? 'Cập Nhật' : 'Tạo'}
        cancelText="Hủy"
      >
        <Form onSubmit={handleAddRoom}>
          <FormGroup label="Số Phòng" required>
            <Input
              type="text"
              value={formData.roomNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, roomNumber: e.target.value })
              }
              placeholder="Ví dụ: 101"
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Diện Tích (m²)" required>
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={formData.area}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, area: e.target.value })
              }
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Tầng" required>
            <Input
              type="number"
              min="0"
              step="1"
              value={formData.floor}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, floor: e.target.value })
              }
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Giá Thuê/Tháng (VNĐ)" required>
            <Input
              type="number"
              min="1"
              step="1000"
              value={formData.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, price: e.target.value })
              }
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Trạng thái phòng" required>
            <Select
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, status: e.target.value })
              }
              options={[
                { value: '', label: 'Chọn trạng thái...' },
                { value: 'available', label: 'Còn trống' },
                { value: 'rented', label: 'Đã cho thuê' },
                { value: 'maintenance', label: 'Bảo trì' },
              ]}
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Mô Tả">
            <Input
              type="text"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, description: e.target.value })
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
