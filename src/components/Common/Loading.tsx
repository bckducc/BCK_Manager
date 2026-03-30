import styles from '../../styles/common.module.css';

interface LoadingProps {
  fullPage?: boolean;
}

export const Loading = ({ fullPage = false }: LoadingProps) => {
  const loadingStyle = fullPage ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  } : {};

  return (
    <div className={styles.loading} style={loadingStyle}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  );
};
