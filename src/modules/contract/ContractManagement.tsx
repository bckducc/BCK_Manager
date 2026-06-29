import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Loading, Alert, Modal } from '../../components/common';
import { Table } from '../../components/Table';
import { Form, FormGroup, Input, Select, TextArea } from '../../components/Forms/Form';
import { useContract } from '../../store/contract-context';
import type { Contract } from './contract.types';
import { tenantService } from '../tenant/tenantService';
import { roomService } from '../room/roomService';
import type { Tenant } from '../tenant/tenant.types';
import type { Room } from '../room/room.types';

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
  grid-template-columns: minmax(220px, 1fr) minmax(160px, 220px) auto;
  gap: ${theme.spacing.md};
  align-items: flex-end;

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

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  flex-wrap: wrap;

  button {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

const initialContractForm = {
  tenantId: '',
  roomId: '',
  contractCode: '',
  startDate: '',
  endDate: '',
  depositAmount: '',
  monthlyRent: '',
  signedDate: '',
  terms: '',
};

const statusLabels: Record<Contract['status'], string> = {
  active: 'Còn hiệu lực',
  expired: 'Hết hiệu lực',
  terminated: 'Đã kết thúc',
};

const statusColors: Record<Contract['status'], string> = {
  active: theme.colors.success,
  expired: theme.colors.danger,
  terminated: theme.colors.warning,
};

const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN');
};

const formatCurrency = (value: unknown) => {
  const amount = Number(value || 0);
  return `${amount.toLocaleString('vi-VN')} đ`;
};

export const ContractManagement = () => {
  const { contracts, loading, error, addContract, deleteContract, fetchContracts } = useContract();
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState(initialContractForm);

  const loadOptions = useCallback(async () => {
    try {
      const [tenantResponse, roomResponse] = await Promise.all([
        tenantService.getAll({ hasActiveContract: false }),
        roomService.getAvailable(),
      ]);

      const tenantData = tenantResponse.data as unknown;
      const roomData = roomResponse.data as unknown;
      const availableTenants = Array.isArray(tenantData)
        ? tenantData as Tenant[]
        : Array.isArray((tenantData as Record<string, unknown> | undefined)?.tenants)
          ? (tenantData as Record<string, unknown>).tenants as Tenant[]
          : [];

      setTenants(availableTenants.filter((tenant) => {
        const record = tenant as Tenant & { has_active_contract?: boolean | number | string };
        const hasActiveContract = record.has_active_contract === true || Number(record.has_active_contract) === 1;
        return !hasActiveContract;
      }));
      setRooms(
        Array.isArray(roomData)
          ? roomData as Room[]
          : Array.isArray((roomData as Record<string, unknown> | undefined)?.rooms)
            ? (roomData as Record<string, unknown>).rooms as Room[]
            : []
      );
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không tải được dữ liệu tạo hợp đồng');
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const tenantOptions = tenants.map((tenant) => {
    const record = tenant as Tenant & {
      user_id?: string | number;
      full_name?: string;
      username?: string;
    };
    const id = String(record.user_id || tenant.userId || tenant.id);
    const label = record.full_name || tenant.currentUser?.name || record.username || id;
    return { value: id, label };
  });

  const roomOptions = rooms.map((room) => ({
    value: String(room.id),
    label: `Phòng ${room.room_number || room.roomNumber || room.name || room.id}`,
  }));

  const filteredContracts = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    return contracts.filter((contract) => {
      const matchesStatus = !statusFilter || contract.status === statusFilter;
      const searchContent = [
        contract.contract_code,
        contract.tenantName,
        contract.tenantPhone,
        contract.roomNumber,
      ].join(' ').toLowerCase();
      return matchesStatus && (!keyword || searchContent.includes(keyword));
    });
  }, [contracts, searchText, statusFilter]);

  const handleTerminateContract = useCallback(async (contract: Contract) => {
    if (contract.status === 'terminated') return;
    if (!window.confirm('Bạn có chắc chắn muốn kết thúc hợp đồng này?')) return;

    try {
      setActionError(null);
      await deleteContract(contract.id);
      await loadOptions();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Không kết thúc được hợp đồng');
    }
  }, [deleteContract, loadOptions]);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tenantId || !formData.roomId || !formData.startDate || !formData.endDate || !formData.depositAmount || !formData.monthlyRent) {
      alert('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError(null);
      await addContract({
        tenantId: formData.tenantId,
        roomId: formData.roomId,
        contractCode: formData.contractCode || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        depositAmount: Number(formData.depositAmount),
        monthlyRent: Number(formData.monthlyRent),
        signedDate: formData.signedDate || undefined,
        terms: formData.terms || undefined,
      });

      setIsModalOpen(false);
      setFormData(initialContractForm);
      await Promise.all([fetchContracts(), loadOptions()]);
      alert('Tạo hợp đồng thành công');
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không tạo được hợp đồng'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: TableColumn<Contract>[] = useMemo(() => [
    { key: 'contract_code', title: 'Mã HĐ', width: '12%', render: (value) => String(value || 'N/A') },
    { key: 'tenantName', title: 'Tên Người Thuê', width: '18%', render: (_, row) => row.tenantName || 'N/A' },
    { key: 'roomNumber', title: 'Số Phòng', width: '12%', render: (_, row) => row.roomNumber || 'N/A' },
    { key: 'startDate', title: 'Ngày Bắt Đầu', width: '13%', render: (value) => formatDate(value as Date | string) },
    { key: 'endDate', title: 'Ngày Kết Thúc', width: '13%', render: (value) => formatDate(value as Date | string) },
    { key: 'monthlyRent', title: 'Giá Phòng', width: '13%', render: (_, row) => formatCurrency(row.monthlyRent ?? row.price) },
    {
      key: 'status',
      title: 'Trạng Thái',
      width: '13%',
      render: (value) => {
        const status = value as Contract['status'];
        return <span style={{ color: statusColors[status] || theme.colors.text }}>{statusLabels[status] || status}</span>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      width: '10%',
      render: (_, contract) => (
        <ActionButtons>
          <Button
            variant="secondary"
            onClick={() => handleTerminateContract(contract)}
            disabled={contract.status === 'terminated'}
          >
            Kết thúc
          </Button>
        </ActionButtons>
      ),
    },
  ], [handleTerminateContract]);

  if (loading && contracts.length === 0) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <Container>
        {(actionError || error) && (
          <Alert type="error" message={actionError || error || ''} />
        )}

        <Header
          title="Quản Lý Hợp Đồng"
          actions={
            <ActionButtons>
              <Button onClick={() => {
                setFormData(initialContractForm);
                setIsModalOpen(true);
                loadOptions();
              }}>
                + Tạo Hợp Đồng
              </Button>
            </ActionButtons>
          }
        />

        <Card>
          <Toolbar>
            <FormGroup label="Tìm kiếm">
              <Input
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                placeholder="Tên người thuê, phòng, mã hợp đồng..."
              />
            </FormGroup>
            <FormGroup label="Trạng thái">
              <Select
                value={statusFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'Tất cả' },
                  { value: 'active', label: 'Còn hiệu lực' },
                  { value: 'expired', label: 'Hết hiệu lực' },
                  { value: 'terminated', label: 'Đã kết thúc' },
                ]}
              />
            </FormGroup>
            <Button onClick={fetchContracts} disabled={loading}>
              Tải lại
            </Button>
          </Toolbar>
        </Card>

        <Card>
          <Table columns={columns} data={filteredContracts} emptyText="Chưa có hợp đồng nào" />
        </Card>

        <Modal
          isOpen={isModalOpen}
          title="Tạo Hợp Đồng Mới"
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {
            handleCreateContract({ preventDefault: () => undefined } as React.FormEvent);
          }}
          confirmText={isSubmitting ? 'Đang tạo...' : 'Tạo'}
          cancelText="Hủy"
        >
          <Form onSubmit={handleCreateContract}>
            <FormGrid>
              <FormGroup label="Người thuê" required>
                <Select
                  value={formData.tenantId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFormData({ ...formData, tenantId: e.target.value })
                  }
                  options={tenantOptions}
                  placeholder={tenantOptions.length > 0 ? 'Chọn người thuê...' : 'Không có người thuê chưa có phòng'}
                  disabled={isSubmitting || tenantOptions.length === 0}
                />
              </FormGroup>
              <FormGroup label="Phòng" required>
                <Select
                  value={formData.roomId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const room = rooms.find((item) => String(item.id) === e.target.value);
                    const roomPrice = Number(room?.price || 0);
                    const roomDeposit = Number(room?.deposit ?? roomPrice * 2);
                    setFormData({
                      ...formData,
                      roomId: e.target.value,
                      monthlyRent: roomPrice > 0 ? String(roomPrice) : formData.monthlyRent,
                      depositAmount: roomDeposit > 0 ? String(roomDeposit) : formData.depositAmount,
                    });
                  }}
                  options={roomOptions}
                  placeholder="Chọn phòng..."
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup label="Mã hợp đồng">
                <Input
                  value={formData.contractCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, contractCode: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup label="Ngày ký">
                <Input
                  type="date"
                  value={formData.signedDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, signedDate: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup label="Ngày bắt đầu" required>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup label="Ngày kết thúc" required>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup label="Tiền cọc" required>
                <Input
                  type="number"
                  min="0"
                  value={formData.depositAmount}
                  readOnly
                  placeholder="Chọn phòng để tự động điền"
                  disabled={isSubmitting}
                />
              </FormGroup>
              <FormGroup label="Giá phòng/tháng" required>
                <Input
                  type="number"
                  min="0"
                  value={formData.monthlyRent}
                  readOnly
                  placeholder="Chọn phòng để tự động điền"
                  disabled={isSubmitting}
                />
              </FormGroup>
            </FormGrid>
            <FormGroup label="Điều khoản">
              <TextArea
                value={formData.terms}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setFormData({ ...formData, terms: e.target.value })
                }
                disabled={isSubmitting}
              />
            </FormGroup>
          </Form>
        </Modal>
      </Container>
    </PageWrapper>
  );
};
