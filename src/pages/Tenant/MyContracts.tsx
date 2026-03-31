import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Card, Header } from '../../components/Common';
import { Table } from '../../components/Tables/Table';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

export const MyContracts = () => {
  const contracts: any[] = [];

  const columns: TableColumn[] = [
    { key: 'id', title: 'Mã HĐ' },
    { key: 'startDate', title: 'Ngày Bắt Đầu' },
    { key: 'endDate', title: 'Ngày Kết Thúc' },
    { key: 'price', title: 'Giá Thuê', render: (val) => `$${val}` },
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
