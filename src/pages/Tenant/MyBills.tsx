import type { TableColumn } from '../../components/Tables/Table';
import { Card, Header, Badge } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import styles from './MyBills.module.css';

export const MyBills = () => {
  const bills: any[] = [];

  const columns: TableColumn[] = [
    { key: 'billNumber', title: 'Mã HĐ' },
    { key: 'month', title: 'Tháng' },
    { key: 'totalAmount', title: 'Tổng Tiền', render: (val) => `$${val}` },
    { key: 'dueDate', title: 'Hạn Thanh Toán' },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (val) => {
        const variants: Record<string, any> = {
          draft: 'info',
          issued: 'warning',
          paid: 'success',
          overdue: 'danger',
        };
        return <Badge variant={variants[val] || 'info'}>{val}</Badge>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: () => <a href="#">Xem Chi Tiết</a>,
    },
  ];

  return (
    <div className={styles.container}>
      <Header title="Hóa Đơn Của Tôi" />
      <Card>
        <Table columns={columns} data={bills} emptyText="Chưa có hóa đơn nào" />
      </Card>
    </div>
  );
};
