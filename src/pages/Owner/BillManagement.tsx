import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card } from '../../components/Common';
import { Table } from '../../components/Tables/Table';

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

export const BillManagement = () => {
  const [bills] = useState([]);

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
    <Container>
      <Header
        title="Quản Lý Hóa Đơn"
        actions={<Button>+ Tạo Hóa Đơn</Button>}
      />
      <Card>
        <Table columns={columns} data={bills} emptyText="Chưa có hóa đơn nào" />
      </Card>
    </Container>
  );
};
