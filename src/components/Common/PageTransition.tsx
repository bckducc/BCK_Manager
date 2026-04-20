import type { ReactNode } from 'react';
import styled from 'styled-components';
import { pageEnterAnimation } from '../../styles/animations';

interface PageTransitionProps {
  children: ReactNode;
  key?: string | number;
}

const PageTransitionWrapper = styled.div`
  ${pageEnterAnimation}
`;

export const PageTransition = ({ children, key }: PageTransitionProps) => {
  return <PageTransitionWrapper key={key}>{children}</PageTransitionWrapper>;
};
