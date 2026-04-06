import { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import type { TableColumn } from '../../components/Tables/Table';
import { Header, Button, Card, Modal, Badge } from '../../components/Common';
import { Table } from '../../components/Tables/Table';
import { Form, FormGroup, Input } from '../../components/Forms/Form';

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

const TabContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.md};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: none;
  cursor: pointer;
  font-size: ${theme.fontSize.base};
  font-weight: ${(props) => (props.$active ? '600' : '400')};
  color: ${(props) => (props.$active ? theme.colors.primary : theme.colors.textSecondary)};
  border-bottom: 3px solid ${(props) => (props.$active ? theme.colors.primary : 'transparent')};
  margin-bottom: -2px;
  transition: all 0.3s ease;

  &:hover {
    color: ${theme.colors.primary};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PriceCard = styled.div<{ $bgColor: string }>`
  padding: ${theme.spacing.lg};
  background: linear-gradient(135deg, ${(props) => props.$bgColor}20 0%, transparent 100%);
  border-left: 4px solid ${(props) => props.$bgColor};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.sm};
`;

const PriceValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${theme.colors.dark};
  margin: ${theme.spacing.md} 0;

  .unit {
    font-size: 0.875rem;
    color: ${theme.colors.textSecondary};
    font-weight: 400;
  }
`;

const PriceLabel = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PriceUpdateButton = styled(Button)`
  width: 100%;
  margin-top: ${theme.spacing.md};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.dark};
  margin: ${theme.spacing.lg} 0 ${theme.spacing.md} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 1.5em;
    background: ${theme.colors.primary};
    border-radius: 2px;
  }
`;

interface UtilityPrice {
  type: 'electricity' | 'water';
  price: number;
  unit: string;
  lastUpdated: string;
}

interface UtilityReading {
  id: string;
  roomNumber: string;
  electricityReading: number;
  waterReading: number;
  readingDate: string;
  month: number;
  year: number;
}

interface PriceFormData {
  electricityPrice: string;
  waterPrice: string;
}

interface ReadingFormData {
  roomNumber: string;
  electricityReading: string;
  waterReading: string;
  readingDate: string;
  month: string;
  year: string;
}

export const UtilityManagement = () => {
  const [activeTab, setActiveTab] = useState<'prices' | 'readings'>('prices');
  const [readings, setReadings] = useState<UtilityReading[]>([
    {
      id: '1',
      roomNumber: '101',
      electricityReading: 1250,
      waterReading: 45,
      readingDate: '2024-01-15',
      month: 1,
      year: 2024,
    },
    {
      id: '2',
      roomNumber: '102',
      electricityReading: 1320,
      waterReading: 52,
      readingDate: '2024-01-15',
      month: 1,
      year: 2024,
    },
  ]);

  const [prices, setPrices] = useState<UtilityPrice[]>([
    {
      type: 'electricity',
      price: 3500,
      unit: 'VNĐ/kWh',
      lastUpdated: '2024-01-01',
    },
    {
      type: 'water',
      price: 8500,
      unit: 'VNĐ/m³',
      lastUpdated: '2024-01-01',
    },
  ]);

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isReadingModalOpen, setIsReadingModalOpen] = useState(false);

  const electricityPriceFromState = prices.find((p) => p.type === 'electricity')?.price || 3500;
  const waterPriceFromState = prices.find((p) => p.type === 'water')?.price || 8500;

  const [priceFormData, setPriceFormData] = useState<PriceFormData>({
    electricityPrice: String(electricityPriceFromState),
    waterPrice: String(waterPriceFromState),
  });

  const [readingFormData, setReadingFormData] = useState<ReadingFormData>({
    roomNumber: '',
    electricityReading: '',
    waterReading: '',
    readingDate: new Date().toISOString().split('T')[0],
    month: String(new Date().getMonth() + 1),
    year: String(new Date().getFullYear()),
  });

  const handleUpdatePrice = () => {
    const updatedPrices = prices.map((price) => {
      if (price.type === 'electricity') {
        return {
          ...price,
          price: parseFloat(priceFormData.electricityPrice) || price.price,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      if (price.type === 'water') {
        return {
          ...price,
          price: parseFloat(priceFormData.waterPrice) || price.price,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return price;
    });
    setPrices(updatedPrices);
    setIsPriceModalOpen(false);
  };

  const handleAddReading = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !readingFormData.roomNumber ||
      !readingFormData.electricityReading ||
      !readingFormData.waterReading
    ) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newReading: UtilityReading = {
      id: String(readings.length + 1),
      roomNumber: readingFormData.roomNumber,
      electricityReading: parseFloat(readingFormData.electricityReading),
      waterReading: parseFloat(readingFormData.waterReading),
      readingDate: readingFormData.readingDate,
      month: parseInt(readingFormData.month),
      year: parseInt(readingFormData.year),
    };

    setReadings([...readings, newReading]);
    setIsReadingModalOpen(false);
    setReadingFormData({
      roomNumber: '',
      electricityReading: '',
      waterReading: '',
      readingDate: new Date().toISOString().split('T')[0],
      month: String(new Date().getMonth() + 1),
      year: String(new Date().getFullYear()),
    });
  };

  const handleDeleteReading = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chỉ số này?')) {
      setReadings(readings.filter((r) => r.id !== id));
    }
  };

  const readingsColumns: TableColumn[] = [
    { key: 'roomNumber', title: 'Phòng' },
    {
      key: 'electricityReading',
      title: 'Chỉ Số Điện (kWh)',
      render: (value) => <Badge>{value} kWh</Badge>,
    },
    {
      key: 'waterReading',
      title: 'Chỉ Số Nước (m³)',
      render: (value) => <Badge variant="info">{value} m³</Badge>,
    },
    { key: 'readingDate', title: 'Ngày Ghi Chỉ Số' },
    {
      key: 'month',
      title: 'Tháng',
      render: (value, row: UtilityReading) => `${value}/${row.year}`,
    },
    {
      key: 'actions',
      title: 'Hành Động',
      render: (_, row: UtilityReading) => (
        <ActionButtons>
          <Button>Sửa</Button>
          <Button variant="danger" onClick={() => handleDeleteReading(row.id)}>
            Xóa
          </Button>
        </ActionButtons>
      ),
    },
  ];

  return (
    <PageWrapper>
      <Container>
        <Header title="Quản Lý Điện Nước" />

        <TabContainer>
          <Tab $active={activeTab === 'prices'} onClick={() => setActiveTab('prices')}>
            💰 Quản Lý Giá Điện Nước
          </Tab>
          <Tab $active={activeTab === 'readings'} onClick={() => setActiveTab('readings')}>
            📊 Nhập Chỉ Số Điện Nước
          </Tab>
        </TabContainer>

        {/* TAB 1: PRICES MANAGEMENT */}
        {activeTab === 'prices' && (
          <Container>
            <SectionTitle>Giá Hiện Tại</SectionTitle>

            <StatsContainer>
              {prices.map((price) => (
                <PriceCard
                  key={price.type}
                  $bgColor={price.type === 'electricity' ? theme.colors.warning : theme.colors.info}
                >
                  <PriceLabel>
                    {price.type === 'electricity' ? '⚡ Giá Điện' : '💧 Giá Nước'}
                  </PriceLabel>
                  <PriceValue>
                    {price.price.toLocaleString('vi-VN')}
                    <span className="unit"> {price.unit}</span>
                  </PriceValue>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: theme.colors.textSecondary,
                      marginBottom: theme.spacing.md,
                    }}
                  >
                    Cập nhập: {price.lastUpdated}
                  </div>
                  <PriceUpdateButton
                    onClick={() => {
                      setIsPriceModalOpen(true);
                    }}
                  >
                    Cập Nhập Giá
                  </PriceUpdateButton>
                </PriceCard>
              ))}
            </StatsContainer>

            <Card>
              <SectionTitle>Lịch Sử Cập Nhập</SectionTitle>
              <div
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.lightBg,
                  borderRadius: '4px',
                  marginTop: theme.spacing.md,
                }}
              >
                <p style={{ color: theme.colors.textSecondary, marginBottom: 0 }}>
                  📅 Lần cập nhập gần nhất: {prices[0]?.lastUpdated}
                </p>
                <p style={{ color: theme.colors.textSecondary }}>
                  Điện: {prices.find((p) => p.type === 'electricity')?.price.toLocaleString('vi-VN')} VNĐ/kWh
                </p>
                <p style={{ color: theme.colors.textSecondary }}>
                  Nước: {prices.find((p) => p.type === 'water')?.price.toLocaleString('vi-VN')} VNĐ/m³
                </p>
              </div>
            </Card>
          </Container>
        )}

        {/* TAB 2: READINGS MANAGEMENT */}
        {activeTab === 'readings' && (
          <Container>
            <Header
              title=""
              actions={
                <Button onClick={() => setIsReadingModalOpen(true)}>+ Nhập Chỉ Số Mới</Button>
              }
            />

            <Card>
              <Table
                columns={readingsColumns}
                data={readings}
                emptyText="Chưa có ghi chỉ số nào. Nhấp nút '+ Nhập Chỉ Số Mới' để thêm."
              />
            </Card>
          </Container>
        )}

        {/* MODAL: UPDATE PRICES */}
        <Modal
          isOpen={isPriceModalOpen}
          title="Cập Nhập Giá Điện Nước"
          onClose={() => setIsPriceModalOpen(false)}
          onConfirm={handleUpdatePrice}
          confirmText="Lưu Giá Mới"
        >
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormGrid>
              <FormGroup label="💰 Giá Điện (VNĐ/kWh)" required>
                <Input
                  type="number"
                  value={priceFormData.electricityPrice}
                  onChange={(e) =>
                    setPriceFormData({
                      ...priceFormData,
                      electricityPrice: e.target.value,
                    })
                  }
                  placeholder="Nhập giá điện"
                  min="0"
                  step="100"
                />
              </FormGroup>
              <FormGroup label="💧 Giá Nước (VNĐ/m³)" required>
                <Input
                  type="number"
                  value={priceFormData.waterPrice}
                  onChange={(e) =>
                    setPriceFormData({
                      ...priceFormData,
                      waterPrice: e.target.value,
                    })
                  }
                  placeholder="Nhập giá nước"
                  min="0"
                  step="100"
                />
              </FormGroup>
            </FormGrid>
            <div style={{ marginTop: theme.spacing.md, padding: theme.spacing.md, backgroundColor: theme.colors.warningLight, borderRadius: '4px' }}>
              <p style={{ margin: 0, color: theme.colors.warningDark, fontSize: '0.875rem' }}>
                ⚠️ Giá này sẽ áp dụng cho tất cả các hóa đơn được tạo từ bây giờ
              </p>
            </div>
          </Form>
        </Modal>

        {/* MODAL: ADD READING */}
        <Modal
          isOpen={isReadingModalOpen}
          title="Nhập Chỉ Số Điện Nước Cho Hóa Đơn Tháng Mới"
          onClose={() => setIsReadingModalOpen(false)}
          onConfirm={() => handleAddReading({ preventDefault: () => {} } as React.FormEvent)}
          confirmText="Lưu Chỉ Số"
        >
          <Form onSubmit={handleAddReading}>
            <FormGroup label="Phòng/Căn Hộ" required>
              <Input
                type="text"
                value={readingFormData.roomNumber}
                onChange={(e) =>
                  setReadingFormData({
                    ...readingFormData,
                    roomNumber: e.target.value,
                  })
                }
                placeholder="VD: 101, 102, ..."
              />
            </FormGroup>

            <FormGrid>
              <FormGroup label="Chỉ Số Điện (kWh)" required>
                <Input
                  type="number"
                  value={readingFormData.electricityReading}
                  onChange={(e) =>
                    setReadingFormData({
                      ...readingFormData,
                      electricityReading: e.target.value,
                    })
                  }
                  placeholder="VD: 1250"
                  min="0"
                  step="0.1"
                />
              </FormGroup>
              <FormGroup label="Chỉ Số Nước (m³)" required>
                <Input
                  type="number"
                  value={readingFormData.waterReading}
                  onChange={(e) =>
                    setReadingFormData({
                      ...readingFormData,
                      waterReading: e.target.value,
                    })
                  }
                  placeholder="VD: 45"
                  min="0"
                  step="0.1"
                />
              </FormGroup>
            </FormGrid>

            <FormGrid>
              <FormGroup label="Ngày Ghi Chỉ Số" required>
                <Input
                  type="date"
                  value={readingFormData.readingDate}
                  onChange={(e) =>
                    setReadingFormData({
                      ...readingFormData,
                      readingDate: e.target.value,
                    })
                  }
                />
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.md }}>
                <FormGroup label="Tháng" required>
                  <Input
                    type="number"
                    value={readingFormData.month}
                    onChange={(e) =>
                      setReadingFormData({
                        ...readingFormData,
                        month: e.target.value,
                      })
                    }
                    min="1"
                    max="12"
                  />
                </FormGroup>
                <FormGroup label="Năm" required>
                  <Input
                    type="number"
                    value={readingFormData.year}
                    onChange={(e) =>
                      setReadingFormData({
                        ...readingFormData,
                        year: e.target.value,
                      })
                    }
                    min="2020"
                  />
                </FormGroup>
              </div>
            </FormGrid>
          </Form>
        </Modal>
      </Container>
    </PageWrapper>
  );
};
