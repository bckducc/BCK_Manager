import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Card, Header, Badge } from '../../components/common';
import { Table } from '../../components/Table';

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

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

export const Notifications = () => {
  const notifications: Record<string, unknown>[] = [];

  const columns: TableColumn<Record<string, unknown>>[] = [
    { key: 'type', title: 'Loại', width: '100px' },
    { key: 'title', title: 'Tiêu Đề' },
    { key: 'message', title: 'Nội Dung' },
    { key: 'createdAt', title: 'Ngày' },
    {
      key: 'read',
      title: 'Trạng Thái',
      render: (value: unknown) => (
        <Badge variant={value ? 'success' : 'warning'}>
          {value ? 'Đã Đọc' : 'Chưa Đọc'}
        </Badge>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header title="Thông Báo" />
        <Card>
          <Table
            columns={columns}
            data={notifications}
            emptyText="Chưa có thông báo nào"
          />
        </Card>
      </Container>
    </PageWrapper>
  );
};
