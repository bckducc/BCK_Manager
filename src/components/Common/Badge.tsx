import styles from '../../styles/common.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = ({ children, variant = 'primary' }: BadgeProps) => {
  return <span className={`${styles.badge} ${styles[`badge${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`}>{children}</span>;
};
