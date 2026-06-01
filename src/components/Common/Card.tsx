import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { fadeInAnimation } from '../../styles/animations';

const StyledCard = styled.div`
  background-color: ${theme.colors.white};
  border-radius: ${theme.radius.md};
  box-shadow: ${theme.shadow.md};
  overflow: hidden;
  ${fadeInAnimation}

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: ${theme.radius.sm};
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background-color: ${theme.colors.lightBg};
  border-bottom: 1px solid ${theme.colors.borderLight};
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.dark};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
    font-size: ${theme.fontSize.base};
  }
`;

const CardContent = styled.div`
  padding: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md};
  }
`;

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Card = ({ children, title, className }: CardProps) => {
  return (
    <StyledCard className={className}>
      {title && <CardTitle>{title}</CardTitle>}
      <CardContent>{children}</CardContent>
    </StyledCard>
  );
};
