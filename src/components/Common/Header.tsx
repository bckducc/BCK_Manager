import type { ReactNode } from 'react';
import styles from '../../styles/common.module.css';

interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

export const Header = ({ title, actions }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>{title}</h1>
      {actions && <div className={styles.headerActions}>{actions}</div>}
    </header>
  );
};
