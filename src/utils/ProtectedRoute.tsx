import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../modules/auth/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'tenant' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const hasToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  
  const isValidated = isAuthenticated || (hasToken && parsedUser);
  const currentUser = user || parsedUser;

  if (!isValidated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
                    
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
