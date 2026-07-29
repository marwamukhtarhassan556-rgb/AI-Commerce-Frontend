import { Navigate } from 'react-router-dom';
import { decodeToken, getRedirectPathByRole } from '../api/authService';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // لو مسجل دخول → روح الـ Dashboard بتاعه
  if (token) {
    const tokenDetails = decodeToken(token);
    const role = tokenDetails?.role || localStorage.getItem('userRole');
    return <Navigate to={getRedirectPathByRole(role)} replace />;
  }

  return children;
};

export default PublicRoute;