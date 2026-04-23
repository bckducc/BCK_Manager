import { useContext } from 'react';
import { PageTransitionContext } from '../store/PageTransitionContext';

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within PageTransitionProvider');
  }
  return context;
};
