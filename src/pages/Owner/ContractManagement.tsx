import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card } from '../../components/Common';
import { Table } from '../../components/Tables/Table';

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
        actions={<Button>+ Tạo Hợp Đồng</Button>}
      />
      <Card>
        <Table columns={columns} data={contracts} emptyText="Chưa có hợp đồng nào" />
      </Card>
    </Container>
    </PageWrapper>
  );
};
