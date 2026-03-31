import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface StyledAlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
}

const getAlertStyles = (type: string) => {
  const styles = {
    success: `
      background-color: ${theme.colors.successLight};
      color: ${theme.colors.successDark};
      border-left-color: ${theme.colors.success};
    `,
    error: `
      background-color: ${theme.colors.dangerLight};
      color: ${theme.colors.dangerDark};
      border-left-color: ${theme.colors.danger};
    `,
    warning: `
      background-color: ${theme.colors.warningLight};
      color: ${theme.colors.warningDark};
      border-left-color: ${theme.colors.warning};
    `,
    info: `
      background-color: ${theme.colors.infoLight};
      color: ${theme.colors.infoDark};
      border-left-color: ${theme.colors.info};
    `,
  };
  return styles[type as keyof typeof styles] || styles.info;
};

const StyledAlert = styled.div<StyledAlertProps>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.radius.sm};
  margin-bottom: ${theme.spacing.md};
  border-left: 4px solid;

  p {
    margin: 0;
  }

  ${(props) => getAlertStyles(props.type || 'info')}
`;

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const Alert = ({ message, type = 'info' }: AlertProps) => {
  return (
    <StyledAlert type={type}>
      <p>{message}</p>
    </StyledAlert>
  );
};
