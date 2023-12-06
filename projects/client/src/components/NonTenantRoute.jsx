import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function NonTenantRoute({ children }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Outlet />;
  }

  const payload = jwtDecode(token);
  const currentDate = new Date();

  if (payload.exp * 1000 > currentDate.getTime() && payload.role === 'tenant') {
    return <Navigate to="/tenant" />;
  }

  return <Outlet />;
}

export default NonTenantRoute;
