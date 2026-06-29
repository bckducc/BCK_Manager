import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Badge, Button, Card, Header, Modal } from '../../components/common';
import { Table } from '../../components/Table';
import { FormGroup, Input, Select } from '../../components/Forms/Form';
import { invoiceService } from './invoiceService';
import type { Invoice, InvoiceStatus } from './invoice.types';

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

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1.2fr) repeat(3, minmax(140px, 0.8fr)) auto;
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div<{ $tone?: 'danger' | 'success' | 'info' }>`
  padding: ${theme.spacing.md};
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'danger'
        ? theme.colors.dangerLight
        : $tone === 'success'
          ? theme.colors.successLight
          : theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  background: ${theme.colors.white};
  box-shadow: ${theme.shadow.sm};
`;

const SummaryLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const SummaryValue = styled.div<{ $tone?: 'danger' | 'success' }>`
  color: ${({ $tone }) => ($tone === 'danger' ? theme.colors.danger : $tone === 'success' ? theme.colors.success : theme.colors.dark)};
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  button {
    min-height: 36px;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${theme.colors.danger};
`;

const currentYear = new Date().getFullYear();

const monthOptions = [
  { value: '', label: 'Tất cả tháng' },
  ...Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: `Tháng ${index + 1}`,
  })),
];

const yearOptions = [
  { value: '', label: 'Tất cả năm' },
  ...Array.from({ length: 6 }, (_, index) => {
    const year = currentYear - index;
    return { value: String(year), label: String(year) };
  }),
];

const statusOptions = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chưa thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const statusLabels: Record<InvoiceStatus, string> = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  overdue: 'Quá hạn',
  cancelled: 'Đã hủy',
};

const statusVariants: Record<InvoiceStatus, 'info' | 'warning' | 'success' | 'danger'> = {
  pending: 'warning',
  paid: 'success',
  overdue: 'danger',
  cancelled: 'info',
};

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const MyInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    month: '',
    year: '',
  });

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getMyInvoices({
        status: filters.status as InvoiceStatus | '',
        month: filters.month ? Number(filters.month) : '',
        year: filters.year ? Number(filters.year) : '',
        limit: 100,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không tải được danh sách hóa đơn');
      }

      setInvoices(response.data?.invoices ?? []);
    } catch (err) {
      setInvoices([]);
      setError(err instanceof Error ? err.message : 'Không tải được danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  }, [filters.month, filters.status, filters.year]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const filteredInvoices = useMemo(() => {
    const keyword = filters.search.trim().toLowerCase();
    if (!keyword) return invoices;

    return invoices.filter((invoice) => {
      const content = [
        invoice.id,
        invoice.room_number,
        invoice.landlord_name,
        invoice.month,
        invoice.year,
        statusLabels[invoice.status],
      ].join(' ').toLowerCase();

      return content.includes(keyword);
    });
  }, [filters.search, invoices]);

  const summary = useMemo(() => {
    return filteredInvoices.reduce(
      (acc, invoice) => {
        acc.totalAmount += invoice.final_amount;
        if (invoice.status === 'paid') acc.paid += 1;
        if (invoice.status === 'pending' || invoice.status === 'overdue') {
          acc.unpaid += 1;
          acc.unpaidAmount += invoice.final_amount;
        }
        return acc;
      },
      { totalAmount: 0, paid: 0, unpaid: 0, unpaidAmount: 0 }
    );
  }, [filteredInvoices]);

  const openDetailModal = async (invoice: Invoice) => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await invoiceService.getMyInvoiceById(String(invoice.id));

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Không tải được chi tiết hóa đơn');
      }

      setSelectedInvoice(response.data);
      setIsDetailModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết hóa đơn');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportInvoice = async (invoice: Invoice) => {
    try {
      setSubmitting(true);
      setError(null);
      const text = await invoiceService.exportText(String(invoice.id));
      downloadTextFile(text, `hoadon_${invoice.month}_${invoice.year}_${invoice.room_number || invoice.id}.txt`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không xuất được hóa đơn');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<Invoice>[] = [
    { key: 'id', title: 'Mã HĐ', render: (value) => `#${value}` },
    { key: 'room_number', title: 'Phòng', render: (value) => String(value || 'N/A') },
    { key: 'landlord_name', title: 'Chủ nhà', render: (value) => String(value || 'N/A') },
    { key: 'month', title: 'Kỳ hóa đơn', render: (_, invoice) => `${invoice.month}/${invoice.year}` },
    { key: 'final_amount', title: 'Thành tiền', render: (value) => formatCurrency(Number(value)) },
    { key: 'due_date', title: 'Hạn thanh toán', render: (value) => formatDate(value as string | undefined) },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (value) => {
        const status = value as InvoiceStatus;
        return <Badge variant={statusVariants[status] || 'info'}>{statusLabels[status] || String(value)}</Badge>;
      },
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, invoice) => (
        <ActionButtons>
          <Button onClick={() => openDetailModal(invoice)} disabled={submitting}>
            Xem
          </Button>
          <Button onClick={() => handleExportInvoice(invoice)} disabled={submitting}>
            Xuất
          </Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header
        title="Hóa Đơn Của Tôi"
        actions={
          <Button onClick={loadInvoices} disabled={loading || submitting}>
            Tải lại
          </Button>
        }
      />

      <SummaryGrid>
        <SummaryItem>
          <SummaryLabel>Tổng hóa đơn</SummaryLabel>
          <SummaryValue>{filteredInvoices.length}</SummaryValue>
        </SummaryItem>
        <SummaryItem $tone="success">
          <SummaryLabel>Đã thanh toán</SummaryLabel>
          <SummaryValue $tone="success">{summary.paid}</SummaryValue>
        </SummaryItem>
        <SummaryItem $tone="danger">
          <SummaryLabel>Chưa thanh toán</SummaryLabel>
          <SummaryValue $tone="danger">{summary.unpaid}</SummaryValue>
        </SummaryItem>
        <SummaryItem $tone="danger">
          <SummaryLabel>Số tiền cần xử lý</SummaryLabel>
          <SummaryValue $tone="danger">{formatCurrency(summary.unpaidAmount || summary.totalAmount)}</SummaryValue>
        </SummaryItem>
      </SummaryGrid>

      <Card>
        <Toolbar>
          <FormGroup label="Tìm nhanh">
            <Input
              value={filters.search}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFilters({ ...filters, search: event.target.value })
              }
              placeholder="Mã hóa đơn, phòng, chủ nhà..."
              disabled={loading || submitting}
            />
          </FormGroup>
          <FormGroup label="Trạng thái">
            <Select
              value={filters.status}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setFilters({ ...filters, status: event.target.value })
              }
              options={statusOptions}
              disabled={loading || submitting}
            />
          </FormGroup>
          <FormGroup label="Tháng">
            <Select
              value={filters.month}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setFilters({ ...filters, month: event.target.value })
              }
              options={monthOptions}
              disabled={loading || submitting}
            />
          </FormGroup>
          <FormGroup label="Năm">
            <Select
              value={filters.year}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setFilters({ ...filters, year: event.target.value })
              }
              options={yearOptions}
              disabled={loading || submitting}
            />
          </FormGroup>
          <Button onClick={loadInvoices} disabled={loading || submitting}>
            <SearchOutlined />
            Tìm
          </Button>
        </Toolbar>
      </Card>

      {error && <ErrorText>Lỗi: {error}</ErrorText>}

      <Card>
        <Table columns={columns} data={filteredInvoices} loading={loading} emptyText="Chưa có hóa đơn nào" />
      </Card>

      <Modal
        isOpen={isDetailModalOpen}
        title="Chi Tiết Hóa Đơn"
        onClose={() => setIsDetailModalOpen(false)}
        cancelText="Đóng"
      >
        {selectedInvoice && (
          <DetailGrid>
            <DetailItem>
              <SummaryLabel>Mã hóa đơn</SummaryLabel>
              <SummaryValue>#{selectedInvoice.id}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Kỳ</SummaryLabel>
              <SummaryValue>{selectedInvoice.month}/{selectedInvoice.year}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Phòng</SummaryLabel>
              <SummaryValue>{selectedInvoice.room_number || 'N/A'}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Trạng thái</SummaryLabel>
              <SummaryValue>{statusLabels[selectedInvoice.status]}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Tiền phòng</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedInvoice.room_fee)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Dịch vụ</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedInvoice.service_fee)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Điện</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedInvoice.electric_fee)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Nước</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedInvoice.water_fee)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Phí khác</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedInvoice.other_fees)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Tổng cộng</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedInvoice.total_amount)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Giảm giá</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedInvoice.discount)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Thành tiền</SummaryLabel>
              <SummaryValue $tone="danger">{formatCurrency(selectedInvoice.final_amount)}</SummaryValue>
            </DetailItem>
            <DetailItem>
              <SummaryLabel>Hạn thanh toán</SummaryLabel>
              <SummaryValue>{formatDate(selectedInvoice.due_date)}</SummaryValue>
            </DetailItem>
          </DetailGrid>
        )}
        </Modal>
      </Container>
    </PageWrapper>
  );
};
