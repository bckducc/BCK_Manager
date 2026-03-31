import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonStyledProps {
  $variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  $fullWidth?: boolean;
}

const getVariantStyles = (variant: string) => {
  const variants = {
    primary: `
      background-color: ${theme.colors.primary};
      color: ${theme.colors.white};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.primaryDark};
      }
    `,
    secondary: `
      background-color: ${theme.colors.border};
      color: ${theme.colors.white};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.textSecondary};
      }
    `,
    danger: `
      background-color: ${theme.colors.danger};
      color: ${theme.colors.white};
      
      &:hover:not(:disabled) {
        background-color: ${theme.colors.dangerDark};
      }
    `,
  };
  return variants[variant as keyof typeof variants] || variants.primary;
};

const StyledButton = styled.button<ButtonStyledProps>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${theme.radius.sm};
  cursor: pointer;
  font-size: ${theme.fontSize.base};
  font-weight: ${theme.fontWeight.semibold};
  transition: all ${theme.transition.base};
  display: inline-block;
  text-align: center;

  ${(props) => getVariantStyles(props.$variant || 'primary')}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${(props) =>
    props.$fullWidth &&
    `
    width: 100%;
    display: block;
  `}
`;

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      $variant={variant}
      $fullWidth={fullWidth}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
};
