import { Card, Header } from '../../components/Common';
import styles from './TenantDashboard.module.css';

export const TenantDashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Header title="Dashboard" />
      
      <div className={styles.grid}>
        <Card title="Thông Tin Phòng">
          <div className={styles.info}>
            <p><strong>Phòng:</strong> 101</p>
            <p><strong>Diện Tích:</strong> 30 m²</p>
            <p><strong>Giá Thuê:</strong> $500/tháng</p>
          </div>
        </Card>

        <Card title="Hóa Đơn Sắp Tới">
          <div className={styles.info}>
            <p><strong>Tổng Tiền:</strong> $550</p>
            <p><strong>Hạn Thanh Toán:</strong> 2024-04-10</p>
            <p><strong>Trạng Thái:</strong> Chưa thanh toán</p>
          </div>
        </Card>

        <Card title="Hợp Đồng">
          <div className={styles.info}>
            <p><strong>Ngày Bắt Đầu:</strong> 2024-01-15</p>
            <p><strong>Hạn Hợp Đồng:</strong> 2024-12-31</p>
            <p><strong>Trạng Thái:</strong> Còn hiệu lực</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
