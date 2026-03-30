import { useState } from 'react';
import { Header, Button, Card } from '../../components/Common';
import styles from './OwnerDashboard.module.css';

export const OwnerDashboard = () => {
  const [stats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalTenants: 0,
    totalRevenue: 0,
  });

  return (
    <div className={styles.dashboard}>
      <Header
        title="Dashboard"
        actions={<Button>Tạo hóa đơn</Button>}
      />

      <div className={styles.statsGrid}>
        <Card title="Tổng Phòng">
          <div className={styles.statValue}>{stats.totalRooms}</div>
        </Card>
        <Card title="Phòng Đã Cho Thuê">
          <div className={styles.statValue}>{stats.occupiedRooms}</div>
        </Card>
        <Card title="Tổng Người Thuê">
          <div className={styles.statValue}>{stats.totalTenants}</div>
        </Card>
        <Card title="Lợi Tức/Tháng">
          <div className={styles.statValue}>
            ${stats.totalRevenue.toLocaleString()}
          </div>
        </Card>
      </div>

      <Card title="Quản Lý Nhanh" className={styles.quickActions}>
        <div className={styles.actionGrid}>
          <Button>Thêm Phòng</Button>
          <Button>Thêm Người Thuê</Button>
          <Button>Thêm Hợp Đồng</Button>
          <Button>Xem Hóa Đơn Chưa Thanh Toán</Button>
        </div>
      </Card>
    </div>
  );
};
