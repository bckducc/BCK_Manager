import { useState } from 'react';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import styles from './ServiceManagement.module.css';

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
        <div className={styles.actions}>
          <Button>Sửa</Button>
          <Button variant="danger">Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Header
        title="Quản Lý Dịch Vụ"
        actions={<Button>+ Thêm Dịch Vụ</Button>}
      />
      <Card>
        <Table columns={columns} data={services} emptyText="Chưa có dịch vụ nào" />
      </Card>
    </div>
  );
};
