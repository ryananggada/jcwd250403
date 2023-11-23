import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function LoggedOutRoute({ chidren, ...rest }) {
  const profile = useSelector((state) => state.auth.profile);

  if (!profile || !profile.role) {
    return <Outlet />;
  }

  if (profile.role === 'tenant') {
    return <Navigate to="/tenant" />;
  }

  return <Navigate to="/" />;
}

export default LoggedOutRoute;
