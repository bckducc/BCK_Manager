import { useState } from 'react';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import styles from './TenantManagement.module.css';

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
        <div className={styles.actions}>
          <Button>Xem Chi Tiết</Button>
          <Button variant="danger">Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Header
        title="Quản Lý Người Thuê"
        actions={<Button>+ Thêm Người Thuê</Button>}
      />
      <Card>
        <Table columns={columns} data={tenants} emptyText="Chưa có người thuê nào" />
      </Card>
    </div>
  );
};
