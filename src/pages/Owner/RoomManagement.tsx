import { useState } from 'react';
import type { Room } from '../../types';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card, Modal } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import { Form, FormGroup, Input } from '../../components/Forms/Form';
import styles from './RoomManagement.module.css';

export const RoomManagement = () => {
  const [rooms] = useState<Room[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: '',
    area: '',
    floor: '',
    price: '',
    description: '',
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add room logic
    setIsModalOpen(false);
    setFormData({ roomNumber: '', area: '', floor: '', price: '', description: '' });
  };

  const columns: TableColumn[] = [
    { key: 'roomNumber', title: 'Số Phòng' },
    { key: 'area', title: 'Diện Tích (m²)' },
    { key: 'floor', title: 'Tầng' },
    { key: 'price', title: 'Giá Thuê/Tháng', render: (val) => `$${val}` },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (val) => <span style={{ color: val === 'available' ? 'green' : 'red' }}>{val}</span>,
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: () => (
        <div className={styles.actions}>
          <Button>Sửa</Button>
          <Button variant="danger">Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Header
        title="Quản Lý Phòng"
        actions={
          <Button onClick={() => setIsModalOpen(true)}>
            + Thêm Phòng
          </Button>
        }
      />

      <Card>
        <Table columns={columns} data={rooms} emptyText="Chưa có phòng nào" />
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
            />
          </FormGroup>
          <FormGroup label="Diện Tích (m²)" required>
            <Input
              type="number"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Tầng" required>
            <Input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Giá Thuê/Tháng" required>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </FormGroup>
          <FormGroup label="Mô Tả">
            <Input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </FormGroup>
        </Form>
      </Modal>
    </div>
  );
};
