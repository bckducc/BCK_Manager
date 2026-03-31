import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card, Modal } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import { Form, FormGroup, Input } from '../../components/Forms/Form';

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

export const UtilityManagement = () => {
  const [readings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns: TableColumn[] = [
    { key: 'roomNumber', title: 'Phòng' },
    { key: 'electricityReading', title: 'Chỉ Số Điện (kWh)' },
    { key: 'waterReading', title: 'Chỉ Số Nước (m³)' },
    { key: 'readingDate', title: 'Ngày Ghi' },
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
    <Container>
      <Header
        title="Quản Lý Điện Nước"
        actions={<Button onClick={() => setIsModalOpen(true)}>+ Nhập Chỉ Số</Button>}
      />
      <Card>
        <Table columns={columns} data={readings} emptyText="Chưa có ghi chỉ số nào" />
      </Card>

      <Modal
        isOpen={isModalOpen}
        title="Nhập Chỉ Số Điện Nước"
        onClose={() => setIsModalOpen(false)}
        confirmText="Lưu"
      >
        <Form onSubmit={(e) => {
          e.preventDefault();
          setIsModalOpen(false);
        }}>
          <FormGroup label="Phòng" required>
            <Input type="text" placeholder="Chọn phòng" />
          </FormGroup>
          <FormGroup label="Chỉ Số Điện (kWh)" required>
            <Input type="number" />
          </FormGroup>
          <FormGroup label="Chỉ Số Nước (m³)" required>
            <Input type="number" />
          </FormGroup>
        </Form>
      </Modal>
    </Container>
  );
};
