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

export const ServiceManagement = () => {
  const [services] = useState([]);

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
        actions={<Button>+ Thêm Dịch Vụ</Button>}
      />
      <Card>
        <Table columns={columns} data={services} emptyText="Chưa có dịch vụ nào" />
      </Card>
    </Container>
    </PageWrapper>
  );
};
