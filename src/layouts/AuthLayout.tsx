import type { ReactNode } from 'react';
import styles from '../styles/layouts.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className={styles.authLayout}>
      <div className={styles.authLayoutContainer}>
        <div className={styles.authLayoutTitle}>
          Mini Apartment Manager
        </div>
        {children}
      </div>
    </div>
  );
};
