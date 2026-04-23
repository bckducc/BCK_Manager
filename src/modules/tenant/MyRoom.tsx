import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Card, Header } from '../../components/common';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const Field = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 1px solid ${theme.colors.borderLight};

  label {
    font-weight: ${theme.fontWeight.semibold};
    color: ${theme.colors.dark};
  }

  span {
    color: ${theme.colors.textSecondary};
  }
`;

export const MyRoom = () => {
  return (
    <Container>
      <Header title="Phòng Của Tôi" />
      
      <Card title="Thông Tin Phòng">
        <RoomInfo>
          <Field>
            <label>Số Phòng</label>
            <span>101</span>
          </Field>
          <Field>
            <label>Tầng</label>
            <span>1</span>
          </Field>
          <Field>
            <label>Diện Tích</label>
            <span>30 m²</span>
          </Field>
          <Field>
            <label>Giá Thuê/Tháng</label>
            <span>$500</span>
          </Field>
          <Field>
            <label>Mô Tả</label>
            <span>Phòng rộng rãi, thoáng mát, có cửa sổ</span>
          </Field>
          <Field>
            <label>Mô Tả</label>
            <span>Phòng rộng rãi, thoáng mát, có cửa sổ</span>
          </Field>
        </RoomInfo>
      </Card>
    </Container>
  );
};
