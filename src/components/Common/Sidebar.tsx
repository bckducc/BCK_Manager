import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../stores/AuthContext';
import styles from '../../styles/layouts.module.css';

interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const ownerNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/owner' },
    { label: 'Quản lý Phòng', path: '/owner/rooms' },
    { label: 'Quản lý Người thuê', path: '/owner/tenants' },
    { label: 'Quản lý Hợp đồng', path: '/owner/contracts' },
    { label: 'Quản lý Dịch vụ', path: '/owner/services' },
    { label: 'Quản lý Điện nước', path: '/owner/utilities' },
    { label: 'Quản lý Hóa đơn', path: '/owner/bills' },
    { label: 'Xác nhận Thanh toán', path: '/owner/payments' },
  ];

  const tenantNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/tenant' },
    { label: 'Phòng của tôi', path: '/tenant/room' },
    { label: 'Hợp đồng', path: '/tenant/contracts' },
    { label: 'Hóa đơn', path: '/tenant/bills' },
    { label: 'Thông báo', path: '/tenant/notifications' },
  ];

  const navItems = user?.role === 'owner' ? ownerNavItems : tenantNavItems;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`${styles.sidebarNavItem} ${location.pathname === item.path ? styles.active : ''}`}
          >
            {item.icon && <span className={styles.sidebarNavIcon}>{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
