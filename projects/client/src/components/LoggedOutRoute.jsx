import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function LoggedOutRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Outlet />;
  }

  const payload = jwtDecode(token);
  const currentDate = new Date();

  if (payload.exp * 1000 > currentDate.getTime()) {
    if (payload.role === 'tenant') {
      return <Navigate to="/tenant" />;
    }
    if (payload.role === 'user') {
      return <Navigate to="/" />;
    }
  }

  return <Outlet />;
}

export default LoggedOutRoute;
