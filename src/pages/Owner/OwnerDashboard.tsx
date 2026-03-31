import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Header, Button, Card } from '../../components/Common';

const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const StatValue = styled.div`
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.primary};
  margin: ${theme.spacing.md} 0;
`;

const QuickActionsCard = styled(Card)`
  margin-top: ${theme.spacing.md};
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${theme.spacing.md};

  button {
    display: block;
    width: 100%;
  }
`;

export const OwnerDashboard = () => {
  const [stats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    totalTenants: 0,
    totalRevenue: 0,
  });

  return (
    <Dashboard>
      <Header
        title="Dashboard"
        actions={<Button>Tạo hóa đơn</Button>}
      />

      <StatsGrid>
        <Card title="Tổng Phòng">
          <StatValue>{stats.totalRooms}</StatValue>
        </Card>
        <Card title="Phòng Đã Cho Thuê">
          <StatValue>{stats.occupiedRooms}</StatValue>
        </Card>
        <Card title="Tổng Người Thuê">
          <StatValue>{stats.totalTenants}</StatValue>
        </Card>
        <Card title="Lợi Tức/Tháng">
          <StatValue>
            ${stats.totalRevenue.toLocaleString()}
          </StatValue>
        </Card>
      </StatsGrid>

      <QuickActionsCard title="Quản Lý Nhanh">
        <ActionGrid>
          <Button>Thêm Phòng</Button>
          <Button>Thêm Người Thuê</Button>
          <Button>Thêm Hợp Đồng</Button>
          <Button>Xem Hóa Đơn Chưa Thanh Toán</Button>
        </ActionGrid>
      </QuickActionsCard>
    </Dashboard>
  );
};
