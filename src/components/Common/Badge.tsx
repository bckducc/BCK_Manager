import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface StyledBadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

const getVariantColor = (variant: string) => {
  const variants = {
    primary: theme.colors.primary,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
    info: theme.colors.info,
  };
  return variants[variant as keyof typeof variants] || variants.primary;
};

const StyledBadge = styled.span<StyledBadgeProps>`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.full};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  white-space: nowrap;
  background-color: ${(props) => getVariantColor(props.variant || 'primary')};
  color: ${theme.colors.white};
`;

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = ({ children, variant = 'primary' }: BadgeProps) => {
  return <StyledBadge variant={variant}>{children}</StyledBadge>;
};
