import styles from '../../styles/common.module.css';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const Alert = ({ message, type = 'info' }: AlertProps) => {
  return (
    <div className={`${styles.alert} ${styles[`alert${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
      <p>{message}</p>
    </div>
  );
};
