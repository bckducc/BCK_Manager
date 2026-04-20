import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button, Card } from '../../components/Common';
import {
  AppstoreOutlined,
  TeamOutlined,
  FileProtectOutlined,
  CreditCardOutlined,
  AlertOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

const Dashboard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};

  width: 100%;
  max-width: 100%;

  padding: ${theme.spacing.lg};
`;

const WelcomeSection = styled.div`
  padding: ${theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${theme.colors.primary} 0%,
    ${theme.colors.primaryDark} 100%
  );

  border-radius: ${theme.radius.md};
  color: ${theme.colors.white};

  h1 {
    margin: 0 0 ${theme.spacing.xs} 0;
    font-size: ${theme.fontSize.xl};
    font-weight: ${theme.fontWeight.bold};
  }

  p {
    margin: 0;
    opacity: 0.9;
  }
`;

export const OwnerDashboard = () => {
  const navigate = useNavigate();

  const [stats] = useState({
    totalRooms: 8,
    occupiedRooms: 6,
    totalTenants: 12,
    totalRevenue: 24000,
    paidBills: 10,
    unpaidBills: 2,
  });
  
  return (
    <Dashboard>
      <WelcomeSection>
        <h1>Bảng Điều Khiển 📊</h1>
        <p>Quản lý chung cư mini {stats.totalRooms} phòng - Cập nhật {new Date().toLocaleDateString('vi-VN')}</p>
      </WelcomeSection>
    </Dashboard>
  );
};
