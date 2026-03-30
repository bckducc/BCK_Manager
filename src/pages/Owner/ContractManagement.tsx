import { useState } from 'react';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import styles from './ContractManagement.module.css';

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
        <div className={styles.actions}>
          <Button>Xem</Button>
          <Button variant="danger">Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Header
        title="Quản Lý Hợp Đồng"
        actions={<Button>+ Tạo Hợp Đồng</Button>}
      />
      <Card>
        <Table columns={columns} data={contracts} emptyText="Chưa có hợp đồng nào" />
      </Card>
    </div>
  );
};
