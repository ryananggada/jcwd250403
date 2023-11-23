import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function NonTenantRoute({ children, ...rest }) {
  const profile = useSelector((state) => state.auth.profile);

  if (!profile || !profile.role || profile.role === 'user') {
    return <Outlet />;
  }

  return profile.role !== 'tenant' ? <Outlet /> : <Navigate to="/tenant" />;
}

export default NonTenantRoute;
