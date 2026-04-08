import styled from 'styled-components';
import { theme } from './theme';

export const FlexBox = styled.div<{
  gap?: keyof typeof theme.spacing;
  align?: string;
  justify?: string;
  direction?: 'row' | 'column';
}>`
  display: flex;
  flex-direction: ${(props) => props.direction || 'row'};
  gap: ${(props) => (props.gap ? theme.spacing[props.gap] : '0')};
  align-items: ${(props) => props.align || 'stretch'};
  justify-content: ${(props) => props.justify || 'flex-start'};
`;

export const Container = styled.div<{ maxWidth?: string }>`
  max-width: ${(props) => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

export const Card = styled.div<{ clickable?: boolean }>`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.md};
  overflow: hidden;
  transition: all ${theme.transition.base};
  cursor: ${(props) => (props.clickable ? 'pointer' : 'default')};

  &:hover {
    ${(props) =>
      props.clickable &&
      `
      box-shadow: ${theme.shadow.lg};
      transform: translateY(-2px);
    `}
  }
`;

export const PageContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

export const SectionTitle = styled.h1`
  margin: 0 0 ${theme.spacing.sm} 0;
  color: ${theme.colors.dark};
  font-size: ${theme.fontSize['2xl']};
  font-weight: ${theme.fontWeight.bold};
`;

export const SectionSubtitle = styled.p`
  margin: 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.base};
`;

export const Grid = styled.div<{ columns?: number; gap?: keyof typeof theme.spacing }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 'auto-fit'}, minmax(300px, 1fr));
  gap: ${(props) => (props.gap ? theme.spacing[props.gap] : theme.spacing.lg)};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};
  color: ${theme.colors.textSecondary};

  h3 {
    margin: 0 0 ${theme.spacing.md} 0;
    color: ${theme.colors.dark};
    font-size: ${theme.fontSize.lg};
  }

  p {
    margin: 0;
  }
`;

export const Badge = styled.span<{ variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info' }>`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.radius.full};
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.semibold};
  white-space: nowrap;

  ${(props) => {
    const variantMap = {
      primary: `background-color: ${theme.colors.primary}; color: ${theme.colors.white};`,
      success: `background-color: ${theme.colors.success}; color: ${theme.colors.white};`,
      danger: `background-color: ${theme.colors.danger}; color: ${theme.colors.white};`,
      warning: `background-color: ${theme.colors.warning}; color: ${theme.colors.white};`,
      info: `background-color: ${theme.colors.info}; color: ${theme.colors.white};`,
    };
    return variantMap[props.variant || 'primary'];
  }}
`;
