import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../stores/AuthContext';
import styles from '../../styles/layouts.module.css';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <Link to="/">
          <h2>Mini Apartment Manager</h2>
        </Link>
      </div>
      <div className={styles.navbarUser}>
        {user && (
          <>
            <span className={styles.navbarUserName}>{user.name}</span>
            <span className={styles.navbarUserRole}>{user.role}</span>
            <button onClick={handleLogout} className={styles.navbarLogoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
