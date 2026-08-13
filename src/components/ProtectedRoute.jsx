import { Navigate, useLocation } from 'react-router-dom';
import { decodeToken, getRedirectPathByRole } from '../api/authService';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  // مش مسجل دخول → روح SignIn
  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // فك شفرة التوكين وشوف الـ Role
  const tokenDetails = decodeToken(token);
  const userRole = tokenDetails?.role || localStorage.getItem('userRole') || '';

  // لو فيه allowedRoles محددة، شيك الـ Role
  if (allowedRoles.length > 0) {
    const normalizedRole = String(userRole).toLowerCase();
    const hasAccess = allowedRoles.some(role => 
      normalizedRole.includes(role.toLowerCase())
    );
    
    if (!hasAccess) {
      // مالوش صلاحية → روح الـ Dashboard بتاعه
      return <Navigate to={getRedirectPathByRole(userRole)} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;