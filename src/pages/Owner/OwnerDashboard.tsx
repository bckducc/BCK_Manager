import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button, Card } from '../../components/Common';
import {
  AppstoreOutlined,
  TeamOutlined,
  FileProtectOutlined,
  CreditCardOutlined,
  AlertOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};

  width: 100%;
  max-width: 100%;

  padding: ${theme.spacing.lg};
`;

const WelcomeSection = styled.div`
  padding: ${theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.primaryDark} 100%
  );

  border-radius: ${theme.radius.md};
  color: ${theme.colors.white};

  h1 {
    margin: 0 0 ${theme.spacing.xs} 0;
    font-size: ${theme.fontSize.xl};
    font-weight: ${theme.fontWeight.bold};
  }

  p {
    margin: 0;
    opacity: 0.9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(Card)`
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transition: all ${theme.transition.base};
  cursor: pointer;
  padding: ${theme.spacing.md} !important;

  &:hover {
    box-shadow: ${theme.shadow.lg};
    transform: translateY(-2px);
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${theme.spacing.sm};

    .stat-icon {
      font-size: 28px;
      color: ${theme.colors.primary};
      opacity: 0.7;
    }
  }

  .stat-label {
    font-size: 0.75rem;
    color: ${theme.colors.textSecondary};
    font-weight: ${theme.fontWeight.semibold};
    margin-bottom: ${theme.spacing.xs};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: ${theme.fontSize.xl};
    font-weight: ${theme.fontWeight.bold};
    color: ${theme.colors.dark};
    margin-bottom: ${theme.spacing.xs};
  }

  .stat-change {
    font-size: 0.75rem;
    color: ${theme.colors.success};
  }
`;

const QuickActionsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled(Card)`
  transition: all ${theme.transition.base};

  &:hover {
    box-shadow: ${theme.shadow.lg};
  }
`;

const ActionCardTitle = styled.div`
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.bold};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.dark};
`;

const ActionButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }

  button {
    width: 100%;
    padding: 0.625rem 1rem !important;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.xs};
    font-size: 0.875rem;
  }
`;

const AlertSection = styled(Card)`
  background-color: #fffbf0;
  border-left: 4px solid ${theme.colors.warning};
  margin-bottom: 0;
  margin-left: ${theme.spacing.lg};
  margin-right: ${theme.spacing.lg};

  .alert-header {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};

    .alert-icon {
      font-size: 20px;
      color: ${theme.colors.warning};
    }

    h3 {
      margin: 0;
      font-size: ${theme.fontSize.base};
      color: ${theme.colors.dark};
      font-weight: ${theme.fontWeight.bold};
    }
  }

  .alert-content {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.sm};
    line-height: 1.6;
  }
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(Card)`
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.sm} 0;
    border-bottom: 1px solid ${theme.colors.borderLight};

    &:last-child {
      border-bottom: none;
    }

    .info-label {
      color: ${theme.colors.textSecondary};
      font-size: ${theme.fontSize.sm};
    }

    .info-value {
      font-weight: ${theme.fontWeight.bold};
      color: ${theme.colors.dark};
      font-size: ${theme.fontSize.sm};
    }
  }
`;

export const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    totalRooms: 8,
    occupiedRooms: 6,
    totalTenants: 12,
    totalRevenue: 24000,
  });

  const occupancyRate = Math.round((stats.occupiedRooms / stats.totalRooms) * 100);
  const emptyRooms = stats.totalRooms - stats.occupiedRooms;

  return (
    <Dashboard>
      <WelcomeSection>
        <h1>Xin chào, Owner! 👋</h1>
        <p>Quản lý chung cư của bạn một cách hiệu quả</p>
      </WelcomeSection>

      <StatsGrid>
        <StatCard>
          <div className="stat-header">
            <div>
              <div className="stat-label">Tổng Phòng</div>
              <div className="stat-value">{stats.totalRooms}</div>
            </div>
            <div className="stat-icon">
              <AppstoreOutlined />
            </div>
          </div>
          <div className="stat-change">✓ Quản lý tất cả</div>
        </StatCard>

        <StatCard>
          <div className="stat-header">
            <div>
              <div className="stat-label">Phòng Đã Cho Thuê</div>
              <div className="stat-value">{stats.occupiedRooms}</div>
            </div>
            <div className="stat-icon">
              <TeamOutlined />
            </div>
          </div>
          <div className="stat-change">→ {occupancyRate}% lấp đầy</div>
        </StatCard>

        <StatCard>
          <div className="stat-header">
            <div>
              <div className="stat-label">Người Thuê</div>
              <div className="stat-value">{stats.totalTenants}</div>
            </div>
            <div className="stat-icon">
              <TeamOutlined />
            </div>
          </div>
          <div className="stat-change">✓ Hoạt động</div>
        </StatCard>

        <StatCard>
          <div className="stat-header">
            <div>
              <div className="stat-label">Doanh Thu/Tháng</div>
              <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
            </div>
            <div className="stat-icon">
              <CreditCardOutlined />
            </div>
          </div>
          <div className="stat-change">✓ Ổn định</div>
        </StatCard>
      </StatsGrid>

      {emptyRooms > 0 && (
        <AlertSection>
          <div className="alert-header">
            <div className="alert-icon">
              <AlertOutlined />
            </div>
            <h3>Phòng Trống Cần Chú Ý</h3>
          </div>
          <div className="alert-content">
            Bạn có <strong>{emptyRooms}</strong> phòng trống. Hãy xem xét quảng bá hoặc giảm giá để thu hút người thuê.
          </div>
        </AlertSection>
      )}

      <QuickActionsSection>
        <ActionCard>
          <ActionCardTitle>Quản Lý Phòng & Hợp Đồng</ActionCardTitle>
          <ActionButtonGrid>
            <Button onClick={() => navigate('/owner/rooms')}>
              <AppstoreOutlined /> Phòng
            </Button>
            <Button onClick={() => navigate('/owner/tenants')}>
              <TeamOutlined /> Người Thuê
            </Button>
            <Button onClick={() => navigate('/owner/contracts')}>
              <FileProtectOutlined /> Hợp Đồng
            </Button>
            <Button onClick={() => navigate('/owner/services')}>
              <ArrowRightOutlined /> Dịch Vụ
            </Button>
          </ActionButtonGrid>
        </ActionCard>

        <ActionCard>
          <ActionCardTitle>Tài Chính & Thanh Toán</ActionCardTitle>
          <ActionButtonGrid>
            <Button onClick={() => navigate('/owner/bills')}>
              <FileProtectOutlined /> Hóa Đơn
            </Button>
            <Button onClick={() => navigate('/owner/payments')}>
              <CreditCardOutlined /> Thanh Toán
            </Button>
            <Button onClick={() => navigate('/owner/utilities')}>
              <ArrowRightOutlined /> Dịch Vụ
            </Button>
            <Button variant="primary">
              <CreditCardOutlined /> Báo Cáo
            </Button>
          </ActionButtonGrid>
        </ActionCard>
      </QuickActionsSection>

      <TwoColumnLayout>
        <InfoCard title="Thống Kê Nhanh">
          <div className="info-item">
            <span className="info-label">Tỷ lệ lấp đầy:</span>
            <span className="info-value">{occupancyRate}%</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phòng trống:</span>
            <span className="info-value">{emptyRooms}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Trung bình/phòng:</span>
            <span className="info-value">${stats.totalTenants > 0 ? Math.round(stats.totalRevenue / stats.totalTenants) : 0}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Trạng thái:</span>
            <span className="info-value" style={{ color: '#27ae60' }}>✓ Bình thường</span>
          </div>
        </InfoCard>

        <InfoCard title="Hành Động Nhanh">
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.md }}>
            <Button variant="primary" fullWidth>
              Tạo Hóa Đơn
            </Button>
            <Button fullWidth>
              Xuất hóa đơn
            </Button>
            <Button fullWidth>
              Xuất Báo Cáo
            </Button>
          </div>
        </InfoCard>
      </TwoColumnLayout>
    </Dashboard>
  );
};
