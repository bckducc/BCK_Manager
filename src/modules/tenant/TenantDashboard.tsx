import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  ApartmentOutlined,
  CalendarOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { theme } from '../../styles/theme';
import { Badge } from '../../components/common';
import { DATA_CHANGED_EVENT } from '../../services/apiClient';
import { useAuth } from '../auth/useAuth';
import { tenantService } from './tenantService';
import { contractService } from '../contract/contractService';
import { invoiceService } from '../invoice/invoiceService';
import type { Contract } from '../contract/contract.types';
import type { Invoice } from '../invoice/invoice.types';
import type { User } from '../../types';

const Page = styled.div`
  min-height: 100%;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.lightBg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
  max-width: 1180px;
  margin: 0 auto;
`;

const Overview = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(320px, 0.9fr);
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const WelcomePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${theme.spacing.lg};
  min-height: 260px;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.radius.md};
  background:
    linear-gradient(135deg, rgba(44, 62, 80, 0.94), rgba(68, 129, 241, 0.9)),
    ${theme.colors.dark};
  color: ${theme.colors.white};
  box-shadow: ${theme.shadow.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    min-height: auto;
    padding: ${theme.spacing.lg};
  }
`;

const Eyebrow = styled.div`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  color: rgba(255, 255, 255, 0.76);
`;

const WelcomeTitle = styled.h1`
  margin: ${theme.spacing.xs} 0 0;
  font-size: 1.9rem;
  line-height: 1.2;
  letter-spacing: 0;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSize['2xl']};
  }
`;

const WelcomeMeta = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  min-height: 38px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${theme.radius.full};
  background: rgba(255, 255, 255, 0.12);
  color: ${theme.colors.white};
`;

const DuePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow.md};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
`;

const PanelTitle = styled.h2`
  margin: 0;
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.xl};
  letter-spacing: 0;
`;

const MutedText = styled.p`
  margin: ${theme.spacing.xs} 0 0;
  color: ${theme.colors.textSecondary};
`;

const Amount = styled.div<{ $tone?: 'danger' | 'success' | 'default' }>`
  color: ${({ $tone }) =>
    $tone === 'danger' ? theme.colors.danger : $tone === 'success' ? theme.colors.success : theme.colors.dark};
  font-size: 1.8rem;
  font-weight: ${theme.fontWeight.bold};
  letter-spacing: 0;
`;

const ActionLink = styled(Link)<{ $variant?: 'primary' | 'plain' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  min-height: 40px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${({ $variant }) => ($variant === 'primary' ? theme.colors.primary : theme.colors.borderLight)};
  border-radius: ${theme.radius.sm};
  background: ${({ $variant }) => ($variant === 'primary' ? theme.colors.primary : theme.colors.white)};
  color: ${({ $variant }) => ($variant === 'primary' ? theme.colors.white : theme.colors.dark)};
  text-decoration: none;
  font-weight: ${theme.fontWeight.semibold};

  &:hover {
    background: ${({ $variant }) => ($variant === 'primary' ? theme.colors.primaryDark : theme.colors.lightBg)};
  }
`;

const QuickGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const QuickCard = styled(Link)`
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: ${theme.spacing.md};
  align-items: center;
  min-height: 88px;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  color: ${theme.colors.dark};
  text-decoration: none;
  box-shadow: ${theme.shadow.sm};

  &:hover {
    border-color: ${theme.colors.primaryLight};
    box-shadow: ${theme.shadow.md};
  }
`;

const QuickIcon = styled.div<{ $tone: 'blue' | 'green' | 'orange' | 'red' }>`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: ${theme.radius.sm};
  color: ${({ $tone }) =>
    $tone === 'green'
      ? theme.colors.successDark
      : $tone === 'orange'
        ? theme.colors.warningDark
        : $tone === 'red'
          ? theme.colors.dangerDark
          : theme.colors.primaryDark};
  background: ${({ $tone }) =>
    $tone === 'green'
      ? theme.colors.successLight
      : $tone === 'orange'
        ? theme.colors.warningLight
        : $tone === 'red'
          ? theme.colors.dangerLight
          : '#e8f4fd'};
  font-size: 20px;
`;

const QuickTitle = styled.div`
  font-weight: ${theme.fontWeight.bold};
`;

const QuickDesc = styled.div`
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const MainGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.75fr);
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.div`
  padding: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow.sm};
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.xl};
  letter-spacing: 0;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
`;

const StatLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const StatValue = styled.div`
  margin-top: ${theme.spacing.xs};
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
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

const InvoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const InvoiceItem = styled(Link)`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: ${theme.spacing.md};
  align-items: center;
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  color: ${theme.colors.dark};
  text-decoration: none;

  &:hover {
    background: ${theme.colors.lightBg};
  }
`;

const Notice = styled.div<{ $type?: 'error' | 'info' }>`
  padding: ${theme.spacing.md};
  border: 1px solid ${({ $type }) => ($type === 'error' ? theme.colors.dangerLight : theme.colors.borderLight)};
  border-radius: ${theme.radius.sm};
  background: ${({ $type }) => ($type === 'error' ? '#fff7f5' : theme.colors.white)};
  color: ${({ $type }) => ($type === 'error' ? theme.colors.dangerDark : theme.colors.textSecondary)};
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

const getDaysUntil = (value?: string) => {
  if (!value) return null;
  const dueDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(dueDate.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((dueDate.getTime() - today.getTime()) / 86400000);
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
      setError('Một số dữ liệu chưa tải được. Bạn vẫn có thể dùng các lối tắt bên dưới.');
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();

    const handleDataChanged = () => {
      loadDashboard();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadDashboard();
      }
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChanged);
    window.addEventListener('focus', handleDataChanged);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleDataChanged);
      window.removeEventListener('focus', handleDataChanged);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadDashboard]);

  const nextInvoice = useMemo(() => {
    return invoices
      .filter((invoice) => invoice.status === 'pending' || invoice.status === 'overdue')
      .sort((a, b) => new Date(a.due_date || '').getTime() - new Date(b.due_date || '').getTime())[0] ?? invoices[0];
  }, [invoices]);

  const unpaidInvoices = invoices.filter((invoice) => invoice.status === 'pending' || invoice.status === 'overdue');
  const paidInvoices = invoices.filter((invoice) => invoice.status === 'paid');
  const unpaidAmount = unpaidInvoices.reduce((sum, invoice) => sum + invoice.final_amount, 0);
  const daysUntilDue = getDaysUntil(nextInvoice?.due_date);

  return (
    <Page>
      <PageContent>
        <Overview>
          <WelcomePanel>
            <div>
              <Eyebrow>Trang chủ người thuê</Eyebrow>
              <WelcomeTitle>Chào {profile?.name || user?.name || 'bạn'}! <br></br>Mọi thông tin thuê phòng nằm ở đây.</WelcomeTitle>
            </div>
            <WelcomeMeta>
              <MetaPill>
                <ApartmentOutlined />
                Phòng {contract?.roomNumber || 'chưa cập nhật'}
              </MetaPill>
              <MetaPill>
                <FileProtectOutlined />
                {contract?.status === 'active' ? 'Hợp đồng còn hiệu lực' : 'Chưa có hợp đồng hiệu lực'}
              </MetaPill>
              <MetaPill>
                <FileTextOutlined />
                {unpaidInvoices.length} hóa đơn cần xử lý
              </MetaPill>
            </WelcomeMeta>
          </WelcomePanel>

          <DuePanel>
            <PanelHeader>
              <div>
                <PanelTitle>Việc cần ưu tiên</PanelTitle>
                <MutedText>{loading ? 'Đang cập nhật dữ liệu mới nhất...' : 'Theo dõi hóa đơn và hạn thanh toán gần nhất.'}</MutedText>
              </div>
              {nextInvoice && (
                <Badge variant={nextInvoice.status === 'paid' ? 'success' : nextInvoice.status === 'overdue' ? 'danger' : 'warning'}>
                  {statusLabels[nextInvoice.status]}
                </Badge>
              )}
            </PanelHeader>

            {nextInvoice ? (
              <>
                <div>
                  <MutedText>Kỳ {nextInvoice.month}/{nextInvoice.year}</MutedText>
                  <Amount $tone={nextInvoice.status === 'paid' ? 'success' : nextInvoice.status === 'overdue' ? 'danger' : 'default'}>
                    {formatCurrency(nextInvoice.final_amount)}
                  </Amount>
                  <MutedText>
                    Hạn thanh toán: {formatDate(nextInvoice.due_date)}
                    {daysUntilDue !== null && daysUntilDue >= 0 ? `, còn ${daysUntilDue} ngày` : ''}
                    {daysUntilDue !== null && daysUntilDue < 0 ? `, quá hạn ${Math.abs(daysUntilDue)} ngày` : ''}
                  </MutedText>
                </div>
                <ActionLink to="/tenant/invoices" $variant="primary">
                  <FileTextOutlined />
                  Xem hóa đơn
                </ActionLink>
              </>
            ) : (
              <>
                <Notice>Chưa có hóa đơn nào cần xử lý.</Notice>
                <ActionLink to="/tenant/invoices">Xem danh sách hóa đơn</ActionLink>
              </>
            )}
          </DuePanel>
        </Overview>

        {error && <Notice $type="error">{error}</Notice>}

        <QuickGrid>
          <QuickCard to="/tenant/room">
            <QuickIcon $tone="blue"><ApartmentOutlined /></QuickIcon>
            <div>
              <QuickTitle>Phòng đang thuê</QuickTitle>
              <QuickDesc>Thông tin phòng, chủ nhà và tiền thuê</QuickDesc>
            </div>
          </QuickCard>
          <QuickCard to="/tenant/invoices">
            <QuickIcon $tone={unpaidInvoices.length > 0 ? 'red' : 'green'}><FileTextOutlined /></QuickIcon>
            <div>
              <QuickTitle>Hóa đơn</QuickTitle>
              <QuickDesc>{unpaidInvoices.length > 0 ? `${unpaidInvoices.length} hóa đơn chưa thanh toán` : 'Không có khoản cần xử lý'}</QuickDesc>
            </div>
          </QuickCard>
          <QuickCard to="/tenant/contracts">
            <QuickIcon $tone="orange"><FileProtectOutlined /></QuickIcon>
            <div>
              <QuickTitle>Hợp đồng</QuickTitle>
              <QuickDesc>Thời hạn, tiền cọc và điều khoản thuê</QuickDesc>
            </div>
          </QuickCard>
          <QuickCard to="/tenant/utilities">
            <QuickIcon $tone="green"><ThunderboltOutlined /></QuickIcon>
            <div>
              <QuickTitle>Điện nước</QuickTitle>
              <QuickDesc>Lịch sử chỉ số và chi phí tạm tính</QuickDesc>
            </div>
          </QuickCard>
        </QuickGrid>

        <MainGrid>
          <SectionCard>
            <SectionTitle>Tổng quan thanh toán</SectionTitle>
            <StatGrid>
              <StatItem>
                <StatLabel>Chưa thanh toán</StatLabel>
                <StatValue>{unpaidInvoices.length}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Đã thanh toán</StatLabel>
                <StatValue>{paidInvoices.length}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Số tiền cần xử lý</StatLabel>
                <StatValue>{formatCurrency(unpaidAmount)}</StatValue>
              </StatItem>
            </StatGrid>

            <SectionTitle style={{ marginTop: theme.spacing.lg }}>Hóa đơn gần đây</SectionTitle>
            <InvoiceList>
              {invoices.length > 0 ? invoices.slice(0, 4).map((invoice) => (
                <InvoiceItem key={invoice.id} to="/tenant/invoices">
                  <div>
                    <QuickTitle>Kỳ {invoice.month}/{invoice.year}</QuickTitle>
                    <QuickDesc>Hạn: {formatDate(invoice.due_date)}</QuickDesc>
                  </div>
                  <div>
                    <Amount style={{ fontSize: theme.fontSize.lg }}>{formatCurrency(invoice.final_amount)}</Amount>
                    <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'danger' : 'warning'}>
                      {statusLabels[invoice.status]}
                    </Badge>
                  </div>
                </InvoiceItem>
              )) : (
                <Notice>Chưa có hóa đơn gần đây.</Notice>
              )}
            </InvoiceList>
          </SectionCard>

          <SectionCard>
            <SectionTitle>Thông tin thuê phòng</SectionTitle>
            <InfoList>
              <InfoRow>
                <span>Người thuê</span>
                <span>{profile?.name || 'N/A'}</span>
              </InfoRow>
              <InfoRow>
                <span>Số điện thoại</span>
                <span>{profile?.phone || 'N/A'}</span>
              </InfoRow>
              <InfoRow>
                <span>Phòng</span>
                <span>{contract?.roomNumber || 'N/A'}</span>
              </InfoRow>
              <InfoRow>
                <span>Giá thuê</span>
                <span>{formatCurrency(contract?.price)}</span>
              </InfoRow>
              <InfoRow>
                <span>Ngày bắt đầu</span>
                <span>{formatDate(contract?.startDate)}</span>
              </InfoRow>
              <InfoRow>
                <span>Ngày kết thúc</span>
                <span>{formatDate(contract?.endDate)}</span>
              </InfoRow>
            </InfoList>
            <ActionLink to="/tenant/room" style={{ marginTop: theme.spacing.lg }}>
              <UserOutlined />
              Xem chi tiết phòng
            </ActionLink>
            <ActionLink to="/tenant/contracts" style={{ marginTop: theme.spacing.sm }}>
              <CalendarOutlined />
              Xem hợp đồng
            </ActionLink>
          </SectionCard>
        </MainGrid>
      </PageContent>
    </Page>
  );
};
