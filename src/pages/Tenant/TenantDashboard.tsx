import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Header } from '../../components/Common';

const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  p {
    margin: ${theme.spacing.sm} 0;
    color: ${theme.colors.textSecondary};

    strong {
      color: ${theme.colors.dark};
    }
  }
`;

export const TenantDashboard = () => {
  return (
    <Dashboard>
      <Header title="Dashboard" />
      
      <Grid>
        <Card title="Thông Tin Phòng">
          <InfoSection>
            <p><strong>Phòng:</strong> 101</p>
            <p><strong>Diện Tích:</strong> 30 m²</p>
            <p><strong>Giá Thuê:</strong> $500/tháng</p>
          </InfoSection>
        </Card>

        <Card title="Hóa Đơn Sắp Tới">
          <InfoSection>
            <p><strong>Tổng Tiền:</strong> $550</p>
            <p><strong>Hạn Thanh Toán:</strong> 2024-04-10</p>
            <p><strong>Trạng Thái:</strong> Chưa thanh toán</p>
          </InfoSection>
        </Card>

        <Card title="Hợp Đồng">
          <InfoSection>
            <p><strong>Ngày Bắt Đầu:</strong> 2024-01-15</p>
            <p><strong>Hạn Hợp Đồng:</strong> 2024-12-31</p>
            <p><strong>Trạng Thái:</strong> Còn hiệu lực</p>
          </InfoSection>
        </Card>
      </Grid>
    </Dashboard>
  );
};
