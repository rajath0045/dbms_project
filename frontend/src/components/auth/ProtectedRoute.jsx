import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = AuthService.getCurrentUser();
  const role = AuthService.getRole();
  
  console.log('Protected Route Check:', {
    user,
    role,
    allowedRoles
  });

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log('User role not allowed:', role, 'Required roles:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute; 