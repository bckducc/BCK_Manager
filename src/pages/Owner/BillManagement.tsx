import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card, Modal } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import { Form, FormGroup, Input, Select } from '../../components/Forms/Form';

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

export const BillManagement = () => {
  const [bills] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    roomNumber: '',
    month: '',
    totalAmount: '',
    status: '',
  });

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setFormData({ tenantName: '', roomNumber: '', month: '', totalAmount: '', status: '' });
  };

  const columns: TableColumn[] = [
    { key: 'billNumber', title: 'Mã HĐ' },
    { key: 'tenantName', title: 'Người Thuê' },
    { key: 'roomNumber', title: 'Phòng' },
    { key: 'month', title: 'Tháng' },
    { key: 'totalAmount', title: 'Tổng Tiền', render: (val) => `$${val}` },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (val) => {
        const colors: Record<string, string> = {
          draft: 'gray',
          issued: 'blue',
          paid: 'green',
          overdue: 'red',
        };
        return <span style={{ color: colors[val] || 'black' }}>{val}</span>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: () => (
        <ActionButtons>
          <Button>Xem</Button>
          <Button>In</Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header
          title="Quản Lý Hóa Đơn"
          actions={
            <Button onClick={() => setIsModalOpen(true)}>
              + Tạo Hóa Đơn
            </Button>
          }
        />
        <Card>
          <Table columns={columns} data={bills} emptyText="Chưa có hóa đơn nào" />
        </Card>

        <Modal
          isOpen={isModalOpen}
          title="Tạo Hóa Đơn Mới"
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleCreateBill({ preventDefault: () => {} } as React.FormEvent);
          }}
          confirmText="Tạo"
        >
          <Form onSubmit={handleCreateBill}>
            <FormGroup label="Người Thuê" required>
              <Input
                type="text"
                value={formData.tenantName}
                onChange={(e) =>
                  setFormData({ ...formData, tenantName: e.target.value })
                }
                placeholder="Chọn người thuê"
              />
            </FormGroup>
            <FormGroup label="Phòng" required>
              <Input
                type="text"
                value={formData.roomNumber}
                onChange={(e) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                placeholder="Chọn phòng"
              />
            </FormGroup>
            <FormGroup label="Tháng" required>
              <Input
                type="month"
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />
            </FormGroup>
            <FormGroup label="Tổng Tiền" required>
              <Input
                type="number"
                value={formData.totalAmount}
                onChange={(e) =>
                  setFormData({ ...formData, totalAmount: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup label="Trạng Thái" required>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={[
                  { value: 'draft', label: 'Nháp' },
                  { value: 'issued', label: 'Đã Phát Hành' },
                  { value: 'paid', label: 'Đã Thanh Toán' },
                  { value: 'overdue', label: 'Quá Hạn' },
                ]}
                placeholder="Chọn trạng thái..."
              />
            </FormGroup>
          </Form>
        </Modal>
      </Container>
    </PageWrapper>
  );
};
