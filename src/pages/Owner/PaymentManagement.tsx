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
  gap: ${theme.spacing.xl};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

  button {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

export const PaymentManagement = () => {
  const [payments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: TableColumn[] = [
    { key: 'billNumber', title: 'Mã HĐ' },
    { key: 'tenantName', title: 'Người Thuê' },
    { key: 'amount', title: 'Số Tiền', render: (val) => `$${val}` },
    { key: 'paymentDate', title: 'Ngày Thanh Toán' },
    { key: 'paymentMethod', title: 'Phương Thức' },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (val) => {
        const colors: Record<string, string> = {
          pending: 'orange',
          confirmed: 'green',
          failed: 'red',
        };
        return <span style={{ color: colors[val] || 'black' }}>{val}</span>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: () => (
        <ActionButtons>
          <Button>Xác Nhận</Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <Container>
      <Header
        title="Xác Nhận Thanh Toán"
        actions={<Button onClick={() => setIsModalOpen(true)}>+ Xác Nhận Thanh Toán</Button>}
      />
      <Card>
        <Table columns={columns} data={payments} emptyText="Chưa có thanh toán nào" />
      </Card>

      <Modal
        isOpen={isModalOpen}
        title="Xác Nhận Thanh Toán"
        onClose={() => setIsModalOpen(false)}
        confirmText="Xác Nhận"
      >
        <Form onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
        }}>
          <FormGroup label="Hóa Đơn" required>
            <Input type="text" placeholder="Chọn hóa đơn" />
          </FormGroup>
          <FormGroup label="Số Tiền" required>
            <Input type="number" />
          </FormGroup>
          <FormGroup label="Phương Thức Thanh Toán" required>
            <Select
              options={[
                { value: 'cash', label: 'Tiền Mặt' },
                { value: 'transfer', label: 'Chuyển Khoản' },
                { value: 'card', label: 'Thẻ' },
              ]}
            />
          </FormGroup>
          <FormGroup label="Ghi Chú">
            <Input type="text" />
          </FormGroup>
        </Form>
      </Modal>
    </Container>
  );
};