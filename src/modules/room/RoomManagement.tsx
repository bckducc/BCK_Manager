import { useState, useEffect } from 'react';
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

export const RoomManagement = () => {
  const { isAuthenticated } = useAuth();
  const { data: responseData, loading, error, execute } = useFetch(() => roomService.getAll());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Record<string, unknown>[]>([]);
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
  }, [responseData]);

  useEffect(() => {
    if (isAuthenticated && !hasInitialized) {
      execute();
      setHasInitialized(true);
    }
  }, [isAuthenticated, hasInitialized, execute]);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomNumber || !formData.price || !formData.status) {
      alert('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const roomPayload = {
        room_number: formData.roomNumber,
        area: parseFloat(formData.area),
        floor: parseInt(formData.floor),
        price: parseFloat(formData.price),
        status: formData.status as 'available' | 'rented' | 'maintenance',
        description: formData.description,
      };

      let response: { success?: boolean };

      if (editingRoom && 'id' in editingRoom) {
        // Update existing room
        response = await roomService.update(String(editingRoom.id), roomPayload);
      } else {
        // Create new room
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

      <Card>
        {error && <p style={{ color: 'red' }}>Lỗi: {String(error)}</p>}
        <Table columns={columns} data={rooms as unknown as Record<string, string | number>[]} emptyText="Chưa có phòng nào" />
      </Card>

      <Modal
        isOpen={isModalOpen}
        title={editingRoom ? 'Cập Nhật Phòng' : 'Thêm Phòng Mới'}
        onClose={handleCloseModal}
        onConfirm={() => {
          handleAddRoom({ preventDefault: () => {} } as React.FormEvent);
        }}
        confirmText={editingRoom ? 'Cập Nhật' : 'Tạo'}
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
