import styled from 'styled-components';
import type { ReactNode } from 'react';
import { theme } from '../styles/theme';

const AuthLayoutWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  padding: ${theme.spacing.md};
`;

const AuthLayoutContainer = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.lg};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 400px;
`;

const AuthLayoutTitle = styled.h1`
  margin: 0 0 ${theme.spacing.lg} 0;
  text-align: center;
  font-size: ${theme.fontSize['2xl']};
  color: ${theme.colors.dark};
  font-weight: ${theme.fontWeight.bold};
`;

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <AuthLayoutWrapper>
      <AuthLayoutContainer>
        <AuthLayoutTitle>Chung cư Mini CC-BCK</AuthLayoutTitle>
        {children}
      </AuthLayoutContainer>
    </AuthLayoutWrapper>
  );
};
