import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Badge, Button, Card, Header } from '../../components/common';
import { Table } from '../../components/Table';
import { FormGroup, Select } from '../../components/Forms/Form';
import { utilityService } from './utilityService';
import type { UtilityReading } from './utilityService';

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
  grid-template-columns: repeat(3, minmax(150px, 1fr)) auto;
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }

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

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

export const TenantUtilities = () => {
  const [readings, setReadings] = useState<UtilityReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    month: '',
    year: '',
  });

  const loadReadings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await utilityService.listMyReadings({
        month: filters.month ? Number(filters.month) : undefined,
        year: filters.year ? Number(filters.year) : undefined,
        limit: 100,
      });

      if (!response.success) {
        throw new Error(response.message || 'Không tải được lịch sử điện nước');
      }

      setReadings(response.data ?? []);
    } catch (err) {
      setReadings([]);
      setError(err instanceof Error ? err.message : 'Không tải được lịch sử điện nước');
    } finally {
      setLoading(false);
    }
  }, [filters.month, filters.year]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings]);

  const summary = useMemo(() => {
    return readings.reduce(
      (acc, reading) => {
        const electricUsage = reading.electricNew - reading.electricOld;
        const waterUsage = reading.waterNew - reading.waterOld;
        acc.electricUsage += electricUsage;
        acc.waterUsage += waterUsage;
        acc.amount += electricUsage * reading.electricPrice + waterUsage * reading.waterPrice;
        return acc;
      },
      { electricUsage: 0, waterUsage: 0, amount: 0 }
    );
  }, [readings]);

  const columns: TableColumn<UtilityReading>[] = [
    {
      key: 'roomNumber',
      title: 'Phòng',
      render: (_, row) => <Badge>{row.roomNumber || row.roomId || 'N/A'}</Badge>,
    },
    { key: 'month', title: 'Kỳ ghi', render: (_, row) => `${row.month}/${row.year}` },
    { key: 'electricOld', title: 'Điện cũ' },
    { key: 'electricNew', title: 'Điện mới' },
    { key: 'electricUsage', title: 'Điện tiêu thụ', render: (_, row) => `${row.electricNew - row.electricOld} kWh` },
    { key: 'waterOld', title: 'Nước cũ' },
    { key: 'waterNew', title: 'Nước mới' },
    { key: 'waterUsage', title: 'Nước tiêu thụ', render: (_, row) => `${row.waterNew - row.waterOld} m³` },
    {
      key: 'amount',
      title: 'Tạm tính',
      render: (_, row) => formatCurrency(
        (row.electricNew - row.electricOld) * row.electricPrice +
        (row.waterNew - row.waterOld) * row.waterPrice
      ),
    },
  ];

  return (
    <Container>
      <Header title="Lịch Sử Điện Nước" />

      <Card>
        <Toolbar>
          <FormGroup label="Tháng">
            <Select
              value={filters.month}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setFilters({ ...filters, month: event.target.value })
              }
              options={monthOptions}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup label="Năm">
            <Select
              value={filters.year}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                setFilters({ ...filters, year: event.target.value })
              }
              options={yearOptions}
              disabled={loading}
            />
          </FormGroup>
          <Button onClick={loadReadings} disabled={loading}>
            Tìm kiếm
          </Button>
        </Toolbar>
      </Card>

      <Grid>
        <SummaryItem>
          <SummaryLabel>Số kỳ</SummaryLabel>
          <SummaryValue>{readings.length}</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Tổng điện</SummaryLabel>
          <SummaryValue>{summary.electricUsage} kWh</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Tổng nước</SummaryLabel>
          <SummaryValue>{summary.waterUsage} m³</SummaryValue>
        </SummaryItem>
        <SummaryItem>
          <SummaryLabel>Tổng tạm tính</SummaryLabel>
          <SummaryValue>{formatCurrency(summary.amount)}</SummaryValue>
        </SummaryItem>
      </Grid>

      {error && <ErrorText>Lỗi: {error}</ErrorText>}

      <Card>
        <Table columns={columns} data={readings} loading={loading} emptyText="Chưa có lịch sử điện nước" />
      </Card>
    </Container>
  );
};
