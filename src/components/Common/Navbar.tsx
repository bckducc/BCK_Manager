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
    height: 56px;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const NavbarBrand = styled.div`
  flex: 1;

  a {
    text-decoration: none;
    color: ${theme.colors.white};
    display: flex;
    align-items: center;
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
