import type { ReactNode } from 'react';
import { Navbar, Sidebar } from '../components/Common';
import styles from '../styles/layouts.module.css';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.mainLayout}>
      <Navbar />
      <div className={styles.mainLayoutContent}>
        <div className={styles.mainLayoutSidebar}>
          <Sidebar />
        </div>
        <main className={styles.mainLayoutMain}>{children}</main>
      </div>
    </div>
  );
};
