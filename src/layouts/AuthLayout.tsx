import styled from 'styled-components';
import type { ReactNode } from 'react';
import { Logo } from '../components/common/Logo';
import { theme } from '../styles/theme';
import backgroundImage from '../assets/images/background.png';

const AuthLayoutWrapper = styled.div<{ $bgImage: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), 
                    url(${props => props.$bgImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: ${theme.spacing.md};
`;

const AuthLayoutContainer = styled.div`
  background-color: rgb(255, 250, 250);
  backdrop-filter: blur(15px);
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.lg};
  padding: ${theme.spacing.xl};
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const AuthLayoutLogo = styled.div`
  margin: 0 0 ${theme.spacing.lg} 0;
  text-align: center;
  display: flex;
  justify-content: center;
`;

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <AuthLayoutWrapper $bgImage={backgroundImage}>
      <AuthLayoutContainer>
        <AuthLayoutLogo>
          <Logo showText={false} />
        </AuthLayoutLogo>
        {children}
      </AuthLayoutContainer>
    </AuthLayoutWrapper>
  );
};
