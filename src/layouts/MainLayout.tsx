import styled from 'styled-components';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Sidebar, PageTransition } from '../components/common';
import { ProfileModal } from '../components/common/ProfileModal';
import { useSidebar } from '../store/SidebarContext';
import { useAuth } from '../modules/auth/useAuth';
import { TenantProvider } from '../store/TenantContext';
import { ContractProvider } from '../store/ContractContext';
import { theme } from '../styles/theme';

const MainLayoutWrapper = styled.div`
  height: 100vh;
  height: 100dvh;
  background-color: ${theme.colors.lightBg};
  overflow: hidden;
`;

const MainLayoutContent = styled.div`
  display: flex;
`;

interface MainLayoutMainProps {
  $sidebarCollapsed: boolean;
}

const MainLayoutMain = styled.main<MainLayoutMainProps>`
  margin-top: 64px;
  margin-left: ${(p) => (p.$sidebarCollapsed ? '80px' : '240px')};

  height: calc(100vh - 64px);
  overflow-y: auto;

  padding: 0;
  width: ${(p) => (p.$sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 240px)')};

  transition: margin-left 0.25s ease, width 0.25s ease;

  @media (max-width: ${theme.breakpoints.tablet}) {
    margin-top: calc(56px + env(safe-area-inset-top));
    margin-left: 0;
    width: 100%;
    height: calc(100vh - 124px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    height: calc(100dvh - 124px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    overscroll-behavior-y: contain;
  }
`;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const layout = (
    <MainLayoutWrapper>
      <Navbar onProfileClick={() => setIsProfileOpen(true)} />
      <MainLayoutContent>
        <Sidebar />
        <MainLayoutMain $sidebarCollapsed={collapsed}>
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </MainLayoutMain>
      </MainLayoutContent>
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </MainLayoutWrapper>
  );

  if (user?.role !== 'owner') {
    return layout;
  }

  return (
    <TenantProvider>
      <ContractProvider>{layout}</ContractProvider>
    </TenantProvider>
  );
};
