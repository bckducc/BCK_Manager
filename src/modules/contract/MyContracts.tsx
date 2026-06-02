import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Card, Header } from '../../components/common';
import { Table } from '../../components/Table';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const MyContracts = () => {
  const contracts: Record<string, unknown>[] = [];

  const columns: TableColumn<Record<string, unknown>>[] = [
    { key: 'id', title: 'Mã HĐ' },
    { key: 'startDate', title: 'Ngày Bắt Đầu' },
    { key: 'endDate', title: 'Ngày Kết Thúc' },
    { key: 'price', title: 'Giá Thuê', render: (value: unknown) => `$${value}` },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (value: unknown) => {
        const status = String(value);
        const colors: Record<string, string> = {
          active: 'green',
          expired: 'red',
          terminated: 'orange',
        };
        return <span style={{ color: colors[status] || 'black' }}>{status}</span>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: () => <a href="#">Tải Xuống</a>,
    },
  ];

  return (
    <Container>
      <Header title="Hợp Đồng Của Tôi" />
      <Card>
        <Table columns={columns} data={contracts} emptyText="Chưa có hợp đồng nào" />
      </Card>
    </Container>
  );
};
