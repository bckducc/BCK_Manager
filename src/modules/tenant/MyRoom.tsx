import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Header } from '../../components/common';
import { contractService } from '../contract/contractService';
import type { Contract } from '../contract/contract.types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};

  label {
    display: block;
    margin-bottom: ${theme.spacing.xs};
    font-size: ${theme.fontSize.sm};
    color: ${theme.colors.textSecondary};
  }

  span {
    color: ${theme.colors.dark};
    font-weight: ${theme.fontWeight.semibold};
  }
`;

const Notice = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
  color: ${theme.colors.textSecondary};
`;

type TenantContract = Contract & {
  landlord_name?: string;
  landlord_phone?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
};

const formatCurrency = (value?: number) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const formatDate = (value?: Date | string) => {
  if (!value) return 'N/A';
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('vi-VN');
};

export const MyRoom = () => {
  const [contract, setContract] = useState<TenantContract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contractService.getMyContract();

        if (!response.success) {
          throw new Error(response.message || 'Không tải được phòng đang thuê');
        }

        setContract((response.data as TenantContract | undefined) ?? null);
      } catch (err) {
        setContract(null);
        setError(err instanceof Error ? err.message : 'Không tải được phòng đang thuê');
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, []);

  const room = contract?.room;

  return (
    <Container>
      <Header title="Phòng Đang Thuê" />

      {loading && <Notice>Đang tải thông tin phòng...</Notice>}
      {error && <Notice>Lỗi: {error}</Notice>}
      {!loading && !error && !contract && <Notice>Bạn chưa có hợp đồng thuê phòng đang hiệu lực.</Notice>}

      {contract && (
        <>
          <Card title="Thông Tin Phòng">
            <Grid>
              <Field>
                <label>Số phòng</label>
                <span>{contract.roomNumber || room?.room_number || 'N/A'}</span>
              </Field>
              <Field>
                <label>Tầng</label>
                <span>{contract.floor ?? room?.floor ?? 'N/A'}</span>
              </Field>
              <Field>
                <label>Diện tích</label>
                <span>{room?.area ? `${room.area} m²` : 'N/A'}</span>
              </Field>
              <Field>
                <label>Giá thuê/tháng</label>
                <span>{formatCurrency(contract.price || room?.price)}</span>
              </Field>
              <Field>
                <label>Mã hợp đồng</label>
                <span>{contract.contract_code || `#${contract.id}`}</span>
              </Field>
              <Field>
                <label>Thời hạn</label>
                <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
              </Field>
              <Field>
                <label>Tiền cọc</label>
                <span>{formatCurrency(contract.depositAmount)}</span>
              </Field>
              <Field>
                <label>Trạng thái</label>
                <span>{contract.status === 'active' ? 'Còn hiệu lực' : contract.status}</span>
              </Field>
            </Grid>
          </Card>

          <Card title="Thông Tin Chủ Nhà">
            <Grid>
              <Field>
                <label>Chủ nhà</label>
                <span>{contract.landlord_name || 'N/A'}</span>
              </Field>
              <Field>
                <label>Số điện thoại</label>
                <span>{contract.landlord_phone || 'N/A'}</span>
              </Field>
              <Field>
                <label>Ngân hàng</label>
                <span>{contract.bank_name || 'N/A'}</span>
              </Field>
              <Field>
                <label>Số tài khoản</label>
                <span>{contract.bank_account_number || 'N/A'}</span>
              </Field>
            </Grid>
          </Card>

          {(room?.description || contract.terms) && (
            <Card title="Ghi Chú">
              <Notice>{room?.description || contract.terms}</Notice>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};
