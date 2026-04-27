import type { ReactNode } from 'react';
import styled from 'styled-components';
import { pageEnterAnimation } from '../../styles/animations';

interface PageTransitionProps {
  children: ReactNode;
  customKey?: string | number;
}

const PageTransitionWrapper = styled.div`
  ${pageEnterAnimation}
`;

export const PageTransition = ({ children, customKey }: PageTransitionProps) => {
  return (
    <PageTransitionWrapper key={customKey}>
      {children}
    </PageTransitionWrapper>
  );
};
