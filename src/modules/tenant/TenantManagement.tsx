import { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Alert, Loading } from '../../components/common';
import { Table } from '../../components/Table';
import { useTenant } from '../../store/TenantContext';
import { AddTenantModal } from './AddTenantModal';
import type { Tenant } from './tenant.types';
import { DeleteOutlined } from '@ant-design/icons';

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

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

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
  const { tenants, loading, error, deleteTenant, fetchTenants } = useTenant();

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

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

      return {
        id: tenant.id,
        name: user?.name || 'N/A',
        idNumber: user?.idNumber || 'N/A',
        gender: user?.gender ? genderMap[user.gender as keyof typeof genderMap] : 'N/A',
        phone: user?.phone || 'N/A',
        roomNumber: room?.roomNumber || 'N/A',
        leaseStart: new Date(tenant.startDate).toLocaleDateString('vi-VN'),
      };
    });
  }, [tenants]);

  const columns: TableColumn<Record<string, unknown>>[] = [
    { key: 'name', title: 'Tên Người Thuê' },
    { key: 'idNumber', title: 'CMND/CCCD' },
    { key: 'gender', title: 'Giới Tính' },
    { key: 'phone', title: 'Điện Thoại' },
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
                if (window.confirm(`Bạn có chắc chắn muốn xóa người thuê ${row.name}?`)) {
                  try {
                    await deleteTenant(String(row.id));
                    alert('Xóa người thuê thành công');
                  } catch (err) {
                    alert(`Lỗi: ${err instanceof Error ? err.message : 'Không thể xóa'}`);
                  }
                }
              }}
            >
              <DeleteOutlined />
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
          {loading ? (
            <Loading />
          ) : (
            <Table 
              columns={columns} 
              data={tenantDisplayData} 
              emptyText="Chưa có người thuê nào" 
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
