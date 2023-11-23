import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function TenantRoute({ children, ...rest }) {
  const profile = useSelector((state) => state.auth.profile);

  if (!profile || !profile.role) {
    return <Navigate to="/" />;
  }

  return profile.role === 'tenant' ? <Outlet /> : <Navigate to="/" />;
}

export default TenantRoute;
