import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Modal, Alert, Loading, Badge } from '../../components/common';
import { Table } from '../../components/Table';
import { Form, FormGroup, Input, Select, TextArea } from '../../components/Forms/Form';
import { invoiceService } from './invoiceService';
import type { GenerateInvoiceResult, InvoicePaymentData, InvoicePreview } from './invoiceService';
import type { Invoice, InvoiceStatus, PaymentMethod } from './invoice.types';
import { contractService } from '../contract/contractService';
import type { Contract } from '../contract/contract.types';

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

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  button {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(160px, 220px) auto;
  gap: ${theme.spacing.md};
  align-items: end;

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
`;

const DetailLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const DetailValue = styled.div`
  color: ${theme.colors.dark};
  font-weight: ${theme.fontWeight.semibold};
`;

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: `Tháng ${index + 1}`,
}));

const yearOptions = Array.from({ length: 6 }, (_, index) => {
  const year = currentYear - index;
  return { value: String(year), label: String(year) };
});

const paymentMethodOptions = [
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'bank_transfer', label: 'Chuyển khoản' },
  { value: 'other', label: 'Khác' },
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
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('vi-VN');
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

const safeFilePart = (value: unknown) => String(value || 'hoa_don').replace(/[^\w-]+/g, '_');

const getDefaultDueDate = (month: number, year: number) => {
  const dueDate = new Date(year, month, 5);
  return dueDate.toISOString().slice(0, 10);
};

const initialGenerateForm = {
  contractId: '',
  month: String(currentMonth),
  year: String(currentYear),
  otherFees: '0',
  discount: '0',
  dueDate: getDefaultDueDate(currentMonth, currentYear),
};

const initialPaymentForm = {
  paymentDate: new Date().toISOString().slice(0, 10),
  paymentMethod: 'cash',
  transactionCode: '',
  note: '',
};

export const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [exportingInvoiceId, setExportingInvoiceId] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payments, setPayments] = useState<InvoicePaymentData | null>(null);
  const [generationResult, setGenerationResult] = useState<GenerateInvoiceResult | null>(null);
  const [activeContracts, setActiveContracts] = useState<Contract[]>([]);
  const [invoicePreview, setInvoicePreview] = useState<InvoicePreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [formData, setFormData] = useState(initialGenerateForm);
  const [paymentForm, setPaymentForm] = useState(initialPaymentForm);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await invoiceService.getAll({ limit: 100 });
      if (!response.success) {
        throw new Error(response.message || 'Không tải được danh sách hóa đơn');
      }

      setInvoices(response.data?.invoices || []);
    } catch (err) {
      setInvoices([]);
      setError(err instanceof Error ? err.message : 'Không tải được danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredInvoices = useMemo(() => {
    const keyword = searchText.trim().toLowerCase().replace(/^#/, '');

    return invoices.filter((invoice) => {
      const matchesStatus = !statusFilter || invoice.status === statusFilter;
      const searchContent = [
        invoice.id,
        invoice.contract_id,
        invoice.tenant_name,
        invoice.tenant_phone,
        invoice.room_number,
      ].join(' ').toLowerCase();

      return matchesStatus && (!keyword || searchContent.includes(keyword));
    });
  }, [invoices, searchText, statusFilter]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const loadActiveContracts = useCallback(async () => {
    try {
      const response = await contractService.getAll({ status: 'active', limit: 100 });
      setActiveContracts(response.success ? response.data ?? [] : []);
    } catch {
      setActiveContracts([]);
    }
  }, []);

  useEffect(() => {
    loadActiveContracts();
  }, [loadActiveContracts]);

  const selectedContract = activeContracts.find((contract) => contract.id === formData.contractId);

  const contractOptions = activeContracts.map((contract) => ({
    value: contract.id,
    label: `${contract.tenantName || `Người thuê #${contract.tenantId}`} - Phòng ${contract.roomNumber || contract.roomId}`,
  }));

  useEffect(() => {
    if (!isModalOpen || !formData.contractId || !formData.month || !formData.year) {
      setInvoicePreview(null);
      return;
    }

    let isCurrent = true;
    const timer = window.setTimeout(async () => {
      setPreviewLoading(true);
      try {
        const response = await invoiceService.preview({
          contract_id: formData.contractId,
          month: Number(formData.month),
          year: Number(formData.year),
          other_fees: Number(formData.otherFees || 0),
          discount: Number(formData.discount || 0),
          due_date: formData.dueDate || undefined,
        });

        if (isCurrent) {
          setInvoicePreview(response.success ? response.data ?? null : null);
        }
      } catch {
        if (isCurrent) {
          setInvoicePreview(null);
        }
      } finally {
        if (isCurrent) {
          setPreviewLoading(false);
        }
      }
    }, 350);

    return () => {
      isCurrent = false;
      window.clearTimeout(timer);
    };
  }, [formData.contractId, formData.month, formData.year, formData.otherFees, formData.discount, formData.dueDate, isModalOpen]);

  const handleGenerateInvoices = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);
      setError(null);

      if (!formData.contractId) {
        throw new Error('Vui lòng chọn người thuê cần tạo hóa đơn');
      }

      const response = await invoiceService.generate({
        contract_id: formData.contractId,
        month: Number(formData.month),
        year: Number(formData.year),
        other_fees: Number(formData.otherFees || 0),
        discount: Number(formData.discount || 0),
        due_date: formData.dueDate || undefined,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Không tạo được hóa đơn');
      }

      setGenerationResult(response.data);
      if (response.data.created_count > 0) {
        setInvoices((current) => [...response.data.created, ...current]);
        setIsModalOpen(false);
        setFormData(initialGenerateForm);
        setGenerationResult(null);
        setInvoicePreview(null);
      }
      await loadInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được hóa đơn');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    try {
      setIsSaving(true);
      setError(null);
      const [invoiceResponse, paymentResponse] = await Promise.all([
        invoiceService.getById(String(invoice.id)),
        invoiceService.getPayments(String(invoice.id)),
      ]);

      if (!invoiceResponse.success || !invoiceResponse.data) {
        throw new Error(invoiceResponse.message || 'Không tải được chi tiết hóa đơn');
      }

      setSelectedInvoice(invoiceResponse.data);
      setPayments(paymentResponse.success ? paymentResponse.data : null);
      setIsDetailModalOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được chi tiết hóa đơn');
    } finally {
      setIsSaving(false);
    }
  };

  const openPaymentModal = async (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentForm(initialPaymentForm);
    setIsPaymentModalOpen(true);

    try {
      const response = await invoiceService.getPayments(String(invoice.id));
      setPayments(response.success ? response.data : null);
    } catch {
      setPayments(null);
    }
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    try {
      setIsSaving(true);
      setError(null);
      const response = await invoiceService.confirmPayment(String(selectedInvoice.id), {
        payment_date: paymentForm.paymentDate,
        payment_method: paymentForm.paymentMethod as PaymentMethod,
        transaction_code: paymentForm.transactionCode || undefined,
        note: paymentForm.note || undefined,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không xác nhận được thanh toán');
      }

      setIsPaymentModalOpen(false);
      setSelectedInvoice(null);
      await loadInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không xác nhận được thanh toán');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportInvoice = async (invoice: Invoice) => {
    try {
      setExportingInvoiceId(invoice.id);
      setError(null);

      const content = await invoiceService.exportText(String(invoice.id));
      const filename = `hoa_don_${safeFilePart(invoice.room_number)}_${invoice.month}_${invoice.year}_${invoice.id}.txt`;
      downloadTextFile(content, filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không xuất được hóa đơn');
    } finally {
      setExportingInvoiceId(null);
    }
  };

  const columns: TableColumn<Invoice>[] = [
    { key: 'id', title: 'Mã HĐ', render: (value) => `#${value}` },
    { key: 'tenant_name', title: 'Người Thuê', render: (value) => String(value || 'N/A') },
    { key: 'room_number', title: 'Phòng', render: (value) => String(value || 'N/A') },
    { key: 'month', title: 'Tháng', render: (_, row) => `${row.month}/${row.year}` },
    { key: 'final_amount', title: 'Tổng Tiền', render: (value) => formatCurrency(Number(value)) },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (value) => {
        const status = value as InvoiceStatus;
        return <Badge variant={statusVariants[status] || 'info'}>{statusLabels[status] || String(value)}</Badge>;
      },
    },
    { key: 'due_date', title: 'Hạn Thanh Toán', render: (value) => formatDate(value as string | undefined) },
    {
      key: 'actions',
      title: 'Hành Động',
      render: (_, row) => (
        <ActionButtons>
          <Button onClick={() => handleViewInvoice(row)} disabled={isSaving}>
            Xem
          </Button>
          <Button
            onClick={() => handleExportInvoice(row)}
            disabled={isSaving || exportingInvoiceId !== null}
            loading={exportingInvoiceId === row.id}
          >
            Xuất hóa đơn
          </Button>
          {row.status !== 'paid' && row.status !== 'cancelled' && (
            <Button onClick={() => openPaymentModal(row)} disabled={isSaving}>
              Thanh toán
            </Button>
          )}
        </ActionButtons>
      ),
    },
  ];

  if (loading && invoices.length === 0) {
    return (
      <PageWrapper>
        <Header title="Quản Lý Hóa Đơn" />
        <Loading />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Header
          title="Quản Lý Hóa Đơn"
          actions={
            <Button onClick={() => setIsModalOpen(true)} disabled={isSaving}>
              + Tạo Hóa Đơn
            </Button>
          }
        />

        {error && <Alert message={`Lỗi: ${error}`} type="error" />}

        <Card>
          <Toolbar>
            <FormGroup label="Tìm kiếm">
              <Input
                value={searchText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
                placeholder="Tên người thuê, phòng, mã hóa đơn..."
              />
            </FormGroup>
            <FormGroup label="Trạng thái">
              <Select
                value={statusFilter}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(event.target.value)}
                options={[
                  { value: '', label: 'Tất cả' },
                  { value: 'pending', label: 'Chưa thanh toán' },
                  { value: 'paid', label: 'Đã thanh toán' },
                  { value: 'overdue', label: 'Quá hạn' },
                  { value: 'cancelled', label: 'Đã hủy' },
                ]}
              />
            </FormGroup>
            <Button onClick={loadInvoices} disabled={loading} loading={loading}>
              Tải lại
            </Button>
          </Toolbar>
        </Card>

        <Card>
          <Table columns={columns} data={filteredInvoices} loading={loading} emptyText="Chưa có hóa đơn nào" />
        </Card>

        <Modal
          isOpen={isModalOpen}
          title="Tạo Hóa Đơn Mới"
          onClose={() => {
            setIsModalOpen(false);
            setError(null);
            setGenerationResult(null);
            setInvoicePreview(null);
            setFormData(initialGenerateForm);
          }}
          onConfirm={() => {
            void handleGenerateInvoices({ preventDefault: () => undefined } as React.FormEvent);
          }}
          confirmText={isSaving ? 'Đang tạo...' : 'Tạo'}
          confirmDisabled={isSaving || !formData.contractId || !!invoicePreview?.existing_invoice_id}
          confirmLoading={isSaving}
          cancelText="Đóng"
        >
          <Form onSubmit={handleGenerateInvoices}>
            <FormGrid>
              <FormGroup label="Người Thuê" required>
                <Select
                  value={formData.contractId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, contractId: e.target.value })
                  }
                  options={[{ value: '', label: 'Chọn người thuê' }, ...contractOptions]}
                  disabled={isSaving}
                />
              </FormGroup>
              <FormGroup label="Tháng" required>
                <Select
                  value={formData.month}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({
                      ...formData,
                      month: e.target.value,
                      dueDate: getDefaultDueDate(Number(e.target.value), Number(formData.year)),
                    })
                  }
                  options={monthOptions}
                  disabled={isSaving}
                />
              </FormGroup>
              <FormGroup label="Năm" required>
                <Select
                  value={formData.year}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({
                      ...formData,
                      year: e.target.value,
                      dueDate: getDefaultDueDate(Number(formData.month), Number(e.target.value)),
                    })
                  }
                  options={yearOptions}
                  disabled={isSaving}
                />
              </FormGroup>
              <FormGroup label="Phí Khác">
                <Input
                  type="number"
                  min="0"
                  value={formData.otherFees}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, otherFees: e.target.value })
                  }
                  disabled={isSaving}
                />
              </FormGroup>
              <FormGroup label="Giảm Giá">
                <Input
                  type="number"
                  min="0"
                  value={formData.discount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  disabled={isSaving}
                />
              </FormGroup>
              <FormGroup label="Hạn Thanh Toán">
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  disabled={isSaving}
                />
              </FormGroup>
            </FormGrid>
            {selectedContract && (
              <DetailItem>
                Hợp đồng #{selectedContract.contract_code || selectedContract.id} - Phòng{' '}
                {selectedContract.roomNumber || selectedContract.roomId}. Tiền phòng:{' '}
                <strong>{formatCurrency(Number(selectedContract.monthlyRent ?? selectedContract.price ?? 0))}</strong>
              </DetailItem>
            )}
            {previewLoading && <DetailItem>Đang tính hóa đơn từ dữ liệu hợp đồng, điện nước và dịch vụ...</DetailItem>}
            {invoicePreview && (
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Tiền phòng</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.room_fee)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Dịch vụ đã gán</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.service_fee)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Tiền điện</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.electric_fee)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Tiền nước</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.water_fee)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Phí khác</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.other_fees)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Giảm giá</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.discount)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Tổng cộng</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.total_amount)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Thành tiền</DetailLabel>
                  <DetailValue>{formatCurrency(invoicePreview.final_amount)}</DetailValue>
                </DetailItem>
                {invoicePreview.warning && (
                  <DetailItem>
                    <DetailLabel>Cảnh báo</DetailLabel>
                    <DetailValue>{invoicePreview.warning}</DetailValue>
                  </DetailItem>
                )}
                {invoicePreview.existing_invoice_id && (
                  <DetailItem>
                    <DetailLabel>Trạng thái</DetailLabel>
                    <DetailValue>Đã có hóa đơn #{invoicePreview.existing_invoice_id} cho kỳ này</DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            )}
            {generationResult && (
              <DetailItem>
                Đã tạo {generationResult.created_count} hóa đơn, bỏ qua {generationResult.skipped_count}, cảnh báo{' '}
                {generationResult.warning_count}.
              </DetailItem>
            )}
          </Form>
        </Modal>

        <Modal
          isOpen={isPaymentModalOpen}
          title="Xác Nhận Thanh Toán"
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirm={() => {
            handleConfirmPayment({ preventDefault: () => undefined } as React.FormEvent);
          }}
          confirmText={isSaving ? 'Đang lưu...' : 'Xác nhận'}
          cancelText="Hủy"
        >
          <Form onSubmit={handleConfirmPayment}>
            {selectedInvoice && (
              <DetailItem>
                Hóa đơn #{selectedInvoice.id} - Phòng {selectedInvoice.room_number}. Số tiền còn lại:{' '}
                <strong>{formatCurrency(payments?.remaining_balance ?? selectedInvoice.final_amount)}</strong>
              </DetailItem>
            )}
            <FormGrid>
              <FormGroup label="Ngày Thanh Toán" required>
                <Input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPaymentForm({ ...paymentForm, paymentDate: e.target.value })
                  }
                  disabled={isSaving}
                />
              </FormGroup>
              <FormGroup label="Phương Thức" required>
                <Select
                  value={paymentForm.paymentMethod}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })
                  }
                  options={paymentMethodOptions}
                  disabled={isSaving}
                />
              </FormGroup>
            </FormGrid>
            <FormGroup label="Mã Giao Dịch">
              <Input
                value={paymentForm.transactionCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPaymentForm({ ...paymentForm, transactionCode: e.target.value })
                }
                disabled={isSaving}
              />
            </FormGroup>
            <FormGroup label="Ghi Chú">
              <TextArea
                value={paymentForm.note}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setPaymentForm({ ...paymentForm, note: e.target.value })
                }
                disabled={isSaving}
              />
            </FormGroup>
          </Form>
        </Modal>

        <Modal
          isOpen={isDetailModalOpen}
          title="Chi Tiết Hóa Đơn"
          onClose={() => setIsDetailModalOpen(false)}
          cancelText="Đóng"
        >
          {selectedInvoice && (
            <DetailGrid>
              <DetailItem>
                <DetailLabel>Mã hóa đơn</DetailLabel>
                <DetailValue>#{selectedInvoice.id}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Kỳ hóa đơn</DetailLabel>
                <DetailValue>{selectedInvoice.month}/{selectedInvoice.year}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Người thuê</DetailLabel>
                <DetailValue>{selectedInvoice.tenant_name || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Phòng</DetailLabel>
                <DetailValue>{selectedInvoice.room_number || 'N/A'}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Tiền phòng</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.room_fee)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Dịch vụ</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.service_fee)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Điện</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.electric_fee)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Nước</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.water_fee)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>PhÃ­ khÃ¡c</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.other_fees)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Tá»•ng cá»™ng</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.total_amount)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Giảm giá</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.discount)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Thành tiền</DetailLabel>
                <DetailValue>{formatCurrency(selectedInvoice.final_amount)}</DetailValue>
              </DetailItem>
              <DetailItem>
                <DetailLabel>Hạn thanh toán</DetailLabel>
                <DetailValue>{formatDate(selectedInvoice.due_date)}</DetailValue>
              </DetailItem>
            </DetailGrid>
          )}
        </Modal>
      </Container>
    </PageWrapper>
  );
};
