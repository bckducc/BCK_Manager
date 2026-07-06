import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  TeamOutlined,
  ToolOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { theme } from '../../styles/theme';
import { Header } from '../../components/common';
import { DATA_CHANGED_EVENT } from '../../services/apiClient';
import { dashboardService, type RecentInvoice } from '../../services/dashboardService';
import type { Room } from './room.types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow.sm};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  min-width: 0;
  padding: ${theme.spacing.lg};
  border-right: 1px solid ${theme.colors.borderLight};

  &:last-child {
    border-right: 0;
  }

  @media (max-width: ${theme.breakpoints.desktop}) and (min-width: 641px) {
    &:nth-child(2) {
      border-right: 0;
    }

    &:nth-child(-n + 2) {
      border-bottom: 1px solid ${theme.colors.borderLight};
    }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-right: 0;
    border-bottom: 1px solid ${theme.colors.borderLight};

    &:last-child {
      border-bottom: 0;
    }
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};

  svg {
    color: ${theme.colors.primary};
    font-size: 17px;
  }
`;

const StatValue = styled.div<{ $alert?: boolean }>`
  margin-top: ${theme.spacing.sm};
  color: ${({ $alert }) => ($alert ? theme.colors.dangerDark : theme.colors.dark)};
  font-size: 1.7rem;
  line-height: 1.2;
  font-weight: ${theme.fontWeight.bold};
  overflow-wrap: anywhere;
`;

const StatMeta = styled.div`
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const OperationsBar = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.borderLight};
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const OperationItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  min-height: 64px;
  padding: ${theme.spacing.md};
  background: ${theme.colors.white};
`;

const OperationLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const OperationValue = styled.strong`
  flex-shrink: 0;
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.lg};
`;

const QuickActions = styled.nav`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const QuickLink = styled(Link)`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: ${theme.spacing.md};
  min-height: 68px;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.dark};
  text-decoration: none;

  &:hover {
    border-color: ${theme.colors.primaryLight};
    background: #fbfdff;
  }

  > svg:last-child {
    color: ${theme.colors.textSecondary};
  }
`;

const QuickIcon = styled.span`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: ${theme.radius.sm};
  background: #edf6fc;
  color: ${theme.colors.primaryDark};
  font-size: 18px;
`;

const QuickTitle = styled.div`
  font-weight: ${theme.fontWeight.semibold};
`;

const QuickDescription = styled.div`
  margin-top: 2px;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const MainGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(320px, 0.85fr);
  gap: ${theme.spacing.lg};
  align-items: start;

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow.sm};
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.borderLight};
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.lg};
  letter-spacing: 0;
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  flex-shrink: 0;
  color: ${theme.colors.primaryDark};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  text-decoration: none;
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    padding: ${theme.spacing.md};
  }
`;

const RoomItem = styled(Link)<{ $status: Room['status'] }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  min-width: 0;
  padding: ${theme.spacing.md};
  border: 1px solid ${({ $status }) =>
    $status === 'rented'
      ? '#a9d8ba'
      : $status === 'maintenance'
        ? '#f0d58c'
        : '#9fd3d7'};
  border-radius: ${theme.radius.sm};
  background: ${({ $status }) =>
    $status === 'rented'
      ? theme.colors.successLight
      : $status === 'maintenance'
        ? theme.colors.warningLight
        : theme.colors.infoLight};
  color: ${theme.colors.dark};
  text-decoration: none;

  &:hover {
    filter: brightness(0.98);
  }
`;

const RoomHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.sm};
`;

const RoomName = styled.strong`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusTag = styled.span<{ $status: Room['status'] }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  color: ${({ $status }) =>
    $status === 'rented'
      ? theme.colors.successDark
      : $status === 'maintenance'
        ? theme.colors.warningDark
        : theme.colors.infoDark};
  font-size: ${theme.fontSize.sm};

  &::before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${({ $status }) =>
      $status === 'rented'
        ? theme.colors.success
        : $status === 'maintenance'
          ? theme.colors.warning
          : theme.colors.info};
    content: '';
  }
`;

const RoomPrice = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const InvoiceList = styled.div`
  display: flex;
  flex-direction: column;
`;

const InvoiceItem = styled(Link)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${theme.spacing.md};
  align-items: center;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.borderLight};
  color: ${theme.colors.dark};
  text-decoration: none;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${theme.colors.lightBg};
  }
`;

const InvoiceTitle = styled.div`
  font-weight: ${theme.fontWeight.semibold};
`;

const InvoiceMeta = styled.div`
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const InvoiceAmount = styled.div`
  text-align: right;
  font-weight: ${theme.fontWeight.semibold};
`;

const InvoiceStatus = styled.div<{ $status: RecentInvoice['status'] }>`
  margin-top: ${theme.spacing.xs};
  color: ${({ $status }) =>
    $status === 'paid'
      ? theme.colors.successDark
      : $status === 'overdue'
        ? theme.colors.dangerDark
        : $status === 'cancelled'
          ? theme.colors.textSecondary
          : theme.colors.warningDark};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
`;

const Notice = styled.div<{ $error?: boolean }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${({ $error }) => ($error ? theme.colors.dangerLight : theme.colors.borderLight)};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  color: ${({ $error }) => ($error ? theme.colors.dangerDark : theme.colors.textSecondary)};
  text-align: center;
`;

const RetryButton = styled.button`
  margin-left: ${theme.spacing.sm};
  padding: 0;
  border: 0;
  background: transparent;
  color: ${theme.colors.primaryDark};
  font: inherit;
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;
`;

const formatCurrency = (value: unknown) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const getRoomStatusText = (status: Room['status']) => {
  if (status === 'rented') return 'Đã cho thuê';
  if (status === 'maintenance') return 'Bảo trì';
  return 'Còn trống';
};

const getInvoiceStatusText = (status: RecentInvoice['status']) => {
  if (status === 'paid') return 'Đã thanh toán';
  if (status === 'overdue') return 'Quá hạn';
  if (status === 'cancelled') return 'Đã hủy';
  return 'Chưa thanh toán';
};

export const OwnerDashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
    totalRevenue: 0,
    activeContracts: 0,
    totalTenants: 0,
    unpaidInvoices: 0,
    unpaidAmount: 0,
    occupancyRate: 0,
  });

  const fetchDashboard = useCallback(async () => {
    setError(false);

    try {
      const response = await dashboardService.getLandlord();
      if (response.data) {
        const dashboard = response.data;
        const roomsData = dashboard.rooms.list ?? [];
        const totalRooms = Number(dashboard.rooms.total ?? roomsData.length);
        const occupiedRooms = Number(dashboard.rooms.rented ?? 0);

        setRooms(roomsData);
        setRecentInvoices(dashboard.recent_invoices ?? []);
        setStats({
          totalRooms,
          occupiedRooms,
          availableRooms: Number(dashboard.rooms.available ?? 0),
          maintenanceRooms: Number(dashboard.rooms.maintenance ?? 0),
          totalRevenue: Number(dashboard.invoices.monthly_revenue ?? 0),
          activeContracts: Number(dashboard.contracts.active ?? 0),
          totalTenants: Number(dashboard.tenants.total ?? 0),
          unpaidInvoices: Number(dashboard.invoices.unpaid_count ?? 0),
          unpaidAmount: Number(dashboard.invoices.unpaid_amount ?? 0),
          occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
        });
      }
    } catch (fetchError) {
      console.error('Failed to fetch dashboard:', fetchError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    const handleDataChanged = () => fetchDashboard();
    const handleVisibilityChange = () => {
      if (!document.hidden) fetchDashboard();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChanged);
    window.addEventListener('focus', handleDataChanged);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleDataChanged);
      window.removeEventListener('focus', handleDataChanged);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchDashboard]);

  return (
    <PageWrapper>
      <Container>
        <Header title="Tổng Quan Quản Lý" />
        {error && (
          <Notice $error>
            Không thể tải dữ liệu mới nhất.
            <RetryButton type="button" onClick={fetchDashboard}>Thử lại</RetryButton>
          </Notice>
        )}

        <StatsGrid>
          <StatItem>
            <StatHeader><ApartmentOutlined /> Tổng số phòng</StatHeader>
            <StatValue>{loading ? '—' : stats.totalRooms}</StatValue>
            <StatMeta>{stats.availableRooms} phòng đang trống</StatMeta>
          </StatItem>
          <StatItem>
            <StatHeader><FileProtectOutlined /> Tỷ lệ lấp đầy</StatHeader>
            <StatValue>{loading ? '—' : `${stats.occupancyRate}%`}</StatValue>
            <StatMeta>{stats.occupiedRooms} phòng đã cho thuê</StatMeta>
          </StatItem>
          <StatItem>
            <StatHeader><FileTextOutlined /> Doanh thu tháng</StatHeader>
            <StatValue>{loading ? '—' : formatCurrency(stats.totalRevenue)}</StatValue>
            <StatMeta>Đã ghi nhận trong tháng</StatMeta>
          </StatItem>
          <StatItem>
            <StatHeader><FileTextOutlined /> Công nợ cần thu</StatHeader>
            <StatValue $alert={stats.unpaidInvoices > 0}>
              {loading ? '—' : formatCurrency(stats.unpaidAmount)}
            </StatValue>
            <StatMeta>{stats.unpaidInvoices} hóa đơn chưa thanh toán</StatMeta>
          </StatItem>
        </StatsGrid>

        <OperationsBar>
          <OperationItem>
            <OperationLabel>Hợp đồng hiệu lực</OperationLabel>
            <OperationValue>{stats.activeContracts}</OperationValue>
          </OperationItem>
          <OperationItem>
            <OperationLabel>Người thuê</OperationLabel>
            <OperationValue>{stats.totalTenants}</OperationValue>
          </OperationItem>
          <OperationItem>
            <OperationLabel>Phòng trống</OperationLabel>
            <OperationValue>{stats.availableRooms}</OperationValue>
          </OperationItem>
          <OperationItem>
            <OperationLabel>Đang bảo trì</OperationLabel>
            <OperationValue>{stats.maintenanceRooms}</OperationValue>
          </OperationItem>
        </OperationsBar>

        <QuickActions aria-label="Lối tắt quản lý">
          <QuickLink to="/quan-ly-hop-dong">
            <QuickIcon><FileProtectOutlined /></QuickIcon>
            <div><QuickTitle>Hợp đồng</QuickTitle><QuickDescription>Quản lý hiệu lực và tiền cọc</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
          <QuickLink to="/quan-ly-hoa-don">
            <QuickIcon><FileTextOutlined /></QuickIcon>
            <div><QuickTitle>Hóa đơn</QuickTitle><QuickDescription>Theo dõi thanh toán và công nợ</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
          <QuickLink to="/quan-ly-nguoi-thue">
            <QuickIcon><TeamOutlined /></QuickIcon>
            <div><QuickTitle>Người thuê</QuickTitle><QuickDescription>Thông tin và tài khoản người thuê</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
          <QuickLink to="/quan-ly-dich-vu">
            <QuickIcon><ToolOutlined /></QuickIcon>
            <div><QuickTitle>Dịch vụ</QuickTitle><QuickDescription>Thiết lập dịch vụ và đơn giá</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
          <QuickLink to="/quan-ly-dien-nuoc">
            <QuickIcon><ThunderboltOutlined /></QuickIcon>
            <div><QuickTitle>Điện nước</QuickTitle><QuickDescription>Ghi chỉ số và tính chi phí sử dụng</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
        </QuickActions>

        <MainGrid>
          <Section>
            <SectionHeader>
              <SectionTitle>Trạng thái phòng</SectionTitle>
              <TextLink to="/quan-ly-phong">Xem tất cả <ArrowRightOutlined /></TextLink>
            </SectionHeader>
            {rooms.length > 0 ? (
              <RoomGrid>
                {rooms.slice(0, 9).map((room) => (
                  <RoomItem key={room.id} to="/quan-ly-phong" $status={room.status}>
                    <RoomHeader>
                      <RoomName>Phòng {room.roomNumber || room.room_number}</RoomName>
                      <StatusTag $status={room.status}>{getRoomStatusText(room.status)}</StatusTag>
                    </RoomHeader>
                    <RoomPrice>{formatCurrency(room.price)} / tháng</RoomPrice>
                  </RoomItem>
                ))}
              </RoomGrid>
            ) : (
              <div style={{ padding: theme.spacing.lg }}>
                <Notice>{loading ? 'Đang tải danh sách phòng...' : 'Chưa có phòng nào trong hệ thống.'}</Notice>
              </div>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>Hóa đơn gần đây</SectionTitle>
              <TextLink to="/quan-ly-hoa-don">Xem tất cả <ArrowRightOutlined /></TextLink>
            </SectionHeader>
            {recentInvoices.length > 0 ? (
              <InvoiceList>
                {recentInvoices.slice(0, 6).map((invoice) => (
                  <InvoiceItem key={invoice.id} to="/quan-ly-hoa-don">
                    <div>
                      <InvoiceTitle>Hóa đơn kỳ {invoice.month}/{invoice.year}</InvoiceTitle>
                      <InvoiceMeta>
                        {[invoice.room_number && `Phòng ${invoice.room_number}`, invoice.tenant_name]
                          .filter(Boolean)
                          .join(' · ') || 'Chưa có thông tin phòng'}
                      </InvoiceMeta>
                    </div>
                    <div>
                      <InvoiceAmount>{formatCurrency(invoice.final_amount)}</InvoiceAmount>
                      <InvoiceStatus $status={invoice.status}>{getInvoiceStatusText(invoice.status)}</InvoiceStatus>
                    </div>
                  </InvoiceItem>
                ))}
              </InvoiceList>
            ) : (
              <div style={{ padding: theme.spacing.lg }}>
                <Notice>{loading ? 'Đang tải hóa đơn...' : 'Chưa có hóa đơn gần đây.'}</Notice>
              </div>
            )}
          </Section>
        </MainGrid>

      </Container>
    </PageWrapper>
  );
};