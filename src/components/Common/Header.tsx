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
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${theme.fontSize.xl};
  font-weight: ${theme.fontWeight.bold};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;
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
