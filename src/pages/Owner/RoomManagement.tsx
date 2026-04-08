import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card, Modal } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import { Form, FormGroup, Input, Select } from '../../components/Forms/Form';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { roomService } from '../../services';

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
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

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
      // Handle direct array response: [...]
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
  }, [isAuthenticated, hasInitialized]);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.roomNumber || !formData.price || !formData.status) {
      alert('Vui lòng điền tất cả các trường bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await roomService.create({
        room_number: formData.roomNumber,
        area: parseFloat(formData.area),
        floor: parseInt(formData.floor),
        price: parseFloat(formData.price),
        status: formData.status as 'available' | 'rented' | 'maintenance',
        description: formData.description,
      });

      if (response.success) {
        await execute();
        setIsModalOpen(false);
        setFormData({
          roomNumber: '',
          area: '',
          floor: '',
          price: '',
          status: '',
          description: '',
        });
        alert('Tạo phòng thành công');
      }
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể tạo phòng'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: TableColumn[] = [
    { key: 'room_number', title: 'Số Phòng' },
    { key: 'area', title: 'Diện Tích (m²)' },
    { key: 'floor', title: 'Tầng' },
    { key: 'price', title: 'Giá Thuê/Tháng', render: (val) => `${val.toLocaleString()}đ` },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (val) => {
        const statusLabels: Record<string, string> = {
          available: 'Còn trống',
          rented: 'Đã cho thuê',
          maintenance: 'Bảo trì',
        };
        return <span style={{ color: val === 'available' ? 'green' : val === 'rented' ? 'orange' : 'red' }}>{statusLabels[val] || val}</span>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: () => (
        <ActionButtons>
          <Button>Sửa</Button>
          <Button variant="danger">Xóa</Button>
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
        title="Thêm Phòng Mới"
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          handleAddRoom({ preventDefault: () => {} } as React.FormEvent);
        }}
        confirmText="Tạo"
      >
        <Form onSubmit={handleAddRoom}>
          <FormGroup label="Số Phòng" required>
            <Input
              type="text"
              value={formData.roomNumber}
              onChange={(e) =>
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
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Tầng" required>
            <Input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Giá Thuê/Tháng (VNĐ)" required>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              disabled={isSubmitting}
            />
          </FormGroup>
          <FormGroup label="Trạng thái phòng" required>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              onChange={(e) =>
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
