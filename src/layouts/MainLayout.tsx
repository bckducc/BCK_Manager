import styled from 'styled-components';
import type { ReactNode } from 'react';
import { Navbar, Sidebar } from '../components/Common';
import { theme } from '../styles/theme';

const MainLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${theme.colors.lightBg};
`;

const MainLayoutContent = styled.div`
  display: flex;
  flex: 1;
  gap: 0;

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const MainLayoutMain = styled.main`
  flex: 1;
  padding: ${theme.spacing.lg};
  overflow-y: auto;
`;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <MainLayoutWrapper>
      <Navbar />
      <MainLayoutContent>
        <Sidebar />
        <MainLayoutMain>{children}</MainLayoutMain>
      </MainLayoutContent>
    </MainLayoutWrapper>
  );
};
