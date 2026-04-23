import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Modal } from '../../components/common';
import { Table } from '../../components/Table';
import { Form, FormGroup, Input, Select } from '../../components/forms/Form';

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

export const ServiceManagement = () => {
  const [services] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    type: '',
  });

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setFormData({ name: '', description: '', price: '', unit: '', type: '' });
  };

  const columns: TableColumn[] = [
    { key: 'name', title: 'Tên Dịch Vụ' },
    { key: 'description', title: 'Mô Tả' },
    { key: 'price', title: 'Giá', render: (val) => `$${val}` },
    { key: 'unit', title: 'Đơn Vị' },
    { key: 'type', title: 'Loại' },
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
          title="Quản Lý Dịch Vụ"
          actions={
            <Button onClick={() => setIsModalOpen(true)}>
              + Thêm Dịch Vụ
            </Button>
          }
        />
        <Card>
          <Table columns={columns} data={services} emptyText="Chưa có dịch vụ nào" />
        </Card>

        <Modal
          isOpen={isModalOpen}
          title="Thêm Dịch Vụ Mới"
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleAddService({ preventDefault: () => {} } as React.FormEvent);
          }}
          confirmText="Tạo"
        >
          <Form onSubmit={handleAddService}>
            <FormGroup label="Tên Dịch Vụ" required>
              <Input
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Wifi, Dọn vệ sinh"
              />
            </FormGroup>
            <FormGroup label="Mô Tả">
              <Input
                type="text"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup label="Giá" required>
              <Input
                type="number"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup label="Đơn Vị" required>
              <Select
                value={formData.unit}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                options={[
                  { value: 'month', label: 'Tháng' },
                  { value: 'person', label: 'Người' },
                  { value: 'time', label: 'Lần' },
                  { value: 'fixed', label: 'Cố định' },
                ]}
                placeholder="Chọn đơn vị..."
              />
            </FormGroup>
            <FormGroup label="Loại" required>
              <Select
                value={formData.type}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                options={[
                  { value: 'utilities', label: 'Tiện ích' },
                  { value: 'maintenance', label: 'Bảo trì' },
                  { value: 'cleaning', label: 'Vệ sinh' },
                  { value: 'other', label: 'Khác' },
                ]}
                placeholder="Chọn loại..."
              />
            </FormGroup>
          </Form>
        </Modal>
      </Container>
    </PageWrapper>
  );
};
