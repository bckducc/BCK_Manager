import { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Loading, Alert } from '../../components/common';
import { Table } from '../../components/Table';
import { useContract } from '../../store/contract-context';
import type { Contract } from './contract.types';

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

const PrintContainer = styled.div`
  @media print {
    padding: ${theme.spacing.lg};
    background: white;
  }
`;

export const ContractManagement = () => {
  const { contracts, loading, deleteContract } = useContract();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteContract = useCallback(async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hợp đồng này?')) {
      try {
        await deleteContract(id);
      } catch (err) {
        setDeleteError(err instanceof Error ? err.message : 'Failed to delete contract');
      }
    }
  }, [deleteContract]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const columns: TableColumn[] = useMemo(() => [
    { key: 'id', title: 'Mã HĐ', width: '12%' },
    { 
      key: 'tenantName', 
      title: 'Tên Người Thuê',
      width: '18%',
      render: (_: unknown, row: unknown) => {
        const contract = row as Contract;
        return (
          contract.tenantName ||
          contract.tenant?.currentUser?.name ||
          contract.tenant?.currentUser?.username ||
          contract.tenant?.currentUser?.email ||
          contract.tenant?.currentUser?.id ||
          'N/A'
        );
      },
    },
    { 
      key: 'roomNumber', 
      title: 'Số Phòng',
      width: '12%',
      render: (_: unknown, row: unknown) => {
        const contract = row as Contract;
        return (
          contract.roomNumber ||
          contract.room?.roomNumber ||
          contract.room?.room_number ||
          contract.room?.name ||
          'N/A'
        );
      },
    },
    { 
      key: 'startDate', 
      title: 'Ngày Bắt Đầu',
      width: '13%',
      render: (val: unknown) => {
        const date = val instanceof Date ? val : new Date(val as string);
        return date.toLocaleDateString('vi-VN');
      },
    },
    { 
      key: 'endDate', 
      title: 'Ngày Kết Thúc',
      width: '13%',
      render: (val: unknown) => {
        const date = val instanceof Date ? val : new Date(val as string);
        return date.toLocaleDateString('vi-VN');
      },
    },
    { 
      key: 'price', 
      title: 'Giá Thuê (VNĐ)',
      width: '13%',
      render: (val: unknown) => {
        const price = typeof val === 'number' ? val : 0;
        return new Intl.NumberFormat('vi-VN').format(price);
      },
    },
    {
      key: 'status',
      title: 'Trạng Thái',
      width: '13%',
      render: (val: unknown) => {
        const status = val as string;
        const colors: Record<string, string> = {
          active: theme.colors.success,
          expired: theme.colors.danger,
          terminated: theme.colors.warning,
        };
        const labels: Record<string, string> = {
          active: 'Còn Hiệu Lực',
          expired: 'Hết Hiệu Lực',
          terminated: 'Đã Chấm Dứt',
        };
        return <span style={{ color: colors[status] || 'black' }}>{labels[status] || status}</span>;
      },
    },
    {
      key: 'actions',
      title: 'Hành Động',
      width: '6%',
      render: (_: unknown, row: unknown) => {
        const contract = row as Contract;
        return (
          <ActionButtons>
            <Button
              variant="danger"
              onClick={() => handleDeleteContract(contract.id)}
            >
              ✕ Xóa
            </Button>
          </ActionButtons>
        );
      },
    },
  ], [handleDeleteContract]);

  if (loading && contracts.length === 0) {
    return <Loading />;
  }

  return (
    <PageWrapper>
      <Container>
        {deleteError && (
          <Alert 
            type="error" 
            message={deleteError}
          />
        )}
        
        <Header
          title="Quản Lý Hợp Đồng"
          actions={
            <Button onClick={handlePrint} variant="secondary">
              🖨 In Danh Sách
            </Button>
          }
        />

        <Card>
          <PrintContainer>
            {contracts.length > 0 ? (
              <Table columns={columns} data={contracts} />
            ) : (
              <div style={{ textAlign: 'center', padding: theme.spacing.lg, color: theme.colors.textSecondary }}>
                Chưa có hợp đồng nào
              </div>
            )}
          </PrintContainer>
        </Card>
      </Container>
    </PageWrapper>
  );
};
