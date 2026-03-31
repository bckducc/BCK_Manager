import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  TeamOutlined,
  FileProtectOutlined,
  ToolOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

import { theme } from '../../styles/theme';

interface SidebarProps {
  $collapsed: boolean;
}

const SidebarWrapper = styled.aside<SidebarProps>`
  width: ${(p) => (p.$collapsed ? '80px' : '240px')};
  background: ${theme.colors.darkSecondary};
  min-height: 100vh;
  transition: width 0.25s ease;
  overflow: hidden;
`;

/* ======================
 NAV
====================== */

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
`;

/* ======================
 NAV ITEM
====================== */

interface NavItemProps {
  $active?: boolean;
  $collapsed: boolean;
}

const NavItem = styled(Link)<NavItemProps>`
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  padding: ${(p) => (p.$collapsed ? '0' : '0 20px')};
  gap: ${(p) => (p.$collapsed ? '0' : '14px')};
  color: ${theme.colors.white};
  text-decoration: none;
  transition: background 0.2s ease;
  background: ${(p) =>
    p.$active ? theme.colors.primary : 'transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

/* ======================
 ICON
====================== */

const NavIcon = styled.div`
  font-size: 20px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface NavLabelProps {
  $collapsed: boolean;
}

const NavLabel = styled.span<NavLabelProps>`
  white-space: nowrap;

  flex: ${(p) => (p.$collapsed ? '0 0 0' : '1')};
  min-width: 0;
  
  opacity: ${(p) => (p.$collapsed ? 0 : 1)};
  transform: ${(p) => (p.$collapsed ? 'translateX(-8px)' : 'translateX(0)')};

  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  pointer-events: none;
  overflow: hidden;
`;

/* ======================
 TOGGLE BUTTON
====================== */

const ToggleItem = styled.div<SidebarProps>`
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  padding: ${(p) => (p.$collapsed ? '0' : '0 20px')};
  gap: ${(p) => (p.$collapsed ? '0' : '14px')};
  cursor: pointer;
  color: white;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

interface NavItemType {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems: NavItemType[] = [
    { label: 'Trang chủ', path: '/owner', icon: <DashboardOutlined /> },
    { label: 'Quản lý phòng', path: '/owner/rooms', icon: <AppstoreOutlined /> },
    { label: 'Người thuê', path: '/owner/tenants', icon: <TeamOutlined /> },
    { label: 'Hợp đồng', path: '/owner/contracts', icon: <FileProtectOutlined /> },
    { label: 'Dịch vụ', path: '/owner/services', icon: <ToolOutlined /> },
    { label: 'Điện nước', path: '/owner/utilities', icon: <ThunderboltOutlined /> },
    { label: 'Hóa đơn', path: '/owner/bills', icon: <FileTextOutlined /> },
    { label: 'Thanh toán', path: '/owner/payments', icon: <CreditCardOutlined /> },
  ];

  return (
    <SidebarWrapper $collapsed={collapsed}>
      <SidebarNav>

        {/* Toggle Button */}
        <ToggleItem
          $collapsed={collapsed}
          onClick={() => setCollapsed(!collapsed)}
        >
          <NavIcon>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </NavIcon>

          <NavLabel $collapsed={collapsed}>
            Menu
          </NavLabel>
        </ToggleItem>

        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <NavItem
              key={item.path}
              to={item.path}
              $active={active}
              $collapsed={collapsed}
              title={collapsed ? item.label : ''}
            >
              <NavIcon>{item.icon}</NavIcon>

              <NavLabel $collapsed={collapsed}>
                {item.label}
              </NavLabel>
            </NavItem>
          );
        })}
      </SidebarNav>
    </SidebarWrapper>
  );
};