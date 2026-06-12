import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Alert, Loading } from '../../components/common';
import { Table } from '../../components/Table';
import { useTenant } from '../../store/TenantContext';
import { useContract } from '../../store/contract-context';
import { AddTenantModal } from './AddTenantModal';
import type { Tenant } from './tenant.types';
import { LockOutlined } from '@ant-design/icons';

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

const ErrorContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: flex-start;
  
  > div {
    flex: 1;
  }
  
  button {
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;

    button {
      width: 100%;
      white-space: normal;
    }
  }
`;

const SearchPanel = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  width: min(420px, 100%);
  padding: 0.75rem;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.base};
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const MOCK_ROOMS = [
  { id: 'room_1', roomNumber: '101' },
  { id: 'room_2', roomNumber: '102' },
  { id: 'room_3', roomNumber: '103' },
  { id: 'room_4', roomNumber: '201' },
  { id: 'room_5', roomNumber: '202' },
  { id: 'room_6', roomNumber: '203' },
  { id: 'room_7', roomNumber: '301' },
  { id: 'room_8', roomNumber: '302' },
];

export const TenantManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [searchText, setSearchText] = useState('');
  const { tenants, loading, error, deleteTenant, fetchTenants } = useTenant();
  const { contracts } = useContract();

  const handleEditTenant = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTenant(null);
  };

  const tenantDisplayData = useMemo(() => {
    return tenants.map((tenant) => {
      const genderMap = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác',
      };

      const user = tenant.currentUser;
      const room = tenant.currentRoom;
      const activeContract = contracts.find((contract) => {
        const tenantUserId = String(tenant.userId || tenant.id);
        return (
          contract.status === 'active' &&
          (String(contract.tenantId) === tenantUserId || String(contract.tenant?.userId) === tenantUserId)
        );
      });

      return {
        id: tenant.id,
        username: user?.username || '',
        name: user?.name || 'N/A',
        idNumber: user?.idNumber || 'N/A',
        gender: user?.gender ? genderMap[user.gender as keyof typeof genderMap] : 'N/A',
        phone: user?.phone || 'N/A',
        roomNumber:
          activeContract?.roomNumber ||
          activeContract?.room?.roomNumber ||
          (activeContract?.room as { room_number?: string } | undefined)?.room_number ||
          room?.roomNumber ||
          (room as { room_number?: string } | undefined)?.room_number ||
          'Chưa có phòng',
        leaseStart: new Date(tenant.startDate).toLocaleDateString('vi-VN'),
      };
    });
  }, [contracts, tenants]);

  const filteredTenantData = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return tenantDisplayData;

    return tenantDisplayData.filter((tenant) =>
      [tenant.username, tenant.name, tenant.phone, tenant.idNumber, tenant.roomNumber]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }, [searchText, tenantDisplayData]);

  const columns: TableColumn<Record<string, unknown>>[] = [
    { key: 'name', title: 'Tên Người Thuê' },
    { key: 'phone', title: 'Điện Thoại' },
    { key: 'idNumber', title: 'CMND/CCCD' },
    { key: 'gender', title: 'Giới Tính' },
    { key: 'roomNumber', title: 'Phòng' },
    { key: 'leaseStart', title: 'Ngày Bắt Đầu' },
    {
      key: 'actions',
      title: 'Hành Động',
      render: (_: unknown, row: Record<string, unknown>) => {
        const tenant = tenants.find(t => String(t.id) === String(row.id));
        return (
          <ActionButtons>
            <Button onClick={() => tenant && handleEditTenant(tenant)}>Sửa</Button>
            <Button 
              variant="danger" 
              onClick={async () => {
                if (window.confirm(`Bạn có chắc chắn muốn khóa tài khoản người thuê ${row.name}?`)) {
                  try {
                    await deleteTenant(String(row.id));
                    alert('Khóa tài khoản người thuê thành công');
                  } catch (err) {
                    alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể khóa tài khoản'}`);
                  }
                }
              }}
            >
              <LockOutlined /> Khóa tài khoản
            </Button>
          </ActionButtons>
        );
      },
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header
          title="Quản Lý Người Thuê"
          actions={
            <Button onClick={() => setIsModalOpen(true)}>
              + Thêm Người Thuê
            </Button>
          }
        />
        {error && (
          <ErrorContainer>
            <Alert 
              message={`❌ Lỗi: ${error}\n⚠️ Backend không kết nối được. Kiểm tra:\n✓ Backend http://localhost:5000\n✓ Database kết nối\n✓ Endpoint GET /api/v1/tenants`}
              type="error"
            />
            <Button onClick={() => fetchTenants()} variant="primary">
              ↻ Thử Lại
            </Button>
          </ErrorContainer>
        )}
        <Card>
          <SearchPanel>
            <SearchInput
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Tìm kiếm người thuê theo tên, tài khoản, SĐT, CCCD hoặc phòng"
              aria-label="Tìm kiếm người thuê"
            />
            {searchText && (
              <Button type="button" onClick={() => setSearchText('')}>
                Xóa tìm kiếm
              </Button>
            )}
          </SearchPanel>
        </Card>
        <Card>
          {loading ? (
            <Loading />
          ) : (
            <Table 
              columns={columns} 
              data={filteredTenantData} 
              emptyText={searchText.trim() ? 'Không tìm thấy người thuê phù hợp' : 'Chưa có người thuê nào'} 
            />
          )}
        </Card>
      </Container>

      <AddTenantModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        rooms={MOCK_ROOMS}
        editingTenant={editingTenant || undefined}
      />
    </PageWrapper>
  );
};
