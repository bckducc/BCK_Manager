import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Badge, Button, Card, Header } from '../../components/common';
import { Table } from '../../components/Table';
import { FormGroup, Select } from '../../components/Forms/Form';
import { invoiceService } from './invoiceService';
import type { Invoice } from './invoice.types';

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
`;

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(150px, 1fr)) auto;
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(150px, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  button {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${theme.colors.danger};
`;

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

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

const statusLabels: Record<Invoice['status'], string> = {
  pending: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  overdue: 'Quá hạn',
  cancelled: 'Đã hủy',
};

const statusVariants: Record<Invoice['status'], 'info' | 'warning' | 'success' | 'danger'> = {
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

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    month: '',
    year: '',
  });

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getAll({
        status: filters.status as Invoice['status'] | '',
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

  const handleGenerateInvoices = async () => {
    const month = Number(filters.month || currentMonth);
    const year = Number(filters.year || currentYear);

    if (!window.confirm(`Tạo hóa đơn tháng ${month}/${year}?`)) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await invoiceService.generate({ month, year });
      if (!response.success) {
        throw new Error(response.message || 'Không tạo được hóa đơn');
      }

      await loadInvoices();
      alert(response.message || 'Tạo hóa đơn thành công');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được hóa đơn');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmPayment = async (invoice: Invoice) => {
    if (!window.confirm(`Xác nhận hóa đơn #${invoice.id} đã thanh toán?`)) return;

    try {
      setSubmitting(true);
      setError(null);
      const response = await invoiceService.confirmPayment(String(invoice.id));
      if (!response.success) {
        throw new Error(response.message || 'Không xác nhận được thanh toán');
      }

      setInvoices((current) =>
        current.map((item) => (item.id === invoice.id ? { ...item, status: 'paid' } : item))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không xác nhận được thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  const summary = useMemo(() => {
    return invoices.reduce(
      (acc, invoice) => {
        acc.totalAmount += invoice.final_amount;
        if (invoice.status === 'paid') acc.paid += 1;
        if (invoice.status === 'pending' || invoice.status === 'overdue') acc.unpaid += 1;
        return acc;
      },
      { totalAmount: 0, paid: 0, unpaid: 0 }
    );
  }, [invoices]);

  const columns: TableColumn<Invoice>[] = [
    { key: 'id', title: 'Mã HĐ', render: (value) => `#${value}` },
    { key: 'room_number', title: 'Phòng', render: (value) => String(value || 'N/A') },
    { key: 'tenant_name', title: 'Người thuê', render: (value) => String(value || 'N/A') },
    { key: 'month', title: 'Kỳ hóa đơn', render: (_, invoice) => `${invoice.month}/${invoice.year}` },
    { key: 'room_fee', title: 'Tiền phòng', render: (value) => formatCurrency(Number(value)) },
    { key: 'service_fee', title: 'Dịch vụ', render: (value) => formatCurrency(Number(value)) },
    { key: 'electric_fee', title: 'Điện', render: (value) => formatCurrency(Number(value)) },
    { key: 'water_fee', title: 'Nước', render: (value) => formatCurrency(Number(value)) },
    { key: 'final_amount', title: 'Thành tiền', render: (value) => formatCurrency(Number(value)) },
    { key: 'due_date', title: 'Hạn thanh toán', render: (value) => formatDate(value as string | undefined) },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (value) => {
        const status = value as Invoice['status'];
        return <Badge variant={statusVariants[status] || 'info'}>{statusLabels[status] || String(value)}</Badge>;
      },
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, invoice) => (
        <ActionButtons>
          {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
            <Button onClick={() => handleConfirmPayment(invoice)} disabled={submitting}>
              Đã thanh toán
            </Button>
          )}
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header title="Quản Lý Hóa Đơn" />

        <Card>
          <Toolbar>
            <FormGroup label="Trạng thái">
              <Select
                value={filters.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                options={statusOptions}
                disabled={loading || submitting}
              />
            </FormGroup>
            <FormGroup label="Tháng">
              <Select
                value={filters.month}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, month: e.target.value })
                }
                options={monthOptions}
                disabled={loading || submitting}
              />
            </FormGroup>
            <FormGroup label="Năm">
              <Select
                value={filters.year}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setFilters({ ...filters, year: e.target.value })
                }
                options={yearOptions}
                disabled={loading || submitting}
              />
            </FormGroup>
            <FormGroup label="Tổng quan">
              <div>
                {invoices.length} hóa đơn, {summary.paid} đã trả, {summary.unpaid} chưa trả,{' '}
                {formatCurrency(summary.totalAmount)}
              </div>
            </FormGroup>
            <ActionButtons>
              <Button onClick={loadInvoices} disabled={loading || submitting}>
                Tải lại
              </Button>
              <Button onClick={handleGenerateInvoices} loading={submitting} disabled={loading}>
                Tạo tháng này
              </Button>
            </ActionButtons>
          </Toolbar>
        </Card>

        {error && <ErrorText>Lỗi: {error}</ErrorText>}

        <Card>
          <Table
            columns={columns}
            data={invoices}
            loading={loading}
            emptyText="Chưa có hóa đơn nào"
          />
        </Card>
      </Container>
    </PageWrapper>
  );
};
