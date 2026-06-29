import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ApartmentOutlined,
  BellOutlined,
  FileProtectOutlined,
  FileTextOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useSidebar } from '../../store/SidebarContext';
import { useAuth } from '../../modules/auth/useAuth';
import { theme } from '../../styles/theme';

interface SidebarProps {
  $collapsed: boolean;
}

const SidebarWrapper = styled.aside<SidebarProps>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: ${(p) => (p.$collapsed ? '80px' : '240px')};
  background: ${theme.colors.darkSecondary};
  transition: width 0.25s ease;
  overflow: hidden;
  z-index: 900;

  @media (max-width: ${theme.breakpoints.tablet}) {
    top: auto;
    right: 0;
    width: 100%;
    height: calc(68px + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    transition: none;
  }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;

  @media (max-width: ${theme.breakpoints.tablet}) {
    height: 100%;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x proximity;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

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
  background: ${(p) => (p.$active ? theme.colors.primary : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    min-width: 74px;
    height: 68px;
    flex-direction: column;
    justify-content: center;
    padding: ${theme.spacing.xs};
    gap: ${theme.spacing.xs};
    scroll-snap-align: center;
    border-top: 3px solid ${(p) => (p.$active ? theme.colors.primaryLight : 'transparent')};
    background: ${(p) => (p.$active ? 'rgba(52, 152, 219, 0.18)' : 'transparent')};
  }
`;

const NavIcon = styled.div`
  font-size: 20px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 28px;
    height: 28px;
    font-size: 18px;
  }
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

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex: 0 1 auto;
    width: 100%;
    opacity: 1;
    transform: none;
    text-align: center;
    font-size: 11px;
    line-height: 1.2;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;

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

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: none;
  }
`;

interface NavItemType {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const ownerNavItems: NavItemType[] = [
  { label: 'Trang chủ', path: '/dashboard', icon: <HomeOutlined /> },
  { label: 'Quản lý phòng', path: '/quan-ly-phong', icon: <ApartmentOutlined /> },
  { label: 'Người thuê', path: '/quan-ly-nguoi-thue', icon: <TeamOutlined /> },
  { label: 'Hợp đồng', path: '/quan-ly-hop-dong', icon: <FileProtectOutlined /> },
  { label: 'Dịch vụ', path: '/quan-ly-dich-vu', icon: <ToolOutlined /> },
  { label: 'Điện nước', path: '/quan-ly-dien-nuoc', icon: <ThunderboltOutlined /> },
  { label: 'Hóa đơn', path: '/quan-ly-hoa-don', icon: <FileTextOutlined /> },
];

const tenantNavItems: NavItemType[] = [
  { label: 'Trang chủ', path: '/trang-chu', icon: <HomeOutlined /> },
  { label: 'Phòng đang thuê', path: '/phong-dang-thue', icon: <ApartmentOutlined /> },
  { label: 'Hợp đồng', path: '/hop-dong-cua-toi', icon: <FileProtectOutlined /> },
  { label: 'Hóa đơn', path: '/hoa-don-cua-toi', icon: <FileTextOutlined /> },
  { label: 'Điện nước', path: '/dien-nuoc-hang-thang', icon: <ThunderboltOutlined /> },
  { label: 'Thông báo', path: '/thong-bao', icon: <BellOutlined /> },
];

export const Sidebar = () => {
  const location = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const navItems = user?.role === 'tenant' ? tenantNavItems : ownerNavItems;
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [location.pathname]);

  return (
    <SidebarWrapper $collapsed={collapsed}>
      <SidebarNav>
        <ToggleItem $collapsed={collapsed} onClick={toggleSidebar}>
          <NavIcon>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </NavIcon>
          <NavLabel $collapsed={collapsed}></NavLabel>
        </ToggleItem>

        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <NavItem
              ref={active ? activeItemRef : undefined}
              key={item.path}
              to={item.path}
              $active={active}
              $collapsed={collapsed}
              title={collapsed ? item.label : ''}
              aria-current={active ? 'page' : undefined}
            >
              <NavIcon>{item.icon}</NavIcon>
              <NavLabel $collapsed={collapsed}>{item.label}</NavLabel>
            </NavItem>
          );
        })}
      </SidebarNav>
    </SidebarWrapper>
  );
};
