import { Card, Header } from '../../components/Common';
import styles from './MyRoom.module.css';

export const MyRoom = () => {
  return (
    <div className={styles.container}>
      <Header title="Phòng Của Tôi" />
      
      <Card title="Thông Tin Phòng">
        <div className={styles.roomInfo}>
          <div className={styles.field}>
            <label>Số Phòng</label>
            <span>101</span>
          </div>
          <div className={styles.field}>
            <label>Tầng</label>
            <span>1</span>
          </div>
          <div className={styles.field}>
            <label>Diện Tích</label>
            <span>30 m²</span>
          </div>
          <div className={styles.field}>
            <label>Giá Thuê/Tháng</label>
            <span>$500</span>
          </div>
          <div className={styles.field}>
            <label>Mô Tả</label>
            <span>Phòng rộng rãi, thoáng mát, có cửa sổ</span>
          </div>
          <div className={styles.field}>
            <label>Mô Tả</label>
            <span>Phòng rộng rãi, thoáng mát, có cửa sổ</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
