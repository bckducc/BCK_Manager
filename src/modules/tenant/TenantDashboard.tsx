import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ApartmentOutlined,
  ArrowRightOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Header } from '../../components/common';
import { theme } from '../../styles/theme';
import { DATA_CHANGED_EVENT } from '../../services/apiClient';
import { useAuth } from '../auth/useAuth';
import { tenantService } from './tenantService';
import { contractService } from '../contract/contractService';
import { invoiceService } from '../invoice/invoiceService';
import type { Contract } from '../contract/contract.types';
import type { Invoice } from '../invoice/invoice.types';
import type { User } from '../../types';

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

const StatusBar = styled.section`
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

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  min-height: 64px;
  padding: ${theme.spacing.md};
  background: ${theme.colors.white};
`;

const StatusLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const StatusValue = styled.strong`
  min-width: 0;
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.base};
  text-align: right;
  overflow-wrap: anywhere;
`;

const QuickActions = styled.nav`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

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
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.85fr);
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
  margin-bottom: ${theme.spacing.xs};
  color: ${theme.colors.dark};
  font-weight: ${theme.fontWeight.semibold};
  text-align: right;
`;

const InfoList = styled.div`
  padding: 0 ${theme.spacing.lg};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.borderLight};

  &:last-child {
    border-bottom: 0;
  }

  span:first-child {
    color: ${theme.colors.textSecondary};
  }

  span:last-child {
    color: ${theme.colors.dark};
    font-weight: ${theme.fontWeight.semibold};
    text-align: right;
  }
`;

const Notice = styled.div<{ $error?: boolean }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${({ $error }) => ($error ? theme.colors.dangerLight : theme.colors.borderLight)};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.white};
  color: ${({ $error }) => ($error ? theme.colors.dangerDark : theme.colors.textSecondary)};
  text-align: center;
`;

type DashboardProfile = User & {
  full_name?: string;
  identity_card?: string;
};

const statusLabels: Record<Invoice['status'], string> = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  overdue: 'Quá hạn',
  cancelled: 'Đã hủy',
};

const formatCurrency = (value: unknown) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const formatDate = (value?: Date | string) => {
  if (!value) return 'N/A';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN');
};

export const TenantDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [contract, setContract] = useState<Contract | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [dashboardResult, contractResult, invoiceResult] = await Promise.allSettled([
      tenantService.getDashboard(),
      contractService.getMyContract(),
      invoiceService.getMyInvoices({ limit: 5 }),
    ]);

    if (dashboardResult.status === 'fulfilled') {
      const dashboardProfile = dashboardResult.value.data?.profile as DashboardProfile | undefined;
      if (dashboardProfile) {
        setProfile({
          id: String(dashboardProfile.id),
          username: dashboardProfile.username,
          name: dashboardProfile.name || dashboardProfile.full_name || '',
          role: 'tenant',
          phone: dashboardProfile.phone,
          idNumber: dashboardProfile.idNumber || dashboardProfile.identity_card,
          gender: dashboardProfile.gender,
          createdAt: dashboardProfile.createdAt || new Date(),
        });
      }
    }

    if (contractResult.status === 'fulfilled' && contractResult.value.success) {
      setContract(contractResult.value.data ?? null);
    }

    if (invoiceResult.status === 'fulfilled' && invoiceResult.value.success) {
      setInvoices(invoiceResult.value.data?.invoices ?? []);
    }

    const failed = [dashboardResult, contractResult, invoiceResult].some((result) => result.status === 'rejected');
    if (failed) {
      setError('Một số dữ liệu chưa tải được. Bạn vẫn có thể sử dụng các lối tắt bên dưới.');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    const handleDataChanged = () => void loadDashboard();
    const handleVisibilityChange = () => {
      if (!document.hidden) void loadDashboard();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChanged);
    window.addEventListener('focus', handleDataChanged);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(DATA_CHANGED_EVENT, handleDataChanged);
      window.removeEventListener('focus', handleDataChanged);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadDashboard]);

  const nextInvoice = useMemo(() => (
    invoices
      .filter((invoice) => invoice.status === 'pending' || invoice.status === 'overdue')
      .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime())[0] ?? invoices[0]
  ), [invoices]);

  const unpaidInvoices = invoices.filter((invoice) => invoice.status === 'pending' || invoice.status === 'overdue');
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');
  const unpaidAmount = unpaidInvoices.reduce((sum, invoice) => sum + Number(invoice.final_amount || 0), 0);
  const monthlyRent = contract?.monthlyRent ?? contract?.price ?? 0;

  return (
    <PageWrapper>
      <Container>
        <Header title="Tổng Quan" />

        {error && <Notice $error>{error}</Notice>}

        <StatsGrid>
          <StatItem>
            <StatHeader><ApartmentOutlined /> Phòng đang thuê</StatHeader>
            <StatValue>{loading ? '—' : contract?.roomNumber || 'Chưa có'}</StatValue>
            <StatMeta>Thông tin phòng hiện tại</StatMeta>
          </StatItem>
          <StatItem>
            <StatHeader><FileProtectOutlined /> Tiền thuê phòng</StatHeader>
            <StatValue>{loading ? '—' : formatCurrency(monthlyRent)}</StatValue>
            <StatMeta>Theo hợp đồng hiện tại</StatMeta>
          </StatItem>
          <StatItem>
            <StatHeader><FileTextOutlined /> Hóa đơn của tôi</StatHeader>
            <StatValue $alert={unpaidInvoices.length > 0}>{loading ? '—' : unpaidInvoices.length}</StatValue>
            <StatMeta>{paidInvoices.length} hóa đơn đã thanh toán</StatMeta>
          </StatItem>
          <StatItem>
            <StatHeader><FileTextOutlined /> Số tiền chưa thanh toán</StatHeader>
            <StatValue $alert={unpaidAmount > 0}>{loading ? '—' : formatCurrency(unpaidAmount)}</StatValue>
            <StatMeta>Tổng các hóa đơn cần xử lý</StatMeta>
          </StatItem>
        </StatsGrid>

        <StatusBar>
          <StatusItem>
            <StatusLabel>Người thuê</StatusLabel>
            <StatusValue>{profile?.name || user?.name || 'N/A'}</StatusValue>
          </StatusItem>
          <StatusItem>
            <StatusLabel>Trạng thái hợp đồng</StatusLabel>
            <StatusValue>{contract?.status === 'active' ? 'Còn hiệu lực' : 'Chưa có hiệu lực'}</StatusValue>
          </StatusItem>
          <StatusItem>
            <StatusLabel>Ngày kết thúc</StatusLabel>
            <StatusValue>{formatDate(contract?.endDate)}</StatusValue>
          </StatusItem>
          <StatusItem>
            <StatusLabel>Hạn thanh toán gần nhất</StatusLabel>
            <StatusValue>{formatDate(nextInvoice?.due_date)}</StatusValue>
          </StatusItem>
        </StatusBar>

        <QuickActions aria-label="Lối tắt người thuê">
          <QuickLink to="/phong-dang-thue">
            <QuickIcon><ApartmentOutlined /></QuickIcon>
            <div><QuickTitle>Phòng đang thuê</QuickTitle><QuickDescription>Thông tin phòng và chủ nhà</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
          <QuickLink to="/hop-dong-cua-toi">
            <QuickIcon><FileProtectOutlined /></QuickIcon>
            <div><QuickTitle>Hợp đồng</QuickTitle><QuickDescription>Thời hạn, tiền cọc và điều khoản</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
          <QuickLink to="/hoa-don-cua-toi">
            <QuickIcon><FileTextOutlined /></QuickIcon>
            <div><QuickTitle>Hóa đơn</QuickTitle><QuickDescription>Theo dõi thanh toán và công nợ</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
          <QuickLink to="/dien-nuoc-hang-thang">
            <QuickIcon><ThunderboltOutlined /></QuickIcon>
            <div><QuickTitle>Điện nước</QuickTitle><QuickDescription>Lịch sử chỉ số và chi phí</QuickDescription></div>
            <ArrowRightOutlined />
          </QuickLink>
        </QuickActions>

        <MainGrid>
          <Section>
            <SectionHeader>
              <SectionTitle>Hóa đơn gần đây</SectionTitle>
              <TextLink to="/hoa-don-cua-toi">Xem tất cả <ArrowRightOutlined /></TextLink>
            </SectionHeader>
            {invoices.length > 0 ? (
              <InvoiceList>
                {invoices.slice(0, 5).map((invoice) => (
                  <InvoiceItem key={invoice.id} to="/hoa-don-cua-toi">
                    <div>
                      <InvoiceTitle>Hóa đơn kỳ {invoice.month}/{invoice.year}</InvoiceTitle>
                      <InvoiceMeta>Hạn thanh toán: {formatDate(invoice.due_date)}</InvoiceMeta>
                    </div>
                    <div>
                      <InvoiceAmount>{formatCurrency(invoice.final_amount)}</InvoiceAmount>
                      <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'danger' : 'warning'}>
                        {statusLabels[invoice.status]}
                      </Badge>
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

          <Section>
            <SectionHeader>
              <SectionTitle>Thông tin thuê phòng</SectionTitle>
              <TextLink to="/phong-dang-thue">Chi tiết <ArrowRightOutlined /></TextLink>
            </SectionHeader>
            <InfoList>
              <InfoRow><span>Người thuê</span><span>{profile?.name || 'N/A'}</span></InfoRow>
              <InfoRow><span>Số điện thoại</span><span>{profile?.phone || 'N/A'}</span></InfoRow>
              <InfoRow><span>Phòng</span><span>{contract?.roomNumber || 'N/A'}</span></InfoRow>
              <InfoRow><span>Giá thuê</span><span>{formatCurrency(monthlyRent)}</span></InfoRow>
              <InfoRow><span>Ngày bắt đầu</span><span>{formatDate(contract?.startDate)}</span></InfoRow>
              <InfoRow><span>Ngày kết thúc</span><span>{formatDate(contract?.endDate)}</span></InfoRow>
            </InfoList>
            <div style={{ padding: `0 ${theme.spacing.lg} ${theme.spacing.lg}` }}>
              <TextLink to="/hop-dong-cua-toi"><UserOutlined /> Xem hợp đồng</TextLink>
            </div>
          </Section>
        </MainGrid>
      </Container>
    </PageWrapper>
  );
};
