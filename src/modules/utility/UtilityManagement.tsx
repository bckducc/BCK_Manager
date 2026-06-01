import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Table';
import { Header, Button, Card, Badge } from '../../components/common';
import { Table } from '../../components/Table';
import { Form, FormGroup, Input, Select } from '../../components/Forms/Form';
import { useAuth } from '../auth/useAuth';
import { roomService } from '../room/roomService';
import type { Room } from '../room/room.types';
import { utilityService } from './utilityService';
import type { UtilityReading } from './utilityService';

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
  display: flex;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    align-items: stretch;

    > * {
      width: 100%;
    }
  }
`;

const Tabs = styled.div`
  display: inline-flex;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius.sm};
  overflow: hidden;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  background: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.white)};
  color: ${({ $active }) => ($active ? theme.colors.white : theme.colors.text)};
  font-weight: ${theme.fontWeight.semibold};
  cursor: pointer;

  &:not(:last-child) {
    border-right: 1px solid ${theme.colors.border};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(160px, 1fr));
  gap: ${theme.spacing.md};
  align-items: flex-end;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(160px, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(220px, 1fr));
  gap: ${theme.spacing.md};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryGrid = styled.div`
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
  background: ${theme.colors.lightBg};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
`;

const SummaryLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
  margin-bottom: ${theme.spacing.xs};
`;

const SummaryValue = styled.div`
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize.lg};
  font-weight: ${theme.fontWeight.bold};
`;

const Notice = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.sm};
  background: ${theme.colors.lightBg};
  color: ${theme.colors.text};
`;

type ActiveTab = 'entry' | 'history';

const now = new Date();
const currentMonth = now.getMonth() + 1;
const currentYear = now.getFullYear();

const monthOptions = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: `Tháng ${index + 1}`,
}));

const yearOptions = Array.from({ length: 6 }, (_, index) => {
  const year = currentYear - index;
  return { value: String(year), label: String(year) };
});

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;
const getRoomLabel = (room: Room) => `Phòng ${room.room_number || room.roomNumber || room.name || room.id}`;
const getReadingPeriodValue = (reading: UtilityReading) => reading.year * 100 + reading.month;
const getPreviousMonth = (month: number, year: number) => (
  month === 1 ? { month: 12, year: year - 1 } : { month: month - 1, year }
);

export const UtilityManagement = () => {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const [activeTab, setActiveTab] = useState<ActiveTab>('entry');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [readings, setReadings] = useState<UtilityReading[]>([]);
  const [savedReading, setSavedReading] = useState<UtilityReading | null>(null);
  const [existingReading, setExistingReading] = useState<UtilityReading | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [entryForm, setEntryForm] = useState({
    roomId: '',
    month: String(currentMonth),
    year: String(currentYear),
    electricOld: '0',
    electricNew: '',
    electricPrice: '3500',
    waterOld: '0',
    waterNew: '',
    waterPrice: '15000',
    note: '',
  });

  const [historyFilter, setHistoryFilter] = useState({
    roomId: '',
    startMonth: String(currentMonth),
    startYear: String(currentYear),
    endMonth: String(currentMonth),
    endYear: String(currentYear),
  });

  const roomOptions = rooms
    .filter((room) => room.id !== undefined)
    .map((room) => ({ value: String(room.id), label: getRoomLabel(room) }));

  const entryRoomOptions = rooms
    .filter((room) => room.id !== undefined && room.status === 'rented')
    .map((room) => ({ value: String(room.id), label: getRoomLabel(room) }));

  const effectiveEntryRoomOptions = entryRoomOptions.length > 0 ? entryRoomOptions : roomOptions;

  const electricOld = Number(entryForm.electricOld || 0);
  const electricNew = Number(entryForm.electricNew || 0);
  const electricPrice = Number(entryForm.electricPrice || 0);
  const waterOld = Number(entryForm.waterOld || 0);
  const waterNew = Number(entryForm.waterNew || 0);
  const waterPrice = Number(entryForm.waterPrice || 0);
  const electricUsage = Math.max(electricNew - electricOld, 0);
  const waterUsage = Math.max(waterNew - waterOld, 0);
  const electricAmount = electricUsage * electricPrice;
  const waterAmount = waterUsage * waterPrice;
  const totalAmount = electricAmount + waterAmount;

  const loadRooms = useCallback(async () => {
    if (!isOwner) return;

    try {
      setLoading(true);
      setError(null);
      const response = await roomService.getAll();
      const data = response.data as unknown;
      const parsedRooms = Array.isArray(data)
        ? data as Room[]
        : Array.isArray((data as Record<string, unknown> | undefined)?.rooms)
          ? (data as Record<string, unknown>).rooms as Room[]
          : [];

      setRooms(parsedRooms);
      const firstRoomId = parsedRooms.find((room) => room.status === 'rented')?.id ?? parsedRooms[0]?.id;
      if (firstRoomId !== undefined) {
        const roomId = String(firstRoomId);
        setEntryForm((prev) => ({ ...prev, roomId }));
        setHistoryFilter((prev) => ({ ...prev, roomId }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được danh sách phòng');
    } finally {
      setLoading(false);
    }
  }, [isOwner]);

  const loadHistory = useCallback(async () => {
    if (!isOwner) return;

    try {
      setLoading(true);
      setError(null);
      const response = await utilityService.listReadings({
        roomId: historyFilter.roomId || undefined,
        limit: 1000,
      });
      setReadings(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tải được lịch sử điện nước');
      setReadings([]);
    } finally {
      setLoading(false);
    }
  }, [historyFilter.roomId, isOwner]);

  const refreshReadingContext = useCallback(async () => {
    if (!isOwner || !entryForm.roomId) return;

    const month = Number(entryForm.month);
    const year = Number(entryForm.year);
    const previousPeriod = getPreviousMonth(month, year);

    setExistingReading(null);

    try {
      const currentResponse = await utilityService.getReading(entryForm.roomId, month, year);
      setExistingReading(currentResponse.data || null);
    } catch {
      setExistingReading(null);
    }

    try {
      const previousResponse = await utilityService.getReading(
        entryForm.roomId,
        previousPeriod.month,
        previousPeriod.year
      );
      if (previousResponse.data) {
        setEntryForm((prev) => ({
          ...prev,
          electricOld: String(previousResponse.data?.electricNew ?? 0),
          waterOld: String(previousResponse.data?.waterNew ?? 0),
        }));
      }
    } catch {
      setEntryForm((prev) => ({
        ...prev,
        electricOld: '0',
        waterOld: '0',
      }));
    }
  }, [entryForm.month, entryForm.roomId, entryForm.year, isOwner]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  useEffect(() => {
    if (isOwner && activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab, isOwner, loadHistory]);

  useEffect(() => {
    refreshReadingContext();
  }, [refreshReadingContext]);

  const filteredReadings = useMemo(() => {
    const start = Number(historyFilter.startYear) * 100 + Number(historyFilter.startMonth);
    const end = Number(historyFilter.endYear) * 100 + Number(historyFilter.endMonth);
    return readings.filter((reading) => {
      const value = getReadingPeriodValue(reading);
      return value >= start && value <= end;
    });
  }, [historyFilter.endMonth, historyFilter.endYear, historyFilter.startMonth, historyFilter.startYear, readings]);

  const handleSaveReading = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!entryForm.roomId || !entryForm.month || !entryForm.year || !entryForm.electricNew || !entryForm.waterNew) {
      alert('Vui lòng nhập đầy đủ thông tin chỉ số');
      return;
    }

    if (existingReading) {
      alert('Dữ liệu tháng này đã tồn tại');
      return;
    }

    if (electricNew < electricOld || waterNew < waterOld) {
      alert('Chỉ số mới phải lớn hơn hoặc bằng chỉ số cũ');
      return;
    }

    if (!Number.isFinite(electricPrice) || !Number.isFinite(waterPrice) || electricPrice < 0 || waterPrice < 0) {
      alert('Giá trị không hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await utilityService.recordReading({
        roomId: entryForm.roomId,
        month: Number(entryForm.month),
        year: Number(entryForm.year),
        electricOld,
        electricNew,
        electricPrice,
        waterOld,
        waterNew,
        waterPrice,
        recordedDate: new Date().toISOString().split('T')[0],
        note: entryForm.note || undefined,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Không lưu được chỉ số điện nước');
      }

      setSavedReading(response.data);
      setExistingReading(response.data);
      await loadHistory();
      alert('Lưu chỉ số điện nước thành công');
    } catch (err) {
      alert(`Lỗi: ${err instanceof Error ? err.message : 'Không lưu được chỉ số điện nước'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const historyColumns: TableColumn<UtilityReading>[] = [
    {
      key: 'roomNumber',
      title: 'Phòng',
      render: (_, row) => (
        <Badge>
          {row.roomNumber || rooms.find((room) => String(room.id) === String(row.roomId))?.room_number || row.roomId}
        </Badge>
      ),
    },
    { key: 'month', title: 'Tháng/Năm', render: (_, row) => `${row.month}/${row.year}` },
    { key: 'electricOld', title: 'Điện Cũ' },
    { key: 'electricNew', title: 'Điện Mới' },
    { key: 'electricUsage', title: 'Điện Tiêu Thụ', render: (_, row) => `${row.electricNew - row.electricOld} kWh` },
    { key: 'waterOld', title: 'Nước Cũ' },
    { key: 'waterNew', title: 'Nước Mới' },
    { key: 'waterUsage', title: 'Nước Tiêu Thụ', render: (_, row) => `${row.waterNew - row.waterOld} m³` },
    {
      key: 'amount',
      title: 'Tạm Tính',
      render: (_, row) => formatCurrency(
        (row.electricNew - row.electricOld) * row.electricPrice +
        (row.waterNew - row.waterOld) * row.waterPrice
      ),
    },
  ];

  if (!isOwner) {
    return (
      <PageWrapper>
        <Container>
          <Header title="Quản Lý Điện Nước" />
          <Notice>API utilities hiện chỉ cho phép chủ nhà thao tác.</Notice>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Header title="Quản Lý Điện Nước" />

        <Toolbar>
          <Tabs>
            <TabButton $active={activeTab === 'entry'} onClick={() => setActiveTab('entry')}>
              Nhập chỉ số
            </TabButton>
            <TabButton $active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
              Lịch sử
            </TabButton>
          </Tabs>
          {activeTab === 'history' && (
            <Button onClick={loadHistory} disabled={loading}>
              Tìm kiếm
            </Button>
          )}
        </Toolbar>

        {error && <Notice>Lỗi: {error}</Notice>}

        {activeTab === 'entry' && (
          <>
            <Card>
              <Form onSubmit={handleSaveReading}>
                <Grid>
                  <FormGroup label="Phòng" required>
                    <Select
                      value={entryForm.roomId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setEntryForm({ ...entryForm, roomId: e.target.value })
                      }
                      options={effectiveEntryRoomOptions}
                      placeholder="Chọn phòng..."
                      disabled={loading || isSubmitting}
                    />
                  </FormGroup>
                  <FormGroup label="Tháng" required>
                    <Select
                      value={entryForm.month}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setEntryForm({ ...entryForm, month: e.target.value })
                      }
                      options={monthOptions}
                      disabled={isSubmitting}
                    />
                  </FormGroup>
                  <FormGroup label="Năm" required>
                    <Select
                      value={entryForm.year}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setEntryForm({ ...entryForm, year: e.target.value })
                      }
                      options={yearOptions}
                      disabled={isSubmitting}
                    />
                  </FormGroup>
                  <FormGroup label="Ghi chú">
                    <Input
                      value={entryForm.note}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEntryForm({ ...entryForm, note: e.target.value })
                      }
                      disabled={isSubmitting}
                    />
                  </FormGroup>
                </Grid>

                {existingReading && (
                  <Notice>Dữ liệu tháng này đã tồn tại. Mỗi phòng mỗi tháng chỉ có một bản ghi chỉ số.</Notice>
                )}

                <TwoColumnGrid>
                  <FormGroup label="Chỉ Số Điện Cũ">
                    <Input value={entryForm.electricOld} disabled />
                  </FormGroup>
                  <FormGroup label="Chỉ Số Nước Cũ">
                    <Input value={entryForm.waterOld} disabled />
                  </FormGroup>
                  <FormGroup label="Chỉ Số Điện Mới" required>
                    <Input
                      type="number"
                      min="0"
                      value={entryForm.electricNew}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEntryForm({ ...entryForm, electricNew: e.target.value })
                      }
                      disabled={isSubmitting || !!existingReading}
                    />
                  </FormGroup>
                  <FormGroup label="Chỉ Số Nước Mới" required>
                    <Input
                      type="number"
                      min="0"
                      value={entryForm.waterNew}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEntryForm({ ...entryForm, waterNew: e.target.value })
                      }
                      disabled={isSubmitting || !!existingReading}
                    />
                  </FormGroup>
                  <FormGroup label="Giá Điện / kWh" required>
                    <Input
                      type="number"
                      min="0"
                      value={entryForm.electricPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEntryForm({ ...entryForm, electricPrice: e.target.value })
                      }
                      disabled={isSubmitting || !!existingReading}
                    />
                  </FormGroup>
                  <FormGroup label="Giá Nước / m³" required>
                    <Input
                      type="number"
                      min="0"
                      value={entryForm.waterPrice}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEntryForm({ ...entryForm, waterPrice: e.target.value })
                      }
                      disabled={isSubmitting || !!existingReading}
                    />
                  </FormGroup>
                </TwoColumnGrid>

                <SummaryGrid>
                  <SummaryItem>
                    <SummaryLabel>Điện tiêu thụ</SummaryLabel>
                    <SummaryValue>{electricUsage} kWh</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Nước tiêu thụ</SummaryLabel>
                    <SummaryValue>{waterUsage} m³</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Tiền điện</SummaryLabel>
                    <SummaryValue>{formatCurrency(electricAmount)}</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Tổng tạm tính</SummaryLabel>
                    <SummaryValue>{formatCurrency(totalAmount)}</SummaryValue>
                  </SummaryItem>
                </SummaryGrid>

                <Button type="submit" loading={isSubmitting} disabled={!!existingReading}>
                  Lưu
                </Button>
              </Form>
            </Card>

            {savedReading && (
              <Card>
                <SummaryGrid>
                  <SummaryItem>
                    <SummaryLabel>Bản ghi đã lưu</SummaryLabel>
                    <SummaryValue>{savedReading.month}/{savedReading.year}</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Tiền điện</SummaryLabel>
                    <SummaryValue>{formatCurrency((savedReading.electricNew - savedReading.electricOld) * savedReading.electricPrice)}</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Tiền nước</SummaryLabel>
                    <SummaryValue>{formatCurrency((savedReading.waterNew - savedReading.waterOld) * savedReading.waterPrice)}</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Sẵn sàng tạo hóa đơn</SummaryLabel>
                    <SummaryValue>Đã lưu</SummaryValue>
                  </SummaryItem>
                </SummaryGrid>
              </Card>
            )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            <Card>
              <Grid>
                <FormGroup label="Phòng">
                  <Select
                    value={historyFilter.roomId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setHistoryFilter({ ...historyFilter, roomId: e.target.value })
                    }
                    options={roomOptions}
                    placeholder="Tất cả phòng"
                    disabled={loading}
                  />
                </FormGroup>
                <FormGroup label="Từ Tháng">
                  <Select
                    value={historyFilter.startMonth}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setHistoryFilter({ ...historyFilter, startMonth: e.target.value })
                    }
                    options={monthOptions}
                  />
                </FormGroup>
                <FormGroup label="Từ Năm">
                  <Select
                    value={historyFilter.startYear}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setHistoryFilter({ ...historyFilter, startYear: e.target.value })
                    }
                    options={yearOptions}
                  />
                </FormGroup>
                <FormGroup label="Đến Tháng">
                  <Select
                    value={historyFilter.endMonth}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setHistoryFilter({ ...historyFilter, endMonth: e.target.value })
                    }
                    options={monthOptions}
                  />
                </FormGroup>
                <FormGroup label="Đến Năm">
                  <Select
                    value={historyFilter.endYear}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setHistoryFilter({ ...historyFilter, endYear: e.target.value })
                    }
                    options={yearOptions}
                  />
                </FormGroup>
              </Grid>
            </Card>
            <Card>
              <Table
                columns={historyColumns}
                data={filteredReadings}
                loading={loading}
                emptyText="Không có dữ liệu"
              />
            </Card>
          </>
        )}
      </Container>
    </PageWrapper>
  );
};
