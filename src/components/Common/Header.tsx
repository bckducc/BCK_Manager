import styled from 'styled-components';
import type { ReactNode } from 'react';
import { theme } from '../../styles/theme';

const HeaderWrapper = styled.header`
  background-color: ${theme.colors.dark};
  color: ${theme.colors.white};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${theme.shadow.md};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    flex-direction: column;
    align-items: stretch;
    gap: ${theme.spacing.md};
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: ${theme.fontSize.lg};
    line-height: 1.3;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 100%;
    gap: ${theme.spacing.sm};
    flex-wrap: wrap;

    > * {
      flex: 1 1 auto;
    }
  }
`;

interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

export const Header = ({ title, actions }: HeaderProps) => {
  return (
    <HeaderWrapper>
      <HeaderTitle>{title}</HeaderTitle>
      {actions && <HeaderActions>{actions}</HeaderActions>}
    </HeaderWrapper>
  );
};
