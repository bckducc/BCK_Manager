import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface LoadingWrapperProps {
  fullPage?: boolean;
}

const LoadingWrapper = styled.div<LoadingWrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.xl};
  text-align: center;

  ${(props) =>
    props.fullPage &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: ${theme.zIndex.modal};
  `}
`;

const Spinner = styled.div`
  border: 4px solid ${theme.colors.borderLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: ${theme.spacing.md};

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

interface LoadingProps {
  fullPage?: boolean;
}

export const Loading = ({ fullPage = false }: LoadingProps) => {
  return (
    <LoadingWrapper fullPage={fullPage}>
      <Spinner />
      <p>Loading...</p>
    </LoadingWrapper>
  );
};
