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

export const TenantManagement = () => {
  const [tenants] = useState([]);

  const columns: TableColumn[] = [
    { key: 'name', title: 'Tên Người Thuê' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Điện Thoại' },
    { key: 'roomNumber', title: 'Phòng' },
    { key: 'leaseStart', title: 'Ngày Bắt Đầu' },
    {
      key: 'actions',
      title: 'Hành Động',
      render: () => (
        <ActionButtons>
          <Button>Xem Chi Tiết</Button>
          <Button variant="danger">Xóa</Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header
          title="Quản Lý Người Thuê"
          actions={<Button>+ Thêm Người Thuê</Button>}
        />
        <Card>
          <Table columns={columns} data={tenants} emptyText="Chưa có người thuê nào" />
        </Card>
      </Container>
    </PageWrapper>
  );
};
