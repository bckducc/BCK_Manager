import type { TableColumn } from '../../components/Tables/Table';
import { Card, Header, Badge } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import styles from './Notifications.module.css';

export const Notifications = () => {
  const notifications: any[] = [];

  const columns: TableColumn[] = [
    { key: 'type', title: 'Loại', width: '100px' },
    { key: 'title', title: 'Tiêu Đề' },
    { key: 'message', title: 'Nội Dung' },
    { key: 'createdAt', title: 'Ngày' },
    {
      key: 'read',
      title: 'Trạng Thái',
      render: (val) => (
        <Badge variant={val ? 'success' : 'warning'}>
          {val ? 'Đã Đọc' : 'Chưa Đọc'}
        </Badge>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Header title="Thông Báo" />
      <Card>
        <Table 
          columns={columns} 
          data={notifications} 
          emptyText="Chưa có thông báo nào" 
        />
      </Card>
    </div>
  );
};
