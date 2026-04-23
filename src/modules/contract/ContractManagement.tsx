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

export const ContractManagement = () => {
  const [contracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tenantName: '',
    roomNumber: '',
    startDate: '',
    endDate: '',
    rentAmount: '',
    status: '',
  });

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    setFormData({ tenantName: '', roomNumber: '', startDate: '', endDate: '', rentAmount: '', status: '' });
  };

  const columns: TableColumn[] = [
    { key: 'id', title: 'Mã HĐ' },
    { key: 'tenantName', title: 'Người Thuê' },
    { key: 'roomNumber', title: 'Phòng' },
    { key: 'startDate', title: 'Ngày Bắt Đầu' },
    { key: 'endDate', title: 'Ngày Kết Thúc' },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (val) => {
        const colors: Record<string, string> = {
          active: 'green',
          expired: 'red',
          terminated: 'orange',
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
          <Button variant="danger">Xóa</Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header
          title="Quản Lý Hợp Đồng"
          actions={
            <Button onClick={() => setIsModalOpen(true)}>
              + Tạo Hợp Đồng
            </Button>
          }
        />
        <Card>
          <Table columns={columns} data={contracts} emptyText="Chưa có hợp đồng nào" />
        </Card>

        <Modal
          isOpen={isModalOpen}
          title="Tạo Hợp Đồng Mới"
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleCreateContract({ preventDefault: () => {} } as React.FormEvent);
          }}
          confirmText="Tạo"
        >
          <Form onSubmit={handleCreateContract}>
            <FormGroup label="Người Thuê" required>
              <Input
                type="text"
                value={formData.tenantName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, tenantName: e.target.value })
                }
                placeholder="Chọn người thuê"
              />
            </FormGroup>
            <FormGroup label="Phòng" required>
              <Input
                type="text"
                value={formData.roomNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, roomNumber: e.target.value })
                }
                placeholder="Chọn phòng"
              />
            </FormGroup>
            <FormGroup label="Ngày Bắt Đầu" required>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup label="Ngày Kết Thúc" required>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup label="Tiền Thuê Tháng" required>
              <Input
                type="number"
                value={formData.rentAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, rentAmount: e.target.value })
                }
              />
            </FormGroup>
            <FormGroup label="Trạng Thái" required>
              <Select
                value={formData.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                options={[
                  { value: 'active', label: 'Còn Hiệu Lực' },
                  { value: 'expired', label: 'Hết Hiệu Lực' },
                  { value: 'terminated', label: 'Đã Chấm Dứt' },
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
