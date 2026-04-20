import styled from 'styled-components';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar, Sidebar, PageTransition } from '../components/Common';
import { useSidebar } from '../stores/SidebarContext';
import { theme } from '../styles/theme';

const MainLayoutWrapper = styled.div`
  height: 100vh;
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
    margin-left: 0;
    width: 100%;
  }
`;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { collapsed } = useSidebar();
  const location = useLocation();

  return (
    <MainLayoutWrapper>
      <Navbar />
      <MainLayoutContent>
        <Sidebar />
        <MainLayoutMain $sidebarCollapsed={collapsed}>
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </MainLayoutMain>
      </MainLayoutContent>
    </MainLayoutWrapper>
  );
};
