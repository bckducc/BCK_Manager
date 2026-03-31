import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  HomeOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileProtectOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../stores/AuthContext';
import { theme } from '../../styles/theme';

const SidebarWrapper = styled.aside`
  width: 250px;
  background-color: ${theme.colors.darkSecondary};
  color: ${theme.colors.white};
  padding: 0;
  min-height: calc(100vh - 60px);
  border-right: 1px solid ${theme.colors.dark};
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: ${theme.spacing.md} 0;
`;

interface NavItemProps {
  $isActive?: boolean;
}

const NavItemLink = styled(Link)<NavItemProps>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  color: ${theme.colors.white};
  text-decoration: none;
  transition: background-color ${theme.transition.base}, color ${theme.transition.base};
  border-left: 3px solid transparent;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${(props) =>
    props.$isActive &&
    `
    background-color: ${theme.colors.primary};
    border-left-color: ${theme.colors.primaryDark};
    font-weight: ${theme.fontWeight.semibold};
  `}
`;

const NavIcon = styled.span`
  font-size: ${theme.fontSize.xl};
  display: flex;
  align-items: center;
`;

interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const ownerNavItems: NavItem[] = [
    { label: 'Trang chủ', path: '/owner', icon: <DashboardOutlined /> },
    { label: 'Quản lý Phòng', path: '/owner/rooms', icon: <AppstoreOutlined /> },
    { label: 'Quản lý Người thuê', path: '/owner/tenants', icon: <TeamOutlined /> },
    { label: 'Quản lý Hợp đồng', path: '/owner/contracts', icon: <FileProtectOutlined /> },
    { label: 'Quản lý Dịch vụ', path: '/owner/services', icon: <ToolOutlined /> },
    { label: 'Quản lý Điện nước', path: '/owner/utilities', icon: <ThunderboltOutlined /> },
    { label: 'Quản lý Hóa đơn', path: '/owner/bills', icon: <FileTextOutlined /> },
    { label: 'Xác nhận Thanh toán', path: '/owner/payments', icon: <CreditCardOutlined /> },
  ];

  const tenantNavItems: NavItem[] = [
    { label: 'Trang chủ', path: '/tenant', icon: <HomeOutlined /> },
    { label: 'Phòng của tôi', path: '/tenant/room', icon: <AppstoreOutlined /> },
    { label: 'Hợp đồng', path: '/tenant/contracts', icon: <FileProtectOutlined /> },
    { label: 'Hóa đơn', path: '/tenant/bills', icon: <FileTextOutlined /> },
    { label: 'Thông báo', path: '/tenant/notifications', icon: <BellOutlined /> },
  ];

  const navItems = user?.role === 'owner' ? ownerNavItems : tenantNavItems;

  return (
    <SidebarWrapper>
      <SidebarNav>
        {navItems.map((item) => (
          <NavItemLink
            key={item.path}
            to={item.path}
            $isActive={location.pathname === item.path}
          >
            {item.icon && <NavIcon>{item.icon}</NavIcon>}
            <span>{item.label}</span>
          </NavItemLink>
        ))}
      </SidebarNav>
    </SidebarWrapper>
  );
};
