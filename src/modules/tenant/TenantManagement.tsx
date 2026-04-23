import { useState, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card } from '../../components/common';
import { Table } from '../../components/Table';
import { useTenant } from '../../store/TenantContext';
import { AddTenantModal } from './AddTenantModal';
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
  const { tenants, users, deleteTenant } = useTenant();

  const tenantDisplayData = useMemo(() => {
    return tenants.map((tenant) => {
      const user = users.find((u) => u.id === tenant.userId);
      const room = MOCK_ROOMS.find((r) => r.id === tenant.roomId);

      const genderMap = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác',
      };

      return {
        id: tenant.id,
        name: user?.name || 'N/A',
        idNumber: user?.idNumber || 'N/A',
        gender: genderMap[user?.gender as keyof typeof genderMap] || 'N/A',
        phone: user?.phone || 'N/A',
        roomNumber: room?.roomNumber || 'N/A',
        leaseStart: new Date(tenant.startDate).toLocaleDateString('vi-VN'),
      };
    });
  }, [tenants, users]);

  const columns: TableColumn[] = [
    { key: 'name', title: 'Tên Người Thuê' },
    { key: 'idNumber', title: 'CMND/CCCD' },
    { key: 'gender', title: 'Giới Tính' },
    { key: 'phone', title: 'Điện Thoại' },
    { key: 'roomNumber', title: 'Phòng' },
    { key: 'leaseStart', title: 'Ngày Bắt Đầu' },
    {
      key: 'actions',
      title: 'Hành Động',
      render: (_, row: Record<string, unknown>) => (
        <ActionButtons>
          <Button>Xem Chi Tiết</Button>
          <Button 
            variant="danger" 
            onClick={() => deleteTenant(String(row.id))}
          >
            <DeleteOutlined />
          </Button>
        </ActionButtons>
      ),
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
        <Card>
          <Table 
            columns={columns} 
            data={tenantDisplayData} 
            emptyText="Chưa có người thuê nào" 
          />
        </Card>
      </Container>

      <AddTenantModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        rooms={MOCK_ROOMS}
      />
    </PageWrapper>
  );
};
