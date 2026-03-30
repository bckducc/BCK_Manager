import { useState } from 'react';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import styles from './BillManagement.module.css';

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
        <div className={styles.actions}>
          <Button>Xem</Button>
          <Button>In</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Header
        title="Quản Lý Hóa Đơn"
        actions={<Button>+ Tạo Hóa Đơn</Button>}
      />
      <Card>
        <Table columns={columns} data={bills} emptyText="Chưa có hóa đơn nào" />
      </Card>
    </div>
  );
};
