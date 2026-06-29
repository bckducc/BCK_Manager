import styled from 'styled-components';
import { useAuth } from '../../modules/auth/useAuth';
import { Logo } from './Logo';
import { AccountMenu } from './AccountMenu';
import { theme } from '../../styles/theme';

const NavbarWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  height: 64px;

  background-color: ${theme.colors.dark};
  color: ${theme.colors.white};

  padding: ${theme.spacing.md} ${theme.spacing.xl};

  display: flex;
  justify-content: flex-end;
  align-items: center;

  box-shadow: ${theme.shadow.md};

  z-index: 1000;

  @media (max-width: ${theme.breakpoints.tablet}) {
    height: calc(56px + env(safe-area-inset-top));
    padding: calc(${theme.spacing.sm} + env(safe-area-inset-top)) ${theme.spacing.md} ${theme.spacing.sm};
  }
`;

const NavbarBrand = styled.div`
  flex: 1;
  min-width: 0;

  a {
    text-decoration: none;
    color: ${theme.colors.white};
    display: flex;
    align-items: center;
  }

  @media (max-width: 420px) {
    span {
      display: none;
    }
  }
`;

const NavbarUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: ${theme.spacing.sm};
  }
`;

interface NavbarProps {
  onProfileClick?: () => void;
}

export const Navbar = ({ onProfileClick }: NavbarProps) => {
  const { user } = useAuth();

  return (
    <NavbarWrapper>
      <NavbarBrand>
          <Logo showText={true} size="sm" />
      </NavbarBrand>
      <NavbarUser>
        {user && <AccountMenu onProfileClick={onProfileClick} />}
      </NavbarUser>
    </NavbarWrapper>
  );
};
