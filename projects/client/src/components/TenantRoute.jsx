import { jwtDecode } from 'jwt-decode';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function TenantRoute({ children, ...rest }) {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/" />;
  }

  const payload = jwtDecode(token);
  const currentDate = new Date();

  if (payload.exp * 1000 > currentDate.getTime() && payload.role === 'tenant') {
    return <Outlet />;
  }

  return <Navigate to="/" />;
}

export default TenantRoute;
