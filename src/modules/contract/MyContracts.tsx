import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Badge, Button, Card, Header, Modal } from '../../components/common';
import { Table } from '../../components/Table';
import { FormGroup, Input, Select } from '../../components/Forms/Form';
import { contractService } from './contractService';
import type { Contract } from './contract.types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(160px, 220px) auto;
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
`;

const SummaryLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const SummaryValue = styled.div`
  color: ${theme.colors.dark};
  font-weight: ${theme.fontWeight.bold};
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

const statusLabels: Record<Contract['status'], string> = {
  active: 'Còn hiệu lực',
  expired: 'Hết hiệu lực',
  terminated: 'Đã kết thúc',
};

const statusVariants: Record<Contract['status'], 'success' | 'danger' | 'warning'> = {
  active: 'success',
  expired: 'danger',
  terminated: 'warning',
};

const formatCurrency = (value: unknown) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const formatDate = (value?: Date | string) => {
  if (!value) return 'N/A';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN');
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

const buildContractText = (contract: Contract) => [
  'HOP DONG THUE PHONG',
  `Ma hop dong: ${contract.contract_code || contract.id}`,
  `Phong: ${contract.roomNumber || 'N/A'}`,
  `Ngay bat dau: ${formatDate(contract.startDate)}`,
  `Ngay ket thuc: ${formatDate(contract.endDate)}`,
  `Gia thue: ${formatCurrency(contract.monthlyRent ?? contract.price)}`,
  `Tien coc: ${formatCurrency(contract.depositAmount)}`,
  `Trang thai: ${statusLabels[contract.status] || contract.status}`,
  '',
  'Dieu khoan:',
  contract.terms || 'N/A',
].join('\n');

export const MyContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: '' });

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.getMyContract();

      if (!response.success) {
        throw new Error(response.message || 'Không tải được hợp đồng');
      }

      setContracts(response.data ? [response.data] : []);
    } catch (err) {
      setContracts([]);
      setError(err instanceof Error ? err.message : 'Không tải được hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const filteredContracts = useMemo(() => {
    const keyword = filters.search.trim().toLowerCase();
    return contracts.filter((contract) => {
      const matchesStatus = !filters.status || contract.status === filters.status;
      const content = [
        contract.contract_code,
        contract.roomNumber,
        contract.tenantName,
        contract.terms,
      ].join(' ').toLowerCase();
      return matchesStatus && (!keyword || content.includes(keyword));
    });
  }, [contracts, filters.search, filters.status]);

  const openDetailModal = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDetailModalOpen(true);
  };

  const handleExport = (contract: Contract) => {
    downloadTextFile(buildContractText(contract), `hopdong_${contract.contract_code || contract.id}.txt`);
  };

  const columns: TableColumn<Contract>[] = [
    { key: 'contract_code', title: 'Mã HĐ', render: (_, row) => row.contract_code || `#${row.id}` },
    { key: 'roomNumber', title: 'Phòng', render: (_, row) => row.roomNumber || 'N/A' },
    { key: 'startDate', title: 'Ngày bắt đầu', render: (value) => formatDate(value as Date | string) },
    { key: 'endDate', title: 'Ngày kết thúc', render: (value) => formatDate(value as Date | string) },
    { key: 'monthlyRent', title: 'Giá thuê', render: (_, row) => formatCurrency(row.monthlyRent ?? row.price) },
    {
      key: 'status',
      title: 'Trạng thái',
      render: (value) => {
        const status = value as Contract['status'];
        return <Badge variant={statusVariants[status] || 'warning'}>{statusLabels[status] || status}</Badge>;
      },
    },
    {
      key: 'actions',
      title: 'Hành động',
      render: (_, contract) => (
        <ActionButtons>
          <Button onClick={() => openDetailModal(contract)}>Xem</Button>
          <Button onClick={() => handleExport(contract)}>Xuất</Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <Container>
      <Header title="Hợp Đồng Của Tôi" />

      <Card>
        <Toolbar>
          <FormGroup label="Tìm kiếm">
            <Input
              value={filters.search}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFilters({ ...filters, search: event.target.value })
              }
              placeholder="Mã hợp đồng, phòng, điều khoản..."
              disabled={loading}
            />
          </FormGroup>
          <FormGroup label="Trạng thái">
            <Select
              value={filters.status}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setFilters({ ...filters, status: event.target.value })
              }
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'active', label: 'Còn hiệu lực' },
                { value: 'expired', label: 'Hết hiệu lực' },
                { value: 'terminated', label: 'Đã kết thúc' },
              ]}
              disabled={loading}
            />
          </FormGroup>
          <Button onClick={loadContracts} disabled={loading}>
            Tải lại
          </Button>
        </Toolbar>
      </Card>

      {error && <ErrorText>Lỗi: {error}</ErrorText>}

      <Card>
        <Table columns={columns} data={filteredContracts} loading={loading} emptyText="Chưa có hợp đồng nào" />
      </Card>

      <Modal
        isOpen={isDetailModalOpen}
        title="Chi Tiết Hợp Đồng"
        onClose={() => setIsDetailModalOpen(false)}
        cancelText="Đóng"
      >
        {selectedContract && (
          <Grid>
            <SummaryItem>
              <SummaryLabel>Mã hợp đồng</SummaryLabel>
              <SummaryValue>{selectedContract.contract_code || `#${selectedContract.id}`}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Phòng</SummaryLabel>
              <SummaryValue>{selectedContract.roomNumber || 'N/A'}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Ngày bắt đầu</SummaryLabel>
              <SummaryValue>{formatDate(selectedContract.startDate)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Ngày kết thúc</SummaryLabel>
              <SummaryValue>{formatDate(selectedContract.endDate)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Giá thuê</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedContract.monthlyRent ?? selectedContract.price)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Tiền cọc</SummaryLabel>
              <SummaryValue>{formatCurrency(selectedContract.depositAmount)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Ngày ký</SummaryLabel>
              <SummaryValue>{formatDate(selectedContract.signedDate)}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Trạng thái</SummaryLabel>
              <SummaryValue>{statusLabels[selectedContract.status] || selectedContract.status}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Điều khoản</SummaryLabel>
              <SummaryValue>{selectedContract.terms || 'N/A'}</SummaryValue>
            </SummaryItem>
          </Grid>
        )}
      </Modal>
    </Container>
  );
};
