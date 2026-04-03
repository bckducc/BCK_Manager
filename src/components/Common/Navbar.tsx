import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks';
import { Logo } from './Logo';
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
  justify-content: space-between;
  align-items: center;

  box-shadow: ${theme.shadow.md};

  z-index: 1000;
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
`;

const UserName = styled.span`
  font-weight: ${theme.fontWeight.semibold};
`;

const UserRole = styled.span`
  background-color: rgba(255, 255, 255, 0.2);
  padding: ${theme.spacing.xs} 0.75rem;
  border-radius: ${theme.radius.full};
  font-size: ${theme.fontSize.sm};
  text-transform: uppercase;
`;

const LogoutBtn = styled.button`
  background-color: ${theme.colors.danger};
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  transition: background-color ${theme.transition.base};
  font-weight: ${theme.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${theme.colors.dangerDark};
  }
`;

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <NavbarWrapper>
      <NavbarBrand>
          <Logo showText={true} size="sm" />
      </NavbarBrand>
      <NavbarUser>
        {user && (
          <>
            <UserOutlined />
            <UserName>{user.name}</UserName>
            <UserRole>{user.role}</UserRole>
            <LogoutBtn onClick={handleLogout}>
              <LogoutOutlined />
              Đăng xuất
            </LogoutBtn>
          </>
        )}
      </NavbarUser>
    </NavbarWrapper>
  );
};
