import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) return <Navigate to="/signin" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/signin" />;

  return <>{children}</>;
};

export default ProtectedRoute;
