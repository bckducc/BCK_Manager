import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useAuth } from '../../modules/auth/useAuth';
import { useNavigate } from 'react-router-dom';

const MenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const AvatarButton = styled.button`
  background: ${theme.colors.primaryLight};
  border: none;
  border-radius: ${theme.radius.full};
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-weight: ${theme.fontWeight.bold};
  font-size: ${theme.fontSize.lg};
  transition: background-color 0.3s ease;
  padding: 0;

  &:hover {
    background-color: ${theme.colors.primary};
  }

  &:focus {
    outline: 2px solid ${theme.colors.white};
    outline-offset: 2px;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 44px;
    height: 44px;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.borderLight};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.lg};
  min-width: 250px;
  margin-top: ${theme.spacing.sm};
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
  animation: slideDown 0.2s ease;

  @media (max-width: ${theme.breakpoints.mobile}) {
    position: fixed;
    top: calc(56px + env(safe-area-inset-top));
    right: ${theme.spacing.sm};
    left: ${theme.spacing.sm};
    width: auto;
    min-width: 0;
    margin-top: ${theme.spacing.sm};
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const UserInfo = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.borderLight};
  text-align: center;
`;

const UserName = styled.p`
  margin: 0;
  font-weight: ${theme.fontWeight.bold};
  color: ${theme.colors.text};
  font-size: ${theme.fontSize.base};
`;

const UserRole = styled.p`
  margin: ${theme.spacing.xs} 0 0 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};
`;

const MenuItemsContainer = styled.div`
  padding: ${theme.spacing.sm} 0;
`;

const MenuItem = styled.button<{ $isDanger?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  color: ${props => props.$isDanger ? theme.colors.danger : theme.colors.text};
  font-size: ${theme.fontSize.base};
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  &:hover {
    background-color: ${theme.colors.lightBg};
  }

  &:active {
    background-color: ${theme.colors.borderLight};
  }
`;

const MenuIcon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
`;

interface AccountMenuProps {
  onProfileClick?: () => void;
  onChangePasswordClick?: () => void;
}

export const AccountMenu = ({
  onProfileClick,
}: AccountMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/dang-nhap');
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    if (onProfileClick) {
      onProfileClick();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  const userInitial = user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || 'U';
  const roleDisplay = user.role === 'owner' ? 'Chủ nhà' : user.role === 'tenant' ? 'Khách thuê' : 'Quản trị viên';

  return (
    <MenuContainer ref={menuRef}>
      <AvatarButton
        onClick={() => setIsOpen(!isOpen)}
        title={user.name || user.username}
        aria-label="Mở menu tài khoản"
        aria-expanded={isOpen}
      >
        {userInitial}
      </AvatarButton>

      <DropdownMenu $isOpen={isOpen}>
        <UserInfo>
          <UserName>{user.name || user.username}</UserName>
          <UserRole>{roleDisplay}</UserRole>
        </UserInfo>

        <MenuItemsContainer>
          <MenuItem onClick={handleProfileClick}>
            <MenuIcon>👤</MenuIcon>
            <span>Thông tin tài khoản</span>
          </MenuItem>

          <MenuItem $isDanger onClick={handleLogout}>
            <MenuIcon>🚪</MenuIcon>
            <span>Đăng xuất</span>
          </MenuItem>
        </MenuItemsContainer>
      </DropdownMenu>
    </MenuContainer>
  );
};
