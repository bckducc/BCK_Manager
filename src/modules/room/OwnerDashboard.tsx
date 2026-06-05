import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { roomService } from './roomService';
import type { Room } from './room.types';

const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  width: 100%;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md};
  }
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
  box-shadow: ${theme.shadow.lg};

  h1 {
    margin: 0 0 ${theme.spacing.xs} 0;
    font-size: ${theme.fontSize.xl};
    font-weight: ${theme.fontWeight.bold};
  }

  p {
    margin: 0;
    opacity: 0.9;
    font-size: ${theme.fontSize.base};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    h1 {
      font-size: ${theme.fontSize.lg};
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  width: 100%;

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.md};
  }
`;

interface StatCardStyledProps {
  borderColor?: string;
}

const StatCardStyled = styled.div<StatCardStyledProps>`
  padding: ${theme.spacing.lg};
  background: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.md};
  border-left: 4px solid ${(props) => props.borderColor || theme.colors.primary};
  transition: transform ${theme.transition.base}, box-shadow ${theme.transition.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadow.lg};
  }

  .stat-label {
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.textSecondary};
    margin-bottom: ${theme.spacing.sm};
    font-weight: ${theme.fontWeight.semibold};
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
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.textSecondary};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    .stat-value {
      font-size: ${theme.fontSize.lg};
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${theme.spacing.lg};
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const RoomStatusContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const RoomStatusItem = styled.div<{ status: string }>`
  padding: ${theme.spacing.md};
  background: ${(props) => {
    switch (props.status) {
      case 'rented':
        return theme.colors.successLight;
      case 'available':
        return theme.colors.infoLight;
      case 'maintenance':
        return theme.colors.warningLight;
      default:
        return theme.colors.lightBg;
    }
  }};
  border-radius: ${theme.radius.md};
  border: 1px solid ${theme.colors.borderLight};
  text-align: center;
  cursor: pointer;
  transition: all ${theme.transition.base};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadow.md};
  }

  .room-number {
    font-weight: ${theme.fontWeight.bold};
    font-size: ${theme.fontSize.base};
    margin-bottom: ${theme.spacing.xs};
    color: ${theme.colors.dark};
  }

  .room-price {
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.textSecondary};
    margin-bottom: ${theme.spacing.xs};
  }

  .room-status {
    font-size: ${theme.fontSize.sm};
  }
`;

const ActivityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ActivityItem = styled.div`
  padding: ${theme.spacing.md};
  background: ${theme.colors.lightBg};
  border-left: 3px solid ${theme.colors.primary};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.sm};

  .activity-time {
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSize.sm};
  }

  .activity-text {
    margin-top: ${theme.spacing.xs};
    color: ${theme.colors.dark};
  }
`;

const QuickActionBar = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
  margin-top: ${theme.spacing.md};
`;

const ActionButton = styled.button`
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  background: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  border-radius: ${theme.radius.md};
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
  transition: background ${theme.transition.base};

  &:hover {
    background: ${theme.colors.primaryDark};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
`;

export const OwnerDashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
    totalRevenue: 0,
    occupancyRate: 0,
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getAll();
        if (response.data && response.data.rooms) {
          const roomsData = response.data.rooms;
          setRooms(roomsData);
          
          const occupied = roomsData.filter((r: Room) => r.status === 'rented').length;
          const available = roomsData.filter((r: Room) => r.status === 'available').length;
          const maintenance = roomsData.filter((r: Room) => r.status === 'maintenance').length;
          const revenue = roomsData
            .filter((r: Room) => r.status === 'rented')
            .reduce((sum: number, r: Room) => sum + r.price, 0);

          setStats({
            totalRooms: roomsData.length,
            occupiedRooms: occupied,
            availableRooms: available,
            maintenanceRooms: maintenance,
            totalRevenue: revenue,
            occupancyRate: roomsData.length > 0 ? Math.round((occupied / roomsData.length) * 100) : 0,
          });
        }
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'rented':
        return 'success';
      case 'available':
        return 'info';
      case 'maintenance':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'rented':
        return 'Đã cho thuê';
      case 'available':
        return 'Trống';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Dashboard>
        <WelcomeSection>
          <h1>Bảng Điều Khiển</h1>
          <p>Đang tải dữ liệu...</p>
        </WelcomeSection>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <WelcomeSection>
        <h1>Bảng Điều Khiển Chủ Nhà</h1>
        <p>Quản lý {stats.totalRooms} phòng - Cập nhật {new Date().toLocaleDateString('vi-VN')}</p>
      </WelcomeSection>

      <StatsGrid>
        <StatCardStyled borderColor={theme.colors.primary}>
          <div className="stat-label">Tổng Số Phòng</div>
          <div className="stat-value">{stats.totalRooms}</div>
          <div className="stat-change">Tất cả phòng quản lý</div>
        </StatCardStyled>

        <StatCardStyled borderColor={theme.colors.success}>
          <div className="stat-label">Phòng Cho Thuê</div>
          <div className="stat-value">{stats.occupiedRooms}</div>
          <div className="stat-change">Chiếm {stats.occupancyRate}%</div>
        </StatCardStyled>

        <StatCardStyled borderColor={theme.colors.info}>
          <div className="stat-label">Phòng Trống</div>
          <div className="stat-value">{stats.availableRooms}</div>
          <div className="stat-change">Sẵn sàng cho thuê</div>
        </StatCardStyled>

        <StatCardStyled borderColor={theme.colors.warning}>
          <div className="stat-label">Bảo Trì</div>
          <div className="stat-value">{stats.maintenanceRooms}</div>
          <div className="stat-change">Đang sửa chữa</div>
        </StatCardStyled>

        <StatCardStyled borderColor={theme.colors.danger}>
          <div className="stat-label">Doanh Thu Hàng Tháng</div>
          <div className="stat-value">{stats.totalRevenue.toLocaleString('vi-VN')} ₫</div>
          <div className="stat-change">Từ phòng cho thuê</div>
        </StatCardStyled>
      </StatsGrid>

      <ContentGrid>
        <Card title="🏠 Trạng Thái Phòng Hiện Tại">
          {rooms.length > 0 ? (
            <div>
              <RoomStatusContainer>
                {rooms.map((room) => (
                  <RoomStatusItem key={room.id} status={room.status}>
                    <div className="room-number">Phòng {room.roomNumber || room.room_number}</div>
                    <div className="room-price">{room.price.toLocaleString('vi-VN')} ₫</div>
                    <Badge variant={getStatusBadgeVariant(room.status)}>
                      {getStatusText(room.status)}
                    </Badge>
                  </RoomStatusItem>
                ))}
              </RoomStatusContainer>
            </div>
          ) : (
            <EmptyState>Không có phòng nào</EmptyState>
          )}
          <QuickActionBar>
            <ActionButton>➕ Thêm Phòng Mới</ActionButton>
            <ActionButton>📊 Xem Chi Tiết</ActionButton>
          </QuickActionBar>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
          <Card title="⚡ Hành Động Nhanh">
            <QuickActionBar style={{ marginTop: 0, flexDirection: 'column', gap: theme.spacing.md }}>
              <ActionButton style={{ width: '100%' }}>📋 Quản Lý Hợp Đồng</ActionButton>
              <ActionButton style={{ width: '100%' }}>💰 Quản Lý Hóa Đơn</ActionButton>
              <ActionButton style={{ width: '100%' }}>👥 Quản Lý Người Thuê</ActionButton>
              <ActionButton style={{ width: '100%' }}>🔧 Quản Lý Dịch Vụ</ActionButton>
              {/* <ActionButton style={{ width: '100%' }}>❤️ Quản Lý Elm</ActionButton> */}
            </QuickActionBar>
          </Card>

          <Card title="📢 Hoạt Động Gần Đây">
            <ActivityList>
              <ActivityItem>
                <div className="activity-text">✅ Phòng 101 đã được cho thuê</div>
                <div className="activity-time">2 giờ trước</div>
              </ActivityItem>
              <ActivityItem>
                <div className="activity-text">💰 Hóa đơn tháng 6 đã thanh toán</div>
                <div className="activity-time">5 giờ trước</div>
              </ActivityItem>
              <ActivityItem>
                <div className="activity-text">🔔 Phòng 305 cần bảo trì</div>
                <div className="activity-time">1 ngày trước</div>
              </ActivityItem>
            </ActivityList>
          </Card>
        </div>
      </ContentGrid>
    </Dashboard>
  );
};
