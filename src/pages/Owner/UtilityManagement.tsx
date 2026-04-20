import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card, Badge, Modal } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { roomService } from '../../services';
import type { Room } from '../../types';

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

const FilterSection = styled(Card)`
  background: linear-gradient(135deg, ${theme.colors.primary}10 0%, transparent 100%);
  border-left: 4px solid ${theme.colors.primary};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroupSmall = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  label {
    font-size: ${theme.fontSize.sm};
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.dark};
  }

  select,
  input {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius.sm};
    font-size: ${theme.fontSize.base};

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}20;
    }
  }
`;

const FilterButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};

  button {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  margin: ${theme.spacing.md} 0;
`;

const StatLabel = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  text-align: center;
  background-color: ${theme.colors.lightBg};
  border-radius: ${theme.radius.md};
  border: 2px dashed ${theme.colors.border};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${theme.spacing.md};
`;

const EmptyTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.dark};
  margin-bottom: ${theme.spacing.sm};
`;

const EmptyDesc = styled.p`
  color: ${theme.colors.textSecondary};
  margin: 0;
`;

interface UtilityReading {
  id: string;
  roomId: string;
  roomNumber: string;
  month: number;
  year: number;
  electricityReading: number;
  waterReading: number;
  readingDate: string;
}

interface FilterState {
  roomId: string;
  startMonth: number;
  startYear: number;
  endMonth: number;
  endYear: number;
}

export const UtilityManagement = () => {
  const { user } = useAuth();
  const { data: roomsData } = useFetch(() => roomService.getAll());

  const [rooms, setRooms] = useState<Room[]>([]);
  const [readings] = useState<UtilityReading[]>([
    { id: '1', roomId: '1', roomNumber: '101', month: 1, year: 2024, electricityReading: 150, waterReading: 12, readingDate: '2024-01-15' },
    { id: '2', roomId: '1', roomNumber: '101', month: 2, year: 2024, electricityReading: 165, waterReading: 15, readingDate: '2024-02-15' },
    { id: '3', roomId: '2', roomNumber: '102', month: 1, year: 2024, electricityReading: 170, waterReading: 18, readingDate: '2024-01-15' },
    { id: '4', roomId: '2', roomNumber: '102', month: 2, year: 2024, electricityReading: 185, waterReading: 20, readingDate: '2024-02-15' },
  ]);

  const currentDate = new Date();
  const [filter, setFilter] = useState<FilterState>({
    roomId: '',
    startMonth: currentDate.getMonth() + 1,
    startYear: currentDate.getFullYear(),
    endMonth: currentDate.getMonth() + 1,
    endYear: currentDate.getFullYear(),
  });

  useEffect(() => {
    if (roomsData) {
      const dataObj = roomsData as Record<string, unknown>;
      if (dataObj.rooms && Array.isArray(dataObj.rooms)) {
        setRooms(dataObj.rooms as Room[]);
        if (user?.role === 'tenant' && (dataObj.rooms as Room[]).length > 0) {
          setFilter((prev) => ({ ...prev, roomId: ((dataObj.rooms as Room[])[0].id as string) || '' }));
        }
      }
    }
  }, [roomsData, user]);

  const filteredReadings = readings.filter((reading) => {
    if (filter.roomId && reading.roomId !== filter.roomId) return false;
    const readingYearMonth = reading.year * 100 + reading.month;
    const startYearMonth = filter.startYear * 100 + filter.startMonth;
    const endYearMonth = filter.endYear * 100 + filter.endMonth;
    return readingYearMonth >= startYearMonth && readingYearMonth <= endYearMonth;
  });

  const stats = {
    totalReadings: filteredReadings.length,
    avgElectricity: filteredReadings.length > 0
      ? (filteredReadings.reduce((sum, r) => sum + r.electricityReading, 0) / filteredReadings.length).toFixed(2)
      : 0,
    avgWater: filteredReadings.length > 0
      ? (filteredReadings.reduce((sum, r) => sum + r.waterReading, 0) / filteredReadings.length).toFixed(2)
      : 0,
  };

  const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter((prev) => ({ ...prev, roomId: e.target.value }));
  };

  const handleDateChange = (field: keyof FilterState, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: parseInt(value) }));
  };

  const handleResetFilter = () => {
    setFilter({
      roomId: user?.role === 'tenant' ? (rooms[0]?.id as string) || '' : '',
      startMonth: currentDate.getMonth() + 1,
      startYear: currentDate.getFullYear(),
      endMonth: currentDate.getMonth() + 1,
      endYear: currentDate.getFullYear(),
    });
  };

  const columns: TableColumn[] = [
    { key: 'roomNumber', title: 'Phòng', render: (value) => <Badge>{value}</Badge> },
    { key: 'month', title: 'Tháng/Năm', render: (value, record: UtilityReading) => `${value}/${record.year}` },
    { key: 'electricityReading', title: 'Chỉ Số Điện (kWh)', render: (value) => <Badge variant="warning">⚡ {value}</Badge> },
    { key: 'waterReading', title: 'Chỉ Số Nước (m³)', render: (value) => <Badge variant="info">💧 {value}</Badge> },
    { key: 'readingDate', title: 'Ngày Ghi Chỉ Số' },
  ];

  const availableRooms = user?.role === 'tenant' ? rooms.filter((r) => r.id === user.id) : rooms;
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: `Tháng ${i + 1}` }));
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({ value: String(currentYear - i), label: String(currentYear - i) }));

  return (
    <PageWrapper>
      <Container>
        <Header title="Quản lý điện nước" />
        <FilterSection>
          <div style={{ marginBottom: theme.spacing.md }}>
            <h3 style={{ margin: 0, color: theme.colors.dark }}>Truy cứu điện nước</h3>
          </div>
          <FilterGrid>
            {user?.role === 'owner' && (
              <FormGroupSmall>
                <label>Chọn Phòng</label>
                <select value={filter.roomId} onChange={handleRoomChange}>
                  <option value="">-- Tất Cả Phòng --</option>
                  {availableRooms.map((room) => (
                    <option key={room.id} value={room.id as string}>
                      Phòng {room.roomNumber}
                    </option>
                  ))}
                </select>
              </FormGroupSmall>
            )}
            {user?.role === 'tenant' && (
              <FormGroupSmall>
                <label>Phòng Của Bạn</label>
                <input
                  type="text"
                  value={rooms.find((r) => r.id === filter.roomId)?.roomNumber ? `Phòng ${rooms.find((r) => r.id === filter.roomId)?.roomNumber}` : 'N/A'}
                  disabled
                />
              </FormGroupSmall>
            )}
            <FormGroupSmall>
              <label>Từ Tháng</label>
              <select value={String(filter.startMonth)} onChange={(e) => handleDateChange('startMonth', e.target.value)}>
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormGroupSmall>
            <FormGroupSmall>
              <label>Năm</label>
              <select value={String(filter.startYear)} onChange={(e) => handleDateChange('startYear', e.target.value)}>
                {yearOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormGroupSmall>
            <FormGroupSmall>
              <label>Đến Tháng</label>
              <select value={String(filter.endMonth)} onChange={(e) => handleDateChange('endMonth', e.target.value)}>
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormGroupSmall>
            <FormGroupSmall>
              <label>Năm</label>
              <select value={String(filter.endYear)} onChange={(e) => handleDateChange('endYear', e.target.value)}>
                {yearOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </FormGroupSmall>
            <FilterButtonGroup>
              <Button variant="secondary" onClick={handleResetFilter}>
                Reset
              </Button>
            </FilterButtonGroup>
          </FilterGrid>
        </FilterSection>
        {filteredReadings.length > 0 && (
          <StatsContainer>
            <StatCard>
              <StatLabel>Tổng Bản Ghi</StatLabel>
              <StatValue>{stats.totalReadings}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Trung Bình Điện</StatLabel>
              <StatValue>{stats.avgElectricity} kWh</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Trung Bình Nước</StatLabel>
              <StatValue>{stats.avgWater} m³</StatValue>
            </StatCard>
          </StatsContainer>
        )}
        <Card>
          {filteredReadings.length > 0 ? (
            <>
              <div style={{ marginBottom: theme.spacing.md }}>
                <h3 style={{ margin: 0, color: theme.colors.dark }}>Lịch Sử Điện Nước</h3>
              </div>
              <Table columns={columns} data={filteredReadings} />
            </>
          ) : (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <EmptyTitle>Không Có Dữ Liệu</EmptyTitle>
              <EmptyDesc>Không tìm thấy chỉ số điện nước cho phòng và khoảng thời gian đã chọn.</EmptyDesc>
            </EmptyState>
          )}
        </Card>
      </Container>
    </PageWrapper>
  );
};
