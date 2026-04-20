import type { ReactNode } from 'react';
import { createContext, useCallback, useState } from 'react';

interface PageTransitionContextType {
  isTransitioning: boolean;
  triggerTransition: () => void;
}

export const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const PageTransitionProvider = ({ children }: { children: ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageTransitionContext.Provider value={{ isTransitioning, triggerTransition }}>
      {children}
    </PageTransitionContext.Provider>
  );
};
